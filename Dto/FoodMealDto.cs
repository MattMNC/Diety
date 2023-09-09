namespace Diety.Dto
{
    public class FoodMealDto
    {
        public string? foodName { get; set; } = null!;
        public decimal quantity { get; set; }
        public int foodId { get; set; }
        public int mealId { get; set; }
    }
}
