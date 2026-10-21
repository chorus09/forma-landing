
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.getElementById("hero-tilt-scene");
  const card = document.getElementById("hero-tilt-card");

  if (!scene || !card) {
    return;
  }

  // The Hero remains usable even if GSAP is unavailable.
  if (typeof window.gsap === "undefined") {
    console.warn("FORMA Hero: GSAP is unavailable.");
    return;
  }

  const gsap = window.gsap;
  const motion = gsap.matchMedia();

  const desktopMotionQuery = [
    "(min-width: 1024px)",
    "(hover: hover)",
    "(pointer: fine)",
    "(prefers-reduced-motion: no-preference)"
  ].join(" and ");

  motion.add(desktopMotionQuery, () => {
    const layers = scene.querySelectorAll(
      "[data-hero-depth]"
    );

    // Apply the depth values defined in Razor.
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.heroDepth) || 0;

      gsap.set(layer, {
        z: depth
      });
    });

    // quickTo reuses a tween instead of creating a
    // new animation for every pointer movement.
    const rotateX = gsap.quickTo(card, "rotationX", {
      duration: 0.5,
      ease: "power3.out"
    });

    const rotateY = gsap.quickTo(card, "rotationY", {
      duration: 0.5,
      ease: "power3.out"
    });

    const maxRotateX = 7;
    const maxRotateY = 9;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function handlePointerMove(event) {
      const bounds = scene.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const normalizedX = clamp(
        (event.clientX - centerX) / (bounds.width / 2),
        -1,
        1
      );

      const normalizedY = clamp(
        (event.clientY - centerY) / (bounds.height / 2),
        -1,
        1
      );

      rotateX(-normalizedY * maxRotateX);
      rotateY(normalizedX * maxRotateY);
    }

    function resetTilt() {
      rotateX(0);
      rotateY(0);
    }

    scene.classList.add("hero-tilt-active");

    scene.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    scene.addEventListener(
      "pointerleave",
      resetTilt
    );

    scene.addEventListener(
      "pointercancel",
      resetTilt
    );

    // GSAP automatically reverts its animations when
    // the media query stops matching.
    // Remove our custom event listeners as well.
    return () => {
      scene.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      scene.removeEventListener(
        "pointerleave",
        resetTilt
      );

      scene.removeEventListener(
        "pointercancel",
        resetTilt
      );

      scene.classList.remove("hero-tilt-active");
    };
  });
});
