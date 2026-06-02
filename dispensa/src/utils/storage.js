// Abstração do localStorage com proteção básica
const KEYS = {
  USERS: 'dispensa_users',
  CURRENT_USER: 'dispensa_current_user',
  ITEMS: 'dispensa_items',
};

const parse = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const getUsers = () => parse(KEYS.USERS, []);
export const saveUsers = (users) => save(KEYS.USERS, users);

export const getCurrentUser = () => parse(KEYS.CURRENT_USER, null);
export const saveCurrentUser = (user) => save(KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => localStorage.removeItem(KEYS.CURRENT_USER);

export const getItems = (userId) => {
  const all = parse(KEYS.ITEMS, {});
  return all[userId] || [];
};

export const saveItems = (userId, items) => {
  const all = parse(KEYS.ITEMS, {});
  all[userId] = items;
  save(KEYS.ITEMS, all);
};

export const deleteUserItems = (userId) => {
  const all = parse(KEYS.ITEMS, {});
  delete all[userId];
  save(KEYS.ITEMS, all);
};