const classGrid = document.getElementById("classes");
const selectedClassEl = document.getElementById("selected-class");
const roleIconsEl = document.getElementById("role-icons");
const specListEl = document.getElementById("spec-list");
const raceAllianceEl = document.getElementById("race-alliance");
const raceHordeEl = document.getElementById("race-horde");
const raceRowEl = document.getElementById("race-row");
const roleResetEl = document.getElementById("role-reset");

// Map role names in data-role to CSS classes
function getRoleKey(roleName) {
  const trimmed = roleName.toLowerCase();
  if (trimmed.includes("tank")) return "tank";
  if (trimmed.includes("heal")) return "healer";
  return "damage";
}

// Map class display names to CSS keys for coloring
const CLASS_COLOR_KEYS = {
  "Death Knight": "deathknight",
  "Demon Hunter": "demonhunter",
  Druid: "druid",
  Evoker: "evoker",
  Hunter: "hunter",
  Mage: "mage",
  Monk: "monk",
  Paladin: "paladin",
  Priest: "priest",
  Rogue: "rogue",
  Shaman: "shaman",
  Warlock: "warlock",
  Warrior: "warrior",
};
const CLASS_COLOR_VALUES = Object.values(CLASS_COLOR_KEYS);

let currentClassName = null;
let currentRoleFilter = null; // "tank" | "healer" | "damage" | null

// Races per faction, taken from Blizzard's races page:
// https://worldofwarcraft.blizzard.com/en-us/game/races
const RACES = {
  alliance: [
    // Core Alliance races
    "Human",
    "Dwarf",
    "Night Elf",
    "Gnome",
    "Draenei",
    "Worgen",
    "Pandaren",
    "Dracthyr",
    // Allied Alliance races
    "Void Elf",
    "Lightforged Draenei",
    "Dark Iron Dwarf",
    "Kul Tiran",
    "Mechagnome",
    "Earthen",
  ],
  horde: [
    // Core Horde races
    "Orc",
    "Undead",
    "Tauren",
    "Troll",
    "Blood Elf",
    "Goblin",
    "Pandaren",
    "Dracthyr",
    // Allied Horde races
    "Nightborne",
    "Highmountain Tauren",
    "Mag'har Orc",
    "Zandalari Troll",
    "Vulpera",
    "Earthen",
  ],
};

// Which races can play each class (simplified; you can refine this list).
// Uses the race names from the RACES lists above.
const CLASS_RACES = {
  Warrior: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Dracthyr",
      "Void Elf",
      "Lightforged Draenei",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
      "Earthen",
    ],
    horde: [
      "Orc",
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Dracthyr",
      "Nightborne",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
      "Vulpera",
      "Earthen",
    ],
  },
  Hunter: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Void Elf",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Nightborne",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
      "Vulpera",
    ],
  },
  Priest: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Void Elf",
      "Lightforged Draenei",
      "Kul Tiran",
    ],
    horde: [
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Nightborne",
      "Zandalari Troll",
    ],
  },
  Mage: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Void Elf",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Nightborne",
      "Zandalari Troll",
    ],
  },
  Monk: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Void Elf",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Nightborne",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
    ],
  },
  "Demon Hunter": {
    alliance: ["Night Elf"],
    horde: ["Blood Elf"],
  },
  Evoker: {
    alliance: ["Dracthyr"],
    horde: ["Dracthyr"],
  },
  Paladin: {
    alliance: [
      "Human",
      "Dwarf",
      "Draenei",
      "Lightforged Draenei",
      "Dark Iron Dwarf",
      "Kul Tiran",
    ],
    horde: ["Blood Elf", "Tauren", "Zandalari Troll"],
  },
  Rogue: {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Pandaren",
      "Void Elf",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Pandaren",
      "Nightborne",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
      "Vulpera",
    ],
  },
  Shaman: {
    alliance: ["Dwarf", "Draenei", "Dark Iron Dwarf", "Kul Tiran"],
    horde: [
      "Orc",
      "Tauren",
      "Troll",
      "Goblin",
      "Pandaren",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
    ],
  },
  Warlock: {
    alliance: [
      "Human",
      "Dwarf",
      "Gnome",
      "Worgen",
      "Void Elf",
      "Dark Iron Dwarf",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Nightborne",
      "Zandalari Troll",
    ],
  },
  Druid: {
    alliance: ["Night Elf", "Worgen", "Kul Tiran"],
    horde: ["Tauren", "Troll", "Highmountain Tauren", "Zandalari Troll"],
  },
  "Death Knight": {
    alliance: [
      "Human",
      "Dwarf",
      "Night Elf",
      "Gnome",
      "Draenei",
      "Worgen",
      "Void Elf",
      "Lightforged Draenei",
      "Dark Iron Dwarf",
      "Kul Tiran",
      "Mechagnome",
    ],
    horde: [
      "Orc",
      "Undead",
      "Tauren",
      "Troll",
      "Blood Elf",
      "Goblin",
      "Nightborne",
      "Highmountain Tauren",
      "Mag'har Orc",
      "Zandalari Troll",
      "Vulpera",
    ],
  },
};

// Specs per class, with their primary combat role.
// Warrior specs based on the official Blizzard warrior page:
// Arms (Damage), Fury (Damage), Protection (Tank) –
// https://worldofwarcraft.blizzard.com/en-us/game/classes/warrior
// Other class specs and roles based on the class guides index on Wowhead –
// https://www.wowhead.com/guides/classes
const CLASS_SPECS = {
  "Death Knight": [
    { name: "Blood", role: "Tank" },
    { name: "Frost", role: "Damage" },
    { name: "Unholy", role: "Damage" },
  ],
  "Demon Hunter": [
    { name: "Havoc", role: "Damage" },
    { name: "Vengeance", role: "Tank" },
  ],
  Druid: [
    { name: "Balance", role: "Damage" },
    { name: "Feral", role: "Damage" },
    { name: "Guardian", role: "Tank" },
    { name: "Restoration", role: "Healer" },
  ],
  Evoker: [
    { name: "Devastation", role: "Damage" },
    { name: "Preservation", role: "Healer" },
    { name: "Augmentation", role: "Damage" },
  ],
  Hunter: [
    { name: "Beast Mastery", role: "Damage" },
    { name: "Marksmanship", role: "Damage" },
    { name: "Survival", role: "Damage" },
  ],
  Mage: [
    { name: "Arcane", role: "Damage" },
    { name: "Fire", role: "Damage" },
    { name: "Frost", role: "Damage" },
  ],
  Monk: [
    { name: "Brewmaster", role: "Tank" },
    { name: "Mistweaver", role: "Healer" },
    { name: "Windwalker", role: "Damage" },
  ],
  Paladin: [
    { name: "Holy", role: "Healer" },
    { name: "Protection", role: "Tank" },
    { name: "Retribution", role: "Damage" },
  ],
  Priest: [
    { name: "Discipline", role: "Healer" },
    { name: "Holy", role: "Healer" },
    { name: "Shadow", role: "Damage" },
  ],
  Rogue: [
    { name: "Assassination", role: "Damage" },
    { name: "Outlaw", role: "Damage" },
    { name: "Subtlety", role: "Damage" },
  ],
  Shaman: [
    { name: "Elemental", role: "Damage" },
    { name: "Enhancement", role: "Damage" },
    { name: "Restoration", role: "Healer" },
  ],
  Warlock: [
    { name: "Affliction", role: "Damage" },
    { name: "Demonology", role: "Damage" },
    { name: "Destruction", role: "Damage" },
  ],
  Warrior: [
    { name: "Arms", role: "Damage" },
    { name: "Fury", role: "Damage" },
    { name: "Protection", role: "Tank" },
  ],
};

function applySelectedClassStyle(name) {
  // ensure base highlight class
  selectedClassEl.classList.add("selected-class-text");
  // clear previous class color keys
  CLASS_COLOR_VALUES.forEach((key) => selectedClassEl.classList.remove(key));
  const key = CLASS_COLOR_KEYS[name];
  if (key) {
    selectedClassEl.classList.add(key);
  }
}

function renderSpecs(name, roleFilter) {
  specListEl.innerHTML = "";
  if (!name) return;
  const specs = CLASS_SPECS[name] || [];
  specs.forEach((spec) => {
    const roleKey = getRoleKey(spec.role || "");
    if (roleFilter && roleKey !== roleFilter) return;
    const pill = document.createElement("span");
    pill.className = `spec-pill ${roleKey}`;
    pill.textContent = spec.name;
    pill.title = `${spec.name} – ${spec.role}`;
    specListEl.appendChild(pill);
  });
}

function setActiveRoleIcon(roleKey) {
  // clear previous active state
  roleIconsEl
    .querySelectorAll(".role-icon")
    .forEach((icon) => icon.classList.remove("active"));
  if (!roleKey) return;
  const icon = roleIconsEl.querySelector(`.role-icon.${roleKey}`);
  if (icon) icon.classList.add("active");
}

// Single-select behavior: clicking a card selects it and updates the info panel
classGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".class-card");
  if (!card) return;

  // Clear previous selection
  document
    .querySelectorAll(".class-card.selected")
    .forEach((el) => el.classList.remove("selected"));

  // Mark this card selected
  card.classList.add("selected");

  // Update info panel
  const name = card.dataset.class;
  const roleString = card.dataset.role || "";

  currentClassName = name;
  currentRoleFilter = null;

  selectedClassEl.textContent = name;
  applySelectedClassStyle(name);

  // Build role icons
  roleIconsEl.innerHTML = "";
  const roles = roleString
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  roles.forEach((role) => {
    const key = getRoleKey(role);
    const span = document.createElement("span");
    span.className = `role-icon ${key}`;
    span.dataset.roleKey = key;
    roleIconsEl.appendChild(span);
  });

  setActiveRoleIcon(null);
  renderSpecs(name, null);
});

// Clicking a role icon filters specs to that role (click again to clear filter)
roleIconsEl.addEventListener("click", (event) => {
  const icon = event.target.closest(".role-icon");
  if (!icon || !currentClassName) return;
  const roleKey = icon.dataset.roleKey || "";
  const normalized = roleKey === "tank" || roleKey === "healer" || roleKey === "damage" ? roleKey : null;

  if (!normalized) return;

  // toggle filter
  if (currentRoleFilter === normalized) {
    currentRoleFilter = null;
  } else {
    currentRoleFilter = normalized;
  }

  setActiveRoleIcon(currentRoleFilter);
  renderSpecs(currentClassName, currentRoleFilter);
});

// Reset button clears role filter and shows all specs
if (roleResetEl) {
  roleResetEl.addEventListener("click", () => {
    if (!currentClassName) return;
    currentRoleFilter = null;
    setActiveRoleIcon(null);
    renderSpecs(currentClassName, null);
  });
}

// When a class is selected, also render the races (by faction) for that class
classGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".class-card");
  const name = card?.dataset.class;
  if (!name) return;
  renderRaces(name);
});

// Render races when a class is selected, showing only races that can play the class
function renderRaces(className) {
  const mapping = CLASS_RACES[className] || { alliance: [], horde: [] };
  const alliance = mapping.alliance || [];
  const horde = mapping.horde || [];

  raceAllianceEl.innerHTML = "";
  alliance.forEach((race) => {
    const span = document.createElement("span");
    span.className = "race-pill";
    span.textContent = race;
    span.classList.add("highlight");
    raceAllianceEl.appendChild(span);
  });

  raceHordeEl.innerHTML = "";
  horde.forEach((race) => {
    const span = document.createElement("span");
    span.className = "race-pill";
    span.textContent = race;
    span.classList.add("highlight");
    raceHordeEl.appendChild(span);
  });
  // show the race row once we have rendered races
  raceRowEl.classList.remove("hidden");
}

// hide races until a class is selected
if (raceRowEl) {
  raceRowEl.classList.add("hidden");
}
