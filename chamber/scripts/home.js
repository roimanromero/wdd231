// ==========================================================================
// Manos de Quilla — home.js
// Powers the home page: nav toggle, weather widget, member spotlights
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

// ==========================================================================
// Weather — OpenWeatherMap
// ==========================================================================

// TODO: Replace with your own free OpenWeatherMap API key.
// Sign up at https://openweathermap.org/api
const WEATHER_API_KEY = "da32264d5977f69075fceb1b7f63b011";

// Barranquilla, Atlántico, Colombia
const CHAMBER_LAT = 10.9639;
const CHAMBER_LON = -74.7964;

const weatherWidget = document.querySelector("#weatherWidget");

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

function dayLabel(dateTimeTxt, index) {
  const date = new Date(dateTimeTxt);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

async function getCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Current weather request failed (${response.status})`);
  }
  return response.json();
}

async function getForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast request failed (${response.status})`);
  }
  return response.json();
}

// Reduce the 5-day/3-hour forecast list down to one midday reading per
// day for the next three distinct calendar days.
function extractThreeDayForecast(forecastList) {
  const today = new Date().toDateString();
  const seenDays = new Set([today]);
  const daily = [];

  for (const entry of forecastList) {
    const entryDate = new Date(entry.dt_txt);
    const entryDay = entryDate.toDateString();
    const isMidday = entry.dt_txt.includes("12:00:00");

    if (!seenDays.has(entryDay) && isMidday) {
      seenDays.add(entryDay);
      daily.push(entry);
    }

    if (daily.length === 3) break;
  }

  return daily;
}

function renderWeather(current, forecastDays) {
  const temp = Math.round(current.main.temp);
  const description = current.weather[0].description;
  const iconEmoji = weatherIcons[current.weather[0].main] ?? "🌡️";

  const forecastHTML = forecastDays
    .map((day, index) => {
      const label = dayLabel(day.dt_txt, index);
      const dayTemp = Math.round(day.main.temp);
      const dayEmoji = weatherIcons[day.weather[0].main] ?? "🌡️";
      return `
        <div class="forecast-day">
          <p class="forecast-label">${label}</p>
          <p class="forecast-icon" aria-hidden="true">${dayEmoji}</p>
          <p class="forecast-temp">${dayTemp}°C</p>
        </div>
      `;
    })
    .join("");

  weatherWidget.innerHTML = `
    <div class="weather-current">
      <p class="weather-icon" aria-hidden="true">${iconEmoji}</p>
      <p class="weather-temp">${temp}°C</p>
      <p class="weather-desc">${description}</p>
      <p class="weather-location">Barranquilla, Atlántico</p>
    </div>
    <div class="weather-forecast">
      ${forecastHTML}
    </div>
  `;
}

async function loadWeather() {
  try {
    const [current, forecast] = await Promise.all([getCurrentWeather(), getForecast()]);
    const forecastDays = extractThreeDayForecast(forecast.list);
    renderWeather(current, forecastDays);
  } catch (error) {
    weatherWidget.innerHTML = `<p class="error-message">Weather data is unavailable right now. Please check back later.</p>`;
    console.error("Error loading weather data:", error);
  }
}

// ==========================================================================
// Member Spotlights
// ==========================================================================

const spotlightsGrid = document.querySelector("#spotlightsGrid");

const tierLabels = {
  1: "Member",
  2: "Silver",
  3: "Gold",
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSpotlightCard(member) {
  const card = document.createElement("section");
  card.className = "spotlight-card";
  card.dataset.tier = member.membership;

  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" />
    <div class="spotlight-body">
      <span class="member-tier">${tierLabels[member.membership] ?? "Member"}</span>
      <h3>${member.name}</h3>
      <p class="spotlight-meta">
        ${member.address}<br />
        ${member.phone}<br />
        <a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a>
      </p>
    </div>
  `;

  return card;
}

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();

    // Spotlights only feature Gold (3) and Silver (2) members
    const eligible = data.members.filter((member) => member.membership === 2 || member.membership === 3);

    // Randomize on every load, show between 2 and 3 members
    const count = eligible.length >= 3 ? 3 : Math.min(2, eligible.length);
    const chosen = shuffle(eligible).slice(0, count);

    spotlightsGrid.innerHTML = "";
    chosen.forEach((member) => {
      spotlightsGrid.appendChild(createSpotlightCard(member));
    });
  } catch (error) {
    spotlightsGrid.innerHTML = `<p class="error-message">Sorry, member spotlights could not be loaded right now.</p>`;
    console.error("Error loading members.json:", error);
  }
}

loadWeather();
loadSpotlights();
