export function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

export function initModalAttributions() {
  const modal = document.getElementById('attributions-modal');
  const openLink = document.getElementById('attributions-link');
  const closeBtn = document.getElementById('close-modal');

  if (modal && openLink && closeBtn) {
    openLink.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
    });

    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModalAttributions();
});