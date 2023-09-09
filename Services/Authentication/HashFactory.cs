using Diety.Interfaces.Authentication.HashFactory;
using System.Security.Cryptography;
using System.Text;

namespace Diety.Services.Authentication
{
    public class HashFactory : IHashFactory
    {

        private static readonly int keySize = 64;
        private static readonly int iterations = 32000;
        private static readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;
        
        public string Hasher(string password, out byte[] salt)
        {
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithm,
                keySize);

            return Convert.ToHexString(hash);
        }
        public bool Checker(string password, string hash, byte[] salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, keySize);

            return hashToCompare.SequenceEqual(Convert.FromHexString(hash));
        }
    }
}
