using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diety.Model
{
    public class Settings
    {
        [Key]
        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; } = null!;

        [Required]
        public bool DarkTheme { get; set; }

        [Required]
        public bool AdvancedView { get; set; }
    }
}
