
using System.Net;
using System.Net.Http.Json;
using Forma.Web.Models;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Forma.Web.Tests;

public class ApiIntegrationTests :
    IClassFixture<WebApplicationFactory<Program>>
{
  private readonly HttpClient _client;

  public ApiIntegrationTests(
      WebApplicationFactory<Program> factory)
  {
    _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
          BaseAddress = new Uri("https://localhost")
        }
    );
  }

  [Fact]
  public async Task Calories_ValidInput_ReturnsOk()
  {
    var input = new CalorieInput(
        25, 75, 180,
        BiologicalSex.Male,
        ActivityLevel.ModeratelyActive
    );

    var response = await _client.PostAsJsonAsync(
        "/api/calories", input
    );

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var result =
        await response.Content.ReadFromJsonAsync<CalorieResult>();

    Assert.NotNull(result);
    Assert.Equal(1755, result.BasalMetabolicRate);
    Assert.Equal(2720, result.EstimatedDailyCalories);
  }

  [Fact]
  public async Task Calories_InvalidInput_ReturnsBadRequest()
  {
    var input = new CalorieInput(
        15, 75, 180,
        BiologicalSex.Male,
        ActivityLevel.Sedentary
    );

    var response = await _client.PostAsJsonAsync(
        "/api/calories", input
    );

    Assert.Equal(
        HttpStatusCode.BadRequest,
        response.StatusCode
    );
  }

  [Fact]
  public async Task Workouts_ValidInput_ReturnsThreeSessions()
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Strength,
        FitnessLevel.Beginner,
        3
    );

    var response = await _client.PostAsJsonAsync(
        "/api/workouts", request
    );

    response.EnsureSuccessStatusCode();

    var plan =
        await response.Content.ReadFromJsonAsync<WorkoutPlan>();

    Assert.NotNull(plan);
    Assert.Equal(3, plan.Sessions.Count);
  }

  [Fact]
  public async Task Workouts_InvalidDays_ReturnsBadRequest()
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Strength,
        FitnessLevel.Beginner,
        7
    );

    var response = await _client.PostAsJsonAsync(
        "/api/workouts", request
    );

    Assert.Equal(
        HttpStatusCode.BadRequest,
        response.StatusCode
    );
  }

  [Theory]
  [InlineData("/api/demo/dashboard")]
  [InlineData("/api/demo/products")]
  public async Task DemoEndpoints_ReturnOk(string path)
  {
    var response = await _client.GetAsync(path);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }
}
