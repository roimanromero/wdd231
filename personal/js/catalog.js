import { initNavigation } from './main.js';

const catalogContainer = document.getElementById('catalog-grid');
const filterSelect = document.getElementById('filter-select');
const counterEl = document.getElementById('counter');
const detailsModal = document.getElementById('details-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close-btn');

let consoleData = [];

// Fetch API with try...catch
async function fetchConsoleData() {
  try {
    const response = await fetch('data/consoles.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    consoleData = await response.json();
    
    // Save last fetched count to Local Storage
    localStorage.setItem('retroVault_itemCount', consoleData.length);

    renderCatalog(consoleData);
  } catch (error) {
    console.error('Error fetching hardware data:', error);
    if (catalogContainer) {
      catalogContainer.innerHTML = `<p class="error">Unable to load catalog hardware data. Please try again later.</p>`;
    }
  }
}

// Render dynamic cards using Template Literals & Array methods
function renderCatalog(items) {
  if (!catalogContainer) return;
  catalogContainer.innerHTML = '';

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="400" height="250" loading="lazy">
      <h3>${item.name}</h3>
      <p><strong>Manufacturer:</strong> ${item.manufacturer}</p>
      <p><strong>Released:</strong> ${item.releaseYear}</p>
      <p><strong>Category:</strong> ${item.type}</p>
      <button class="btn details-btn" data-id="${item.id}">View Details</button>
    `;
    catalogContainer.appendChild(card);
  });

  // Event Listener Delegation for Modal
  document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.getAttribute('data-id');
      openDetailsModal(itemId);
    });
  });

  if (counterEl) {
    counterEl.textContent = `Showing ${items.length} item(s)`;
  }
}

// Modal dialog display function
function openDetailsModal(id) {
  const item = consoleData.find((c) => c.id === id);
  if (item && detailsModal) {
    modalTitle.textContent = item.name;
    modalBody.innerHTML = `
      <p><strong>Manufacturer:</strong> ${item.manufacturer}</p>
      <p><strong>Release Year:</strong> ${item.releaseYear}</p>
      <p><strong>System Type:</strong> ${item.type}</p>
      <p><strong>Global Sales:</strong> ${item.unitsSold}</p>
    `;
    detailsModal.showModal();
  }
}

if (modalCloseBtn && detailsModal) {
  modalCloseBtn.addEventListener('click', () => detailsModal.close());
}

// Filter Event Listener using array filter method
if (filterSelect) {
  filterSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value === 'all') {
      renderCatalog(consoleData);
    } else {
      const filtered = consoleData.filter((item) => item.type === value);
      renderCatalog(filtered);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  fetchConsoleData();
});