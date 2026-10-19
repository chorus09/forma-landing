
document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("progress-dashboard");
    if (!section) return;

    const get = (id) => document.getElementById(id);

    const widget = get("dashboard-widget");
    const chart = get("dashboard-bars");
    const status = get("dashboard-status");
    const errorBox = get("dashboard-error");
    const retryButton = get("dashboard-retry");

    const metricButtons = section.querySelectorAll(
        "[data-dashboard-metric]"
    );

    const formatNumber = new Intl.NumberFormat("en-US");

    let dashboard = null;
    let activeMetric = "workouts";
    let selectedWeekIndex = 0;

    function isValidDashboard(data) {
        const validInteger = (value) =>
            Number.isSafeInteger(value) && value >= 0;

        return data &&
            Array.isArray(data.weeks) &&
            data.weeks.length > 0 &&
            data.weeks.length <= 52 &&
            validInteger(data.weeklyWorkoutGoal) &&
            data.weeklyWorkoutGoal > 0 &&
            validInteger(data.totalWorkouts) &&
            validInteger(data.totalActiveMinutes) &&
            validInteger(data.currentGoalStreakWeeks) &&
            typeof data.notice === "string" &&
            data.weeks.every((week) =>
                typeof week.weekLabel === "string" &&
                validInteger(week.completedWorkouts) &&
                validInteger(week.activeMinutes)
            );
    }

    function updateSummary() {
        get("dashboard-workouts").textContent =
            formatNumber.format(dashboard.totalWorkouts);

        get("dashboard-minutes").textContent =
            formatNumber.format(dashboard.totalActiveMinutes);

        get("dashboard-streak").textContent =
            dashboard.currentGoalStreakWeeks;

        get("dashboard-notice").textContent =
            dashboard.notice;
    }

    function updateWeekDetails() {
        const week = dashboard.weeks[selectedWeekIndex];
        const goal = dashboard.weeklyWorkoutGoal;

        const percentage = Math.round(
            (week.completedWorkouts / goal) * 100
        );

        const displayedPercentage = Math.min(
            100,
            percentage
        );

        get("dashboard-selected-week").textContent =
            week.weekLabel;

        get("dashboard-week-workouts").textContent =
            week.completedWorkouts;

        get("dashboard-week-minutes").textContent =
            `${week.activeMinutes} min`;

        get("dashboard-week-goal").textContent =
            `${goal} workouts`;

        get("dashboard-goal-percent").textContent =
            `${percentage}%`;

        const progress = get("dashboard-goal-progress");

        progress.setAttribute(
            "aria-valuenow",
            String(displayedPercentage)
        );

        get("dashboard-goal-fill").style.width =
            `${displayedPercentage}%`;

        get("dashboard-week-status").textContent =
            week.completedWorkouts >= goal
                ? "Weekly goal achieved"
                : "Weekly goal not reached";
    }

    function updateSelection() {
        const buttons = chart.querySelectorAll(
            ".dashboard-week-button"
        );

        buttons.forEach((button, index) => {
            button.setAttribute(
                "aria-pressed",
                String(index === selectedWeekIndex)
            );
        });

        updateWeekDetails();
    }

    function createWeekColumn(week, index, maximum) {
        const value = activeMetric === "workouts"
            ? week.completedWorkouts
            : week.activeMinutes;

        const metricLabel = activeMetric === "workouts"
            ? "workouts"
            : "active minutes";

        const height = maximum > 0
            ? (value / maximum) * 100
            : 0;

        const item = document.createElement("li");
        item.className = "dashboard-week";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "dashboard-week-button";

        button.setAttribute(
            "aria-pressed",
            String(index === selectedWeekIndex)
        );

        button.setAttribute(
            "aria-label",
            `${week.weekLabel}: ${value} ${metricLabel}. Select week.`
        );

        const valueLabel = document.createElement("span");
        valueLabel.className = "dashboard-week-value";
        valueLabel.textContent = value;

        const barSpace = document.createElement("span");
        barSpace.className = "dashboard-bar-space";

        const bar = document.createElement("span");
        bar.className = "dashboard-bar";
        bar.style.height = `${height}%`;
        bar.setAttribute("aria-hidden", "true");

        const weekLabel = document.createElement("span");
        weekLabel.className = "dashboard-week-label";
        weekLabel.textContent = week.weekLabel;

        barSpace.appendChild(bar);
        button.append(valueLabel, barSpace, weekLabel);
        item.appendChild(button);

        button.addEventListener("click", () => {
            selectedWeekIndex = index;
            updateSelection();
        });

        return item;
    }

    function renderChart() {
        chart.replaceChildren();

        const values = dashboard.weeks.map((week) =>
            activeMetric === "workouts"
                ? week.completedWorkouts
                : week.activeMinutes
        );

        const maximum = Math.max(
            1,
            ...values,
            activeMetric === "workouts"
                ? dashboard.weeklyWorkoutGoal
                : 0
        );

        dashboard.weeks.forEach((week, index) => {
            chart.appendChild(
                createWeekColumn(week, index, maximum)
            );
        });

        get("dashboard-chart-description").textContent =
            activeMetric === "workouts"
                ? `Completed workouts per week. Target: ${dashboard.weeklyWorkoutGoal}.`
                : "Active training minutes per week.";

        metricButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.dashboardMetric === activeMetric)
            );
        });

        updateWeekDetails();
    }

    async function loadDashboard() {
        status.textContent = "Loading your dashboard...";
        errorBox.classList.add("hidden");
        retryButton.classList.add("hidden");
        widget.setAttribute("aria-busy", "true");

        try {
            const response = await fetch(
                "/api/demo/dashboard",
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Dashboard request failed.");
            }

            const data = await response.json();

            if (!isValidDashboard(data)) {
                throw new Error("Invalid dashboard response.");
            }

            dashboard = data;
            selectedWeekIndex = data.weeks.length - 1;

            updateSummary();
            renderChart();

            status.textContent =
                `Showing ${data.weeks.length} weeks of fictional activity data.`;

        } catch (error) {
            status.textContent = "Dashboard unavailable.";

            errorBox.textContent =
                "Could not load demo data. Please try again.";

            errorBox.classList.remove("hidden");
            retryButton.classList.remove("hidden");

            console.error("FORMA dashboard:", error);

        } finally {
            widget.setAttribute("aria-busy", "false");
        }
    }

    metricButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!dashboard) return;

            activeMetric = button.dataset.dashboardMetric;
            renderChart();
        });
    });

    retryButton.addEventListener("click", loadDashboard);

    loadDashboard();
});
