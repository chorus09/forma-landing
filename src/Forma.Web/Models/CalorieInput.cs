
namespace Forma.Web.Models;

public enum BiologicalSex
{
  Male,
  Female
}

public enum ActivityLevel
{
  Sedentary,
  LightlyActive,
  ModeratelyActive,
  VeryActive,
  ExtraActive
}

public sealed record CalorieInput(
    int Age,
    double WeightKg,
    double HeightCm,
    BiologicalSex Sex,
    ActivityLevel ActivityLevel
);
