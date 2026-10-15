
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuButton || !mobileMenu) return;

  function setMenuState(isOpen) {
    mobileMenu.classList.toggle("hidden", !isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  // Close menu after selecting a navigation link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  // Allow keyboard users to close the menu
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      menuButton.focus();
    }
  });

  // Reset menu when switching to desktop
  window.matchMedia("(min-width: 768px)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        setMenuState(false);
      }
    });
});
