using Microsoft.EntityFrameworkCore;
using ProductApi.Models;

namespace ProductApi.Data
{
    public class ProductDbContext :DbContext
    { public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
        { }
    public DbSet<Products> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Cart> Cart { get; set; }
    public DbSet<UserCredentials> UserCredentials { get; set; }
    public DbSet<Order> Order { get; set; }
    public DbSet<Address> Address { get; set; }
    public DbSet<OrderTracker> OrderTrackers { get; set; }
    public DbSet<OrderItem> OrderItem { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<EmailVerification> EmailVerifications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }



    }
}
