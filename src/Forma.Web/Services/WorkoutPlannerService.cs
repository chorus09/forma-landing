
using Forma.Web.Models;

namespace Forma.Web.Services;

public sealed class WorkoutPlannerService
{
  private sealed record WorkoutTemplate(
      string Focus,
      string[] Activities
  );

  public WorkoutPlan Generate(WorkoutRequest request)
  {
    ArgumentNullException.ThrowIfNull(request);

    if (!Enum.IsDefined(request.Goal) ||
        !Enum.IsDefined(request.Level))
    {
      throw new ArgumentException("Invalid workout option.");
    }

    if (request.DaysPerWeek < 2 || request.DaysPerWeek > 5)
    {
      throw new ArgumentOutOfRangeException(
          nameof(request.DaysPerWeek),
          "Choose between 2 and 5 days.");
    }

    string[] days = request.DaysPerWeek switch
    {
      2 => ["Monday", "Thursday"],
      3 => ["Monday", "Wednesday", "Friday"],
      4 => ["Monday", "Tuesday", "Thursday", "Saturday"],
      5 => ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
      _ => throw new ArgumentException("Invalid schedule.")
    };

    WorkoutTemplate[] templates = request.Goal switch
    {
      WorkoutGoal.Strength =>
      [
          new("Full-body strength",
                    ["Chair squats", "Incline push-ups", "Band rows"]),
                new("Lower-body strength",
                    ["Glute bridges", "Step-ups", "Calf raises"]),
                new("Upper-body strength",
                    ["Wall push-ups", "Band pulls", "Shoulder raises"])
      ],

      WorkoutGoal.Endurance =>
      [
          new("Cardio foundations",
                    ["Brisk walking", "Easy cycling"]),
                new("Steady movement",
                    ["Walking intervals", "Low-impact aerobics"]),
                new("Active endurance",
                    ["Comfortable-paced cycling", "Easy walking"])
      ],

      WorkoutGoal.Mobility =>
      [
          new("Full-body mobility",
                    ["Shoulder circles", "Gentle spinal rotations"]),
                new("Lower-body mobility",
                    ["Hip circles", "Ankle mobility", "Gentle stretching"]),
                new("Upper-body mobility",
                    ["Arm circles", "Thoracic rotations"])
      ],

      _ => throw new ArgumentException("Invalid goal.")
    };

    int minutes = request.Level == FitnessLevel.Beginner
        ? 20
        : 35;

    var sessions = days.Select((day, index) =>
    {
      var template = templates[index % templates.Length];

      return new WorkoutSession(
              day,
              template.Focus,
              minutes,
              template.Activities
          );
    }).ToArray();

    return new WorkoutPlan(
        $"{request.Goal} — {request.Level}",
        sessions,
        "Illustrative plan for generally healthy adults. " +
        "Not individualized fitness or medical advice."
    );
  }
}
