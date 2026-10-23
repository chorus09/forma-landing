
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.gsap === "undefined") {
    console.warn("FORMA Microinteractions: GSAP is unavailable.");
    return;
  }

  const gsap = window.gsap;
  const motion = gsap.matchMedia();

  // Animate dynamically generated result cards.
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    const containers = [
      document.getElementById("workout-results"),
      document.getElementById("products-comparison-result")
    ].filter(Boolean);

    const observers = containers.map((container) => {
      const observer = new MutationObserver((records) => {
        const added = new Set();

        for (const record of records) {
          for (const node of record.addedNodes) {
            if (
              node instanceof Element &&
              node.parentElement === container &&
              node.isConnected
            ) {
              added.add(node);
            }
          }
        }

        if (!added.size) return;

        gsap.fromTo(
          [...added],
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.055,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "opacity,transform"
          }
        );
      });

      observer.observe(container, { childList: true });
      return observer;
    });

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }

      for (const container of containers) {
        gsap.killTweensOf(container.children);
        gsap.set(container.children, {
          clearProps: "opacity,transform"
        });
      }
    };
  });

  // Subtle magnetic movement for desktop mouse devices.
  motion.add(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const links = document.querySelectorAll(
        "#home a.forma-btn-primary, " +
        "#home a.forma-btn-secondary, " +
        "#get-started a.forma-btn-primary"
      );

      const cleanups = [];

      for (const link of links) {
        let bounds = null;

        const moveX = gsap.quickTo(link, "x", {
          duration: 0.35,
          ease: "power3.out"
        });

        const moveY = gsap.quickTo(link, "y", {
          duration: 0.35,
          ease: "power3.out"
        });

        function onEnter() {
          bounds = link.getBoundingClientRect();
        }

        function onMove(event) {
          if (event.pointerType !== "mouse") return;
          if (!bounds) onEnter();

          if (!bounds || !bounds.width || !bounds.height) {
            return;
          }

          const positionX =
            (event.clientX - bounds.left) / bounds.width - 0.5;

          const positionY =
            (event.clientY - bounds.top) / bounds.height - 0.5;

          moveX(
            gsap.utils.clamp(-4, 4, positionX * 8)
          );

          moveY(
            gsap.utils.clamp(-3, 3, positionY * 6)
          );
        }

        function onLeave() {
          bounds = null;
          moveX(0);
          moveY(0);
        }

        link.addEventListener("pointerenter", onEnter);

        link.addEventListener("pointermove", onMove, {
          passive: true
        });

        link.addEventListener("pointerleave", onLeave);
        link.addEventListener("pointercancel", onLeave);

        cleanups.push(() => {
          link.removeEventListener("pointerenter", onEnter);
          link.removeEventListener("pointermove", onMove);
          link.removeEventListener("pointerleave", onLeave);
          link.removeEventListener("pointercancel", onLeave);
        });
      }

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }
  );
});
