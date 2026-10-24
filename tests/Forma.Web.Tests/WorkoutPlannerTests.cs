
using Forma.Web.Models;
using Forma.Web.Services;

namespace Forma.Web.Tests;

public class WorkoutPlannerTests
{
  private readonly WorkoutPlannerService _service = new();

  [Theory]
  [InlineData(2)]
  [InlineData(3)]
  [InlineData(4)]
  [InlineData(5)]
  public void Generate_ValidDays_CreatesCorrectSessionCount(
      int days)
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Strength,
        FitnessLevel.Beginner,
        days
    );

    var plan = _service.Generate(request);

    Assert.Equal(days, plan.Sessions.Count);
    Assert.All(plan.Sessions, session =>
        Assert.Equal(20, session.DurationMinutes));
  }

  [Fact]
  public void Generate_Intermediate_Uses35Minutes()
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Mobility,
        FitnessLevel.Intermediate,
        3
    );

    var plan = _service.Generate(request);

    Assert.All(plan.Sessions, session =>
        Assert.Equal(35, session.DurationMinutes));
  }

  [Theory]
  [InlineData(1)]
  [InlineData(6)]
  public void Generate_InvalidDays_ThrowsException(int days)
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Strength,
        FitnessLevel.Beginner,
        days
    );

    Assert.Throws<ArgumentOutOfRangeException>(
        () => _service.Generate(request)
    );
  }

  [Fact]
  public void Generate_InvalidGoal_ThrowsException()
  {
    var request = new WorkoutRequest(
        (WorkoutGoal)99,
        FitnessLevel.Beginner,
        3
    );

    Assert.Throws<ArgumentException>(
        () => _service.Generate(request)
    );
  }

  [Fact]
  public void Generate_Strength_ContainsExpectedActivities()
  {
    var request = new WorkoutRequest(
        WorkoutGoal.Strength,
        FitnessLevel.Beginner,
        3
    );

    var plan = _service.Generate(request);

    Assert.Equal("Monday", plan.Sessions[0].Day);
    Assert.Contains(
        "Chair squats",
        plan.Sessions[0].Activities
    );
  }
}
