
document.addEventListener("DOMContentLoaded", () => {
  // Animations are optional enhancements.
  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {
    console.warn("FORMA Motion: GSAP is unavailable.");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();

  // Respect the user's operating system preference.
  motion.add(
    "(prefers-reduced-motion: no-preference)",
    () => {

      const headingSelectors = [
        "#features h2",
        "#demo h2",
        "#calorie-calculator h2",
        "#body-progress h2",
        "#workout-planner h2",
        "#progress-dashboard h2",
        "#product-comparison h2",
        "#how-it-works h2",
        "#get-started h2"
      ];

      const cardSelectors = [
        "#features article",
        "#demo .demo-link-card",
        "#how-it-works article"
      ];

      function reveal(element, distance, delay = 0) {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: distance
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            ease: "power2.out",

            // Restore CSS hover effects after reveal.
            clearProps: "opacity,transform",

            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );
      }

      document
        .querySelectorAll(headingSelectors.join(","))
        .forEach((heading) => {
          reveal(heading, 24);
        });

      document
        .querySelectorAll(cardSelectors.join(","))
        .forEach((card, index) => {
          const delay = (index % 3) * 0.06;
          reveal(card, 28, delay);
        });
    }
  );
});
