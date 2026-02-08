"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-violet-900/95 to-fuchsia-950/95 border-2 border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/20 p-10 sm:p-14 text-center"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-tight mb-6">
              BIENVENIDO AL SITIO OFICIAL DE UN FIN DE SEMANA ÉPICO
            </h2>
            <p className="font-body text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed mb-10">
              QUEDAN <span className="font-bold text-fuchsia-300">{days}</span> DÍAS
              PARA QUE NUESTRO QUERIDO SEBITA SE CASE
            </p>
            <motion.button
              onClick={handleEnter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 rounded-xl font-display text-xl tracking-wider bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-lg shadow-[#1DB954]/40 transition-colors"
            >
              ENTRAR
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
