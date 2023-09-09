﻿namespace Diety.Dto
{
    public class FoodDto
    {
        public int id { get; set; }
        public string name { get; set; } = null!;
        public string? notes { get; set; } = null!;
        public decimal? calories { get; set; }
        public decimal? carbos { get; set; }
        public decimal? proteins { get; set; }
        public decimal? fats { get; set; }
        public decimal? fibers { get; set; }
        public decimal? water { get; set; }
    }
}
