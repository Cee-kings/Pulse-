import { LocalShelbyAdapter, migrateFromLegacyStorage } from "./local-adapter";

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

const _adapter = new LocalShelbyAdapter();
migrateFromLegacyStorage(_adapter);

export const shelby = _adapter;
