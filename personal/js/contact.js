import { initNavigation } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();

  const form = document.querySelector('.custom-form');
  if (form) {
    form.addEventListener('submit', () => {
      // Form persistence/analytics can be stored client-side via LocalStorage
      localStorage.setItem('retroVault_lastInquiry', new Date().toISOString());
    });
  }
});