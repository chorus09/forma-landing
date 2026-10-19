
namespace Forma.Web.Models;

public enum WorkoutGoal
{
    Strength,
    Endurance,
    Mobility
}

public enum FitnessLevel
{
    Beginner,
    Intermediate
}

public sealed record WorkoutRequest(
    WorkoutGoal Goal,
    FitnessLevel Level,
    int DaysPerWeek
);
