import { NextResponse } from "next/server";
import {
  applyCloudinaryConfigCandidate,
  getCloudinary,
  getCloudinaryConfigCandidates,
  getCloudinaryErrorDetails,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

type DeletePayload = {
  imageId?: string;
  deleteToken?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeletePayload;
    const imageId = String(body?.imageId ?? "").trim();
    const deleteToken = String(body?.deleteToken ?? "").trim();

    if (!imageId || !deleteToken) {
      return NextResponse.json(
        { error: "Faltan datos para eliminar la imagen." },
        { status: 400 }
      );
    }

    const cloudinary = getCloudinary();
    const candidates = getCloudinaryConfigCandidates();
    const errors: string[] = [];

    for (const candidate of candidates) {
      applyCloudinaryConfigCandidate(candidate);
      try {
        const resource = await cloudinary.api.resource(imageId, {
          resource_type: "image",
          type: "upload",
          context: true,
        });
        const ownerToken = resource.context?.custom?.owner_token;

        if (!ownerToken || ownerToken !== deleteToken) {
          return NextResponse.json(
            { error: "No tienes permiso para eliminar esta foto." },
            { status: 403 }
          );
        }

        await cloudinary.uploader.destroy(imageId, {
          resource_type: "image",
          invalidate: true,
        });

        return NextResponse.json({ success: true, imageId });
      } catch (error) {
        errors.push(
          `${candidate.source}:${candidate.cloudName} => ${getCloudinaryErrorDetails(
            error
          )}`
        );
      }
    }

    return NextResponse.json(
      { error: "No se pudo eliminar la imagen.", details: errors.join(" || ") },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "No se pudo procesar la eliminación.",
        details: getCloudinaryErrorDetails(error),
      },
      { status: 500 }
    );
  }
}
