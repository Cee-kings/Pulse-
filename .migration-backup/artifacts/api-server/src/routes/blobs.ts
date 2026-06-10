import { Router } from "express";
import { shelbyClient } from "../lib/shelbyClient";

const router = Router();

router.get("/blobs", async (req, res) => {
  try {
    const prefix = String(req.query.prefix ?? "");
    const keys = await shelbyClient.list(prefix);
    res.json({ keys });
  } catch {
    res.status(500).json({ error: "Failed to list blobs" });
  }
});

router.get("/blobs/:key", async (req, res) => {
  try {
    const value = await shelbyClient.get(req.params.key);
    if (value === null) return res.status(404).json({ error: "Not found" });
    res.json({ value });
  } catch {
    res.status(500).json({ error: "Failed to get blob" });
  }
});

router.head("/blobs/:key", async (req, res) => {
  const exists = await shelbyClient.exists(req.params.key);
  res.status(exists ? 200 : 404).end();
});

router.put("/blobs/:key", async (req, res) => {
  try {
    const { value, expirySeconds } = req.body;
    await shelbyClient.put(req.params.key, value, expirySeconds);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to put blob" });
  }
});

router.delete("/blobs/:key", async (req, res) => {
  try {
    await shelbyClient.remove(req.params.key);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete blob" });
  }
});

export default router;