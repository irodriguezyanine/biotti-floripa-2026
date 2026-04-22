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

      if (resources.length > 0 || localDiagnostics.length === 0) {
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

        return NextResponse.json({
          images,
          warning:
            localDiagnostics.length > 0
              ? `${localDiagnostics.join(" | ")} | config: ${candidate.source}:${candidate.cloudName}`
              : undefined,
        });
      }

      diagnostics.push(
        `${candidate.source}:${candidate.cloudName} => ${localDiagnostics.join(" | ")}`
      );
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
