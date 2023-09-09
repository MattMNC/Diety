namespace Diety.Services.Authentication
{
    public record HasherResponse
    {
        protected string HashedPassword { get; set; } = null!;
        protected byte[] Salt { get; set; } = null!;
    }
}
