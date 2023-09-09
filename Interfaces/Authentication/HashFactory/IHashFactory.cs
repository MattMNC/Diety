using System.Security.Cryptography;

namespace Diety.Interfaces.Authentication.HashFactory
{
    public interface IHashFactory
    {
        string Hasher(string password, out byte[] salt);
        bool Checker(string password, string hash, byte[] salt);
    }
}
