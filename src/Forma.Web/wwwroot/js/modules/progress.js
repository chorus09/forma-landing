
document.addEventListener("DOMContentLoaded", () => {
    const comparison = document.getElementById("progress-comparison");
    const slider = document.getElementById("progress-slider");
    const output = document.getElementById("progress-value");

    if (!comparison || !slider || !output) return;

    function updateComparison() {
        const value = Math.max(0, Math.min(100, Number(slider.value)));

        comparison.style.setProperty("--comparison", `${value}%`);
        output.textContent = `${value}% revealed`;
    }

    slider.addEventListener("input", updateComparison);

    updateComparison();
});
