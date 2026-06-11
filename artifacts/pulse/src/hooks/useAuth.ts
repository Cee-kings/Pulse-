import { createContext, useContext } from "react";
import shelbyStorage from "../lib/shelbyStorage";

export interface PulseUser {
  name: string;       // resolved: username || shortAddr(walletId)
  walletId: string;   // Aptos address
  username?: string;  // explicitly set by user (undefined = not set yet)
  createdAt: string;
}

export interface VerifiedSession {
  address: string;
  verifiedAt: string;
  name?: string;
}

const STORAGE_KEY = "pulse_user";
const DISPLAY_NAME_KEY = "pulse_display_name";
const SESSION_KEY = "pulse_verified_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function usernameStorageKey(address: string) { return `pulse_username_${address}`; }
function skipStorageKey(address: string) { return `pulse_username_skip_${address}`; }

export function saveUsername(address: string, username: string): void {
  shelbyStorage.set<string>(usernameStorageKey(address), username.trim());
  shelbyStorage.remove(skipStorageKey(address));
}

export function loadUsername(address: string): string | null {
  return shelbyStorage.get<string>(usernameStorageKey(address));
}

export function markUsernameSkipped(address: string): void {
  shelbyStorage.set<boolean>(skipStorageKey(address), true);
}

export function isUsernameSkipped(address: string): boolean {
  return shelbyStorage.get<boolean>(skipStorageKey(address)) === true;
}

export function saveDisplayName(name: string): void {
  shelbyStorage.set<string>(DISPLAY_NAME_KEY, name);
}

export function loadDisplayName(): string | null {
  return shelbyStorage.get<string>(DISPLAY_NAME_KEY);
}

export function saveSession(address: string, name?: string): void {
  const session: VerifiedSession = {
    address,
    verifiedAt: new Date().toISOString(),
    name: name?.trim() || undefined,
  };
  shelbyStorage.set<VerifiedSession>(SESSION_KEY, session);
}

export function loadSession(): VerifiedSession | null {
  const session = shelbyStorage.get<VerifiedSession>(SESSION_KEY);
  if (!session) return null;
  const age = Date.now() - new Date(session.verifiedAt).getTime();
  if (age > SESSION_TTL_MS) {
    shelbyStorage.remove(SESSION_KEY);
    return null;
  }
  return session;
}

export function clearSession(): void {
  shelbyStorage.remove(SESSION_KEY);
}

export function shortAddress(addr: string): string {
  if (addr.length > 10) return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  return addr;
}

export function saveUser(address: string, nameHint?: string): PulseUser {
  const storedUsername = loadUsername(address);
  const username = storedUsername || undefined;
  const displayName = username || (nameHint && nameHint.trim()) || loadDisplayName() || shortAddress(address);
  const user: PulseUser = {
    name: displayName,
    walletId: address,
    username,
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
  setUsername: (username: string) => void;
  skipUsernamePrompt: () => void;
  openUsernamePrompt: () => void;
  showUsernamePrompt: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  setUsername: () => {},
  skipUsernamePrompt: () => {},
  openUsernamePrompt: () => {},
  showUsernamePrompt: false,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
