
document.addEventListener("DOMContentLoaded", () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Content remains visible when GSAP is unavailable.
  if (!gsap || !ScrollTrigger) {
    console.warn("FORMA Motion: GSAP is unavailable.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();

  // Decorative scroll effects only on capable devices.
  const scrollMotionQuery = [
    "(min-width: 768px)",
    "(hover: hover)",
    "(pointer: fine)",
    "(prefers-reduced-motion: no-preference)"
  ].join(" and ");

  motion.add(scrollMotionQuery, () => {
    const headings = [
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

    const cards = [
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
      .querySelectorAll(headings.join(","))
      .forEach((heading) => {
        reveal(heading, 24);
      });

    document
      .querySelectorAll(cards.join(","))
      .forEach((card, index) => {
        reveal(card, 28, (index % 3) * 0.06);
      });

    // GSAP matchMedia automatically reverts scoped
    // animations when the query stops matching.
  });
});
