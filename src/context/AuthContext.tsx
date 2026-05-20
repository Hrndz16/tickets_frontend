import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { authApi, type AuthUser, type LoginRequest } from "../api/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser() {
  const value = localStorage.getItem("user");

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  async function login(credentials: LoginRequest) {
    const session = await authApi.login(credentials);
    const authUser: AuthUser = {
      id: session.id,
      username: session.username,
      email: session.email,
      nombre: session.nombre,
      apellido: session.apellido,
      role: session.role,
    };

    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(session.token);
    setUser(authUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
