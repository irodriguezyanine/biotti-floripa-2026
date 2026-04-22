"use client";

import { motion } from "framer-motion";
import Countdown from "./Countdown";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Camera,
  Film,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";

const QUICK_SECTION_LINKS = [
  { href: "#crew", label: "Ir a equipo", icon: Users },
  { href: "#flight", label: "Ir a cronograma de vuelos", icon: Plane },
  { href: "#itinerary", label: "Ir a itinerario", icon: CalendarDays },
  { href: "#location", label: "Ir a ubicación", icon: MapPin },
  { href: "#videos", label: "Ir a videos", icon: Film },
  { href: "#gallery", label: "Ir a galería", icon: Camera },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Fondo fiesta Brasil: terraza Río, atardecer, cócteles, mujeres */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(120,40,80,0.25) 0%, rgba(60,20,50,0.5) 40%, rgba(30,10,35,0.9) 100%),
            url(/party-brasil.png)`,
        }}
      />
      {/* Overlay atardecer cálido - tonos naranja/rosa/púrpura */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-900/15 to-violet-950/85" />

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-10 sm:mt-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/35 border border-white/20 backdrop-blur-md">
            <span className="w-9 h-9 rounded-xl bg-miami-blue/15 border border-miami-blue/40 text-miami-blue inline-flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_SECTION_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.href} className="relative group/shortcut">
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        "relative w-10 h-10 rounded-xl inline-flex items-center justify-center overflow-hidden",
                        "bg-white/10 border border-white/20 text-white/90",
                        "hover:-translate-y-0.5 hover:text-neon-pink hover:border-neon-pink/70 hover:bg-white/15",
                        "hover:shadow-[0_0_20px_rgba(255,0,255,0.28)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-miami-blue/70",
                        "transition-all duration-200"
                      )}
                    >
                      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover/shortcut:opacity-100 group-focus-within/shortcut:opacity-100 bg-gradient-to-br from-miami-blue/20 via-transparent to-neon-pink/20 transition-opacity duration-200" />
                      <Icon className="relative w-4 h-4 transition-transform duration-200 group-hover/shortcut:scale-110" />
                    </a>

                    <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-neon-pink/45 bg-sky-950/92 px-3 py-1.5 text-[11px] sm:text-xs font-mono tracking-[0.04em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] opacity-0 group-hover/shortcut:opacity-100 group-focus-within/shortcut:opacity-100 group-hover/shortcut:translate-y-0 group-focus-within/shortcut:translate-y-0 transition-all duration-200">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
