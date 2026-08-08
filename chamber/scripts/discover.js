// ==========================================================================
// Manos de Quilla — discover.js
// Renders the eight Discover cards from data/discover.mjs and shows a
// last-visit message using localStorage.
// ==========================================================================

import discoverItems from "../data/discover.mjs";

const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");
const discoverGrid = document.querySelector("#discoverGrid");
const visitMessage = document.querySelector("#visitMessage");
const visitMessageText = document.querySelector("#visitMessageText");
const visitMessageClose = document.querySelector("#visitMessageClose");

// ---------- Navigation toggle (mobile hamburger) ----------
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

// ---------- Build a single discover card ----------
function createDiscoverCard(item) {
  const card = document.createElement("section");
  card.className = "discover-card";

  card.innerHTML = `
    <figure>
      <img src="images/${item.image}" alt="${item.alt}" loading="lazy" width="300" height="200" />
    </figure>
    <div class="discover-card-body">
      <h2>${item.name}</h2>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <p class="discover-card-more">Ask a Manos de Quilla member for local tips before you go — many artisans nearby sell handcrafted souvenirs inspired by this spot.</p>
      <button type="button" class="discover-learn-more">Learn more</button>
    </div>
  `;

  const button = card.querySelector(".discover-learn-more");
  button.addEventListener("click", () => {
    const expanded = card.classList.toggle("is-expanded");
    button.textContent = expanded ? "Show less" : "Learn more";
  });

  return card;
}

// ---------- Render all eight cards ----------
function renderDiscoverItems(items) {
  discoverGrid.innerHTML = "";
  items.forEach((item) => {
    discoverGrid.appendChild(createDiscoverCard(item));
  });
}

// ==========================================================================
// Last-visit message (localStorage)
// ==========================================================================

const LAST_VISIT_KEY = "manosDeQuillaDiscoverLastVisit";

function getVisitMessage() {
  const lastVisitRaw = localStorage.getItem(LAST_VISIT_KEY);
  const now = Date.now();

  if (!lastVisitRaw) {
    return "Welcome! Let us know if you have any questions.";
  }

  const lastVisit = Number(lastVisitRaw);
  const msInDay = 1000 * 60 * 60 * 24;
  const daysBetween = Math.floor((now - lastVisit) / msInDay);

  if (daysBetween < 1) {
    return "Back so soon! Awesome!";
  }

  const unit = daysBetween === 1 ? "day" : "days";
  return `You last visited ${daysBetween} ${unit} ago.`;
}

function showVisitMessage() {
  visitMessageText.textContent = getVisitMessage();
  visitMessage.classList.remove("is-hidden");
  localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
}

if (visitMessageClose) {
  visitMessageClose.addEventListener("click", () => {
    visitMessage.classList.add("is-hidden");
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

renderDiscoverItems(discoverItems);
showVisitMessage();
