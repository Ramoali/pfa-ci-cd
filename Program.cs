using Microsoft.EntityFrameworkCore;
using StudentPortal.Models;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register DbContext
builder.Services.AddDbContext<StudentPortalContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Map API controllers
app.MapControllers();

// Serve the React app for non-API routes
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), reactApp =>
{
    reactApp.UseSpa(spa =>
    {
        spa.Options.SourcePath = "wwwroot/clientapp"; // Path to your React app

        if (app.Environment.IsDevelopment())
        {
            spa.UseReactDevelopmentServer(npmScript: "start"); // Use React development server
        }
        else
        {
            spa.Options.DefaultPage = "/index.html"; // Serve the React app's index.html for non-API routes
        }
    });
});

app.Run();