
namespace Forma.Web.Models;

public sealed record WeeklyTrainingData(
    string WeekLabel,
    int CompletedWorkouts,
    int ActiveMinutes
);

public sealed record DemoDashboard(
    int WeeklyWorkoutGoal,
    int TotalWorkouts,
    int TotalActiveMinutes,
    int CurrentGoalStreakWeeks,
    IReadOnlyList<WeeklyTrainingData> Weeks,
    string Notice
);
