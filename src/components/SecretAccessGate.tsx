"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Lock, ShieldAlert } from "lucide-react";

const ACCESS_STORAGE_KEY = "biotti-secret-access-v1";
const ACCESS_PASSWORD = "Ben10";

export default function SecretAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [attemptError, setAttemptError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasAccess =
      typeof window !== "undefined" &&
      sessionStorage.getItem(ACCESS_STORAGE_KEY) === "true";

    if (hasAccess) {
      setIsUnlocked(true);
      setReady(true);
      return;
    }

    const timer = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === ACCESS_PASSWORD) {
      sessionStorage.setItem(ACCESS_STORAGE_KEY, "true");
      setIsUnlocked(true);
      setAttemptError("");
      return;
    }
    setAttemptError("Clave incorrecta. Acceso denegado.");
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center px-4 py-8 overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/access-loop.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-fuchsia-950/60 to-sky-950/75" />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-[80vmin] w-[80vmin] rounded-full border border-fuchsia-300/15"
              animate={{ rotate: 360, scale: [1, 1.06, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-28 -bottom-28 h-[90vmin] w-[90vmin] rounded-full border border-cyan-300/15"
              animate={{ rotate: -360, scale: [1, 1.04, 1] }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vmin] w-[50vmin] rounded-full border border-neon-pink/20"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative w-full max-w-2xl rounded-3xl border border-fuchsia-300/30 bg-black/50 backdrop-blur-xl p-6 sm:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.6),0_0_60px_rgba(255,0,255,0.2)]"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.28em] uppercase text-fuchsia-200/85 font-mono">
                  <ShieldAlert className="w-4 h-4 text-fuchsia-300" />
                  Protocolo seguro activado
                </p>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl text-white leading-none">
                Archivo Clasificado
              </h2>
              <p className="mt-1 font-display text-2xl sm:text-3xl text-fuchsia-300 [text-shadow:0_0_15px_rgba(222,91,255,0.5)]">
                DESPEDIDA BIOTTI
              </p>

              <motion.div
                className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-200/90 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Contenido secreto bloqueado
                </p>
                <p className="mt-2 font-body text-white text-base sm:text-lg">
                  Faltan solo <span className="text-amber-200 font-semibold">2 días</span>. Ingresa la clave para desbloquear la misión.
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleUnlock}
                initial={{ opacity: 0, y: 8 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="mt-5 space-y-4"
              >
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-miami-blue" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (attemptError) setAttemptError("");
                    }}
                    autoFocus
                    className="w-full rounded-xl border border-white/25 bg-black/35 pl-10 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
                    placeholder="Clave de acceso"
                    aria-label="Contraseña de acceso"
                  />
                </div>

                {attemptError && (
                  <motion.p
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-rose-300 text-sm font-body"
                  >
                    {attemptError}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl border border-cyan-300/55 bg-gradient-to-r from-cyan-400/25 via-miami-blue/20 to-fuchsia-400/20 py-3.5 text-cyan-200 font-display text-xl tracking-wider hover:brightness-125 transition-all"
                >
                  DESBLOQUEAR BÓVEDA
                </button>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
