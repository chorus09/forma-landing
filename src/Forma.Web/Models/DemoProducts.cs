
namespace Forma.Web.Models;

public sealed record DemoOffer(
    string Retailer,
    decimal PriceMdl
);

public sealed record DemoProduct(
    string Id,
    string Name,
    string Category,
    string PackageSize,
    int CaloriesPer100g,
    IReadOnlyList<DemoOffer> Offers
);

public sealed record DemoProductCatalog(
    IReadOnlyList<DemoProduct> Products,
    string Notice
);
