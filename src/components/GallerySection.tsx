"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  MessageSquare,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  uploadedBy: string;
  message?: string;
  uploadedAt: string;
};

type OwnershipToken = {
  id: string;
  deleteToken: string;
};

type SelectedPreview = {
  key: string;
  name: string;
  size: number;
  url: string;
};

const OWNERSHIP_STORAGE_KEY = "biotti-gallery-ownership-v1";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function readOwnershipMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OWNERSHIP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOwnershipMap(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNERSHIP_STORAGE_KEY, JSON.stringify(map));
}

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<SelectedPreview[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [ownershipMap, setOwnershipMap] = useState<Record<string, string>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => {
    return !uploading && selectedFiles.length > 0 && uploaderName.trim().length > 0;
  }, [selectedFiles, uploaderName, uploading]);

  const selectedCountLabel = useMemo(() => {
    if (selectedFiles.length === 0) return "Ninguna imagen seleccionada";
    if (selectedFiles.length === 1) return "1 imagen seleccionada";
    return `${selectedFiles.length} imágenes seleccionadas`;
  }, [selectedFiles]);

  const selectedSizeLabel = useMemo(() => {
    const totalBytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalMb = totalBytes / (1024 * 1024);
    return `${totalMb.toFixed(1)} MB en total`;
  }, [selectedFiles]);

  const imagesWithOwnership = useMemo(
    () =>
      images.map((image) => ({
        ...image,
        isOwned: Boolean(ownershipMap[image.id]),
      })),
    [images, ownershipMap]
  );

  function onSelectFiles(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedFiles((previous) => {
      const merged = [...previous];
      for (const file of incoming) {
        const exists = merged.some(
          (item) => item.name === file.name && item.size === file.size
        );
        if (!exists) merged.push(file);
        if (merged.length >= 10) break;
      }
      return merged.slice(0, 10);
    });
  }

  function removeSelectedFile(targetFile: File) {
    setSelectedFiles((previous) =>
      previous.filter(
        (file) => !(file.name === targetFile.name && file.size === targetFile.size)
      )
    );
  }

  function clearSelectedFiles() {
    setSelectedFiles([]);
    const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  }

  function scrollCarousel(direction: "left" | "right") {
    const container = carouselRef.current;
    if (!container) return;
    const shift = Math.max(container.clientWidth * 0.8, 320);
    container.scrollBy({
      left: direction === "right" ? shift : -shift,
      behavior: "smooth",
    });
  }

  async function loadGallery() {
    setSuccessMessage("");
    setError("");
    setWarning("");
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = await response.json();
      if (typeof data?.warning === "string" && data.warning.trim().length > 0) {
        setWarning(data.warning);
      }
      if (!response.ok) {
        throw new Error(
          [data?.error, data?.details].filter(Boolean).join(" · ") ||
            "No se pudo cargar la galería."
        );
      }
      setImages(Array.isArray(data.images) ? (data.images as GalleryImage[]) : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setOwnershipMap(readOwnershipMap());
    void loadGallery();
  }, []);

  useEffect(() => {
    const previews = selectedFiles.map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setSelectedPreviews(previews);
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("uploaderName", uploaderName.trim());
      formData.append("message", message.trim());

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          [data?.error, data?.details].filter(Boolean).join(" · ") ||
            "No se pudo subir la imagen."
        );
      }

      const uploadedImages = Array.isArray(data?.images)
        ? (data.images as GalleryImage[])
        : [];
      const ownershipTokens = Array.isArray(data?.ownershipTokens)
        ? (data.ownershipTokens as OwnershipToken[])
        : [];
      if (ownershipTokens.length > 0) {
        setOwnershipMap((previous) => {
          const next = { ...previous };
          ownershipTokens.forEach((item) => {
            if (item?.id && item?.deleteToken) next[item.id] = item.deleteToken;
          });
          writeOwnershipMap(next);
          return next;
        });
      }

      if (uploadedImages.length > 0) {
        setImages((previous) => [...uploadedImages, ...previous]);
        setSuccessMessage(
          uploadedImages.length === 1
            ? "Foto subida con éxito."
            : `${uploadedImages.length} fotos subidas con éxito.`
        );
      }

      clearSelectedFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function onDeleteImage(imageId: string) {
    const deleteToken = ownershipMap[imageId];
    if (!deleteToken || deletingId) return;
    const confirmed = window.confirm("¿Seguro que quieres eliminar esta foto?");
    if (!confirmed) return;

    setDeletingId(imageId);
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, deleteToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          [data?.error, data?.details].filter(Boolean).join(" · ") ||
            "No se pudo eliminar la foto."
        );
      }

      setImages((previous) => previous.filter((image) => image.id !== imageId));
      setOwnershipMap((previous) => {
        const next = { ...previous };
        delete next[imageId];
        writeOwnershipMap(next);
        return next;
      });
      setSuccessMessage("Foto eliminada con éxito.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section id="gallery" className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url(/party-brasil.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-fuchsia-950/88 to-sky-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          GALERÍA <span className="text-miami-blue">COLABORATIVA</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 font-body text-sm sm:text-base mb-10"
        >
          Sube varias fotos a la vez con tu nombre y mensaje opcional.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          className="glass-card rounded-3xl border border-white/20 p-5 sm:p-7 mb-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-white/65 mb-2">
                Fotos
              </p>
              <label
                htmlFor="gallery-file-input"
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  onSelectFiles(event.dataTransfer.files);
                }}
                className={cn(
                  "block rounded-2xl border border-dashed p-6 transition-colors cursor-pointer",
                  isDragging
                    ? "border-miami-blue/80 bg-miami-blue/15"
                    : "border-white/25 bg-white/5 hover:bg-white/10"
                )}
              >
                <input
                  id="gallery-file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={(event) => onSelectFiles(event.target.files)}
                  className="hidden"
                />
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-miami-blue/15 border border-miami-blue/50 flex items-center justify-center shrink-0">
                    <ImagePlus className="w-5 h-5 text-miami-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-white">
                      Arrastra imágenes aquí o haz clic para seleccionarlas
                    </p>
                    <p className="font-body text-sm text-white/60 mt-1">
                      JPG, PNG, WEBP · hasta 10 archivos · 10MB por imagen
                    </p>
                    <p className="font-mono text-xs text-miami-blue mt-2">
                      {selectedCountLabel} · {selectedSizeLabel}
                    </p>
                  </div>
                </div>
              </label>
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {selectedPreviews.map((preview, index) => (
                      <div
                        key={preview.key}
                        className="relative rounded-xl overflow-hidden border border-white/20 bg-black/20"
                      >
                        <img
                          src={preview.url}
                          alt={`Preview ${preview.name}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const target = selectedFiles[index];
                            if (target) removeSelectedFile(target);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 border border-white/20 text-white/90 flex items-center justify-center hover:bg-black"
                          aria-label={`Quitar ${preview.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    className="text-xs text-white/60 hover:text-white/85 transition-colors font-body"
                  >
                    Limpiar selección
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <label className="block">
                <span className="font-body text-xs uppercase tracking-[0.18em] text-white/65">
                  Nombre
                </span>
                <input
                  type="text"
                  value={uploaderName}
                  required
                  maxLength={60}
                  onChange={(event) => setUploaderName(event.target.value)}
                  placeholder="Ej: Nacho"
                  className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-miami-blue/60"
                />
              </label>

              <label className="block">
                <span className="font-body text-xs uppercase tracking-[0.18em] text-white/65">
                  Mensaje (opcional)
                </span>
                <textarea
                  value={message}
                  maxLength={140}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ej: Primera noche en Floripa"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-miami-blue/60 resize-none"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm transition-colors",
                canSubmit
                  ? "bg-miami-blue/25 border border-miami-blue/60 text-miami-blue hover:bg-miami-blue/35"
                  : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Subir fotos
                </>
              )}
            </button>
            <p className="text-white/55 text-xs font-body">
              Máximo 10 fotos por envío.
            </p>
          </div>
        </motion.form>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-200 text-sm font-body">
            {error}
          </div>
        )}
        {warning && (
          <div className="mb-6 rounded-lg border border-amber-400/35 bg-amber-500/10 px-4 py-3 text-amber-200 text-xs font-mono break-words">
            {warning}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-200 text-sm font-body">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center text-white/70 font-body flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando galería...
          </div>
        ) : imagesWithOwnership.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-white/70 font-body">
            Aún no hay fotos subidas. Sé el primero en compartir una.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/70 font-body text-sm">
                Últimas subidas · desliza horizontalmente
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  className="w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Desplazar carrusel a la izquierda"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Desplazar carrusel a la derecha"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
            >
              {imagesWithOwnership.map((image) => (
                <motion.article
                  key={image.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/15 shrink-0 snap-start w-[82vw] sm:w-[52vw] lg:w-[32vw] xl:w-[28vw]"
                >
                  <div className="aspect-[4/3] bg-black/30">
                    <img
                      src={image.url}
                      alt={`Foto subida por ${image.uploadedBy}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="inline-flex items-center gap-2 text-white font-body font-semibold min-w-0">
                        <User className="w-4 h-4 text-miami-blue shrink-0" />
                        <span className="truncate">{image.uploadedBy}</span>
                      </p>
                      {image.isOwned && (
                        <button
                          type="button"
                          onClick={() => onDeleteImage(image.id)}
                          disabled={deletingId === image.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-500/20 disabled:opacity-60"
                        >
                          {deletingId === image.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Eliminar
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-white/60 font-mono">
                      {formatDate(image.uploadedAt)}
                    </p>
                    {image.message ? (
                      <p className="text-sm text-white/85 font-body inline-flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-0.5 text-neon-pink shrink-0" />
                        <span>{image.message}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-white/40 font-body">Sin mensaje</p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-white/45 text-xs font-body">
          <Camera className="w-4 h-4" />
          Las imágenes se almacenan en Cloudinary.
        </div>
      </div>
    </section>
  );
}
