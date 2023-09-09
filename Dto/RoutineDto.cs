namespace Diety.Dto
{
    public class RoutineDto
    {
        public int id { get; set; }
        public string name { get; set; } = null!;
        public string? notes { get; set; } = null!;
        public IList<MealRoutineDto> meals { get; set; } = null!;
    }
    
}