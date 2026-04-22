"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, KeyRound, Lock, ShieldAlert } from "lucide-react";

const ACCESS_STORAGE_KEY = "biotti-secret-access-v1";
const ACCESS_PASSWORD = "Ben10";

type GatePhase = "booting" | "locked";

export default function SecretAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [phase, setPhase] = useState<GatePhase>("booting");
  const [password, setPassword] = useState("");
  const [attemptError, setAttemptError] = useState("");
  const [hasBooted, setHasBooted] = useState(false);

  useEffect(() => {
    const hasAccess =
      typeof window !== "undefined" &&
      sessionStorage.getItem(ACCESS_STORAGE_KEY) === "true";

    if (hasAccess) {
      setIsUnlocked(true);
      setHasBooted(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("locked");
      setHasBooted(true);
    }, 1800);

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
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[12000] bg-[#09030f] flex items-center justify-center px-4 py-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,120,0.14),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(0,255,255,0.12),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(255,140,0,0.12),transparent_42%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
              className="absolute w-[80vmin] h-[80vmin] rounded-full border border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
              className="absolute w-[62vmin] h-[62vmin] rounded-full border border-neon-pink/20"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-black/55 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,255,0.25)]"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.22em] uppercase text-white/70 font-mono">
                  <ShieldAlert className="w-4 h-4 text-neon-pink" />
                  Protocolo seguro activado
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-miami-blue/90">
                  Vault Node: FLORIPA-26
                </p>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-3">
                Archivo Clasificado
                <br />
                <span className="text-neon-pink">DESPEDIDA BIOTTI</span>
              </h2>

              {!hasBooted || phase === "booting" ? (
                <div className="rounded-2xl border border-amber-300/35 bg-amber-300/10 p-4 sm:p-5">
                  <p className="inline-flex items-center gap-2 font-mono text-amber-200 text-xs sm:text-sm tracking-[0.16em] uppercase mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerta de intrusión
                  </p>
                  <p className="text-white/80 font-body text-sm sm:text-base">
                    Cargando sistema de bloqueo de caja fuerte...
                  </p>
                  <motion.div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 1.7, ease: "easeInOut" }}
                      className="h-full w-full bg-gradient-to-r from-neon-pink via-sunset-orange to-miami-blue"
                    />
                  </motion.div>
                </div>
              ) : (
                <motion.form
                  onSubmit={handleUnlock}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-rose-400/35 bg-rose-500/10 p-4 sm:p-5">
                    <p className="inline-flex items-center gap-2 font-mono text-rose-200 text-xs sm:text-sm tracking-[0.12em] uppercase mb-2">
                      <Lock className="w-4 h-4" />
                      Contenido secreto bloqueado
                    </p>
                    <p className="text-white/85 font-body text-sm sm:text-base">
                      Ingresa la clave de acceso para desbloquear la misión.
                    </p>
                  </div>

                  <label className="block">
                    <span className="font-mono text-[11px] sm:text-xs tracking-[0.18em] text-white/65 uppercase">
                      Contraseña
                    </span>
                    <div className="mt-2 relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-miami-blue/85" />
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (attemptError) setAttemptError("");
                        }}
                        autoFocus
                        className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-miami-blue/55"
                        placeholder="Clave de acceso"
                        aria-label="Contraseña de acceso al contenido secreto"
                      />
                    </div>
                  </label>

                  {attemptError && (
                    <motion.p
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-rose-200 text-xs sm:text-sm font-mono"
                    >
                      {attemptError}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl border border-miami-blue/60 bg-miami-blue/20 py-3 text-miami-blue font-display tracking-[0.1em] hover:bg-miami-blue/30 transition-colors"
                  >
                    DESBLOQUEAR BÓVEDA
                  </button>
                </motion.form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
