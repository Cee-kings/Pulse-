import { useState, type ReactNode } from "react";
import { AuthContext, loadUser, saveUser, clearUser, type PulseUser } from "../hooks/useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PulseUser | null>(() => loadUser());

  function login(name: string) {
    const newUser = saveUser(name);
    setUser(newUser);
  }

  function logout() {
    clearUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
