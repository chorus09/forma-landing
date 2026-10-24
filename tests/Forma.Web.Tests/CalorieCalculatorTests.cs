
using Forma.Web.Models;
using Forma.Web.Services;

namespace Forma.Web.Tests;

public class CalorieCalculatorTests
{
  private readonly CalorieCalculatorService _service = new();

  [Fact]
  public void Calculate_ValidInput_ReturnsCorrectResults()
  {
    var input = new CalorieInput(
        25, 75, 180,
        BiologicalSex.Male,
        ActivityLevel.ModeratelyActive
    );

    var result = _service.Calculate(input);

    Assert.Equal(1755, result.BasalMetabolicRate);
    Assert.Equal(2720, result.EstimatedDailyCalories);
  }

  [Theory]
  [InlineData(17)]
  [InlineData(121)]
  public void Calculate_InvalidAge_ThrowsException(int age)
  {
    var input = new CalorieInput(
        age, 75, 180,
        BiologicalSex.Male,
        ActivityLevel.Sedentary
    );

    Assert.Throws<ArgumentOutOfRangeException>(
        () => _service.Calculate(input)
    );
  }

  [Theory]
  [InlineData(0)]
  [InlineData(501)]
  [InlineData(double.NaN)]
  public void Calculate_InvalidWeight_ThrowsException(
      double weight)
  {
    var input = new CalorieInput(
        25, weight, 180,
        BiologicalSex.Male,
        ActivityLevel.Sedentary
    );

    Assert.Throws<ArgumentOutOfRangeException>(
        () => _service.Calculate(input)
    );
  }

  [Theory]
  [InlineData(49)]
  [InlineData(251)]
  [InlineData(double.PositiveInfinity)]
  public void Calculate_InvalidHeight_ThrowsException(
      double height)
  {
    var input = new CalorieInput(
        25, 75, height,
        BiologicalSex.Male,
        ActivityLevel.Sedentary
    );

    Assert.Throws<ArgumentOutOfRangeException>(
        () => _service.Calculate(input)
    );
  }

  [Fact]
  public void Calculate_InvalidEnum_ThrowsException()
  {
    var input = new CalorieInput(
        25, 75, 180,
        (BiologicalSex)99,
        ActivityLevel.Sedentary
    );

    Assert.Throws<ArgumentException>(
        () => _service.Calculate(input)
    );
  }
}
