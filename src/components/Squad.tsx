"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserCheck, UserX } from "lucide-react";

const CONFIRMED = [
  { name: "Biotti", tag: "THE GROOM / EL OBJETIVO", gold: true },
  { name: "Nacho" },
  { name: "Manuel" },
  { name: "Jt Molina" },
  { name: "Joaco Honorato" },
  { name: "Javier Vargas" },
  { name: "Mandiola" },
  { name: "Pedro De Diego" },
];

const PENDING = [
  { name: "Seba Valenzuela", status: "PENDING" },
  { name: "Felipe Bravo", status: "PENDING" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Squad() {
  return (
    <section id="crew" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo Brasil / playa tropical */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/95 via-sky-900/90 to-sky-950/95" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          THE CREW <span className="text-neon-pink">/</span> WANTED LIST
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/60 font-body text-sm mb-12"
        >
          Confirmados y en misión
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {CONFIRMED.map((person) => (
            <motion.div
              key={person.name}
              variants={item}
              className={cn(
                "glass-card rounded-xl p-4 sm:p-5 transition-all duration-300",
                "hover:border-neon-pink/60 hover:shadow-neon-pink/20 hover:shadow-lg",
                "cursor-default"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    person.gold
                      ? "bg-amber-500/30 border border-amber-400/50 text-amber-300"
                      : "bg-white/10 border border-white/20 text-white/80"
                  )}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-body font-semibold text-white truncate">
                    {person.name}
                  </p>
                  {person.tag && (
                    <p className="text-xs text-amber-400/90 font-mono uppercase tracking-wider">
                      {person.tag}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {PENDING.map((person) => (
            <motion.div
              key={person.name}
              variants={item}
              className={cn(
                "glass-card rounded-xl p-4 sm:p-5 opacity-60",
                "border border-white/10 border-dashed",
                "hover:opacity-80 hover:border-amber-500/30 transition-all duration-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center shrink-0 text-white/50">
                  <UserX className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-body font-medium text-white/80 truncate">
                    {person.name}
                  </p>
                  <p className="text-xs text-amber-500/80 font-mono uppercase">
                    {person.status}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
