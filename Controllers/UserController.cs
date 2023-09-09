using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Diety.Data;
using Diety.Interfaces.Authentication.HashFactory;
using Diety.Interfaces.Authentication.Requests;
using Diety.Interfaces.Jwt;
using Diety.Model;
using Diety.Services.Jwt;
using Diety.Dto;

namespace Diety.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IHashFactory _hashFactory;
        private readonly IJwtUtils _jwtUtils;

        public UserController(DataContext context, IHashFactory hashFactory, IJwtUtils jwtUtils)
        {
            _context = context;
            _hashFactory = hashFactory;
            _jwtUtils = jwtUtils;
        }
    
        [HttpGet, Authorize]
        public IActionResult CheckToken()
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

            UserSettingsDto userSettingsDto = new UserSettingsDto
            {
                proPic = user.ProfilePicture,
                isDark = settings.DarkTheme,
                advancedView = settings.AdvancedView
            };

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "User logged in successfully",
                userSettings = userSettingsDto
            }));
        }
        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] RegisterRequest request)
        {
            if (request.Password == null || request.Username == null || request.Email == null)
                return BadRequest(ModelState);

           if (_context.User.Any(u => u.Email == request.Email))
            {
                ModelState.AddModelError("", "An account associated with this email already exists");
                return StatusCode(409, new JsonResult (new {
                    result = "Error",
                    message = "An account associated with this email already exists"
                }));
            }

             if (_context.User.Any(u => u.Username == request.Username))
            {
                ModelState.AddModelError("", "Username already in use");
                return StatusCode(409, new JsonResult (new {
                    result = "Error",
                    message = "Username already in use"
                }));
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var hash = _hashFactory.Hasher(request.Password, out var salt);

            User user = new User()
            {
                Username = request.Username,
                Email = request.Email,
                HashedPassword = hash,
                Salt = Convert.ToHexString(salt),
                ProfilePicture = "data:image/jpeg;base64,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"
            };

            _context.User.Add(user);

            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong");
                return StatusCode(500, new JsonResult(new
                {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong"
                }));
            }

            Settings settings = new Settings {
                UserId = user.Id,
                DarkTheme = false,
                AdvancedView = false
            };

            
            _context.Settings.Add(settings);
            
            if (!(_context.SaveChanges() > 0))
            {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong"
                }));
            }

            UserSettingsDto userSettingsDto = new UserSettingsDto
            {
                proPic = user.ProfilePicture,
                isDark = settings.DarkTheme,
                advancedView = settings.AdvancedView
            }; 

            JwtRequirements requirements = new JwtRequirements { Username = request.Username };

            string token = _jwtUtils.TokenGenerator(requirements);

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "User registered successfully",
                jwtToken = token,
                userSettings = userSettingsDto
            }));
        }

        [HttpPost("login")]
        public IActionResult LoginUser([FromBody] LoginRequest request)
        {
            if (request.Password == null || request.Username == null)
                return BadRequest(ModelState);

            if (!_context.User.Any(u => u.Username == request.Username))
            {
                ModelState.AddModelError("", "Uncorrect credentials");
                return StatusCode(401, new JsonResult (new {
                    result = "Error",
                    message = "Uncorrect credentials"
                }));
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            User user = _context.User.
                Where(u => u.Username == request.Username).
                FirstOrDefault()!;

            bool authorized = _hashFactory.Checker(request.Password, user!.HashedPassword, Convert.FromHexString(user.Salt));

            if (!authorized)
            {
                ModelState.AddModelError("", "Uncorrect credentials");
                return StatusCode(401, new JsonResult (new {
                    result = "Error",
                    message = "Uncorrect credentials"
                }));
            }
            
            JwtRequirements requirements = new JwtRequirements{ Username = request.Username };

            string token = _jwtUtils.TokenGenerator(requirements);
            
            Settings settings = _context.Settings
                .Where(s => s.User == user)
                .FirstOrDefault()!;

            UserSettingsDto userSettingsDto = new UserSettingsDto
            {
                proPic = user.ProfilePicture,
                isDark = settings.DarkTheme,
                advancedView = settings.AdvancedView
            };

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "User logged in successfully",
                jwtToken = token,
                userSettings = userSettingsDto
            }));
        }

        [HttpPut("profilePicture"), Authorize]
        public IActionResult UpdateProfilePicture([FromBody] string base64ProPic)
        {
            if (base64ProPic == null)
                return BadRequest(ModelState);
            
            var username = _jwtUtils.ClaimExtractor();

            if (!_context.User.Any(u => u.Username == username))
                return NotFound();

            User user = _context.User
                .Where(u => u.Username == username)
                .FirstOrDefault()!;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            user.ProfilePicture = base64ProPic;

            _context.User.Update(user);

            if(!(_context.SaveChanges() > 0)) {
                ModelState.AddModelError("", "INTERNAL SERVER ERROR 500 - Something went wrong while updating user profile picture");
                return StatusCode(500, new JsonResult (new {
                    result = "Error",
                    message = "INTERNAL SERVER ERROR 500 - Something went wrong while updating user profile picture"
                }));
            }

            return StatusCode(200, new JsonResult(new {
                result = "Success",
                message = "Profile picture updated successfully",
            }));
        }
    }


}
