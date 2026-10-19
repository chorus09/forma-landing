
using Forma.Web.Models;

namespace Forma.Web.Services;

public sealed class DemoDataService
{
  public DemoDashboard GetDashboard()
  {
    WeeklyTrainingData[] weeks =
    [
        new("W1", 2, 60),
            new("W2", 3, 90),
            new("W3", 3, 95),
            new("W4", 4, 120),
            new("W5", 2, 65),
            new("W6", 4, 125),
            new("W7", 3, 110),
            new("W8", 4, 140)
    ];

    const int weeklyGoal = 3;

    int totalWorkouts = weeks.Sum(
        week => week.CompletedWorkouts
    );

    int totalMinutes = weeks.Sum(
        week => week.ActiveMinutes
    );

    int goalStreak = 0;

    for (int i = weeks.Length - 1; i >= 0; i--)
    {
      if (weeks[i].CompletedWorkouts < weeklyGoal)
        break;

      goalStreak++;
    }

    return new DemoDashboard(
        weeklyGoal,
        totalWorkouts,
        totalMinutes,
        goalStreak,
        weeks,
        "Fictional activity data for demonstration only."
    );
  }

  public DemoProductCatalog GetProducts()
  {
    DemoProduct[] products =
    [
        new(
                "oats",
                "Rolled Oats",
                "Grains",
                "500 g",
                389,
                [
                    new("Demo Store A", 28.90m),
                    new("Demo Store B", 31.50m)
                ]
            ),

            new(
                "yogurt",
                "Plain Yogurt",
                "Dairy",
                "500 g",
                63,
                [
                    new("Demo Store A", 29.90m),
                    new("Demo Store B", 27.50m)
                ]
            ),

            new(
                "almonds",
                "Unsalted Almonds",
                "Nuts",
                "200 g",
                579,
                [
                    new("Demo Store A", 64.90m),
                    new("Demo Store B", 69.50m)
                ]
            ),

            new(
                "bread",
                "Wholegrain Bread",
                "Bakery",
                "500 g",
                247,
                [
                    new("Demo Store A", 24.50m),
                    new("Demo Store B", 26.90m)
                ]
            )
    ];

    return new DemoProductCatalog(
        products,
        "Fictional retailers, prices and illustrative " +
        "nutrition values. Not live shopping data."
    );
  }
}
