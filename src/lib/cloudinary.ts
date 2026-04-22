import { v2 as cloudinary } from "cloudinary";

const requiredEnvs = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

let configured = false;

function ensureCloudinaryConfig() {
  if (configured) return;

  const missing = requiredEnvs.filter((envName) => !process.env[envName]);
  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno de Cloudinary: ${missing.join(", ")}`
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export function getCloudinary() {
  ensureCloudinaryConfig();
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
