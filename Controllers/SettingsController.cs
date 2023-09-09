using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Diety.Data;
using Diety.Interfaces.Authentication.HashFactory;
using Diety.Interfaces.Jwt;
using Diety.Model;
using Diety.Dto;

namespace Diety.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IJwtUtils _jwtUtils;

        public SettingsController(DataContext context, IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }
    
        [HttpPut, Authorize]
        public IActionResult UpdateSettings([FromBody] UserSettingsDto userSettingsDto)
        {
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            User user = _context.User
                .Where(u => u.Username == username)
                .FirstOrDefault()!;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Settings settings = _context.Settings
                .Where(s => s.User == user)
                .FirstOrDefault()!;

            settings.DarkTheme = userSettingsDto.isDark;
            settings.AdvancedView = userSettingsDto.advancedView;

            _context.Settings.Update(settings);

            if(!(_context.SaveChanges() > 0)) {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating settings");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating settings"
                }));
            }

           return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Settings updated successfully"
            }));
        }
    }
}