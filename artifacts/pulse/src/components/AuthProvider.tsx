import { useState, useEffect, type ReactNode } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AuthContext,
  saveUser,
  clearUser,
  loadDisplayName,
  type PulseUser,
} from "../hooks/useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { connected, account, disconnect } = useWallet();
  const [user, setUser] = useState<PulseUser | null>(null);

  useEffect(() => {
    if (connected && account?.address) {
      const address = account.address.toString();
      const name = loadDisplayName() ?? undefined;
      const newUser = saveUser(address, name);
      setUser(newUser);
    } else {
      clearUser();
      setUser(null);
    }
  }, [connected, account?.address]);

  function login(address: string, name?: string) {
    const newUser = saveUser(address, name);
    setUser(newUser);
  }

  function logout() {
    clearUser();
    setUser(null);
    disconnect();
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
