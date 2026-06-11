import { useState, useEffect, useRef, type ReactNode } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AuthContext,
  saveUser,
  clearUser,
  clearSession,
  loadSession,
  type PulseUser,
} from "../hooks/useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { connected, account, disconnect } = useWallet();
  const [user, setUser] = useState<PulseUser | null>(null);
  const autoLoginAttempted = useRef(false);

  useEffect(() => {
    if (connected && account?.address) {
      const address = account.address.toString();

      if (!autoLoginAttempted.current) {
        autoLoginAttempted.current = true;
        const session = loadSession();
        if (session && session.address === address) {
          const newUser = saveUser(address, session.name);
          setUser(newUser);
          return;
        }
      }
    }

    if (!connected) {
      autoLoginAttempted.current = false;
      clearUser();
      clearSession();
      setUser(null);
    }
  }, [connected, account?.address]);

  function login(address: string, name?: string) {
    const newUser = saveUser(address, name);
    setUser(newUser);
  }

  function logout() {
    clearUser();
    clearSession();
    setUser(null);
    disconnect();
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
