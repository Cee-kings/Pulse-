import { createContext, useContext } from "react";
import shelbyStorage from "../lib/shelbyStorage";

export interface PulseUser {
  name: string;
  walletId: string;
  createdAt: string;
}

const STORAGE_KEY = "pulse_user";
const DISPLAY_NAME_KEY = "pulse_display_name";

export function saveDisplayName(name: string): void {
  shelbyStorage.set<string>(DISPLAY_NAME_KEY, name);
}

export function loadDisplayName(): string | null {
  return shelbyStorage.get<string>(DISPLAY_NAME_KEY);
}

function shortAddress(addr: string): string {
  if (addr.length > 10) return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  return addr;
}

export function saveUser(address: string, name?: string): PulseUser {
  const displayName = (name && name.trim()) ? name.trim() : (loadDisplayName() || shortAddress(address));
  const user: PulseUser = {
    name: displayName,
    walletId: address,
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
  login: (address: string, name?: string) => void;
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
