"use client";

import { motion } from "framer-motion";
import Countdown from "./Countdown";
import { cn } from "@/lib/utils";
import { Plane } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background: gradient + optional image/video placeholder */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(10,6,18,0.85) 50%, rgba(10,6,18,1) 100%),
            url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80)`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-sm sm:text-base tracking-[0.4em] text-miami-blue text-neon-cyan uppercase mb-4"
        >
          MISSION START IN:
        </motion.p>

        <Countdown />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-10 sm:mt-14 text-white leading-tight"
        >
          BIOTTI SE CASA.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-orange via-neon-pink to-miami-blue">
            FLORIPA NOS ESPERA.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-4 text-white/80 font-body text-sm sm:text-base"
        >
          Jueves 21 — Domingo 24 Mayo 2026 · Florianópolis, Brasil
        </motion.p>

        <motion.a
          href="#flight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className={cn(
            "inline-flex items-center gap-2 mt-10 sm:mt-12 px-6 py-4 rounded-lg font-body font-semibold",
            "bg-white/10 backdrop-blur border border-neon-pink/50 text-white",
            "hover:border-neon-pink hover:shadow-neon-pink hover:bg-white/15",
            "transition-all duration-300 hover:animate-glitch"
          )}
        >
          <Plane className="w-5 h-5 text-neon-pink" />
          VER CRONOGRAMA DE VUELOS
        </motion.a>
      </div>
    </section>
  );
}
