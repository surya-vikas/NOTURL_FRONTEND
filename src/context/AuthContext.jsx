import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { clearSession, getToken, getUser, setToken, setUser } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken() || "");
  const [user, setUserState] = useState(() => getUser());

  const login = useCallback((nextToken, nextUser) => {
    const normalizedToken = String(nextToken || "");
    if (!normalizedToken) {
      return;
    }

    setToken(normalizedToken);
    setUser(nextUser || {});
    setTokenState(normalizedToken);
    setUserState(nextUser || {});
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setTokenState("");
    setUserState(null);
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser || {});
    setUserState(nextUser || {});
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [token, user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};
