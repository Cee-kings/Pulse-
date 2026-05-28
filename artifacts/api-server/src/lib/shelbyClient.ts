import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const GATEWAY_URL = process.env.SHELBY_GATEWAY_URL ?? "http://localhost:9000";
const ACCESS_KEY  = process.env.SHELBY_ACCESS_KEY  ?? "AKIAIOSFODNN7EXAMPLE";
const SECRET_KEY  = process.env.SHELBY_SECRET_KEY  ?? "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const BUCKET      = process.env.SHELBY_BUCKET      ?? "";

const s3 = new S3Client({
  endpoint: GATEWAY_URL,
  region: "shelbyland",
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  forcePathStyle: true,
});

const DEFAULT_EXPIRY = String(60 * 60 * 24 * 365);

export const shelbyClient = {
  async put(key: string, value: unknown, expirySeconds?: number) {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(value),
      ContentType: "application/json",
      Metadata: { "expiration-seconds": String(expirySeconds ?? DEFAULT_EXPIRY) },
    }));
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const text = await res.Body?.transformToString();
      if (!text) return null;
      return JSON.parse(text) as T;
    } catch (e: any) {
      if (e.name === "NoSuchKey") return null;
      throw e;
    }
  },

  async remove(key: string) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  },

  async list(prefix = ""): Promise<string[]> {
    const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
    return (res.Contents ?? []).map(o => o.Key ?? "").filter(Boolean);
  },

  async exists(key: string): Promise<boolean> {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
      return true;
    } catch {
      return false;
    }
  },
};