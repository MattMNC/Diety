using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Diety.Data;
using Diety.Dto;
using Diety.Interfaces.Jwt;
using Diety.Model;

namespace Diety.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MealController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IJwtUtils _jwtUtils;

        public MealController(DataContext context, IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }

        [HttpGet, Authorize]
        public IActionResult GetMeals()
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            List<MealDto> meals = _context.Meal
                .Where(m => m.User!.Id == user!.Id)
                .Select(m => new MealDto() {
                     id = m.Id, 
                     name = m.Name, 
                     notes = m.Notes,
                     calories = m.Calories,
                     carbos = m.Carbos,
                     proteins = m.Proteins,
                     fats = m.Fats,
                     fibers = m.Fibers,
                     water = m.Water
                })
                .ToList();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(meals);
        }

        [HttpGet("{mealId}"), Authorize]
        public IActionResult GetMealById(int mealId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            var meal = _context.Meal
                .Where(m => m.Id == mealId)
                .Select(m => new { 
                    m.Id, 
                    m.Name, 
                    m.Notes, 
                    m.User,
                    m.Calories,
                    m.Carbos,
                    m.Proteins,
                    m.Fats,
                    m.Fibers,
                    m.Water 
                })
                .FirstOrDefault();
            
            if (meal?.User?.Id != user?.Id) {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            MealDto mealResult = new MealDto() {
                id = meal!.Id,
                name = meal.Name,
                notes = meal.Notes,
                calories = meal.Calories,
                carbos = meal.Carbos,
                proteins = meal.Proteins,
                fats = meal.Fats,
                fibers = meal.Fibers,
                water = meal.Water
            };

            return Ok(mealResult);
        }

        [HttpGet("food/{foodId}"), Authorize]
        public IActionResult GetMealsByFood(int foodId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var mealsIds = _context.FoodMeal
                .Where(fm => fm.FoodId == foodId)
                .Select(fm => new { fm.MealId })
                .Distinct()
                .ToList();

            List<MealDto> meals = new List<MealDto>() {};

            foreach (var mi in mealsIds) {
                MealDto? meal = _context.Meal
                    .Where(m => m.Id == mi.MealId)
                    .Select(m => new MealDto() {
                        id = m.Id, 
                        name = m.Name, 
                        notes = m.Notes
                    })
                    .FirstOrDefault();

                if (meal != null) {
                    meals.Add(meal);
                }
                
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(meals);
        }
       
        [HttpPost, Authorize]
        public IActionResult CreateMeal([FromBody] MealDto newMealDto)
        {
            if (newMealDto == null)
                return BadRequest(ModelState);

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            User user = _context.User.Where(u => u.Username == username).FirstOrDefault()!;

            if (_context.Meal.Any(m => m.Name == newMealDto.name && m.User == user))
            {
                ModelState.AddModelError("", "A meal with the same name already exists");
                return StatusCode(409, new JsonResult(new {
                    result = "Error",
                    message = "A meal with the same name already exists"
                }));
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Meal newMeal = new Meal() {
                Name = newMealDto.name,
                Notes = newMealDto.notes,
                User = user,
                Calories = newMealDto.calories,
                Carbos = newMealDto.carbos,
                Proteins = newMealDto.proteins,
                Fats = newMealDto.fats,
                Fibers = newMealDto.fibers,
                Water = newMealDto.water
            };

            var addMealResult = _context.Meal.Add(newMeal);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal"
                }));
            }

            Meal mealEntity = _context.Meal.Where(m => m.Id == addMealResult.Entity.Id).FirstOrDefault()!;

            foreach (FoodMealDto fDto in newMealDto.foods!)
            {
                Food foodEntity = _context.Food.Where(f => f.Id == fDto.foodId).FirstOrDefault()!;
                if (mealEntity == null || foodEntity == null)
                {
                    ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal food, missing meal or food");
                    return StatusCode(500, new JsonResult (new {
                        result = "Error",
                        message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal food, missing meal or food"
                    }));
                }
                FoodMeal f = new FoodMeal()
                {
                    Food = foodEntity,
                    Meal = mealEntity,
                    Quantity = fDto.quantity
                };

                _context.FoodMeal.Add(f);
            }

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal food");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal food"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Meal successfully created"
            }));
        }

        [HttpPut("{mealId}")]
        public IActionResult UpdateMeal(int mealId, [FromBody] MealDto updatedMealDto) {
            if (updatedMealDto == null)
                return BadRequest(ModelState);
            
            if (!_context.Meal.Any(m => m.Id == mealId))
                return NotFound();
            
            if(!ModelState.IsValid) 
                return BadRequest(ModelState);

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Meal updatedMeal = new Meal() {
                Id = mealId,
                Name = updatedMealDto.name,
                Notes = updatedMealDto.notes,
                Calories = updatedMealDto.calories,
                Carbos = updatedMealDto.carbos,
                Proteins = updatedMealDto.proteins,
                Fats = updatedMealDto.fats,
                Fibers = updatedMealDto.fibers,
                Water = updatedMealDto.water
            };

            var updateMealResult = _context.Meal.Update(updatedMeal);
            _context.FoodMeal.RemoveRange(_context.FoodMeal.Where(fm => fm.MealId == mealId));

            Meal mealEntity = _context.Meal.Where(m => m.Id == updateMealResult.Entity.Id).FirstOrDefault()!;

            foreach (FoodMealDto fDto in updatedMealDto.foods!)
            {
                Food foodEntity = _context.Food.Where(f => f.Id == fDto.foodId).FirstOrDefault()!;
                if (mealEntity == null || foodEntity == null)
                {
                    ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating meal food, missing meal or food");
                    return StatusCode(500, new JsonResult (new {
                        result = "Error",
                        message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating meal food, missing meal or food"
                    }));
                }
                FoodMeal f = new FoodMeal()
                {
                    Food = foodEntity,
                    Meal = mealEntity,
                    Quantity = fDto.quantity
                };

                _context.FoodMeal.Add(f);
            }

            if(!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating meal");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating meal"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Meal successfully updated"
            }));
        }

        [HttpDelete("{mealId}"), Authorize]
        public IActionResult DeleteMeal(int mealId)
        {
            if (!_context.Meal.Any(m => m.Id == mealId))
                return NotFound();

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            var meal = _context.Meal
                .Where(m => m.Id == mealId)
                .Select(m => new { m.Id, m.User })
                .FirstOrDefault();

            if (meal!.User!.Id != user!.Id)
            {
                ModelState.AddModelError("", "Unauthorized");
                return StatusCode(401, new JsonResult(new {
                    result = "Error",
                    message = "Unauthorized"
                }));
            }

            Meal mealToDelete = new Meal {Id = meal.Id};

            if (!ModelState.IsValid)
                return BadRequest();
        
            _context.Meal.Attach(mealToDelete);
            _context.Meal.Remove(mealToDelete);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while deleting meal");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while deleting meal"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Meal successfully removed"
            }));
        }
    }
}
