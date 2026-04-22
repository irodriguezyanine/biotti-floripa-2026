import { v2 as cloudinary } from "cloudinary";

const requiredEnvs = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;
type CloudinaryConfigSource = "url" | "split";

export type CloudinaryConfigCandidate = {
  source: CloudinaryConfigSource;
  cloudName: string;
  config: {
    secure: true;
    cloudinary_url?: string;
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
  };
};

function cleanEnvValue(value?: string) {
  if (!value) return "";
  let cleaned = value.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith("<") && cleaned.endsWith(">")) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}

function sanitizeCloudinaryUrl(value: string) {
  return cleanEnvValue(value)
    .replace(/<([^>]+)>/g, "$1")
    .replace(/\s+/g, "");
}

function readCandidatesFromEnv(): CloudinaryConfigCandidate[] {
  const candidates: CloudinaryConfigCandidate[] = [];
  const cloudinaryUrl = sanitizeCloudinaryUrl(process.env.CLOUDINARY_URL ?? "");
  if (cloudinaryUrl) {
    const maybeCloudName =
      cloudinaryUrl.split("@")[1]?.split("?")[0]?.trim() || "desconocido";
    candidates.push({
      source: "url",
      cloudName: maybeCloudName,
      config: {
        cloudinary_url: cloudinaryUrl,
        secure: true,
      },
    });
  }

  const envCloudName = cleanEnvValue(process.env.CLOUDINARY_CLOUD_NAME);
  const envApiKey = cleanEnvValue(process.env.CLOUDINARY_API_KEY);
  const envApiSecret = cleanEnvValue(process.env.CLOUDINARY_API_SECRET);
  if (envCloudName && envApiKey && envApiSecret) {
    candidates.push({
      source: "split",
      cloudName: envCloudName,
      config: {
        cloud_name: envCloudName,
        api_key: envApiKey,
        api_secret: envApiSecret,
        secure: true,
      },
    });
  }

  return candidates;
}

export function getCloudinaryConfigCandidates() {
  const candidates = readCandidatesFromEnv();
  if (candidates.length === 0) {
    const missing = requiredEnvs.filter((envName) => !cleanEnvValue(process.env[envName]));
    throw new Error(
      `Faltan variables de entorno de Cloudinary: ${missing.join(
        ", "
      )}. O define CLOUDINARY_URL completo.`
    );
  }
  return candidates;
}

export function applyCloudinaryConfigCandidate(candidate: CloudinaryConfigCandidate) {
  cloudinary.config(candidate.config);
}

export function getCloudinary() {
  const [firstCandidate] = getCloudinaryConfigCandidates();
  applyCloudinaryConfigCandidate(firstCandidate);
  return cloudinary;
}

export function getGalleryFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER || "biotti-floripa-2026/gallery";
}

export function normalizeCloudinaryText(value: string) {
  return value
    .replace(/[=|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null;
}

export function getCloudinaryErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.name;
  }

  if (isRecord(error)) {
    const directMessage =
      typeof error.message === "string" ? error.message : undefined;
    if (directMessage) return directMessage;

    const nestedError = error.error;
    if (isRecord(nestedError) && typeof nestedError.message === "string") {
      return nestedError.message;
    }

    const httpCode =
      typeof error.http_code === "number" ? String(error.http_code) : undefined;
    const name = typeof error.name === "string" ? error.name : undefined;
    const partial = [name, httpCode ? `http ${httpCode}` : undefined]
      .filter(Boolean)
      .join(" · ");
    if (partial) return partial;

    try {
      return JSON.stringify(error);
    } catch {
      return "Error no serializable";
    }
  }

  if (typeof error === "string") return error;
  return "Error desconocido";
}
