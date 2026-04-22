import { NextResponse } from "next/server";
import {
  getCloudinary,
  getCloudinaryErrorDetails,
  getGalleryFolder,
  getCloudinaryRuntimeInfo,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

type CloudinarySearchResult = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
  context?: {
    custom?: Record<string, string>;
  };
};

function toIsoDate(value?: string) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export async function GET() {
  const diagnostics: string[] = [];
  try {
    const cloudinary = getCloudinary();
    const runtimeInfo = getCloudinaryRuntimeInfo();
    const folder = getGalleryFolder();
    let resources: CloudinarySearchResult[] = [];

    try {
      const resourcesResult = await cloudinary.api.resources({
        type: "upload",
        prefix: `${folder}/`,
        max_results: 100,
        context: true,
      });
      resources = (resourcesResult.resources ?? []) as CloudinarySearchResult[];
    } catch (apiError) {
      diagnostics.push(`api.resources: ${getCloudinaryErrorDetails(apiError)}`);
    }

    // Fallback para cuentas/configuraciones donde api.resources puede fallar.
    if (resources.length === 0) {
      try {
        const searchResult = await cloudinary.search
          .expression(`folder="${folder}" AND resource_type:image`)
          .sort_by("created_at", "desc")
          .max_results(100)
          .with_field("context")
          .execute();
        resources = (searchResult.resources ?? []) as CloudinarySearchResult[];
      } catch (searchError) {
        diagnostics.push(`search: ${getCloudinaryErrorDetails(searchError)}`);
      }
    }

    const images = resources
      .map((resource) => ({
        id: resource.public_id,
        url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        uploadedBy: resource.context?.custom?.uploader || "Anónimo",
        message: resource.context?.custom?.message || "",
        uploadedAt: toIsoDate(
          resource.context?.custom?.uploaded_at || resource.created_at
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

    return NextResponse.json({
      images,
      warning:
        diagnostics.length > 0
          ? `${diagnostics.join(" | ")}${
              runtimeInfo
                ? ` | config: ${runtimeInfo.source}:${runtimeInfo.cloudName}`
                : ""
            }`
          : undefined,
    });
  } catch (error) {
    console.error("Error cargando galería:", error);
    const details = getCloudinaryErrorDetails(error);
    // Evitamos tirar 500 para no romper la UI y poder seguir subiendo fotos.
    return NextResponse.json({
      images: [],
      error: "No se pudo cargar la galería.",
      details,
    });
  }
}
