using Diety.Services.Jwt;

namespace Diety.Interfaces.Jwt
{
    public interface IJwtUtils
    {
        string TokenGenerator(JwtRequirements requirements);
        string ClaimExtractor();
    }
}


