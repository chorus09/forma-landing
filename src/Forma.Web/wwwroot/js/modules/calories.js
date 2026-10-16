
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calorie-form");
  if (!form) return;

  const submitButton = document.getElementById("calorie-submit");
  const errorElement = document.getElementById("calorie-error");
  const bmrElement = document.getElementById("calorie-bmr");
  const tdeeElement = document.getElementById("calorie-tdee");
  const statusElement = document.getElementById("calorie-status");

  const numberFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = {
      age: Number(document.getElementById("calorie-age").value),
      weightKg: Number(document.getElementById("calorie-weight").value),
      heightCm: Number(document.getElementById("calorie-height").value),
      sex: Number(document.getElementById("calorie-sex").value),
      activityLevel: Number(document.getElementById("calorie-activity").value)
    };

    errorElement.textContent = "";
    errorElement.classList.add("hidden");
    bmrElement.textContent = "—";
    tdeeElement.textContent = "—";

    submitButton.disabled = true;
    submitButton.textContent = "Calculating...";
    statusElement.textContent = "Calculating your estimate...";

    try {
      const response = await fetch("/api/calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 400
            ? "Please check the information you entered."
            : "Unable to calculate right now."
        );
      }

      bmrElement.textContent =
        numberFormat.format(result.basalMetabolicRate);

      tdeeElement.textContent =
        numberFormat.format(result.estimatedDailyCalories);

      statusElement.textContent =
        "Calculated successfully. Results are estimates.";
    } catch (error) {
      errorElement.textContent =
        error.message || "Something went wrong.";
      errorElement.classList.remove("hidden");

      statusElement.textContent =
        "Your estimate could not be calculated.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Calculate calories";
    }
  });
});
