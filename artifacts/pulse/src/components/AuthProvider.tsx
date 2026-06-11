import { useState, useEffect, useRef, type ReactNode } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AuthContext,
  saveUser,
  saveUsername,
  markUsernameSkipped,
  isUsernameSkipped,
  clearUser,
  clearSession,
  loadSession,
  type PulseUser,
} from "../hooks/useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { connected, account, disconnect } = useWallet();
  const [user, setUser] = useState<PulseUser | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
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
          if (!newUser.username && !isUsernameSkipped(address)) {
            setShowUsernamePrompt(true);
          }
          return;
        }
      }
    }

    if (!connected) {
      autoLoginAttempted.current = false;
      clearUser();
      clearSession();
      setUser(null);
      setShowUsernamePrompt(false);
    }
  }, [connected, account?.address]);

  function login(address: string, name?: string) {
    const newUser = saveUser(address, name);
    setUser(newUser);
    if (!newUser.username && !isUsernameSkipped(address)) {
      setShowUsernamePrompt(true);
    }
  }

  function logout() {
    clearUser();
    clearSession();
    setUser(null);
    setShowUsernamePrompt(false);
    disconnect();
  }

  function setUsernameFn(username: string) {
    if (!user) return;
    saveUsername(user.walletId, username);
    const updated = saveUser(user.walletId);
    setUser(updated);
    setShowUsernamePrompt(false);
  }

  function skipUsernamePrompt() {
    if (user) markUsernameSkipped(user.walletId);
    setShowUsernamePrompt(false);
  }

  function openUsernamePrompt() {
    setShowUsernamePrompt(true);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUsername: setUsernameFn,
        skipUsernamePrompt,
        openUsernamePrompt,
        showUsernamePrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
