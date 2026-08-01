// ==========================================================================
// Manos de Quilla — join.js
// Powers the join page: nav toggle, footer info, hidden timestamp,
// and the membership level modals
// ==========================================================================

const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");

// ---------- Navigation toggle (mobile hamburger) ----------
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

// ---------- Footer: copyright year + last modified ----------
const yearSpan = document.querySelector("#currentYear");
const lastModifiedSpan = document.querySelector("#lastModified");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (lastModifiedSpan) {
  lastModifiedSpan.textContent = document.lastModified;
}

// ---------- Hidden timestamp field ----------
// Records the exact moment the form was loaded by the user.
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
  timestampField.value = new Date().toString();
}

// ---------- Membership level modals ----------
const modalTriggers = document.querySelectorAll("[data-modal]");

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.querySelector(`#${trigger.dataset.modal}`);
    if (modal) {
      modal.showModal();
    }
  });
});

const modalCloseButtons = document.querySelectorAll(".modal-close");

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest("dialog");
    if (modal) {
      modal.close();
    }
  });
});

// Close a modal when the user clicks on its backdrop
document.querySelectorAll(".membership-modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    const dialogBounds = modal.getBoundingClientRect();
    const clickedOutside =
      event.clientX < dialogBounds.left ||
      event.clientX > dialogBounds.right ||
      event.clientY < dialogBounds.top ||
      event.clientY > dialogBounds.bottom;

    if (clickedOutside) {
      modal.close();
    }
  });
});
