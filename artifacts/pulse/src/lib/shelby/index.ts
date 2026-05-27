/**
 * Shelby Client — active instance
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SWAP POINT                                                      ║
 * ║  To use the real Shelby SDK, replace the import below with       ║
 * ║  your SDK adapter and ensure it implements IShelbyClient.        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Example:
 *   import { RealShelbyAdapter } from "@shelby/sdk";
 *   export const shelby: IShelbyClient = new RealShelbyAdapter({ ... });
 */

import { LocalShelbyAdapter, migrateFromLegacyStorage } from "./local-adapter";
import type { IShelbyClient } from "./types";

const adapter = new LocalShelbyAdapter();

// One-time migration from pre-Shelby localStorage format
migrateFromLegacyStorage(adapter);

export const shelby: IShelbyClient = adapter;

export type { IShelbyClient } from "./types";
export type {
  ShelbyBlob,
  ShelbyMeta,
  ShelbyPublishReceipt,
  ShelbyRetrievalTrace,
  ShelbyRetrievalStep,
  ShelbyNetworkStats,
  ShelbyQuery,
} from "./types";
