"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getDaysLeft } from "@/lib/countdown";

const STORAGE_KEY = "welcomeEntered";

export function hasUserEntered(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function markUserEntered(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, "true");
  window.dispatchEvent(new CustomEvent("welcomeEnter"));
}

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (hasUserEntered()) return;
    setVisible(true);
    setDays(getDaysLeft());
  }, []);

  const handleEnter = () => {
    markUserEntered();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#2a1453]/95 px-6 py-8 sm:px-10 sm:py-12 text-center shadow-[0_25px_80px_rgba(45,0,77,0.55)]"
          >
            <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-[-5rem] h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white/90"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                Edición Floripa 2026
              </motion.div>

              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-white leading-[1.06] text-balance">
                BIENVENIDO AL SITIO OFICIAL DE LA DESPEDIDA DE SOLTEROS DE SEBASTIÁN BIOTTI
              </h2>

              <p className="mx-auto mt-6 max-w-2xl font-body text-base sm:text-xl text-white/90 leading-relaxed">
                Prepárate para la misión: quedan{" "}
                <span className="inline-flex items-center rounded-lg border border-amber-300/50 bg-amber-300/15 px-3 py-1 font-bold text-amber-200 shadow-[0_0_16px_rgba(252,211,77,0.35)]">
                  {days} días
                </span>{" "}
                para despedir al novio como corresponde.
              </p>

              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-10 inline-flex items-center gap-3 rounded-xl border border-emerald-300/40 bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-400 px-8 py-4 font-display text-lg sm:text-xl tracking-wide text-slate-950 shadow-[0_10px_30px_rgba(132,204,22,0.35)] transition-all duration-300 hover:shadow-[0_14px_38px_rgba(132,204,22,0.55)]"
              >
                ENTRAR
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
