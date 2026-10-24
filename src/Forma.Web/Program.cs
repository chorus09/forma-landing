
using Forma.Web.Models;
using Forma.Web.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddResponseCompression(options =>
{
    // FORMA currently serves a public demo without
    // authentication or user-specific secrets.
    options.EnableForHttps = true;
});

builder.Services.AddRazorPages();

// Register calculator service in DI
builder.Services.AddSingleton<CalorieCalculatorService>();
builder.Services.AddSingleton<WorkoutPlannerService>();
builder.Services.AddSingleton<DemoDataService>();

var app = builder.Build();
app.UseResponseCompression();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
//app.UseStaticFiles();
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
app.MapPost("/api/workouts",
    (WorkoutRequest request, WorkoutPlannerService planner) =>
    {
        try
        {
            var plan = planner.Generate(request);
            return Results.Ok(plan);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new
            {
                error = ex.Message
            });
        }
    });

app.MapGet("/api/demo/dashboard",
    (DemoDataService demo) =>
    {
        return Results.Ok(demo.GetDashboard());
    });

app.MapGet("/api/demo/products",
    (DemoDataService demo) =>
    {
        return Results.Ok(demo.GetProducts());
    });

app.Run();
public partial class Program { }