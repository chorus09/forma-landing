
using Forma.Web.Models;
using Forma.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Register calculator service in DI
builder.Services.AddSingleton<CalorieCalculatorService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapStaticAssets();

app.MapRazorPages()
   .WithStaticAssets();

// Calorie calculator API
app.MapPost("/api/calories",
    (CalorieInput input, CalorieCalculatorService calculator) =>
    {
        try
        {
            var result = calculator.Calculate(input);
            return Results.Ok(result);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new
            {
                error = ex.Message
            });
        }
    });

app.Run();
