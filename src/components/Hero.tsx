"use client";

import { motion } from "framer-motion";
import Countdown from "./Countdown";
import { cn } from "@/lib/utils";
import { Plane } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background: Brasil playas, fiesta, tropical */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,20,40,0.4) 0%, rgba(8,45,65,0.75) 40%, rgba(5,30,50,0.95) 100%),
            url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85)`,
        }}
      />
      {/* Overlay adicional para mantener legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-900/20 to-sky-950/90" />

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
          DESPEDIDA DE SOLTEROS DE BIOTTI
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-orange via-neon-pink to-miami-blue">
            LA ÚLTIMA VUELTA
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
