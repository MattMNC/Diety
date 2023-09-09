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
    public class RoutineController : ControllerBase
    {
        private readonly DataContext _context;
        
        private readonly IJwtUtils _jwtUtils;

        public RoutineController(DataContext context,  IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }
        [HttpGet, Authorize]
        public IActionResult GetRoutines()
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            List<RoutineDto> routines = _context.Routine
                .Where(r => r.User!.Id == user!.Id)
                .Select(r => new RoutineDto { 
                    id = r.Id,
                    name = r.Name,
                    notes = r.Notes 
                })
                .ToList();
            
            foreach (RoutineDto routineDto in routines) {
                routineDto.meals = _context.MealRoutine
                    .Where(mr => mr.RoutineId == routineDto.id)
                    .Select(mr => new MealRoutineDto() {
                        mealId = mr.MealId,
                        type = mr.Type,
                        day = mr.Day
                    })
                    .ToList();
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(routines);
        }

        [HttpGet("{routineId}"), Authorize]
        public IActionResult GetRoutineById(int routineId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            var routine = _context.Routine
                .Where(r => r.Id == routineId)
                .Select(r => new { r.Id, r.Name, r.Notes, r.User })
                .FirstOrDefault();
            
            if (routine?.User?.Id != user?.Id) {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            RoutineDto routineResult = new RoutineDto() {
                id = routine!.Id,
                name = routine.Name,
                notes = routine.Notes
            };

            return Ok(routineResult);
        }
        
        [HttpGet("meal/{mealId}"), Authorize]
        public IActionResult GetRoutinesByMeal(int mealId)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var routinesIds = _context.MealRoutine
                .Where(mr => mr.MealId == mealId)
                .Select(mr => new { mr.RoutineId })
                .Distinct()
                .ToList();

            List<RoutineDto> routines = new List<RoutineDto>() {};

            foreach (var ri in routinesIds) {
                RoutineDto? routine = _context.Routine
                    .Where(r => r.Id == ri.RoutineId)
                    .Select(r => new RoutineDto() {
                        id = r.Id, 
                        name = r.Name, 
                        notes = r.Notes
                    })
                    .FirstOrDefault();

                if (routine != null) {
                    routines.Add(routine);
                }
                
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(routines);
        }
        
        [HttpPost, Authorize]
        public IActionResult CreateRoutine([FromBody] RoutineDto newRoutineDto)
        {
            if (newRoutineDto == null)
                return BadRequest(ModelState);

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            User user = _context.User.Where(u => u.Username == username).FirstOrDefault()!;

            if (_context.Routine.Any(r => r.Name == newRoutineDto.name && r.User == user))
            {
                ModelState.AddModelError("", "A routine with the same name already exists");
                return StatusCode(409, new JsonResult (new {
                    result = "Error",
                    message = "A routine with the same name already exists"
                }));
            }

            Routine newRoutine = new Routine {
                Name = newRoutineDto.name,
                Notes = newRoutineDto.notes,
                User = user
            };

            var addRoutineResult = _context.Routine.Add(newRoutine);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving routine");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving routine"
                }));
            }
            
            Routine routineEntity = _context.Routine.Where(r => r.Id == addRoutineResult.Entity.Id).FirstOrDefault()!;

            foreach (MealRoutineDto mrDto in newRoutineDto.meals)
            {
                Meal mealEntity = _context.Meal.Where(m => m.Id == mrDto.mealId).FirstOrDefault()!;
                if (routineEntity == null || mealEntity == null)
                {
                    ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal routine, missing routine or meal");
                    return StatusCode(500, new JsonResult (new {
                        result = "Error",
                        message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving meal routine, missing routine or meal"
                    }));
                }
                MealRoutine mr = new MealRoutine()
                {
                    Routine = routineEntity,
                    Meal = mealEntity,
                    Type = mrDto.type,
                    Day = mrDto.day
                };
                
                _context.MealRoutine.Add(mr);
                
                if (!(_context.SaveChanges() > 0))
                {
                    ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving routine meal");
                        return StatusCode(500, new JsonResult (new {
                        result = "Error",
                        message = "INTERNAL SERVER ERROR 500 - Something went wrong while saving routine meal"
                    }));
                }
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Routine successfully created"
            }));
        }
        [HttpPut("{routineId}")]
        public IActionResult UpdateRoutine(int routineId, [FromBody] RoutineDto updatedRoutineDto) {
            if (updatedRoutineDto == null)
                return BadRequest(ModelState);
            
            if (!_context.Routine.Any(r => r.Id == routineId))
                return NotFound();
            
            if(!ModelState.IsValid) 
                return BadRequest(ModelState);

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            Routine updatedRoutine = new Routine() {
                Id = routineId,
                Name = updatedRoutineDto.name,
                Notes = updatedRoutineDto.notes
            };

            var updateRoutineResult = _context.Routine.Update(updatedRoutine);
            _context.MealRoutine.RemoveRange(_context.MealRoutine.Where(mr => mr.RoutineId == routineId));

            Routine routineEntity = _context.Routine.Where(r => r.Id == updateRoutineResult.Entity.Id).FirstOrDefault()!;

            foreach (MealRoutineDto mrDto in updatedRoutineDto.meals!)
            {
                
                Meal mealEntity = _context.Meal.Where(m => m.Id == mrDto.mealId).FirstOrDefault()!;
                if (routineEntity == null || mealEntity == null)
                {
                    ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while saving routine meal, missing routine or meal");
                    return StatusCode(500, new JsonResult (new {
                        result = "Error",
                        message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating routine meal, missing routine or meal"
                    }));
                }
                MealRoutine mr = new MealRoutine()
                {
                    Meal = mealEntity,
                    Routine = routineEntity,
                    Type = mrDto.type,
                    Day = mrDto.day
                };

                _context.MealRoutine.Add(mr);
            }

            if(!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating routine");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating routine"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Routine successfully updated"
            }));
        }

        [HttpDelete("{routineId}"), Authorize]
        public IActionResult DeleteRoutine(int routineId)
        {
            if (!_context.Routine.Any(r => r.Id == routineId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            var user = _context.User
                .Where(u => u.Username == username)
                .Select(u => new { u.Id })
                .FirstOrDefault();

            var routine = _context.Routine
                .Where(r => r.Id == routineId)
                .Select(r => new { r.Id, r.User })
                .FirstOrDefault();

            if (routine!.User!.Id != user!.Id)
            {
                ModelState.AddModelError("", "Unauthorized");
                return StatusCode(401, new JsonResult(new {
                    result = "Error",
                    message = "Unauthorized"
                }));
            }

            Routine routineToDelete = new Routine {Id = routine.Id};
        
            _context.Routine.Attach(routineToDelete);
            _context.Routine.Remove(routineToDelete);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while deleting routine");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while deleting routine"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Routine successfully removed"
            }));
        }
    }
}
