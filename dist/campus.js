const campusItems = {
  events: [
    { id: "open-mic", category: "Arts & culture", title: "Courtyard Open Mic", details: "Tue, 6:30 pm · Arts Courtyard" },
    { id: "coffee", category: "Student life", title: "Coffee & Campus Walk", details: "Thu, 10:00 am · Student Union" },
    { id: "night-study", category: "Academics", title: "Late-Night Study Hall", details: "Fri, 7:00 pm · Main Library" },
  ],
  clubs: [
    { id: "photo", category: "Creative", title: "Film & Photo Society", details: "Photo walks, screenings, and peer critiques." },
    { id: "outdoors", category: "Outdoors", title: "Outdoor Collective", details: "Weekend hikes and low-pressure adventures." },
    { id: "makers", category: "Technology", title: "Makers Club", details: "A space to build things and trade ideas." },
  ],
  resources: [
    { id: "library", category: "Study", title: "Library Study Rooms", details: "Rooms for group projects and quiet work." },
    { id: "wellbeing", category: "Wellbeing", title: "Student Wellbeing", details: "Find counselling and peer support options." },
    { id: "careers", category: "Careers", title: "Career Studio", details: "Get help with applications and interview prep." },
  ],
};
const viewTitles = {
  events: "Coming up on campus",
  clubs: "Meet the campus clubs",
  resources: "Find a campus service",
  saved: "Your saved items",
};
const storageKey = "campus-hub-portfolio-saved";
const allItems = Object.entries(campusItems).flatMap(([type, items]) =>
  items.map((item) => ({ ...item, type })),
);
const viewButtons = [...document.querySelectorAll("[data-view]")];
const results = document.querySelector("#demo-results");
const heading = document.querySelector("#demo-heading");
const announcement = document.querySelector("#demo-announcement");
const savedCount = document.querySelector("#saved-count");
let view = "events";
let saved = new Set();

try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(stored)) {
    saved = new Set(allItems.filter((item) => stored.includes(item.id)).map((item) => item.id));
  }
} catch {
  // The demo can still save items for this page view if storage is unavailable.
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function updateSaveButton(button, item) {
  const isSaved = saved.has(item.id);
  button.textContent = isSaved ? "Remove" : "Save";
  button.dataset.saved = String(isSaved);
  button.setAttribute("aria-label", isSaved ? `Remove ${item.title} from saved items` : `Save ${item.title}`);
}

function toggleSaved(item, button) {
  const wasSaved = saved.delete(item.id);
  if (!wasSaved) saved.add(item.id);

  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch {
    // Keep the in-memory selection available when storage is unavailable.
  }

  savedCount.textContent = saved.size;
  announcement.textContent = wasSaved ? `${item.title} removed from saved items.` : `${item.title} saved.`;

  if (view === "saved") {
    const buttons = [...results.querySelectorAll(".save-button")];
    const removedIndex = buttons.indexOf(button);
    render();
    const remaining = results.querySelectorAll(".save-button");
    const next = remaining[Math.min(removedIndex, remaining.length - 1)];
    (next || viewButtons.find((tab) => tab.dataset.view === "saved")).focus();
  } else {
    updateSaveButton(button, item);
  }
}

function createCard(item) {
  const card = element("article", "demo-card", "");
  card.dataset.type = item.type;
  const button = element("button", "save-button", "");
  button.type = "button";
  updateSaveButton(button, item);
  button.addEventListener("click", () => toggleSaved(item, button));
  card.append(
    element("p", "category", item.category),
    element("h4", "", item.title),
    element("p", "details", item.details),
    button,
  );
  return card;
}

function render() {
  for (const button of viewButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.view === view));
  }
  heading.textContent = viewTitles[view];
  savedCount.textContent = saved.size;
  const items = allItems.filter((item) => view === "saved" ? saved.has(item.id) : item.type === view);
  const cards = items.map(createCard);
  if (!cards.length) {
    cards.push(element("p", "empty", "Items you save from Events, Clubs, and Resources will appear here."));
  }
  results.replaceChildren(...cards);
}

for (const button of viewButtons) {
  button.addEventListener("click", () => {
    view = button.dataset.view;
    render();
  });
}

for (const link of document.querySelectorAll("[data-demo-view]")) {
  link.addEventListener("click", () => {
    view = link.dataset.demoView;
    render();
  });
}

render();
