// ==========================================================================
// Manos de Quilla — thankyou.js
// Powers the thank-you page: nav toggle, footer info, and reading the
// submitted form data back out of the URL query string
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

// ---------- Display submitted form data ----------
const params = new URLSearchParams(window.location.search);

const fieldMap = {
  firstName: "#outFirstName",
  lastName: "#outLastName",
  email: "#outEmail",
  mobilePhone: "#outMobilePhone",
  orgName: "#outOrgName",
  timestamp: "#outTimestamp",
};

Object.entries(fieldMap).forEach(([paramName, selector]) => {
  const target = document.querySelector(selector);
  const value = params.get(paramName);
  if (target && value) {
    target.textContent = value;
  }
});
