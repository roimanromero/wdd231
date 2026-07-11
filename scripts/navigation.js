// Handles the small-screen hamburger navigation toggle.
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

// Close the menu automatically if the viewport is resized past the
// breakpoint where the horizontal nav takes over, so it doesn't stay
// stuck open when the layout switches.
const navBreakpoint = window.matchMedia('(min-width: 700px)');
navBreakpoint.addEventListener('change', (event) => {
  if (event.matches) {
    primaryNav.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});
