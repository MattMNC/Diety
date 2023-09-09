using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace Diety.Model
{
    public class MealRoutine
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = null!;

        [Required]
        public char Day { get; set; }

        public int MealId { get; set; } 

        public int RoutineId { get; set; } 

        public Meal Meal { get; set; } = null!;

        public Routine Routine { get; set; } = null!;
    }
}
