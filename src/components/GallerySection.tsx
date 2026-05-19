"use client";

import { FormEvent, MouseEvent, TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  FileImage,
  Files,
  HardDrive,
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
const MAX_UPLOAD_TARGET_BYTES = 3.8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2200;
const MAX_FILES_PER_BATCH = 50;

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
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [ownershipMap, setOwnershipMap] = useState<Record<string, string>>({});
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselDragStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    startScrollLeft: number;
    hasMoved: boolean;
  }>({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });
  const viewerTouchStartXRef = useRef<number | null>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const canSubmit = useMemo(() => {
    return !uploading && selectedFiles.length > 0 && uploaderName.trim().length > 0;
  }, [selectedFiles, uploaderName, uploading]);

  const selectedCount = selectedFiles.length;
  const selectedSizeMb = useMemo(() => {
    const totalBytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    return totalBytes / (1024 * 1024);
  }, [selectedFiles]);

  const imagesWithOwnership = useMemo(
    () =>
      images.map((image) => ({
        ...image,
        isOwned: Boolean(ownershipMap[image.id]),
      })),
    [images, ownershipMap]
  );
  const carouselItems = useMemo(() => {
    if (imagesWithOwnership.length > 1) {
      return [...imagesWithOwnership, ...imagesWithOwnership];
    }
    return imagesWithOwnership;
  }, [imagesWithOwnership]);
  const currentViewerImage =
    viewerIndex !== null && viewerIndex >= 0 && viewerIndex < imagesWithOwnership.length
      ? imagesWithOwnership[viewerIndex]
      : null;

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
        if (merged.length >= MAX_FILES_PER_BATCH) break;
      }
      return merged.slice(0, MAX_FILES_PER_BATCH);
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

  function onCarouselMouseDown(event: MouseEvent<HTMLDivElement>) {
    const container = carouselRef.current;
    if (!container) return;
    carouselDragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      hasMoved: false,
    };
    setIsCarouselPaused(true);
  }

  function onCarouselMouseMove(event: MouseEvent<HTMLDivElement>) {
    const container = carouselRef.current;
    if (!container || !carouselDragStateRef.current.isDragging) return;
    event.preventDefault();
    const deltaX = event.clientX - carouselDragStateRef.current.startX;
    if (Math.abs(deltaX) > 6) {
      carouselDragStateRef.current.hasMoved = true;
    }
    container.scrollLeft = carouselDragStateRef.current.startScrollLeft - deltaX;
  }

  function stopCarouselMouseDrag() {
    if (!carouselDragStateRef.current.isDragging) return;
    carouselDragStateRef.current.isDragging = false;
    setIsCarouselPaused(false);
  }

  function onOpenViewer(imageId: string) {
    const idx = imagesWithOwnership.findIndex((item) => item.id === imageId);
    if (idx >= 0) setViewerIndex(idx);
  }

  function onCloseViewer() {
    setViewerIndex(null);
  }

  function onNextViewerImage() {
    if (!imagesWithOwnership.length || viewerIndex === null) return;
    setViewerIndex((viewerIndex + 1) % imagesWithOwnership.length);
  }

  function onPreviousViewerImage() {
    if (!imagesWithOwnership.length || viewerIndex === null) return;
    setViewerIndex((viewerIndex - 1 + imagesWithOwnership.length) % imagesWithOwnership.length);
  }

  function onViewerTouchStart(event: TouchEvent<HTMLDivElement>) {
    viewerTouchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function onViewerTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (viewerTouchStartXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? viewerTouchStartXRef.current;
    const deltaX = endX - viewerTouchStartXRef.current;
    viewerTouchStartXRef.current = null;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) onNextViewerImage();
    else onPreviousViewerImage();
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

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || imagesWithOwnership.length <= 1) return;

    let animationId = 0;
    const speed = 0.35;

    const animate = () => {
      if (!isCarouselPaused) {
        container.scrollLeft += speed;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationId);
  }, [imagesWithOwnership.length, isCarouselPaused]);

  useEffect(() => {
    if (viewerIndex === null) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseViewer();
      if (event.key === "ArrowRight") onNextViewerImage();
      if (event.key === "ArrowLeft") onPreviousViewerImage();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [viewerIndex, imagesWithOwnership.length]);

  async function optimizeImageForUpload(file: File) {
    if (file.size <= MAX_UPLOAD_TARGET_BYTES) return file;

    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`No se pudo leer la imagen: ${file.name}`));
        image.src = objectUrl;
      });

      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        return file;
      }
      context.drawImage(img, 0, 0, width, height);

      const fileBaseName = file.name.replace(/\.[^/.]+$/, "");

      for (const quality of [0.86, 0.78, 0.7, 0.62, 0.55]) {
        const compressedBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality)
        );
        if (!compressedBlob) continue;
        if (compressedBlob.size <= MAX_UPLOAD_TARGET_BYTES || quality === 0.55) {
          return new File([compressedBlob], `${fileBaseName}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
      }

      return file;
    } catch {
      return file;
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const uploadedImages: GalleryImage[] = [];
      const ownershipTokens: OwnershipToken[] = [];
      const failedFiles: string[] = [];

      for (const originalFile of selectedFiles) {
        const file = await optimizeImageForUpload(originalFile);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploaderName", uploaderName.trim());
        formData.append("message", message.trim());

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          const details =
            [data?.error, data?.details].filter(Boolean).join(" · ") ||
            "No se pudo subir la imagen.";
          failedFiles.push(`${originalFile.name}: ${details}`);
          continue;
        }

        const currentUploadedImages = Array.isArray(data?.images)
          ? (data.images as GalleryImage[])
          : [];
        const currentOwnershipTokens = Array.isArray(data?.ownershipTokens)
          ? (data.ownershipTokens as OwnershipToken[])
          : [];

        uploadedImages.push(...currentUploadedImages);
        ownershipTokens.push(...currentOwnershipTokens);
      }

      if (uploadedImages.length === 0 && failedFiles.length > 0) {
        throw new Error(failedFiles.join(" | "));
      }

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
        if (failedFiles.length > 0) {
          setSuccessMessage(
            `${uploadedImages.length} foto(s) subida(s). ${failedFiles.length} fallaron.`
          );
          setError(failedFiles.join(" | "));
        } else {
          setSuccessMessage(
            uploadedImages.length === 1
              ? "Foto subida con éxito."
              : `${uploadedImages.length} fotos subidas con éxito.`
          );
        }
      }

      clearSelectedFiles();
      setIsUploaderOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function onDeleteImage(imageId: string) {
    const deleteToken = ownershipMap[imageId];
    if (!deleteToken || deletingId) return;
    setConfirmModal({
      message: "¿Seguro que quieres eliminar esta foto?",
      onConfirm: () => {
        setConfirmModal(null);
        void executeDeleteImage(imageId);
      },
    });
  }

  async function executeDeleteImage(imageId: string) {
    const deleteToken = ownershipMap[imageId];
    if (!deleteToken) return;
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex justify-center"
        >
          <button
            type="button"
            onClick={() => setIsUploaderOpen(true)}
            className="group relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-miami-blue/60 bg-miami-blue/15 text-miami-blue shadow-[0_0_24px_rgba(0,255,255,0.25)] transition-all hover:scale-105 hover:bg-miami-blue/25"
            aria-label="Abrir modal para subir fotos"
            title="Subir fotos"
          >
            <Camera className="h-7 w-7 transition-transform group-hover:scale-110" />
          </button>
        </motion.div>

        <AnimatePresence>
          {isUploaderOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-md px-4 py-4 sm:py-6"
              onClick={() => setIsUploaderOpen(false)}
            >
              <motion.form
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ type: "spring", damping: 24, stiffness: 260 }}
                onSubmit={onSubmit}
                onClick={(event) => event.stopPropagation()}
                className="relative my-3 w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-card rounded-3xl border border-white/25 p-5 sm:p-7"
              >
                <button
                  type="button"
                  onClick={() => setIsUploaderOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white/90 transition-colors hover:bg-black/55"
                  aria-label="Cerrar modal de subida"
                  title="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7">
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

                      <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-miami-blue/15 border border-miami-blue/50 flex items-center justify-center">
                          <ImagePlus className="w-7 h-7 text-miami-blue" />
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono text-white/85">
                            <FileImage className="w-3.5 h-3.5 text-miami-blue" />
                            IMG
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono text-white/85">
                            <Files className="w-3.5 h-3.5 text-miami-blue" />
                            {selectedCount}/{MAX_FILES_PER_BATCH}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono text-white/85">
                            <HardDrive className="w-3.5 h-3.5 text-miami-blue" />
                            {selectedSizeMb.toFixed(1)}MB
                          </span>
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
                                title={`Quitar ${preview.name}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={clearSelectedFiles}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/75 transition-colors hover:bg-white/20 hover:text-white"
                          aria-label="Limpiar selección"
                          title="Limpiar selección"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <label className="relative block">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-miami-blue/85" />
                      <input
                        type="text"
                        value={uploaderName}
                        required
                        maxLength={60}
                        onChange={(event) => setUploaderName(event.target.value)}
                        placeholder="Nombre"
                        className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-miami-blue/60"
                      />
                    </label>

                    <label className="relative block">
                      <MessageSquare className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-neon-pink/85" />
                      <textarea
                        value={message}
                        maxLength={140}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Mensaje"
                        rows={4}
                        className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-miami-blue/60 resize-none"
                      />
                    </label>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={cn(
                          "inline-flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-xl px-4 transition-colors",
                          canSubmit
                            ? "bg-miami-blue/25 border border-miami-blue/60 text-miami-blue hover:bg-miami-blue/35"
                            : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                        )}
                        aria-label={uploading ? "Subiendo fotos" : "Subir fotos"}
                        title={uploading ? "Subiendo fotos" : "Subir fotos"}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="font-body text-sm">Subiendo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span className="font-body text-sm">Subir fotos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

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
              onMouseDown={onCarouselMouseDown}
              onMouseMove={onCarouselMouseMove}
              onMouseUp={stopCarouselMouseDrag}
              onMouseLeave={stopCarouselMouseDrag}
              onTouchStart={() => setIsCarouselPaused(true)}
              onTouchEnd={() => setIsCarouselPaused(false)}
              onTouchCancel={() => setIsCarouselPaused(false)}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {carouselItems.map((image, idx) => (
                <motion.article
                  key={`${image.id}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/15 shrink-0 snap-start w-[82vw] sm:w-[52vw] lg:w-[32vw] xl:w-[28vw]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (carouselDragStateRef.current.hasMoved) return;
                      onOpenViewer(image.id);
                    }}
                    className="aspect-[4/3] w-full bg-black/30 text-left"
                    aria-label={`Ver foto en pantalla completa de ${image.uploadedBy}`}
                  >
                    <img
                      src={image.url}
                      alt={`Foto subida por ${image.uploadedBy}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
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

      </div>

      <AnimatePresence>
        {currentViewerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1150] bg-black/90 backdrop-blur-sm px-4 py-6 flex items-center justify-center"
            onClick={onCloseViewer}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={onViewerTouchStart}
              onTouchEnd={onViewerTouchEnd}
              className="relative w-full max-w-5xl"
            >
              <button
                type="button"
                onClick={onCloseViewer}
                className="absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/90 hover:bg-black/65 transition-colors"
                aria-label="Cerrar visor de galería"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={currentViewerImage.url}
                alt={`Foto subida por ${currentViewerImage.uploadedBy}`}
                className="w-full max-h-[76vh] object-contain rounded-2xl border border-white/15 bg-black/40"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onPreviousViewerImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white/90 font-body hover:bg-white/15 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <div className="text-center">
                  <p className="text-white font-body font-semibold">
                    {currentViewerImage.uploadedBy}
                  </p>
                  <p className="text-xs text-white/60 font-mono">
                    {viewerIndex !== null ? `${viewerIndex + 1} / ${imagesWithOwnership.length}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNextViewerImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white/90 font-body hover:bg-white/15 transition-colors"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/25 bg-sky-950/95 backdrop-blur-xl p-6"
            >
              <p className="text-white font-body text-base sm:text-lg leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="rounded-xl border border-rose-300/55 bg-rose-500/15 px-4 py-2 text-rose-100 font-body font-semibold hover:bg-rose-500/25 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
