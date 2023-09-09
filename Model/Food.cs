using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diety.Model
{
    public class Food
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Notes { get; set; } = null!;

        [Column(TypeName = "decimal (7,1)")]
        public decimal? Calories { get; set; }

        [Column(TypeName = "decimal (4,1)")]
        public decimal? Carbos { get; set; }

        [Column(TypeName = "decimal (4,1)")]
        public decimal? Proteins { get; set; }

        [Column(TypeName = "decimal (4,1)")]
        public decimal? Fats { get; set; }

        [Column(TypeName = "decimal (4,1)")]
        public decimal? Fibers { get; set; }

        [Column(TypeName = "decimal (4,1)")]
        public decimal? Water { get; set; }

        public User User { get; set; } = null!;

        public ICollection<FoodMeal> FoodMeal { get; set; } = null!;
    }
}
