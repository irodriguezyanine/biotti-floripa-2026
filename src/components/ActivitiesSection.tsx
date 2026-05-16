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
  RotateCcw,
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

type BonusTrack = {
  title: string;
  questionVideoUrl: string;
  answerVideoUrl: string;
};

type NoviaGameStage =
  | "cover"
  | "instructions"
  | "intro-video"
  | "questions"
  | "bonus-track"
  | "bonus-rounds"
  | "final-report";

type QuestionStep = "question" | "respond" | "video" | "result";
type ResultMark = "yes" | "so-so" | "no" | null;
type BonusStep = "question-video" | "respond" | "answer-video" | "result";
type CiertoBiottiItem = {
  title: string;
  story: string;
  verdict: string;
  isTrue: boolean;
};
type MandiolaVote = "true" | "false" | null;
type MandiolaPhase = "vote" | "result";

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
    password: "FranSoto123",
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

const CIERTO_BIOTTI_ITEMS: CiertoBiottiItem[] = [
  {
    title: "1. El Emprendimiento Escolar",
    story:
      'En el San Ignacio El Bosque, a Sebastián lo pillaron en los baños vendiendo respuestas de pruebas de matemáticas. Decía que ese baño era "la oficina de Sebastián Biotti".',
    verdict: "BIOTTI-MENTIRA (Nunca pasó).",
    isTrue: false,
  },
  {
    title: "2. El Impulso Vandálico",
    story:
      "En la universidad, volviendo de un carrete, a Biotti le dio por robarse un basurero de la vía pública a pulso y llevárselo a casa. Se sacó la csm caminando con el basurero, pero llegó a la casa con el basurero municipal.",
    verdict: "CIERTA (Es real).",
    isTrue: true,
  },
  {
    title: "3. El Accidente Misterioso",
    story:
      "Durante un carrete, se cayó de un árbol por estar borracho y bajo los efectos de sustancias. Para tapar la vergüenza, le inventó a sus amigos que fue un accidente casual.",
    verdict: "CIERTA (Es real).",
    isTrue: true,
  },
  {
    title: "4. El Secreto Universitario",
    story:
      'Sebastián, alias "El Lula", recuerda a María José como la mejor polola de toda su época universitaria.',
    verdict: "CIERTA (Es real).",
    isTrue: true,
  },
  {
    title: "5. Desgracia Romántica",
    story:
      '"El Lula" entró a la casa de una mina que se quería comer. En plena cita tuvo que ir al baño a hacer "a cagar", la maniobra falló y la mina lo pilló.',
    verdict: "BIOTTI-MENTIRA (Esta es la trampa).",
    isTrue: false,
  },
];

const MANDIOLA_PLAYERS = [
  "Biotti",
  "Nacho",
  "Manuel",
  "Momo",
  "Javier",
  "Mandiola",
  "Pedro",
  "Seba",
  "Felipe",
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
    question: "15. Disfraz favorito de Sebastián para el sexo.",
    videoUrl: "/videos/vale/pregunta-15-disfraz-favorito.mp4",
  },
];

const BONUS_TRACKS: BonusTrack[] = [
  {
    title: "Bonus 1: Vale pregunta",
    questionVideoUrl: "/videos/vale/bonus-pregunta-01.mp4",
    answerVideoUrl: "/videos/vale/bonus-respuesta-01.mp4",
  },
  {
    title: "Bonus 2: Vale pregunta",
    questionVideoUrl: "/videos/vale/bonus-pregunta-02.mp4",
    answerVideoUrl: "/videos/vale/bonus-respuesta-02.mp4",
  },
  {
    title: "Bonus 3: Vale pregunta",
    questionVideoUrl: "/videos/vale/bonus-pregunta-03.mp4",
    answerVideoUrl: "/videos/vale/bonus-respuesta-03.mp4",
  },
];

export default function ActivitiesSection() {
  const [passwordModalFor, setPasswordModalFor] = useState<string | null>(null);
  const [resumePromptFor, setResumePromptFor] = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [activitySessionExists, setActivitySessionExists] = useState<Record<string, boolean>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionStep, setQuestionStep] = useState<QuestionStep>("question");
  const [questionResults, setQuestionResults] = useState<ResultMark[]>(
    () => NOVIA_QUESTIONS.map(() => null)
  );
  const [bonusIdx, setBonusIdx] = useState(0);
  const [bonusStep, setBonusStep] = useState<BonusStep>("question-video");
  const [bonusResults, setBonusResults] = useState<ResultMark[]>(() =>
    BONUS_TRACKS.map(() => null)
  );
  const [mandiolaQuestionIdx, setMandiolaQuestionIdx] = useState(0);
  const [mandiolaPhase, setMandiolaPhase] = useState<MandiolaPhase>("vote");
  const [mandiolaVotes, setMandiolaVotes] = useState<MandiolaVote[][]>(
    () => CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null))
  );
  const [mandiolaResolvedRounds, setMandiolaResolvedRounds] = useState<boolean[]>(
    () => CIERTO_BIOTTI_ITEMS.map(() => false)
  );
  const [mandiolaGiftedByPlayer, setMandiolaGiftedByPlayer] = useState<boolean[][]>(
    () => CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => false))
  );
  const [noviaStage, setNoviaStage] = useState<NoviaGameStage>("cover");

  const INTRO_VIDEO_URL = "/videos/vale/Introduccion.mp4";

  const activeActivity = useMemo(
    () => ACTIVITIES.find((item) => item.id === activeActivityId) ?? null,
    [activeActivityId]
  );

  const currentQuestion = NOVIA_QUESTIONS[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === NOVIA_QUESTIONS.length - 1;
  const currentResult = questionResults[currentQuestionIdx];
  const currentBonus = BONUS_TRACKS[bonusIdx];
  const isLastBonus = bonusIdx === BONUS_TRACKS.length - 1;
  const currentBonusResult = bonusResults[bonusIdx];
  const yesCount = questionResults.filter((item) => item === "yes").length;
  const soSoCount = questionResults.filter((item) => item === "so-so").length;
  const noCount = questionResults.filter((item) => item === "no").length;
  const totalScore = yesCount + soSoCount * 0.5;
  const bonusYesCount = bonusResults.filter((item) => item === "yes").length;
  const bonusSoSoCount = bonusResults.filter((item) => item === "so-so").length;
  const bonusNoCount = bonusResults.filter((item) => item === "no").length;
  const bonusScore = bonusYesCount + bonusSoSoCount * 0.5;
  const overallYesCount = yesCount + bonusYesCount;
  const overallSoSoCount = soSoCount + bonusSoSoCount;
  const overallNoCount = noCount + bonusNoCount;
  const overallQuestionsCount = NOVIA_QUESTIONS.length + BONUS_TRACKS.length;
  const overallScore = totalScore + bonusScore;
  const overallAccuracy = (overallScore / overallQuestionsCount) * 100;
  const currentMandiolaItem = CIERTO_BIOTTI_ITEMS[mandiolaQuestionIdx];
  const currentMandiolaVotes = mandiolaVotes[mandiolaQuestionIdx] ?? [];
  const allMandiolaVotesDone = currentMandiolaVotes.every((vote) => vote !== null);
  const isFirstMandiolaQuestion = mandiolaQuestionIdx === 0;
  const isLastMandiolaQuestion = mandiolaQuestionIdx === CIERTO_BIOTTI_ITEMS.length - 1;
  const currentMandiolaWinners = MANDIOLA_PLAYERS.filter((_, playerIdx) => {
    const vote = currentMandiolaVotes[playerIdx];
    if (!vote) return false;
    return currentMandiolaItem.isTrue ? vote === "true" : vote === "false";
  });
  const currentMandiolaLosers = MANDIOLA_PLAYERS.filter((_, playerIdx) => {
    const vote = currentMandiolaVotes[playerIdx];
    if (!vote) return false;
    return currentMandiolaItem.isTrue ? vote === "false" : vote === "true";
  });

  const mandiolaCorrectCount = CIERTO_BIOTTI_ITEMS.reduce((acc, item, roundIdx) => {
    if (!mandiolaResolvedRounds[roundIdx]) return acc;
    const votes = mandiolaVotes[roundIdx] ?? [];
    const winnersInRound = votes.filter((vote) =>
      item.isTrue ? vote === "true" : vote === "false"
    ).length;
    return acc + winnersInRound;
  }, 0);
  const mandiolaWrongCount = CIERTO_BIOTTI_ITEMS.reduce((acc, item, roundIdx) => {
    if (!mandiolaResolvedRounds[roundIdx]) return acc;
    const votes = mandiolaVotes[roundIdx] ?? [];
    const losersInRound = votes.filter((vote) =>
      item.isTrue ? vote === "false" : vote === "true"
    ).length;
    return acc + losersInRound;
  }, 0);
  const mandiolaGiftedCount = mandiolaGiftedByPlayer.reduce(
    (acc, byRound) => acc + byRound.filter(Boolean).length,
    0
  );
  const mandiolaAvailableGiftShots = Math.max(0, mandiolaCorrectCount - mandiolaGiftedCount);

  function closePasswordModal() {
    setPasswordModalFor(null);
    setPasswordInput("");
    setPasswordError("");
  }

  function resetPreguntasNoviaState() {
    setCurrentQuestionIdx(0);
    setQuestionStep("question");
    setQuestionResults(NOVIA_QUESTIONS.map(() => null));
    setBonusIdx(0);
    setBonusStep("question-video");
    setBonusResults(BONUS_TRACKS.map(() => null));
    setNoviaStage("cover");
  }

  function resetMandiolaState() {
    setMandiolaQuestionIdx(0);
    setMandiolaPhase("vote");
    setMandiolaVotes(CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null)));
    setMandiolaResolvedRounds(CIERTO_BIOTTI_ITEMS.map(() => false));
    setMandiolaGiftedByPlayer(CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => false)));
  }

  function resetActivityState(activityId: string) {
    if (activityId === "preguntas-novia") {
      resetPreguntasNoviaState();
      return;
    }
    if (activityId === "actividad-mandiola") {
      resetMandiolaState();
    }
  }

  function openActivity(activityId: string, options?: { restart?: boolean }) {
    if (options?.restart) {
      resetActivityState(activityId);
    }
    setActiveActivityId(activityId);
    setActivitySessionExists((previous) => ({ ...previous, [activityId]: true }));
  }

  function closeActivityModal() {
    if (activeActivityId) {
      setActivitySessionExists((previous) => ({ ...previous, [activeActivityId]: true }));
    }
    setActiveActivityId(null);
  }

  function onRestartCurrentActivity() {
    if (!activeActivityId) return;
    const confirmed = window.confirm(
      "¿Seguro que quieres reiniciar esta actividad desde el principio?"
    );
    if (!confirmed) return;
    resetActivityState(activeActivityId);
  }

  function onOpenActivity(activityId: string) {
    if (unlocked[activityId]) {
      if (activitySessionExists[activityId]) {
        setResumePromptFor(activityId);
      } else {
        openActivity(activityId);
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
      openActivity(activity.id, { restart: true });
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

  function markCurrentBonusResult(result: Exclude<ResultMark, null>) {
    setBonusResults((previous) => {
      const next = [...previous];
      next[bonusIdx] = result;
      return next;
    });
  }

  function onNextAfterBonusResult() {
    if (!currentBonusResult) return;
    if (isLastBonus) {
      setNoviaStage("final-report");
      return;
    }
    setBonusIdx((prev) => prev + 1);
    setBonusStep("question-video");
  }

  function getFinalBiottiTitle() {
    if (overallAccuracy >= 85) return "BIOTTI ORÁCULO SUPREMO";
    if (overallAccuracy >= 65) return "BIOTTI MODO ADIVINO";
    if (overallAccuracy >= 45) return "BIOTTI EN PARTIDA PELEADA";
    return "BIOTTI NECESITA REFUERZOS";
  }

  function markMandiolaVote(playerIdx: number, vote: Exclude<MandiolaVote, null>) {
    setMandiolaVotes((previous) => {
      const next = previous.map((roundVotes) => [...roundVotes]);
      next[mandiolaQuestionIdx][playerIdx] = vote;
      return next;
    });
  }

  function onShowMandiolaVerdict() {
    if (!allMandiolaVotesDone) return;
    setMandiolaResolvedRounds((previous) => {
      const next = [...previous];
      next[mandiolaQuestionIdx] = true;
      return next;
    });
    setMandiolaPhase("result");
  }

  function onPreviousMandiolaStage() {
    if (mandiolaPhase === "result") {
      setMandiolaPhase("vote");
      return;
    }
    if (isFirstMandiolaQuestion) return;
    setMandiolaQuestionIdx((prev) => prev - 1);
    setMandiolaPhase("result");
  }

  function onNextMandiolaStage() {
    if (mandiolaPhase === "vote") {
      onShowMandiolaVerdict();
      return;
    }
    if (isLastMandiolaQuestion) return;
    setMandiolaQuestionIdx((prev) => prev + 1);
    setMandiolaPhase("vote");
  }

  function toggleMandiolaGift(playerIdx: number) {
    if (mandiolaPhase !== "result") return;
    const playerName = MANDIOLA_PLAYERS[playerIdx];
    if (!currentMandiolaWinners.includes(playerName)) return;

    const wasGifted = mandiolaGiftedByPlayer[mandiolaQuestionIdx]?.[playerIdx];
    if (!wasGifted && mandiolaAvailableGiftShots <= 0) return;

    setMandiolaGiftedByPlayer((previous) => {
      const next = previous.map((roundGifts) => [...roundGifts]);
      next[mandiolaQuestionIdx][playerIdx] = !Boolean(wasGifted);
      return next;
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
        {resumePromptFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1105] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setResumePromptFor(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/25 glass-card p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-white">¿Cómo quieres entrar?</h3>
                <button
                  type="button"
                  onClick={() => setResumePromptFor(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/80 hover:bg-black/50"
                  aria-label="Cerrar modal de retomar o reiniciar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-white/75 font-body text-sm">
                Ya tenías una partida iniciada. ¿Quieres retomar donde estabas o reiniciar
                desde el principio?
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!resumePromptFor) return;
                    openActivity(resumePromptFor);
                    setResumePromptFor(null);
                  }}
                  className="rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-3 text-miami-blue font-body font-semibold hover:bg-miami-blue/25 transition-colors"
                >
                  Retomar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!resumePromptFor) return;
                    openActivity(resumePromptFor, { restart: true });
                    setResumePromptFor(null);
                  }}
                  className="rounded-xl border border-rose-300/45 bg-rose-500/10 px-4 py-3 text-rose-200 font-body font-semibold hover:bg-rose-500/20 transition-colors"
                >
                  Reiniciar
                </button>
              </div>
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
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRestartCurrentActivity}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/45 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                  aria-label="Reiniciar actividad"
                  title="Reiniciar actividad"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeActivityModal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/85 hover:bg-black/55"
                  aria-label="Cerrar actividad"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {activeActivity.id === "actividad-mandiola" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-miami-blue/35 bg-miami-blue/10 p-4 sm:p-5">
                    <h3 className="font-display text-3xl sm:text-4xl text-white">
                      Trivia: Cierto o Biotti
                    </h3>
                    <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                      Regla del viaje: el animador lee la historia. Los que aciertan no toman;
                      quienes se equivoquen toman un shot y pueden regalar un shot.
                    </p>
                    <p className="mt-2 text-white/70 font-body text-sm">
                      Durante todo el viaje pueden sumar historias reales o falsas del Lula y guardar
                      shots para regalarlos en cualquier lugar y momento.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-200/85">Aciertos</p>
                      <p className="font-display text-xl text-emerald-200">{mandiolaCorrectCount}</p>
                    </div>
                    <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider font-mono text-rose-200/85">Errores</p>
                      <p className="font-display text-xl text-rose-200">{mandiolaWrongCount}</p>
                    </div>
                    <div className="rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider font-mono text-amber-200/85">Shots a tomar</p>
                      <p className="font-display text-xl text-amber-200">{mandiolaWrongCount}</p>
                    </div>
                    <div className="rounded-xl border border-miami-blue/35 bg-miami-blue/10 px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider font-mono text-miami-blue/85">Disponibles</p>
                      <p className="font-display text-xl text-miami-blue">{mandiolaAvailableGiftShots}</p>
                    </div>
                    <div className="rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider font-mono text-fuchsia-200/85">Regalados</p>
                      <p className="font-display text-xl text-fuchsia-200">{mandiolaGiftedCount}</p>
                    </div>
                  </div>

                  <article className="rounded-2xl border border-white/20 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-display text-2xl text-white">{currentMandiolaItem.title}</h4>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-white/70">
                        Pregunta {mandiolaQuestionIdx + 1} / {CIERTO_BIOTTI_ITEMS.length}
                      </span>
                    </div>
                    <p className="mt-2 text-white/85 font-body text-sm leading-relaxed">
                      {currentMandiolaItem.story}
                    </p>

                    {mandiolaPhase === "vote" ? (
                      <>
                        <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-miami-blue/90">
                          Etapa 1: Votación (solo íconos)
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {MANDIOLA_PLAYERS.map((player, playerIdx) => {
                            const vote = currentMandiolaVotes[playerIdx];
                            return (
                              <div
                                key={player}
                                className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 flex items-center justify-between gap-2"
                              >
                                <span className="text-sm text-white/90 font-body truncate">
                                  {player}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => markMandiolaVote(playerIdx, "true")}
                                    className={cn(
                                      "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                                      vote === "true"
                                        ? "border-emerald-300/80 bg-emerald-500/25 text-emerald-100"
                                        : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                                    )}
                                    aria-label={`Voto cierto para ${player}`}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => markMandiolaVote(playerIdx, "false")}
                                    className={cn(
                                      "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                                      vote === "false"
                                        ? "border-rose-300/80 bg-rose-500/25 text-rose-100"
                                        : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                                    )}
                                    aria-label={`Voto falso para ${player}`}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {allMandiolaVotesDone && (
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={onShowMandiolaVerdict}
                              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-500/10 px-3 py-2 text-amber-200 text-sm font-body hover:bg-amber-500/20"
                            >
                              Mostrar veredicto
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-fuchsia-200/90">
                          Etapa 2: Veredicto y ganadores
                        </p>
                        <p className="mt-2 rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-3 py-2 text-fuchsia-100 font-body text-sm">
                          Veredicto: {currentMandiolaItem.verdict}
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-200/85">
                              Ganadores (pueden regalar shot)
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {currentMandiolaWinners.length === 0 ? (
                                <span className="text-sm text-emerald-100/80 font-body">
                                  Nadie acertó.
                                </span>
                              ) : (
                                currentMandiolaWinners.map((player) => (
                                  <span
                                    key={player}
                                    className="rounded-full border border-emerald-200/45 bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-100 font-body"
                                  >
                                    {player}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                          <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-rose-200/85">
                              Toman shot
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {currentMandiolaLosers.length === 0 ? (
                                <span className="text-sm text-rose-100/80 font-body">Nadie.</span>
                              ) : (
                                currentMandiolaLosers.map((player) => (
                                  <span
                                    key={player}
                                    className="rounded-full border border-rose-200/45 bg-rose-500/20 px-2.5 py-1 text-xs text-rose-100 font-body"
                                  >
                                    {player}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl border border-fuchsia-300/30 bg-fuchsia-500/5 p-3">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-fuchsia-200/85 mb-2">
                            Regalar shot (solo ganadores)
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {MANDIOLA_PLAYERS.map((player, playerIdx) => {
                              const isWinner = currentMandiolaWinners.includes(player);
                              const gifted = Boolean(
                                mandiolaGiftedByPlayer[mandiolaQuestionIdx]?.[playerIdx]
                              );
                              const disabled = !isWinner && !gifted;
                              return (
                                <button
                                  key={`${player}-gift`}
                                  type="button"
                                  onClick={() => toggleMandiolaGift(playerIdx)}
                                  disabled={disabled}
                                  className={cn(
                                    "inline-flex h-9 items-center justify-center rounded-lg border px-2 text-xs font-body transition-colors",
                                    gifted
                                      ? "border-fuchsia-300/80 bg-fuchsia-500/25 text-fuchsia-100"
                                      : "border-white/20 bg-white/5 text-white/75 hover:bg-white/10",
                                    disabled && "opacity-40 cursor-not-allowed"
                                  )}
                                  aria-label={`Regalar shot ${player}`}
                                  title={player}
                                >
                                  <PartyPopper className="h-4 w-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={onPreviousMandiolaStage}
                        disabled={mandiolaPhase === "vote" && isFirstMandiolaQuestion}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                          mandiolaPhase === "vote" && isFirstMandiolaQuestion
                            ? "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                            : "border-white/35 bg-white/10 text-white/85 hover:bg-white/15"
                        )}
                      >
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={onNextMandiolaStage}
                        disabled={
                          (mandiolaPhase === "vote" && !allMandiolaVotesDone) ||
                          (mandiolaPhase === "result" && isLastMandiolaQuestion)
                        }
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                          (mandiolaPhase === "vote" && !allMandiolaVotesDone) ||
                            (mandiolaPhase === "result" && isLastMandiolaQuestion)
                            ? "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                            : "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                        )}
                      >
                        {mandiolaPhase === "vote"
                          ? "Siguiente"
                          : isLastMandiolaQuestion
                            ? "Trivia completa"
                            : "Siguiente"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                </div>
              ) : activeActivity.id !== "preguntas-novia" ? (
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
                        Preguntas finales de Vale para Biotti: 3 rondas x 4 etapas.
                      </p>
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                          <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 1</p>
                          <p className="text-white font-body text-sm">Video pregunta</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                          <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 2</p>
                          <p className="text-white font-body text-sm">BIOTTI RESPONDE</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                          <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 3</p>
                          <p className="text-white font-body text-sm">Video respuesta</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center">
                          <p className="text-xs font-mono uppercase tracking-wider text-white/65">Etapa 4</p>
                          <p className="text-white font-body text-sm">Evaluación</p>
                        </div>
                      </div>
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
                          onClick={() => {
                            setBonusIdx(0);
                            setBonusStep("question-video");
                            setNoviaStage("bonus-rounds");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {noviaStage === "bonus-rounds" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-violet-950/70 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Bonus {bonusIdx + 1} / {BONUS_TRACKS.length}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-amber-200 rounded-full border border-amber-300/40 bg-amber-500/10 px-2 py-1">
                          Etapa:{" "}
                          {bonusStep === "question-video"
                            ? "video pregunta"
                            : bonusStep === "respond"
                              ? "responde"
                            : bonusStep === "answer-video"
                              ? "video respuesta"
                              : "resultado"}
                        </span>
                      </div>
                      <h4 className="font-display text-2xl sm:text-3xl text-white">
                        {currentBonus.title}
                      </h4>

                      {bonusStep === "question-video" && (
                        <>
                          <div className="mt-4 rounded-2xl border border-fuchsia-300/30 bg-black/40 p-3">
                            {currentBonus.questionVideoUrl ? (
                              <video
                                controls
                                src={currentBonus.questionVideoUrl}
                                className="w-full rounded-xl max-h-[460px] bg-black"
                              />
                            ) : (
                              <div className="h-48 rounded-xl border border-dashed border-white/25 bg-white/5 flex flex-col items-center justify-center text-center px-4">
                                <UserRound className="h-7 w-7 text-white/55 mb-2" />
                                <p className="text-white/70 text-sm font-body">
                                  Falta cargar el video de pregunta de este bonus.
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (bonusIdx === 0) {
                                  setNoviaStage("bonus-track");
                                  return;
                                }
                                setBonusIdx((prev) => prev - 1);
                                setBonusStep("result");
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setBonusStep("respond")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {bonusStep === "respond" && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-6 sm:p-8 text-center"
                          >
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/85">
                              Etapa especial bonus
                            </p>
                            <h4 className="mt-3 font-display text-4xl sm:text-5xl text-amber-100">
                              BIOTTI, RESPONDE
                            </h4>
                          </motion.div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setBonusStep("question-video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setBonusStep("answer-video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {bonusStep === "answer-video" && (
                        <>
                          <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-black/40 p-3">
                            {currentBonus.answerVideoUrl ? (
                              <video
                                controls
                                src={currentBonus.answerVideoUrl}
                                className="w-full rounded-xl max-h-[460px] bg-black"
                              />
                            ) : (
                              <div className="h-48 rounded-xl border border-dashed border-white/25 bg-white/5 flex flex-col items-center justify-center text-center px-4">
                                <UserRound className="h-7 w-7 text-white/55 mb-2" />
                                <p className="text-white/70 text-sm font-body">
                                  Falta cargar el video de respuesta de este bonus.
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setBonusStep("respond")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={() => setBonusStep("result")}
                              className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                            >
                              Siguiente
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {bonusStep === "result" && (
                        <>
                          <div className="mt-4 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 to-black/70 p-5">
                            <p className="font-display text-2xl text-white">
                              ¿Biotti respondió bien este bonus?
                            </p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => markCurrentBonusResult("yes")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentBonusResult === "yes"
                                    ? "border-emerald-300/70 bg-emerald-500/25 text-emerald-100"
                                    : "border-emerald-300/35 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                                )}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => markCurrentBonusResult("so-so")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentBonusResult === "so-so"
                                    ? "border-amber-300/70 bg-amber-500/25 text-amber-100"
                                    : "border-amber-300/35 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                                )}
                              >
                                <Circle className="h-4 w-4" />
                                Más o menos
                              </button>
                              <button
                                type="button"
                                onClick={() => markCurrentBonusResult("no")}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-body transition-colors",
                                  currentBonusResult === "no"
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
                              onClick={() => setBonusStep("answer-video")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={onNextAfterBonusResult}
                              disabled={!currentBonusResult}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                                currentBonusResult
                                  ? "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                                  : "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                              )}
                            >
                              {isLastBonus ? "Ver resultado final" : "Siguiente bonus"}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {noviaStage === "final-report" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-3xl border border-fuchsia-300/35 bg-gradient-to-br from-violet-900/65 via-sky-950/70 to-black/75 p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                    >
                      <div className="rounded-2xl border border-white/20 bg-white/5 p-4 sm:p-5">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-miami-blue">
                          Cierre oficial del juego
                        </p>
                        <h4 className="mt-2 font-display text-3xl sm:text-5xl text-white">
                          {getFinalBiottiTitle()}
                        </h4>
                        <p className="mt-2 text-white/75 font-body text-sm sm:text-base">
                          Reporte final ultra pro del rendimiento de Biotti entre preguntas + bonus.
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-200/85">Sí</p>
                          <p className="font-display text-2xl text-emerald-200">{overallYesCount}</p>
                        </div>
                        <div className="rounded-xl border border-amber-300/35 bg-amber-500/10 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-amber-200/85">Más o menos</p>
                          <p className="font-display text-2xl text-amber-200">{overallSoSoCount}</p>
                        </div>
                        <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-rose-200/85">No</p>
                          <p className="font-display text-2xl text-rose-200">{overallNoCount}</p>
                        </div>
                        <div className="rounded-xl border border-miami-blue/35 bg-miami-blue/10 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-miami-blue/85">Precisión</p>
                          <p className="font-display text-2xl text-miami-blue">{overallAccuracy.toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/20 bg-black/25 p-4">
                        <p className="text-white/85 font-body text-sm sm:text-base">
                          <span className="text-miami-blue font-semibold">Puntaje global:</span>{" "}
                          {overallScore.toFixed(1)} / {overallQuestionsCount}
                          {" · "}
                          <span className="text-fuchsia-200 font-semibold">Preguntas principales:</span>{" "}
                          {totalScore.toFixed(1)} / {NOVIA_QUESTIONS.length}
                          {" · "}
                          <span className="text-amber-200 font-semibold">Bonus:</span>{" "}
                          {bonusScore.toFixed(1)} / {BONUS_TRACKS.length}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 font-body">
                          Modo fiesta: {overallAccuracy >= 70 ? "controlado" : "caótico"}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 font-body">
                          Shots estimados: {overallNoCount}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 font-body">
                          Nivel de drama: {overallNoCount >= 5 ? "alto" : "moderado"}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setNoviaStage("bonus-rounds");
                            setBonusIdx(BONUS_TRACKS.length - 1);
                            setBonusStep("result");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onRestartCurrentActivity}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                        >
                          Jugar de nuevo
                        </button>
                      </div>
                    </motion.div>
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

