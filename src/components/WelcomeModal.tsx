"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Flame, PartyPopper } from "lucide-react";
import { getDaysLeft } from "@/lib/countdown";

const STORAGE_KEY = "welcomeEntered";
const BORDER_FLAMES = [
  { left: "6%", top: "-10px", rotate: -12, delay: 0 },
  { left: "16%", top: "-12px", rotate: 10, delay: 0.2 },
  { left: "26%", top: "-9px", rotate: -8, delay: 0.35 },
  { left: "37%", top: "-11px", rotate: 9, delay: 0.5 },
  { left: "49%", top: "-10px", rotate: -7, delay: 0.65 },
  { left: "61%", top: "-12px", rotate: 8, delay: 0.8 },
  { left: "73%", top: "-10px", rotate: -10, delay: 0.95 },
  { left: "84%", top: "-11px", rotate: 8, delay: 1.1 },
  { left: "96%", top: "12%", rotate: 92, delay: 0.15 },
  { left: "96%", top: "28%", rotate: 96, delay: 0.4 },
  { left: "96%", top: "44%", rotate: 88, delay: 0.6 },
  { left: "96%", top: "60%", rotate: 95, delay: 0.8 },
  { left: "96%", top: "76%", rotate: 90, delay: 1.0 },
  { left: "84%", top: "calc(100% - 2px)", rotate: 180, delay: 0.25 },
  { left: "72%", top: "calc(100% - 2px)", rotate: 186, delay: 0.45 },
  { left: "60%", top: "calc(100% - 2px)", rotate: 175, delay: 0.65 },
  { left: "48%", top: "calc(100% - 2px)", rotate: 182, delay: 0.85 },
  { left: "36%", top: "calc(100% - 2px)", rotate: 176, delay: 1.05 },
  { left: "24%", top: "calc(100% - 2px)", rotate: 185, delay: 1.2 },
  { left: "12%", top: "calc(100% - 2px)", rotate: 178, delay: 1.35 },
  { left: "0%", top: "80%", rotate: -90, delay: 0.1 },
  { left: "0%", top: "64%", rotate: -84, delay: 0.3 },
  { left: "0%", top: "48%", rotate: -92, delay: 0.5 },
  { left: "0%", top: "32%", rotate: -86, delay: 0.7 },
  { left: "0%", top: "16%", rotate: -94, delay: 0.9 },
];

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
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden bg-[#0a0200]/90 backdrop-blur-md"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,75,0,0.28),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(255,160,0,0.24),transparent_35%),radial-gradient(circle_at_70%_75%,rgba(255,40,0,0.2),transparent_38%),radial-gradient(circle_at_30%_85%,rgba(255,120,0,0.2),transparent_38%)]" />
          <motion.div
            className="pointer-events-none absolute left-[8%] top-[10%] h-3 w-3 rounded-full bg-amber-300"
            animate={{ opacity: [0, 1, 0], scale: [0.2, 1.4, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8 }}
          />
          <motion.div
            className="pointer-events-none absolute right-[12%] top-[20%] h-2.5 w-2.5 rounded-full bg-fuchsia-300"
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.5, repeatDelay: 1.1 }}
          />
          <motion.div
            className="pointer-events-none absolute right-[22%] bottom-[15%] h-3 w-3 rounded-full bg-cyan-300"
            animate={{ opacity: [0, 1, 0], scale: [0.2, 1.6, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 1.1, repeatDelay: 1.2 }}
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] p-[2px]"
          >
            <motion.div
              className="pointer-events-none absolute -bottom-6 left-0 right-0 h-20 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.55),rgba(255,45,0,0.25),transparent_70%)]"
              animate={{ opacity: [0.5, 0.95, 0.55], y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="pointer-events-none absolute inset-0">
              {BORDER_FLAMES.map((flame, index) => (
                <motion.div
                  key={`flame-${index}`}
                  className="absolute h-10 w-5 rounded-[65%_65%_45%_45%] bg-gradient-to-t from-[#ff3a00] via-[#ff9800] to-[#fff4a3] opacity-90 blur-[0.3px] shadow-[0_0_14px_rgba(255,120,0,0.7)]"
                  style={{ left: flame.left, top: flame.top, transform: `rotate(${flame.rotate}deg)` }}
                  animate={{ y: [0, -9, -2, 0], scaleY: [0.95, 1.25, 1.08, 0.95], opacity: [0.7, 1, 0.9, 0.72] }}
                  transition={{ duration: 1.15, repeat: Infinity, delay: flame.delay, ease: "easeInOut" }}
                />
              ))}
            </div>

            <div className="relative z-10 rounded-[1.8rem] border border-white/20 bg-[linear-gradient(140deg,#240033_0%,#3b0733_32%,#45110f_66%,#1f0d00_100%)] px-6 py-8 sm:px-10 sm:py-12 text-center shadow-[0_30px_90px_rgba(255,80,0,0.25)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,184,0,0.2),transparent_38%)]" />
              <div className="pointer-events-none absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-[-3rem] h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-white/10 px-4 py-2 text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-amber-100"
                >
                  <PartyPopper className="h-4 w-4 text-amber-300" />
                  Modo fiesta y descontrol
                </motion.div>

                <h2 className="font-display text-2xl sm:text-5xl md:text-6xl text-white leading-[1.02] text-balance [text-shadow:0_0_22px_rgba(255,120,0,0.45)]">
                  BIENVENIDO AL SITIO OFICIAL DE LA DESPEDIDA DE SOLTEROS DE SEBASTIÁN BIOTTI
                </h2>

                <p className="mx-auto mt-6 max-w-3xl font-body text-lg sm:text-3xl text-amber-50 leading-relaxed">
                  Ya no queda nada. SOLO QUEDAN{" "}
                  <span className="font-display text-4xl sm:text-5xl text-orange-300 drop-shadow-[0_0_18px_rgba(255,120,0,0.9)]">
                    {days}
                  </span>{" "}
                  DÍAS PARA UNA AVENTURA DE LA QUE NUNCA NOS OLVIDAREMOS.
                </p>

                <motion.button
                  onClick={handleEnter}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group mt-10 inline-flex items-center gap-3 rounded-xl border border-orange-200/45 bg-gradient-to-r from-[#ff2f00] via-[#ff8f00] to-[#ffd257] px-8 py-4 font-display text-lg sm:text-2xl tracking-wide text-[#210700] shadow-[0_12px_35px_rgba(255,88,0,0.65)] transition-all duration-300 hover:shadow-[0_14px_48px_rgba(255,112,0,0.88)]"
                >
                  <Flame className="h-5 w-5 text-[#3a0a00]" />
                  ENTRAR
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
