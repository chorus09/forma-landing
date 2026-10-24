
using Forma.Web.Services;

namespace Forma.Web.Tests;

public class DemoDataTests
{
  private readonly DemoDataService _service = new();

  [Fact]
  public void GetDashboard_ReturnsCorrectTotals()
  {
    var dashboard = _service.GetDashboard();

    Assert.Equal(8, dashboard.Weeks.Count);
    Assert.Equal(25, dashboard.TotalWorkouts);
    Assert.Equal(805, dashboard.TotalActiveMinutes);
    Assert.Equal(3, dashboard.CurrentGoalStreakWeeks);
    Assert.Equal(3, dashboard.WeeklyWorkoutGoal);
  }

  [Fact]
  public void GetDashboard_TotalsMatchWeeklyData()
  {
    var dashboard = _service.GetDashboard();

    Assert.Equal(
        dashboard.Weeks.Sum(w => w.CompletedWorkouts),
        dashboard.TotalWorkouts
    );

    Assert.Equal(
        dashboard.Weeks.Sum(w => w.ActiveMinutes),
        dashboard.TotalActiveMinutes
    );
  }

  [Fact]
  public void GetProducts_ReturnsFourProducts()
  {
    var catalog = _service.GetProducts();

    Assert.Equal(4, catalog.Products.Count);

    Assert.All(catalog.Products, product =>
    {
      Assert.Equal(2, product.Offers.Count);
      Assert.All(product.Offers, offer =>
              Assert.True(offer.PriceMdl > 0));
    });
  }

  [Fact]
  public void GetProducts_OatsHaveExpectedLowestPrice()
  {
    var catalog = _service.GetProducts();

    var oats = Assert.Single(
        catalog.Products,
        p => p.Id == "oats"
    );

    Assert.Equal(
        28.90m,
        oats.Offers.Min(o => o.PriceMdl)
    );
  }
}
