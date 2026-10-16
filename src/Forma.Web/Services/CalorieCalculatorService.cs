
using Forma.Web.Models;

namespace Forma.Web.Services;

public sealed class CalorieCalculatorService
{
  public CalorieResult Calculate(CalorieInput input)
  {
    ArgumentNullException.ThrowIfNull(input);

    if (input.Age < 18 || input.Age > 120)
      throw new ArgumentOutOfRangeException(
          nameof(input.Age),
          "Age must be between 18 and 120.");

    if (!double.IsFinite(input.WeightKg) ||
    input.WeightKg < 1 ||
    input.WeightKg > 500)
    {
      throw new ArgumentOutOfRangeException(
          nameof(input.WeightKg),
          "Weight must be between 1 and 500 kg.");
    }

    if (!double.IsFinite(input.HeightCm) ||
        input.HeightCm < 50 ||
        input.HeightCm > 250)
    {
      throw new ArgumentOutOfRangeException(
          nameof(input.HeightCm),
          "Height must be between 50 and 250 cm.");
    }

    if (!Enum.IsDefined(input.Sex) ||
        !Enum.IsDefined(input.ActivityLevel))
      throw new ArgumentException("Invalid calculator option.");

    double sexAdjustment = input.Sex switch
    {
      BiologicalSex.Male => 5,
      BiologicalSex.Female => -161,
      _ => throw new ArgumentException("Invalid biological sex.")
    };

    double bmr =
        10 * input.WeightKg +
        6.25 * input.HeightCm -
        5 * input.Age +
        sexAdjustment;

    double activityMultiplier = input.ActivityLevel switch
    {
      ActivityLevel.Sedentary => 1.2,
      ActivityLevel.LightlyActive => 1.375,
      ActivityLevel.ModeratelyActive => 1.55,
      ActivityLevel.VeryActive => 1.725,
      ActivityLevel.ExtraActive => 1.9,
      _ => throw new ArgumentException("Invalid activity level.")
    };

    return new CalorieResult(
        Math.Round(bmr),
        Math.Round(bmr * activityMultiplier)
    );
  }
}
