"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, MessageSquare, Upload, User } from "lucide-react";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return !uploading && !!selectedFile && uploaderName.trim().length > 0;
  }, [selectedFile, uploaderName, uploading]);

  async function loadGallery() {
    setError("");
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo cargar la galería.");
      }
      setImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGallery();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || !selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("uploaderName", uploaderName.trim());
      formData.append("message", message.trim());

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo subir la imagen.");
      }

      if (data?.image) {
        setImages((previous) => [data.image as GalleryImage, ...previous]);
      }

      setSelectedFile(null);
      setUploaderName("");
      setMessage("");
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setUploading(false);
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
          Sube tu foto con nombre y mensaje opcional. Se mostrará con la fecha de subida.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          className="glass-card rounded-2xl border border-white/20 p-5 sm:p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="block">
            <span className="font-body text-xs uppercase tracking-wider text-white/70">
              Foto
            </span>
            <input
              id="gallery-file-input"
              type="file"
              accept="image/*"
              required
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setSelectedFile(nextFile);
              }}
              className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-miami-blue/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-miami-blue hover:file:bg-miami-blue/30"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs uppercase tracking-wider text-white/70">
              Nombre (obligatorio)
            </span>
            <input
              type="text"
              value={uploaderName}
              required
              maxLength={60}
              onChange={(event) => setUploaderName(event.target.value)}
              placeholder="Ej: Nacho"
              className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-miami-blue/50"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="font-body text-xs uppercase tracking-wider text-white/70">
              Mensaje (opcional)
            </span>
            <textarea
              value={message}
              maxLength={140}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ej: Primera noche en Floripa 🍻"
              rows={3}
              className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-miami-blue/50 resize-none"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-body text-sm transition-colors",
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
                  Subir foto
                </>
              )}
            </button>
            <p className="text-white/55 text-xs font-body">
              Máximo 10MB por imagen.
            </p>
          </div>
        </motion.form>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-200 text-sm font-body">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center text-white/70 font-body flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando galería...
          </div>
        ) : images.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-white/70 font-body">
            Aún no hay fotos subidas. Sé el primero en compartir una.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((image) => (
              <motion.article
                key={image.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden border border-white/15"
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
                  <p className="inline-flex items-center gap-2 text-white font-body font-semibold">
                    <User className="w-4 h-4 text-miami-blue" />
                    {image.uploadedBy}
                  </p>
                  <p className="text-xs text-white/60 font-mono">{formatDate(image.uploadedAt)}</p>
                  {image.message ? (
                    <p className="text-sm text-white/85 font-body inline-flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-neon-pink shrink-0" />
                      <span>{image.message}</span>
                    </p>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-white/45 text-xs font-body">
          <Camera className="w-4 h-4" />
          Las imágenes se almacenan en Cloudinary.
        </div>
      </div>
    </section>
  );
}
