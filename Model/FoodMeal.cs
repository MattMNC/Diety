using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diety.Model
{
    public class FoodMeal
    {
        [Required]
        [Column(TypeName = "decimal (6,2)")]
        public decimal Quantity { get; set; }

        public int FoodId { get; set; }

        public int MealId { get; set; }

        public Food Food { get; set; } = null!;

        public Meal Meal { get; set; } = null!;
    }
}
