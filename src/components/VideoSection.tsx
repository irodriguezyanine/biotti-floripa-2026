"use client";

import { motion } from "framer-motion";
import { Palette, Music } from "lucide-react";

const VIDEO_1 = "umLkHnIMNFs";
const VIDEO_2 = "gqULJobgflM";

function VideoCard({
  videoId,
  title,
  position,
  delay,
}: {
  videoId: string;
  title: string;
  position: "top-left" | "bottom-right";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === "top-left" ? 30 : -30, x: position === "top-left" ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay ?? 0 }}
      className={`relative group ${
        position === "top-left"
          ? "lg:mr-auto lg:pl-0 lg:pr-8"
          : "lg:ml-auto lg:pr-0 lg:pl-8"
      }`}
    >
      {/* Marco decorativo Brasil / fiesta */}
      <div className="absolute -inset-2 bg-gradient-to-br from-[#009c3b]/20 via-[#ffdf00]/10 to-[#002776]/20 rounded-3xl -z-10 blur-sm group-hover:blur-0 transition-all duration-500" />
      <div className="relative rounded-2xl overflow-hidden border-2 border-fuchsia-500/30 bg-black/60 backdrop-blur-sm p-2 sm:p-3 shadow-2xl shadow-fuchsia-500/10">
        {/* Esquinas decorativas */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-[#009c3b] rounded-tl-2xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-[#ffdf00] rounded-br-2xl opacity-60" />
        <div className="absolute top-0 right-0 text-3xl opacity-40">🇧🇷</div>
        <div className="absolute bottom-0 left-0 text-3xl opacity-40">🍹</div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="mt-3 font-display text-sm sm:text-base text-white/90 text-center">
          {title}
        </p>
      </div>
    </motion.div>
  );
}

export default function VideoSection() {
  return (
    <section id="videos" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo fiesta Brasil */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: `url(/party-brasil.png)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/85 via-fuchsia-950/90 to-sky-950/95" />

      {/* Decoraciones laterales - palmeras, cócteles */}
      <div className="absolute left-0 top-1/4 text-6xl sm:text-8xl opacity-15 pointer-events-none select-none hidden md:block">
        🌴
      </div>
      <div className="absolute right-0 top-1/3 text-5xl sm:text-7xl opacity-15 pointer-events-none select-none hidden md:block">
        🎉
      </div>
      <div className="absolute left-1/4 bottom-1/4 text-5xl sm:text-6xl opacity-10 pointer-events-none select-none hidden lg:block">
        🍹
      </div>
      <div className="absolute right-1/4 bottom-1/3 text-6xl sm:text-7xl opacity-15 pointer-events-none select-none hidden md:block">
        🎵
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          VIDEOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-amber-400">ÉPICOS</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 font-body text-sm sm:text-base mb-16"
        >
          Lo mejor de Brasil · Playas, fiesta y recuerdos
        </motion.p>

        {/* Layout: Video 1 arriba izquierda | Video 2 abajo derecha */}
        <div className="space-y-16 lg:space-y-24">
          {/* Fila 1: Video 1 (izq) + decoración Brasil (der) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <VideoCard
                videoId={VIDEO_1}
                title="La aventura comienza"
                position="top-left"
                delay={0}
              />
            </div>
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center min-h-[280px]">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 text-fuchsia-300/60"
              >
                <Palette className="w-20 h-20" />
                <span className="font-body text-xs uppercase tracking-[0.3em]">Brasil vibes</span>
              </motion.div>
            </div>
          </div>

          {/* Fila 2: decoración fiesta (izq) + Video 2 (der) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center min-h-[280px] order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-4 text-amber-300/60"
              >
                <Music className="w-20 h-20" />
                <span className="font-body text-xs uppercase tracking-[0.3em]">Fiesta total</span>
              </motion.div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 lg:flex lg:justify-end">
              <VideoCard
                videoId={VIDEO_2}
                title="La fiesta no para"
                position="bottom-right"
                delay={0.15}
              />
            </div>
          </div>
        </div>

        {/* Decoración mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex lg:hidden justify-center mt-12 gap-6 text-4xl opacity-40"
        >
          <span>🇧🇷</span>
          <span>🎵</span>
          <span>🍹</span>
        </motion.div>
      </div>
    </section>
  );
}
