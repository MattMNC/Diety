using Microsoft.EntityFrameworkCore;
using Diety.Model;

namespace Diety.Data
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server with connection string from app settings
            options.UseSqlServer(Configuration.GetConnectionString("dbDiety"), options =>
            {
                options.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
            });
        }

        public DbSet<User> User { get; set; } = null!;
        public DbSet<Food> Food { get; set; } = null!;
        public DbSet<Meal> Meal { get; set; } = null!;
        public DbSet<Routine> Routine { get; set; } = null!;
        public DbSet<FoodMeal> FoodMeal { get; set; } = null!;
        public DbSet<MealRoutine> MealRoutine { get; set; } = null!;
        public DbSet<Settings> Settings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<FoodMeal>()
                .HasKey(fm => new { fm.FoodId, fm.MealId });
            modelBuilder.Entity<FoodMeal>()
                .HasOne(fm => fm.Food)
                .WithMany(a => a.FoodMeal)
                .HasForeignKey(fm => fm.FoodId);
            modelBuilder.Entity<FoodMeal>()
                .HasOne(fm => fm.Meal)
                .WithMany(m => m.FoodMeal)
                .HasForeignKey(fm => fm.MealId);

            modelBuilder.Entity<MealRoutine>()
                .HasOne(mr => mr.Meal)
                .WithMany(m => m.MealRoutine)
                .HasForeignKey(mr => mr.MealId);
            modelBuilder.Entity<MealRoutine>()
                .HasOne(mr => mr.Routine)
                .WithMany(r => r.MealRoutine)
                .HasForeignKey(mr => mr.RoutineId);
        }
    }
}
