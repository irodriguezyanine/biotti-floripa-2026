import { NextResponse } from "next/server";
import { getCloudinary, getGalleryFolder } from "@/lib/cloudinary";

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
  try {
    const cloudinary = getCloudinary();
    const folder = getGalleryFolder();

    const searchResult = await cloudinary.search
      .expression(`folder="${folder}" AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .with_field("context")
      .execute();

    const images = ((searchResult.resources ?? []) as CloudinarySearchResult[]).map(
      (resource) => ({
        id: resource.public_id,
        url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        uploadedBy: resource.context?.custom?.uploader || "Anónimo",
        message: resource.context?.custom?.message || "",
        uploadedAt: toIsoDate(
          resource.context?.custom?.uploaded_at || resource.created_at
        ),
      })
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error cargando galería:", error);
    return NextResponse.json(
      { error: "No se pudo cargar la galería." },
      { status: 500 }
    );
  }
}
