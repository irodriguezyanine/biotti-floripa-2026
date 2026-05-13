"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crown,
  KeyRound,
  Lock,
  PartyPopper,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  password: string;
  icon: typeof Clapperboard;
  accentClass: string;
};

type NoviaQuestion = {
  question: string;
  videoUrl: string;
};

type NoviaGameStage = "instructions" | "intro-video" | "questions";

const ACTIVITIES: Activity[] = [
  {
    id: "preguntas-novia",
    title: "Preguntas Novia",
    subtitle: "Quiz + respuesta en video",
    password: "Vale123",
    icon: Clapperboard,
    accentClass: "text-neon-pink",
  },
  {
    id: "desafio-shots",
    title: "Desafío Shots",
    subtitle: "Ronda de castigos",
    password: "Shots2026",
    icon: PartyPopper,
    accentClass: "text-sunset-orange",
  },
  {
    id: "trivia-crew",
    title: "Trivia Crew",
    subtitle: "Puntos por equipo",
    password: "CrewPass26",
    icon: Trophy,
    accentClass: "text-miami-blue",
  },
  {
    id: "caja-secreta",
    title: "Caja Secreta",
    subtitle: "Retos sorpresa",
    password: "BiottiVIP",
    icon: Crown,
    accentClass: "text-amber-300",
  },
];

const NOVIA_QUESTIONS: NoviaQuestion[] = [
  {
    question: "1. ¿Dónde se conocieron?",
    videoUrl: "/videos/vale/pregunta-01-donde-se-conocieron.mp4",
  },
  {
    question: "2. ¿Dónde fue el primer beso?",
    videoUrl: "/videos/vale/pregunta-02-primer-beso.mp4",
  },
  {
    question: "3. ¿Lo que menos te gusta de Sebastián?",
    videoUrl: "/videos/vale/pregunta-03-lo-que-menos-te-gusta.mp4",
  },
  {
    question: "4. ¿Cuál es tu trago favorito?",
    videoUrl: "/videos/vale/pregunta-04-trago-favorito.mp4",
  },
  {
    question: "5. ¿Cuánto tiempo llevan juntos (exacto)?",
    videoUrl: "/videos/vale/pregunta-05-tiempo-juntos.mp4",
  },
  {
    question: "6. ¿Cuántos hijos quieren tener?",
    videoUrl: "/videos/vale/pregunta-06-hijos.mp4",
  },
  {
    question: "7. ¿Qué hombre(s) le causan celos a Sebastián?",
    videoUrl: "/videos/vale/pregunta-07-celos.mp4",
  },
  {
    question: "8. ¿Dónde fue su primera vez 👉👌?",
    videoUrl: "/videos/vale/pregunta-08-primera-vez.mp4",
  },
  {
    question: "9. ¿Posición preferida tuya?",
    videoUrl: "/videos/vale/pregunta-09-posicion-preferida.mp4",
  },
  {
    question: "10. ¿Qué parte del cuerpo de Sebastián te gusta más?",
    videoUrl: "/videos/vale/pregunta-10-parte-del-cuerpo.mp4",
  },
  {
    question:
      "11. En promedio ¿cuántas veces hacen el amor a la semana (número exacto)?",
    videoUrl: "/videos/vale/pregunta-11-cuantas-veces.mp4",
  },
  {
    question: "12. Si no es en la cama, ¿dónde hacen el amor?",
    videoUrl: "/videos/vale/pregunta-12-no-cama.mp4",
  },
  {
    question: "13. ¿Qué cosas no dejas que Sebastián haga en la cama?",
    videoUrl: "/videos/vale/pregunta-13-no-deja-en-cama.mp4",
  },
  {
    question:
      "14. Posición favorita de Sebastián (imitándolo), tendrá que actuarlo.",
    videoUrl: "/videos/vale/pregunta-14-posicion-favorita-seba.mp4",
  },
  {
    question: "15. Disfraz favorito de Sebastián para el sexo. O vestimenta.",
    videoUrl: "/videos/vale/pregunta-15-disfraz-favorito.mp4",
  },
];

export default function ActivitiesSection() {
  const [passwordModalFor, setPasswordModalFor] = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [noviaStage, setNoviaStage] = useState<NoviaGameStage>("instructions");

  const INTRO_VIDEO_URL = "/videos/vale/Introduccion.mp4";

  const activeActivity = useMemo(
    () => ACTIVITIES.find((item) => item.id === activeActivityId) ?? null,
    [activeActivityId]
  );

  const currentQuestion = NOVIA_QUESTIONS[currentQuestionIdx];
  const isFirstQuestion = currentQuestionIdx === 0;
  const isLastQuestion = currentQuestionIdx === NOVIA_QUESTIONS.length - 1;

  function closePasswordModal() {
    setPasswordModalFor(null);
    setPasswordInput("");
    setPasswordError("");
  }

  function closeActivityModal() {
    setActiveActivityId(null);
    setCurrentQuestionIdx(0);
    setShowVideo(false);
    setNoviaStage("instructions");
  }

  function onOpenActivity(activityId: string) {
    if (unlocked[activityId]) {
      setActiveActivityId(activityId);
      if (activityId === "preguntas-novia") {
        setCurrentQuestionIdx(0);
        setShowVideo(false);
        setNoviaStage("instructions");
      }
      return;
    }
    setPasswordModalFor(activityId);
    setPasswordInput("");
    setPasswordError("");
  }

  function onValidatePassword() {
    const activity = ACTIVITIES.find((item) => item.id === passwordModalFor);
    if (!activity) return;

    if (passwordInput.trim() === activity.password) {
      setUnlocked((previous) => ({ ...previous, [activity.id]: true }));
      setActiveActivityId(activity.id);
      if (activity.id === "preguntas-novia") {
        setCurrentQuestionIdx(0);
        setShowVideo(false);
        setNoviaStage("instructions");
      }
      closePasswordModal();
      return;
    }

    setPasswordError("Clave incorrecta");
  }

  function moveQuestion(direction: "next" | "prev") {
    setShowVideo(false);
    setCurrentQuestionIdx((prev) => {
      if (direction === "next") return Math.min(prev + 1, NOVIA_QUESTIONS.length - 1);
      return Math.max(prev - 1, 0);
    });
  }

  return (
    <section id="activities" className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url(/party-brasil.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-fuchsia-950/88 to-sky-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          ACTIVIDADES <span className="text-miami-blue">SECRETAS</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 font-body text-sm sm:text-base mb-10"
        >
          4 juegos bloqueados con contraseña
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {ACTIVITIES.map((activity, index) => {
            const Icon = activity.icon;
            const isUnlocked = Boolean(unlocked[activity.id]);
            return (
              <motion.button
                key={activity.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                onClick={() => onOpenActivity(activity.id)}
                className="glass-card rounded-2xl border border-white/20 p-5 text-left hover:border-miami-blue/60 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <Icon className={cn("h-5 w-5", activity.accentClass)} />
                  </div>
                  {isUnlocked ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-300 shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-white/60 shrink-0" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-2xl text-white">{activity.title}</h3>
                <p className="mt-1 text-sm text-white/65 font-body">{activity.subtitle}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {passwordModalFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={closePasswordModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/25 glass-card p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-white">Clave de acceso</h3>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/80 hover:bg-black/50"
                  aria-label="Cerrar modal de contraseña"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-miami-blue" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(event) => {
                    setPasswordInput(event.target.value);
                    setPasswordError("");
                  }}
                  className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-miami-blue/60"
                  placeholder="Ingresa contraseña"
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="mt-2 text-rose-300 text-sm font-body">{passwordError}</p>
              )}
              <button
                type="button"
                onClick={onValidatePassword}
                className="mt-5 w-full rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-3 text-miami-blue font-body font-semibold hover:bg-miami-blue/25 transition-colors"
              >
                Entrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1110] bg-sky-950/85 backdrop-blur-sm px-4 py-8 overflow-y-auto"
            onClick={closeActivityModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-4xl mx-auto rounded-3xl border border-white/20 glass-card p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={closeActivityModal}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/85 hover:bg-black/55"
                aria-label="Cerrar actividad"
              >
                <X className="h-4 w-4" />
              </button>

              {activeActivity.id !== "preguntas-novia" ? (
                <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-10 h-10 text-miami-blue mb-4" />
                  <h3 className="font-display text-3xl text-white">{activeActivity.title}</h3>
                  <p className="mt-3 text-white/70 font-body max-w-md">
                    Esta actividad está desbloqueada y lista para que carguen contenido cuando
                    quieran.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h3 className="font-display text-3xl sm:text-4xl text-white">
                      Preguntas Novia
                    </h3>
                    <p className="mt-2 text-white/65 text-sm font-body">
                      Modo diapositiva: lean la pregunta y luego muestren el video de la respuesta.
                    </p>
                  </div>

                  {noviaStage === "instructions" && (
                    <div className="rounded-2xl border border-white/20 bg-black/25 p-5 sm:p-6">
                      <div className="rounded-2xl border border-miami-blue/30 bg-miami-blue/10 p-4 sm:p-5">
                        <h4 className="font-display text-2xl text-white">Instrucciones</h4>
                        <ul className="mt-3 space-y-2 text-white/80 font-body text-sm">
                          <li>1) Lee la pregunta en voz alta.</li>
                          <li>2) Biotti responde.</li>
                          <li>3) Recién ahí muestra el video de Vale.</li>
                          <li>4) Si falla, toma.</li>
                        </ul>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("intro-video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "intro-video" && (
                    <div className="rounded-2xl border border-white/20 bg-black/25 p-4 sm:p-6">
                      <div className="rounded-2xl border border-fuchsia-300/30 bg-black/40 p-3">
                        <video
                          controls
                          src={INTRO_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("questions")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "questions" && (
                    <div className="rounded-2xl border border-white/20 bg-black/25 p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Pregunta {currentQuestionIdx + 1} / {NOVIA_QUESTIONS.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveQuestion("prev")}
                            disabled={isFirstQuestion}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/20"
                            aria-label="Pregunta anterior"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion("next")}
                            disabled={isLastQuestion}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/20"
                            aria-label="Siguiente pregunta"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuestion.question}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.24 }}
                          className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-5 sm:p-7"
                        >
                          <p className="font-display text-2xl sm:text-3xl text-white leading-tight">
                            {currentQuestion.question}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowVideo((prev) => !prev)}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/50 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {showVideo ? "Ocultar video" : "Mostrar video respuesta"}
                        </button>
                      </div>

                      {showVideo && (
                        <div className="mt-4 rounded-2xl border border-white/20 bg-black/35 p-3">
                          {currentQuestion.videoUrl ? (
                            <video
                              controls
                              src={currentQuestion.videoUrl}
                              className="w-full rounded-xl max-h-[420px] bg-black"
                            />
                          ) : (
                            <div className="h-48 rounded-xl border border-dashed border-white/25 bg-white/5 flex flex-col items-center justify-center text-center px-4">
                              <UserRound className="h-7 w-7 text-white/55 mb-2" />
                              <p className="text-white/70 text-sm font-body">
                                Agrega el video de esta respuesta en el arreglo `NOVIA_QUESTIONS`.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

