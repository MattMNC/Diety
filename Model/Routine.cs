using System.ComponentModel.DataAnnotations;

namespace Diety.Model
{
    public class Routine
    {
        public int Id { get; set; }

        public User? User { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Notes { get; set; } = null!;

        public ICollection<MealRoutine> MealRoutine { get; set; } = null!;
    }
}
