
namespace Forma.Web.Models;

public sealed record WorkoutSession(
    string Day,
    string Focus,
    int DurationMinutes,
    IReadOnlyList<string> Activities
);

public sealed record WorkoutPlan(
    string Title,
    IReadOnlyList<WorkoutSession> Sessions,
    string Disclaimer
);
