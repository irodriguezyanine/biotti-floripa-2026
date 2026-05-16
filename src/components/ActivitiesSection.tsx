"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Circle,
  Crown,
  XCircle,
  KeyRound,
  Lock,
  PartyPopper,
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

type NoviaGameStage =
  | "cover"
  | "instructions"
  | "intro-video"
  | "questions"
  | "bonus-track"
  | "bonus-question-video"
  | "bonus-answer-video";

type QuestionStep = "question" | "respond" | "video" | "result";
type ResultMark = "yes" | "so-so" | "no" | null;

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
    id: "actividad-novio",
    title: "Actividad del novio",
    subtitle: "Bloque especial",
    password: "Shots2026",
    icon: PartyPopper,
    accentClass: "text-sunset-orange",
  },
  {
    id: "actividad-mandiola",
    title: "Actividad Mandiola",
    subtitle: "Bloque sorpresa",
    password: "CrewPass26",
    icon: Trophy,
    accentClass: "text-miami-blue",
  },
  {
    id: "actividad-manuel",
    title: "Actividad Manuel",
    subtitle: "Bloque sorpresa",
    password: "BiottiVIP",
    icon: Crown,
    accentClass: "text-amber-300",
  },
  {
    id: "bonus",
    title: "BONUS",
    subtitle: "Contenido extra",
    password: "Bonus2026",
    icon: Sparkles,
    accentClass: "text-fuchsia-300",
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
  const [questionStep, setQuestionStep] = useState<QuestionStep>("question");
  const [questionResults, setQuestionResults] = useState<ResultMark[]>(
    () => NOVIA_QUESTIONS.map(() => null)
  );
  const [noviaStage, setNoviaStage] = useState<NoviaGameStage>("cover");

  const INTRO_VIDEO_URL = "/videos/vale/Introduccion.mp4";
  const BONUS_QUESTION_VIDEO_URL = "/videos/vale/bonus-pregunta-01.mp4";
  const BONUS_ANSWER_VIDEO_URL = "/videos/vale/bonus-respuesta-01.mp4";

  const activeActivity = useMemo(
    () => ACTIVITIES.find((item) => item.id === activeActivityId) ?? null,
    [activeActivityId]
  );

  const currentQuestion = NOVIA_QUESTIONS[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === NOVIA_QUESTIONS.length - 1;
  const currentResult = questionResults[currentQuestionIdx];
  const yesCount = questionResults.filter((item) => item === "yes").length;
  const soSoCount = questionResults.filter((item) => item === "so-so").length;
  const noCount = questionResults.filter((item) => item === "no").length;
  const totalScore = yesCount + soSoCount * 0.5;

  function closePasswordModal() {
    setPasswordModalFor(null);
    setPasswordInput("");
    setPasswordError("");
  }

  function closeActivityModal() {
    setActiveActivityId(null);
    setCurrentQuestionIdx(0);
    setQuestionStep("question");
    setQuestionResults(NOVIA_QUESTIONS.map(() => null));
    setNoviaStage("cover");
  }

  function onOpenActivity(activityId: string) {
    if (unlocked[activityId]) {
      setActiveActivityId(activityId);
      if (activityId === "preguntas-novia") {
        setCurrentQuestionIdx(0);
        setQuestionStep("question");
        setQuestionResults(NOVIA_QUESTIONS.map(() => null));
        setNoviaStage("cover");
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
        setQuestionStep("question");
        setQuestionResults(NOVIA_QUESTIONS.map(() => null));
        setNoviaStage("cover");
      }
      closePasswordModal();
      return;
    }

    setPasswordError("Clave incorrecta");
  }

  function markCurrentResult(result: Exclude<ResultMark, null>) {
    setQuestionResults((previous) => {
      const next = [...previous];
      next[currentQuestionIdx] = result;
      return next;
    });
  }

  function onNextAfterResult() {
    if (!currentResult) return;
    if (isLastQuestion) {
      setNoviaStage("bonus-track");
      return;
    }
    setCurrentQuestionIdx((prev) => prev + 1);
    setQuestionStep("question");
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
                  <div className="mb-6 rounded-2xl border border-fuchsia-300/30 bg-gradient-to-r from-fuchsia-500/15 via-violet-500/10 to-cyan-500/10 px-4 py-4 sm:px-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-miami-blue font-mono mb-2">
                      Modo Juego
                    </p>
                    <h3 className="font-display text-3xl sm:text-5xl text-white">
                      Preguntas Novia
                    </h3>
                    <p className="mt-2 text-white/70 text-sm sm:text-base font-body">
                      4 etapas por pregunta: pregunta, responde, video y evaluación del novio.
                    </p>
                  </div>

                  {noviaStage === "cover" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-sky-950/75 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-5 sm:p-6">
                        <h4 className="font-display text-3xl sm:text-4xl text-white">
                          Desafío: Preguntas Novia vs Novio
                        </h4>
                        <p className="mt-3 text-white/85 font-body text-sm sm:text-base leading-relaxed">
                          Biotti debe adivinar respuestas personales de Vale en 15 rondas.
                          Cada pregunta se juega en 4 etapas: leer pregunta, responder,
                          ver video respuesta de Vale y evaluar si el novio acertó.
                        </p>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                            <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 1</p>
                            <p className="text-white font-body text-sm">Pregunta</p>
                          </div>
                          <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                            <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 2</p>
                            <p className="text-white font-body text-sm">Responde</p>
                          </div>
                          <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                            <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 3</p>
                            <p className="text-white font-body text-sm">Video</p>
                          </div>
                          <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                            <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 4</p>
                            <p className="text-white font-body text-sm">Resultado</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("instructions")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Ver instrucciones
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "instructions" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-sky-900/55 to-slate-950/70 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="rounded-2xl border border-miami-blue/40 bg-miami-blue/10 p-4 sm:p-6">
                        <h4 className="font-display text-3xl text-white">Instrucciones</h4>
                        <ul className="mt-4 space-y-2.5 text-white/90 font-body text-base">
                          <li>1) Lee la pregunta en voz alta.</li>
                          <li>2) Biotti responde.</li>
                          <li>3) Recién ahí muestra el video de Vale.</li>
                          <li>4) Si el novio adivina, toman todos.</li>
                          <li>5) Si el novio no adivina, toma 2.</li>
                          <li>6) Si el novio gana, todos toman al seco. Si el novio pierde, toma al seco.</li>
                        </ul>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("cover")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("intro-video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "intro-video" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-slate-950/75 p-4 sm:p-6">
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-black/40 p-3">
                        <video
                          controls
                          src={INTRO_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("instructions")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQuestionStep("question");
                            setNoviaStage("questions");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "questions" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-sky-950/80 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Pregunta {currentQuestionIdx + 1} / {NOVIA_QUESTIONS.length}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-miami-blue rounded-full border border-miami-blue/40 bg-miami-blue/10 px-2 py-1">
                          Etapa:{" "}
                          {questionStep === "question"
                            ? "pregunta"
                            : questionStep === "respond"
                              ? "responde"
                            : questionStep === "video"
                              ? "video"
                              : "resultado"}
                        </span>
                      </div>

                      {questionStep === "question" && (
                        <>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentQuestion.question}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.24 }}
                              className="rounded-2xl border border-fuchsia-300/30 bg-gradient-to-r from-fuchsia-500/15 to-violet-500/10 p-5 sm:p-7"
                            >
                              <p className="font-display text-2xl sm:text-3xl text-white leading-tight">
                                {currentQuestion.question}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setNoviaStage("intro-video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15 mr-auto"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuestionStep("respond")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {questionStep === "respond" && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-6 sm:p-8 text-center"
                          >
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/85">
                              Etapa especial
                            </p>
                            <h4 className="mt-3 font-display text-4xl sm:text-5xl text-amber-100">
                              BIOTTI, RESPONDE
                            </h4>
                          </motion.div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setQuestionStep("question")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuestionStep("video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {questionStep === "video" && (
                        <>
                          <div className="rounded-2xl border border-white/20 bg-black/45 p-3">
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
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setQuestionStep("respond")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuestionStep("result")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {questionStep === "result" && (
                        <>
                          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 to-black/70 p-5">
                            <p className="font-display text-2xl text-white">
                              ¿El novio respondió bien?
                            </p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => markCurrentResult("yes")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentResult === "yes"
                                    ? "border-emerald-300/70 bg-emerald-500/25 text-emerald-100"
                                    : "border-emerald-300/35 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                                )}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => markCurrentResult("so-so")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentResult === "so-so"
                                    ? "border-amber-300/70 bg-amber-500/25 text-amber-100"
                                    : "border-amber-300/35 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                                )}
                              >
                                <Circle className="h-4 w-4" />
                                Más o menos
                              </button>
                              <button
                                type="button"
                                onClick={() => markCurrentResult("no")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentResult === "no"
                                    ? "border-rose-300/70 bg-rose-500/25 text-rose-100"
                                    : "border-rose-300/35 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                                )}
                              >
                                <XCircle className="h-4 w-4" />
                                No
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setQuestionStep("video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={onNextAfterResult}
                              disabled={!currentResult}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                                currentResult
                                  ? "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                                  : "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                              )}
                            >
                              {isLastQuestion ? "Finalizar preguntas" : "Siguiente pregunta"}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  )}

                  {noviaStage === "bonus-track" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-3xl border border-amber-300/45 bg-gradient-to-r from-amber-500/15 via-orange-400/10 to-fuchsia-500/10 p-6 sm:p-8 text-center"
                    >
                      <motion.p
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="font-display text-4xl sm:text-5xl text-amber-200"
                      >
                        BONUS TRACK
                      </motion.p>
                      <p className="mt-3 text-white/75 font-body">
                        Preguntas de la novia para el novio.
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setNoviaStage("questions");
                            setQuestionStep("result");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("bonus-question-video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {noviaStage === "bonus-question-video" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-slate-950/75 p-4 sm:p-6">
                      <div className="rounded-2xl border border-fuchsia-300/30 bg-black/40 p-3">
                        <video
                          controls
                          src={BONUS_QUESTION_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("bonus-track")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("bonus-answer-video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "bonus-answer-video" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-emerald-950/45 to-slate-950/80 p-4 sm:p-6">
                      <div className="rounded-2xl border border-emerald-300/30 bg-black/40 p-3">
                        <video
                          controls
                          src={BONUS_ANSWER_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 rounded-xl border border-white/20 bg-white/5 px-4 py-3">
                        <p className="text-white/80 font-body text-sm">
                          Resultado final:{" "}
                          <span className="text-emerald-300 font-semibold">{yesCount} sí</span>
                          {" · "}
                          <span className="text-amber-300 font-semibold">{soSoCount} más o menos</span>
                          {" · "}
                          <span className="text-rose-300 font-semibold">{noCount} no</span>
                          {" · "}
                          <span className="text-miami-blue font-semibold">
                            Puntaje: {totalScore.toFixed(1)} / {NOVIA_QUESTIONS.length}
                          </span>
                        </p>
                      </div>
                      <div className="mt-4 flex justify-start">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("bonus-question-video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                      </div>
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

