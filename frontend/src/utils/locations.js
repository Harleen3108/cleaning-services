// Frontend-managed serviceable locations.
// Defaults ship with the app; admins can add/remove extras (saved in the browser).
// No backend involved — honors the "keep backend intact" requirement.

const STORAGE_ADDED = 'serviceableLocations_added';
const STORAGE_SELECTED = 'selectedLocation';

const DEFAULT_SERVICEABLE = [
  'Bengaluru',
  'Bangalore',
  'Delhi',
  'New Delhi',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Gurgaon',
  'Gurugram',
  'Noida',
  'Chennai',
  'Kolkata',
];

const readAdded = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ADDED);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

// Full list of serviceable city names (defaults + admin additions, de-duped).
export const getServiceableLocations = () => {
  const merged = [...DEFAULT_SERVICEABLE, ...readAdded()];
  const seen = new Set();
  const out = [];
  merged.forEach((name) => {
    const key = name.trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(name.trim());
    }
  });
  return out.sort((a, b) => a.localeCompare(b));
};

// Admin add / remove (only affects admin-added extras, never the defaults).
export const addServiceableLocation = (name) => {
  const clean = (name || '').trim();
  if (!clean) return getServiceableLocations();
  const added = readAdded();
  if (!added.some((n) => n.toLowerCase() === clean.toLowerCase()) &&
      !DEFAULT_SERVICEABLE.some((n) => n.toLowerCase() === clean.toLowerCase())) {
    added.push(clean);
    localStorage.setItem(STORAGE_ADDED, JSON.stringify(added));
  }
  return getServiceableLocations();
};

export const removeServiceableLocation = (name) => {
  const added = readAdded().filter((n) => n.toLowerCase() !== (name || '').toLowerCase());
  localStorage.setItem(STORAGE_ADDED, JSON.stringify(added));
  return getServiceableLocations();
};

export const isDefaultLocation = (name) =>
  DEFAULT_SERVICEABLE.some((n) => n.toLowerCase() === (name || '').trim().toLowerCase());

// Does a free-text place string (e.g. a full address or city) match any serviceable area?
// Returns the matched city name, or null.
export const matchServiceable = (query) => {
  const q = (query || '').toLowerCase();
  if (!q) return null;
  const found = getServiceableLocations().find((city) => q.includes(city.toLowerCase()));
  return found || null;
};

export const isServiceable = (query) => matchServiceable(query) !== null;

// The user's currently selected location (city label).
export const getSelectedLocation = () => {
  try {
    return localStorage.getItem(STORAGE_SELECTED) || null;
  } catch {
    return null;
  }
};

export const setSelectedLocation = (name) => {
  try {
    if (name) localStorage.setItem(STORAGE_SELECTED, name);
    else localStorage.removeItem(STORAGE_SELECTED);
  } catch {
    /* ignore */
  }
};
