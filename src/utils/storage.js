/**
 * Safely get an item from localStorage and parse it.
 * @param {string} key - The localStorage key.
 * @param {any} defaultValue - The default value to return if not found or on error.
 * @returns {any} The parsed value or defaultValue.
 */
export const getStorageData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing storage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely stringify and save an item to localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} value - The value to store.
 */
export const setStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving storage item "${key}":`, error);
  }
};

/**
 * Safely remove an item from localStorage.
 * @param {string} key - The localStorage key.
 */
export const removeStorageData = key => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item "${key}":`, error);
  }
};
