"use client";

import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Home, MapPin } from "lucide-react";

const LOCATION_QUERY =
  "Av. dos Búzios, Jurerê, Florianópolis, Santa Catarina, Brasil";

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  LOCATION_QUERY
)}&output=embed`;

const HOUSE_PHOTOS = [
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830609/biotti-floripa-2026/gallery/hksjisiur0ab0fb3ffeo.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830611/biotti-floripa-2026/gallery/kyy0p2fwjpw5maextliu.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830612/biotti-floripa-2026/gallery/ivslomk4qe0vv1ilvmy8.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830614/biotti-floripa-2026/gallery/jzkhjauozpnh1jesbnsq.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830615/biotti-floripa-2026/gallery/p78ghavqfbru6f8hxkw8.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830616/biotti-floripa-2026/gallery/bidq7abdhzg1af3hdnlt.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830618/biotti-floripa-2026/gallery/bcvoex3xl3v9mih4aurn.jpg",
  "https://res.cloudinary.com/dindgpi3d/image/upload/v1776830619/biotti-floripa-2026/gallery/y4qtwnyvk4n380g3pweq.jpg",
];

export default function LocationSection() {
  const houseCarouselRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  function scrollHousePhotos(direction: "left" | "right") {
    const container = houseCarouselRef.current;
    if (!container) return;
    const shift = Math.max(container.clientWidth * 0.78, 260);
    container.scrollBy({
      left: direction === "right" ? shift : -shift,
      behavior: "smooth",
    });
  }

  function handleCarouselKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollHousePhotos("right");
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollHousePhotos("left");
      return;
    }
    if (event.key === " ") {
      event.preventDefault();
      scrollHousePhotos(event.shiftKey ? "left" : "right");
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const container = houseCarouselRef.current;
    if (!container) return;
    dragStateRef.current.isDragging = true;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.scrollLeft = container.scrollLeft;
    container.setPointerCapture(event.pointerId);
    container.classList.add("cursor-grabbing");
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const container = houseCarouselRef.current;
    if (!container || !dragStateRef.current.isDragging) return;
    const delta = event.clientX - dragStateRef.current.startX;
    container.scrollLeft = dragStateRef.current.scrollLeft - delta;
  }

  function endPointerDrag(event: PointerEvent<HTMLDivElement>) {
    const container = houseCarouselRef.current;
    if (!container || !dragStateRef.current.isDragging) return;
    dragStateRef.current.isDragging = false;
    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
    container.classList.remove("cursor-grabbing");
  }

  return (
    <section id="location" className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url(/party-brasil.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-violet-950/90 to-sky-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          UBICACIÓN <span className="text-neon-pink">DEL CUARTEL</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 font-body text-sm sm:text-base mb-10"
        >
          Florianópolis, Santa Catarina, Brasil
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl border border-white/20 p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 text-white/85 font-body">
              <MapPin className="w-4 h-4 text-miami-blue" />
              {LOCATION_QUERY}
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                LOCATION_QUERY
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-miami-blue/45 bg-miami-blue/15 px-3 py-2 text-sm text-miami-blue hover:bg-miami-blue/25 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en Google Maps
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/15 bg-black/30">
            <iframe
              title="Ubicación Florianópolis"
              src={MAP_EMBED_URL}
              className="w-full h-[300px] sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl border border-white/20 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4 mb-4 text-white">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-neon-pink" />
              <h3 className="font-display text-2xl">Fotos de la Casa</h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-white/65">
              Desliza, arrastra o usa espacio/flechas
            </p>
          </div>

          <div className="relative group">
            <button
              type="button"
              onClick={() => scrollHousePhotos("left")}
              className="absolute left-0 top-0 z-10 h-full w-12 sm:w-16 bg-gradient-to-r from-black/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Ver fotos anteriores"
            >
              <ChevronLeft className="mx-2 sm:mx-4 w-5 h-5 text-white/80" />
            </button>
            <button
              type="button"
              onClick={() => scrollHousePhotos("right")}
              className="absolute right-0 top-0 z-10 h-full w-12 sm:w-16 bg-gradient-to-l from-black/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Ver fotos siguientes"
            >
              <ChevronRight className="ml-auto mr-2 sm:mr-4 w-5 h-5 text-white/80" />
            </button>

            <div
              ref={houseCarouselRef}
              tabIndex={0}
              onKeyDown={handleCarouselKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endPointerDrag}
              onPointerCancel={endPointerDrag}
              onPointerLeave={endPointerDrag}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab no-scrollbar touch-pan-x"
              aria-label="Carrusel de fotos de la casa"
            >
              {HOUSE_PHOTOS.map((url, index) => (
                <div
                  key={url}
                  className="rounded-xl overflow-hidden border border-white/15 bg-black/25 shrink-0 snap-start w-[92vw] sm:w-[72vw] lg:w-[52vw] xl:w-[44vw]"
                >
                  <img
                    src={url}
                    alt={`Casa en Florianópolis ${index + 1}`}
                    className="w-full h-64 sm:h-80 object-cover select-none"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
