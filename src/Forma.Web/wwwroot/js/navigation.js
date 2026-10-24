
document.addEventListener("DOMContentLoaded", () => {
  const menuButton =
    document.getElementById("mobile-menu-button");

  const mobileMenu =
    document.getElementById("mobile-menu");

  if (!menuButton || !mobileMenu) return;

  const menuLinks = [
    ...mobileMenu.querySelectorAll("a")
  ];

  function isMenuOpen() {
    return menuButton.getAttribute("aria-expanded") === "true";
  }

  function setMenuState(isOpen) {
    mobileMenu.classList.toggle("hidden", !isOpen);

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  }

  menuButton.addEventListener("click", () => {
    const shouldOpen = !isMenuOpen();

    setMenuState(shouldOpen);

    // Move keyboard focus into the opened menu
    // only when the button was activated by keyboard.
    if (shouldOpen && menuButton.matches(":focus-visible")) {
      menuLinks[0]?.focus();
    }
  });

  for (const link of menuLinks) {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isMenuOpen()) {
      return;
    }

    setMenuState(false);
    menuButton.focus();
  });

  // Close an opened mobile menu when resizing
  // to the desktop navigation breakpoint.
  const desktopQuery = window.matchMedia(
    "(min-width: 768px)"
  );

  desktopQuery.addEventListener("change", (event) => {
    if (!event.matches) return;

    if (isMenuOpen()) {
      setMenuState(false);

      if (mobileMenu.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }
  });
});
