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
    public class FoodController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IJwtUtils _jwtUtils;

        public FoodController(DataContext context, IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }

        [HttpGet, Authorize]
        public IActionResult GetFoods()
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User.
                Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            List<FoodDto> foods = _context.Food
                .Where(f => f.User.Id == user!.Id)
                .Select( f => new FoodDto() {
                    id = f!.Id,
                    name = f.Name,
                    notes = f.Notes,
                    calories = f.Calories,
                    carbos = f.Carbos,
                    proteins = f.Proteins,
                    fats = f.Fats,
                    fibers = f.Fibers,
                    water = f.Water
                })
                .ToList();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(foods);
        }

        [HttpGet("{foodId}"), Authorize]
        public IActionResult GetFoodById(int foodId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return Unauthorized();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            var food = _context.Food
                .Where(f => f.Id == foodId)
                .Select(f => new { 
                    f.Id, 
                    f.Name, 
                    f.Notes, 
                    f.Calories,
                    f.Carbos,
                    f.Proteins, 
                    f.Fats, 
                    f.Fibers, 
                    f.Water, 
                    f.User 
                })
                .FirstOrDefault();
            
            if (food?.User?.Id != user?.Id) {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            FoodDto foodResult = new FoodDto() {
                id = food!.Id,
                name = food.Name,
                notes = food.Notes,
                calories = food.Calories,
                carbos = food.Carbos,
                proteins = food.Proteins,
                fats = food.Fats,
                fibers = food.Fibers,
                water = food.Water
            };

            return Ok(foodResult);
        }
        [HttpGet("meal/{mealId}"), Authorize]
        public IActionResult GetFoodsByMealId(int mealId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return Unauthorized();

            var user = _context.User.Where(u => u.Username == username).FirstOrDefault();

            List<FoodMealDto> foods = _context.FoodMeal
                .Where(fm => fm.MealId == mealId)
                .Select(fm => new FoodMealDto() { 
                    foodId = fm.FoodId,
                    quantity = fm.Quantity 
                })
                .ToList();

            foreach (FoodMealDto foodMealDto in foods) {
                var food = _context.Food.Where(f => f.Id == foodMealDto.foodId)
                    .Select(f => new {f.Id, f.Name, f.User})
                    .FirstOrDefault();

                if (food?.User?.Id != user?.Id) {
                    return Unauthorized();
                }

                foodMealDto.foodName = food!.Name;
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(foods);
        }

        [HttpPost, Authorize]
        public IActionResult CreateFood([FromBody] FoodDto newFoodDto)
        {
            if(newFoodDto == null)
                return BadRequest(ModelState);

            var username = _jwtUtils.ClaimExtractor();

            if(!_context.User.Any(u => u.Username == username))
                return NotFound();

            User user = _context.User.Where(u => u.Username == username).FirstOrDefault()!;

            if(_context.Food.Any(f => f.Name == newFoodDto.name && f.User == user))
            {
                ModelState.AddModelError("", "A food with the same name already exists");
                return StatusCode(409, new JsonResult (new {
                    result = "Error",
                    message = "A food with the same name already exists"
                }));
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Food newFood = new Food()
            {
                Name = newFoodDto.name,
                Notes = newFoodDto.notes,
                Calories = newFoodDto.calories,
                Carbos = newFoodDto.carbos,
                Proteins = newFoodDto.proteins,
                Fats = newFoodDto.fats,
                Fibers = newFoodDto.fibers,
                Water = newFoodDto.water,
                User = user
            };

            _context.Food.Add(newFood);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving food");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving food"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Food successfully created"
            }));
        }
        [HttpPut("{foodId}")]
        public IActionResult UpdateFood(int foodId, [FromBody] FoodDto updatedFoodDto) {
            if(updatedFoodDto == null)
                return BadRequest(ModelState);

            if(!_context.Food.Any(f => f.Id == foodId))
                return NotFound();
            
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Food food = new Food() {
                Id = foodId,
                Name = updatedFoodDto.name,
                Notes = updatedFoodDto.notes,
                Calories = updatedFoodDto.calories,
                Carbos = updatedFoodDto.carbos,
                Proteins = updatedFoodDto.proteins,
                Fats = updatedFoodDto.fats,
                Fibers = updatedFoodDto.fibers,
                Water = updatedFoodDto.water,
            };

            _context.Food.Update(food);

            if(!(_context.SaveChanges() > 0)) {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating food");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating food"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Food successfully updated"
            }));
        }

        [HttpDelete("{foodId}"), Authorize]
        public IActionResult DeleteFood(int foodId)
        {
            if (!_context.Food.Any(f => f.Id == foodId))
                return NotFound();

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            if (!_context.Food.Any(f => f.Id == foodId))
                return NotFound();

            var food = _context.Food
                .Where(f => f.Id == foodId)
                .Select(f => new { f.Id, f.User })
                .FirstOrDefault();

            if(food!.User!.Id != user!.Id)
            {
                ModelState.AddModelError("", "Unauthorized");
                return StatusCode(401, new JsonResult(new {
                    result = "Error",
                    message = "Unauthorized"
                }));
            }

            Food foodToDelete = new Food { Id = food.Id};

            if (!ModelState.IsValid)
                return BadRequest();

            _context.Food.Attach(foodToDelete);
            _context.Food.Remove(foodToDelete);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while deleting food");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while deleting food"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Food successfully removed"
            }));
        }
    }
}
