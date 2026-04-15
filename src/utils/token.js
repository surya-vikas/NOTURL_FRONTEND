const TOKEN_KEY = "noturl_token";
const USER_KEY = "noturl_user";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
};

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const titleize = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const getDisplayName = () => {
  const user = getUser();
  if (user?.name && String(user.name).trim()) {
    return String(user.name).trim();
  }

  if (user?.email && String(user.email).includes("@")) {
    const username = String(user.email).split("@")[0];
    const formatted = username.replace(/[._-]+/g, " ").trim();
    return formatted ? titleize(formatted) : "User";
  }

  return "User";
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(getToken());
