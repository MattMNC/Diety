using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Diety.Interfaces.Jwt;
using Diety.Services.Jwt;

namespace Diety.Services.Authentication
{
    public class JwtUtils : IJwtUtils
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public JwtUtils(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public string ClaimExtractor()
        {
            var result = string.Empty;
            if( _httpContextAccessor != null )
            {
                result = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.Name);
            }
            return result;
        }

        public string TokenGenerator(JwtRequirements requirements)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, requirements.Username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Key").Value!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}