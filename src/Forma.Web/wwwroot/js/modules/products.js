
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("product-comparison");
  if (!section) return;

  const get = (id) => document.getElementById(id);

  const clearButton = get("products-clear");
  const widget = get("products-widget");
  const list = get("products-list");
  const comparison = get("products-comparison-result");
  const categorySelect = get("products-category");
  const sortSelect = get("products-sort");
  const selectedCount = get("products-selected-count");
  const notice = get("products-notice");
  const status = get("products-status");
  const errorBox = get("products-error");
  const retryButton = get("products-retry");


  const numberFormat = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const icons = {
    Grains: "🌾",
    Dairy: "🥛",
    Nuts: "🥜",
    Bakery: "🍞"
  };

  let products = [];
  const selectedIds = new Set();

  function money(value) {
    return `${numberFormat.format(value)} MDL`;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);

    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;

    return node;
  }

  function packageGrams(product) {
    return Number(product.packageSize.match(/^(\d+)\s*g$/i)[1]);
  }

  function bestOffer(product) {
    return product.offers.reduce((best, offer) =>
      offer.priceMdl < best.priceMdl ? offer : best
    );
  }

  function pricePer100g(product) {
    return bestOffer(product).priceMdl / packageGrams(product) * 100;
  }

  function savings(product) {
    const prices = product.offers.map(offer => offer.priceMdl);

    return Math.max(...prices) - Math.min(...prices);
  }

  function isValidCatalog(data) {
    if (!data ||
      !Array.isArray(data.products) ||
      data.products.length === 0 ||
      data.products.length > 50 ||
      typeof data.notice !== "string") {
      return false;
    }

    const ids = new Set();

    return data.products.every(product => {
      if (!product ||
        typeof product.id !== "string" ||
        !product.id ||
        ids.has(product.id) ||
        typeof product.name !== "string" ||
        typeof product.category !== "string" ||
        typeof product.packageSize !== "string" ||
        !Number.isSafeInteger(product.caloriesPer100g) ||
        product.caloriesPer100g < 0 ||
        !Array.isArray(product.offers) ||
        product.offers.length < 1 ||
        product.offers.length > 10) {
        return false;
      }

      const match = product.packageSize.match(/^(\d+)\s*g$/i);
      const grams = match ? Number(match[1]) : 0;

      if (!Number.isSafeInteger(grams) || grams <= 0) {
        return false;
      }

      ids.add(product.id);

      return product.offers.every(offer =>
        offer &&
        typeof offer.retailer === "string" &&
        offer.retailer.length > 0 &&
        Number.isFinite(offer.priceMdl) &&
        offer.priceMdl > 0
      );
    });
  }

  function createProductCard(product) {
    const selected = selectedIds.has(product.id);
    const card = element("article", "forma-card product-card");
    card.dataset.selected = String(selected);

    const top = element(
      "div",
      "flex items-start justify-between gap-3"
    );

    const icon = element(
      "span",
      "product-icon",
      icons[product.category] ?? "🥗"
    );
    icon.setAttribute("aria-hidden", "true");

    const category = element(
      "span",
      "text-xs text-forma-muted",
      product.category
    );

    top.append(icon, category);

    const name = element(
      "h4",
      "mt-5 font-display text-xl font-bold",
      product.name
    );

    const details = element(
      "p",
      "mt-2 text-sm text-forma-muted",
      `${product.packageSize} · ${product.caloriesPer100g} kcal / 100 g`
    );

    const priceLabel = element(
      "p",
      "mt-6 text-xs text-forma-muted",
      "Lowest demo offer"
    );

    const price = element(
      "p",
      "mt-2 font-display text-3xl font-bold text-forma-lime",
      money(bestOffer(product).priceMdl)
    );

    const unitPrice = element(
      "p",
      "mt-2 text-xs text-forma-muted",
      `${money(pricePer100g(product))} / 100 g`
    );

    const offersTitle = element(
      "p",
      "mt-6 text-sm font-semibold",
      "Store comparison"
    );

    const offers = element("ul", "mt-3 space-y-3");

    const orderedOffers = [...product.offers].sort(
      (a, b) => a.priceMdl - b.priceMdl
    );

    for (const offer of orderedOffers) {
      const row = element(
        "li",
        "flex items-center justify-between gap-3 text-sm"
      );

      const isBest = offer.priceMdl === bestOffer(product).priceMdl;

      const store = element(
        "span",
        isBest ? "text-forma-lime" : "text-forma-muted",
        offer.retailer
      );

      const value = element(
        "strong",
        isBest ? "text-forma-lime" : "text-white",
        money(offer.priceMdl)
      );

      row.append(store, value);
      offers.appendChild(row);
    }

    const savingsText = element(
      "p",
      "mt-4 text-xs text-forma-muted",
      `Demo offer difference: ${money(savings(product))}`
    );

    const button = element(
      "button",
      selected
        ? "product-select forma-btn-secondary mt-6 w-full"
        : "product-select forma-btn-primary mt-6 w-full",
      selected ? "Remove from comparison" : "Compare product"
    );

    button.type = "button";
    button.dataset.productId = product.id;
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute(
      "aria-label",
      `${selected ? "Remove" : "Compare"} ${product.name}`
    );

    button.disabled = !selected && selectedIds.size >= 2;

    if (button.disabled) {
      button.textContent = "Two products selected";
    }

    button.addEventListener("click", () => {
      if (selectedIds.has(product.id)) {
        selectedIds.delete(product.id);
      } else if (selectedIds.size < 2) {
        selectedIds.add(product.id);
      }

      renderProducts();
      renderComparison();

      const replacement = [...list.querySelectorAll(
        "[data-product-id]"
      )].find(item => item.dataset.productId === product.id);

      replacement?.focus();
    });

    card.append(
      top, name, details,
      priceLabel, price, unitPrice,
      offersTitle, offers, savingsText, button
    );

    return card;
  }

  function createComparisonEntry(product) {
    const entry = element(
      "div",
      "product-compare-entry"
    );

    const name = element(
      "h4",
      "font-display text-lg font-bold",
      product.name
    );

    const packageInfo = element(
      "p",
      "mt-1 text-xs text-forma-muted",
      product.packageSize
    );

    const best = bestOffer(product);

    const price = element(
      "p",
      "mt-4 text-xl font-bold text-forma-lime",
      money(best.priceMdl)
    );

    const store = element(
      "p",
      "mt-1 text-xs text-forma-muted",
      `Lowest offer: ${best.retailer}`
    );

    const unitPrice = element(
      "p",
      "mt-3 text-sm",
      `${money(pricePer100g(product))} / 100 g`
    );

    entry.append(name, packageInfo, price, store, unitPrice);

    return entry;
  }

  function renderComparison() {
    comparison.replaceChildren();
    selectedCount.textContent = `${selectedIds.size} / 2`;
    clearButton.disabled = selectedIds.size === 0;

    const selected = products.filter(
      product => selectedIds.has(product.id)
    );

    if (selected.length === 0) {
      comparison.appendChild(
        element(
          "p",
          "text-sm text-forma-muted",
          "Select two products to start comparing."
        )
      );
      return;
    }

    for (const product of selected) {
      comparison.appendChild(createComparisonEntry(product));
    }

    if (selected.length === 1) {
      comparison.appendChild(
        element(
          "p",
          "text-xs text-forma-muted",
          "Choose one more product to complete the comparison."
        )
      );
      return;
    }

    const [first, second] = selected;
    const firstPrice = pricePer100g(first);
    const secondPrice = pricePer100g(second);

    const lower = firstPrice <= secondPrice ? first : second;
    const difference = Math.abs(firstPrice - secondPrice);

    const message = difference < 0.005
      ? "Both products have the same demo price per 100 g."
      : `${lower.name} has a lower demo price per 100 g by ${money(difference)}.`;

    comparison.appendChild(
      element(
        "p",
        "product-comparison-insight",
        message
      )
    );
  }

  function filteredProducts() {
    const category = categorySelect.value;

    const filtered = products.filter(
      product => category === "all" ||
        product.category === category
    );

    filtered.sort((a, b) => {
      if (sortSelect.value === "price") {
        return bestOffer(a).priceMdl -
          bestOffer(b).priceMdl;
      }
      if (sortSelect.value === "unit-price") {
        return pricePer100g(a) - pricePer100g(b);
      }
      if (sortSelect.value === "calories") {
        return a.caloriesPer100g -
          b.caloriesPer100g;
      }

      return a.name.localeCompare(b.name);
    });

    return filtered;
  }

  function renderProducts() {
    list.replaceChildren();

    const visible = filteredProducts();

    if (visible.length === 0) {
      list.appendChild(
        element(
          "p",
          "text-sm text-forma-muted",
          "No products match this category."
        )
      );
    }

    for (const product of visible) {
      list.appendChild(createProductCard(product));
    }

    status.textContent =
      `Showing ${visible.length} of ${products.length} demo products. ` +
      `${selectedIds.size} selected for comparison.`;
  }

  function populateCategories() {
    const categories = [...new Set(
      products.map(product => product.category)
    )].sort();

    categorySelect.replaceChildren();

    const all = element("option", "", "All categories");
    all.value = "all";
    categorySelect.appendChild(all);

    for (const category of categories) {
      const option = element("option", "", category);
      option.value = category;
      categorySelect.appendChild(option);
    }
  }

  async function loadProducts() {
    widget.setAttribute("aria-busy", "true");
    status.textContent = "Loading product data...";

    errorBox.classList.add("hidden");
    retryButton.classList.add("hidden");

    try {
      const response = await fetch("/api/demo/products", {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Product request failed.");
      }

      const data = await response.json();

      if (!isValidCatalog(data)) {
        throw new Error("Invalid product catalog.");
      }

      products = data.products;
      selectedIds.clear();

      // Start with two illustrative products.
      selectedIds.add(products[0].id);

      if (products.length > 2) {
        selectedIds.add(products[2].id);
      } else if (products.length > 1) {
        selectedIds.add(products[1].id);
      }

      notice.textContent = data.notice;

      populateCategories();
      renderProducts();
      renderComparison();

    } catch (error) {
      products = [];
      selectedIds.clear();

      list.replaceChildren();
      comparison.replaceChildren();

      selectedCount.textContent = "0 / 2";
      notice.textContent = "";
      status.textContent = "Product catalog unavailable.";

      errorBox.textContent =
        "Unable to load demo products. Please try again.";

      errorBox.classList.remove("hidden");
      retryButton.classList.remove("hidden");

      console.error("FORMA products:", error);

    } finally {
      widget.setAttribute("aria-busy", "false");
      clearButton.disabled = true;
    }
  }

  categorySelect.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  retryButton.addEventListener("click", loadProducts);

  clearButton.addEventListener("click", () => {
    selectedIds.clear();

    renderProducts();
    renderComparison();

    categorySelect.focus();
  });
  loadProducts();
});
