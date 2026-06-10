import { createContext, useContext } from "react";
import shelbyStorage from "../lib/shelbyStorage";

export interface PulseUser {
  name: string;
  walletId: string;
  createdAt: string;
}

const STORAGE_KEY = "pulse_user";

export function generateWalletId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex.slice(0, 4)}…${hex.slice(-4)}`;
}

export function saveUser(name: string): PulseUser {
  const user: PulseUser = {
    name: name.trim(),
    walletId: generateWalletId(),
    createdAt: new Date().toISOString(),
  };
  shelbyStorage.set<PulseUser>(STORAGE_KEY, user);
  return user;
}

export function loadUser(): PulseUser | null {
  return shelbyStorage.get<PulseUser>(STORAGE_KEY);
}

export function clearUser(): void {
  shelbyStorage.remove(STORAGE_KEY);
}

export interface AuthContextValue {
  user: PulseUser | null;
  login: (name: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
