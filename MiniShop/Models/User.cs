namespace MiniShop.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "customer";
        public Cart? Cart { get; set; }
        public List<Order> Orders { get; set; } = new List<Order>();
    }
}
