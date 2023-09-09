using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diety.Model
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Username { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Email { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar (128)")]
        public string HashedPassword { get; set; } = null!;

        [Required]
        [Column(TypeName = "varchar (128)")]
        public string Salt { get; set; } = null!;

        [Column(TypeName = "varchar (MAX)")]
        public string? ProfilePicture { get; set; }

        public ICollection<Food> Food { get; set; } = null!;

        public ICollection<Meal> Meal { get; set; } = null!;

        public ICollection<Routine> Routine { get; set; } = null!;
        public Settings Settings { get; set; } = null!;
    }
}
