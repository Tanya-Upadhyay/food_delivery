using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductApi.Data;
using ProductApi.Helpers;
using ProductApi.Hubs;
using ProductApi.Models;
using ProductApi.Services;
using System.Net;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddSingleton<ProductApi.Helpers.JwtTokenGenerator>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnect"),
        new MySqlServerVersion(new Version(8, 0, 23))));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ProductDbContext>();
    context.Database.Migrate();
    await SeedAdminUser(context);
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.UseCors("AllowFrontend");
app.UseStaticFiles();

app.Run();

async Task SeedAdminUser(ProductDbContext context)
{
    string adminEmail = "anu@example.com";
    string adminPhone = "6306574320";

    var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

    if (adminUser == null)
    {
        var newAdmin = new User
        {
            Name = "Anu",
            Email = adminEmail,
            PhoneNumber = adminPhone,
            Roles = "admin"
        };

        context.Users.Add(newAdmin);
        await context.SaveChangesAsync();

        var adminPassword = "Anu@2512";
        var hashedPassword = HashPassword(adminPassword);

        context.UserCredentials.Add(new UserCredentials
        {
            UCID = newAdmin.UID,
            Email = newAdmin.Email,
            HashPassword = hashedPassword
        });

        await context.SaveChangesAsync();

        Console.WriteLine("Admin user created with email: " + adminEmail);
    }
    else
    {
        Console.WriteLine("Admin user already exists");
    }
}

string HashPassword(string password)
{
    using var sha256 = System.Security.Cryptography.SHA256.Create();
    var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(bytes);
}
