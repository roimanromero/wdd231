// ==========================================================================
// Manos de Quilla — directory.js
// Fetches chamber member data and renders the directory grid/list views
// ==========================================================================

const directoryList = document.querySelector("#directoryList");
const memberCount = document.querySelector("#memberCount");
const gridButton = document.querySelector("#gridView");
const listButton = document.querySelector("#listView");
const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");

const tierLabels = {
  1: "Member",
  2: "Silver",
  3: "Gold",
};

// ---------- Navigation toggle (mobile hamburger) ----------
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

// ---------- Build a single member card ----------
function createMemberCard(member) {
  const card = document.createElement("section");
  card.className = "member-card";
  card.dataset.tier = member.membership;

  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" />
    <div class="member-card-body">
      <span class="member-tier">${tierLabels[member.membership] ?? "Member"}</span>
      <h3>${member.name}</h3>
      <p class="member-tagline">${member.tagline}</p>
      <p class="member-meta">
        ${member.address}<br />
        ${member.phone}<br />
        <a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a>
      </p>
    </div>
  `;

  return card;
}

// ---------- Render all members ----------
function renderMembers(members) {
  directoryList.innerHTML = "";
  members.forEach((member) => {
    directoryList.appendChild(createMemberCard(member));
  });
  memberCount.textContent = `${members.length} member businesses`;
}

// ---------- Fetch member data ----------
async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    renderMembers(data.members);
  } catch (error) {
    directoryList.innerHTML = `<p class="error-message">Sorry, the member directory could not be loaded right now.</p>`;
    console.error("Error loading members.json:", error);
  }
}

// ---------- Grid / List view toggle ----------
gridButton.addEventListener("click", () => {
  directoryList.classList.remove("list-view");
  gridButton.classList.add("active");
  listButton.classList.remove("active");
});

listButton.addEventListener("click", () => {
  directoryList.classList.add("list-view");
  listButton.classList.add("active");
  gridButton.classList.remove("active");
});

// ---------- Footer: copyright year + last modified ----------
const yearSpan = document.querySelector("#currentYear");
const lastModifiedSpan = document.querySelector("#lastModified");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (lastModifiedSpan) {
  lastModifiedSpan.textContent = document.lastModified;
}

loadMembers();
