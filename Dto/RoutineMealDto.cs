namespace Diety.Dto
{
    public class RoutineMealDto
    {
        public string type { get; set; } = null!;
        public char day { get; set; }
        public int mealId { get; set; }
        public string name { get; set; } = null!;
        public string notes { get; set; } = null!;
    }
    
}