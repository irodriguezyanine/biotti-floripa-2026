import { NextResponse } from "next/server";
import {
  applyCloudinaryConfigCandidate,
  getCloudinaryConfigCandidates,
  getCloudinary,
  getCloudinaryErrorDetails,
  getGalleryFolder,
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

function isCrewProfileAsset(resource: CloudinarySearchResult) {
  const message = (resource.context?.custom?.message || "").toLowerCase();
  const explicitProfileFlag =
    (resource.context?.custom?.asset_type || "").toLowerCase() === "profile";
  return (
    explicitProfileFlag ||
    message.includes("foto perfil") ||
    message.includes("[perfil]") ||
    message.includes("[casa]")
  );
}

export async function GET() {
  const diagnostics: string[] = [];
  try {
    const cloudinary = getCloudinary();
    const folder = getGalleryFolder();
    const candidates = getCloudinaryConfigCandidates();
    const mergedById = new Map<
      string,
      {
        id: string;
        url: string;
        width: number;
        height: number;
        uploadedBy: string;
        message: string;
        uploadedAt: string;
      }
    >();
    let hadSuccessfulCandidate = false;
    let successfulCandidateCount = 0;
    let mergedWarning: string | undefined;
    const mergedImagesFromCandidates: Array<{
      id: string;
      url: string;
      width: number;
      height: number;
      uploadedBy: string;
      message: string;
      uploadedAt: string;
    }>[] = [];

    for (const candidate of candidates) {
      applyCloudinaryConfigCandidate(candidate);
      let resources: CloudinarySearchResult[] = [];
      const localDiagnostics: string[] = [];

      try {
        const resourcesResult = await cloudinary.api.resources({
          type: "upload",
          prefix: `${folder}/`,
          max_results: 100,
          context: true,
        });
        resources = (resourcesResult.resources ?? []) as CloudinarySearchResult[];
      } catch (apiError) {
        localDiagnostics.push(`api.resources: ${getCloudinaryErrorDetails(apiError)}`);
      }

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
          localDiagnostics.push(`search: ${getCloudinaryErrorDetails(searchError)}`);
        }
      }

      const images = resources
        .filter((resource) => !isCrewProfileAsset(resource))
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

      if (localDiagnostics.length === 0) {
        hadSuccessfulCandidate = true;
        successfulCandidateCount += 1;
      }

      if (images.length > 0) {
        mergedImagesFromCandidates.push(images);
      }

      if (localDiagnostics.length > 0) {
        diagnostics.push(
          `${candidate.source}:${candidate.cloudName} => ${localDiagnostics.join(" | ")}`
        );
      }
    }

    for (const imageList of mergedImagesFromCandidates) {
      for (const image of imageList) {
        const current = mergedById.get(image.id);
        if (!current) {
          mergedById.set(image.id, image);
          continue;
        }
        const currentTs = new Date(current.uploadedAt).getTime();
        const incomingTs = new Date(image.uploadedAt).getTime();
        if (incomingTs > currentTs) {
          mergedById.set(image.id, image);
        }
      }
    }

    const mergedImages = Array.from(mergedById.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    if (successfulCandidateCount > 1) {
      mergedWarning =
        "Se detectaron múltiples configuraciones de Cloudinary activas. Se unificaron resultados para evitar pérdida visual al refrescar.";
    }
    if (!mergedWarning && diagnostics.length > 0 && hadSuccessfulCandidate) {
      mergedWarning = diagnostics.join(" || ");
    }

    if (mergedImages.length > 0) {
      return NextResponse.json({
        images: mergedImages,
        warning: mergedWarning,
      });
    }

    return NextResponse.json({
      images: [],
      error: "No se pudo cargar la galería.",
      details: diagnostics.join(" || "),
      warning: diagnostics.join(" || "),
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
