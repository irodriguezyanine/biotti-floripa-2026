import { NextResponse } from "next/server";
import {
  getCloudinary,
  getGalleryFolder,
  normalizeCloudinaryText,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function toIsoDate(value?: string) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function uploadToCloudinary(
  fileBuffer: Buffer,
  opts: {
    uploaderName: string;
    message: string;
    uploadedAt: string;
  }
) {
  const cloudinary = getCloudinary();
  const folder = getGalleryFolder();
  const safeMessage = normalizeCloudinaryText(opts.message);
  const safeUploader = normalizeCloudinaryText(opts.uploaderName);
  const contextParts = [
    `uploader=${safeUploader}`,
    `uploaded_at=${opts.uploadedAt}`,
  ];
  if (safeMessage) contextParts.push(`message=${safeMessage}`);
  const context = contextParts.join("|");

  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    created_at: string;
    context?: {
      custom?: Record<string, string>;
    };
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
        context,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("No se pudo subir la imagen a Cloudinary."));
          return;
        }
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const uploaderName = String(formData.get("uploaderName") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido." }, { status: 400 });
    }

    if (!uploaderName) {
      return NextResponse.json(
        { error: "El nombre del usuario es obligatorio." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "La imagen supera el tamaño máximo de 10MB." },
        { status: 400 }
      );
    }

    const uploadedAtIso = new Date().toISOString();
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const result = await uploadToCloudinary(fileBuffer, {
      uploaderName,
      message,
      uploadedAt: uploadedAtIso,
    });

    const customContext = result.context?.custom ?? {};

    return NextResponse.json({
      image: {
        id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        uploadedBy: customContext.uploader || uploaderName,
        message: customContext.message || message || "",
        uploadedAt: toIsoDate(customContext.uploaded_at || result.created_at),
      },
    });
  } catch (error) {
    console.error("Error en subida de galería:", error);
    const details =
      error instanceof Error ? error.message : "Error desconocido de subida";
    return NextResponse.json(
      {
        error: "No se pudo subir la imagen. Revisa la configuración de Cloudinary.",
        details,
      },
      { status: 500 }
    );
  }
}
