
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("workout-form");
  if (!form) return;

  const button = document.getElementById("workout-submit");
  const errorBox = document.getElementById("workout-error");
  const results = document.getElementById("workout-results");
  const title = document.getElementById("workout-title");
  const status = document.getElementById("workout-status");
  const disclaimer = document.getElementById("workout-disclaimer");

  function createSessionCard(session) {
    const card = document.createElement("article");

    card.className =
      "rounded-xl border border-forma-border bg-forma-bg p-5";

    const heading = document.createElement("h4");
    heading.className = "font-display text-lg font-bold";
    heading.textContent = `${session.day} — ${session.focus}`;

    const duration = document.createElement("p");
    duration.className = "mt-2 text-sm text-forma-lime";
    duration.textContent =
      `${session.durationMinutes} minutes`;

    const list = document.createElement("ul");
    list.className =
      "mt-4 list-inside list-disc space-y-2 text-sm text-forma-muted";

    for (const activity of session.activities) {
      const item = document.createElement("li");
      item.textContent = activity;
      list.appendChild(item);
    }

    card.append(heading, duration, list);
    return card;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const request = {
      goal: Number(
        document.getElementById("workout-goal").value
      ),
      level: Number(
        document.getElementById("workout-level").value
      ),
      daysPerWeek: Number(
        document.getElementById("workout-days").value
      )
    };

    button.disabled = true;
    button.textContent = "Generating...";

    errorBox.classList.add("hidden");
    errorBox.textContent = "";
    results.replaceChildren();
    disclaimer.textContent = "";
    title.textContent = "Building your plan...";
    status.textContent = "Generating your workout routine...";

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error("Unable to generate your plan.");
      }

      const plan = await response.json();

      if (!Array.isArray(plan.sessions)) {
        throw new Error("Invalid workout response.");
      }

      title.textContent = plan.title;

      for (const session of plan.sessions) {
        results.appendChild(createSessionCard(session));
      }

      disclaimer.textContent = plan.disclaimer;

      status.textContent =
        `${plan.sessions.length} workout sessions generated.`;

    } catch (error) {
      title.textContent = "Unable to generate plan.";

      errorBox.textContent =
        error.message || "Something went wrong.";

      errorBox.classList.remove("hidden");

      status.textContent =
        "Please try generating your plan again.";

    } finally {
      button.disabled = false;
      button.textContent = "Generate Workout Plan";
    }
  });
});
