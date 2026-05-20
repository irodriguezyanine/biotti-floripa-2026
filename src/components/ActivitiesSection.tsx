"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock3,
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
  day: string;
  time: string;
  location: string;
  password?: string;
  requiresPassword: boolean;
  icon: typeof Clapperboard;
  accentClass: string;
  borderClass: string;
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

type PreferenceWoman = {
  name: string;
  cara: string;
  culo: string;
  tetas: string;
  promedio: string;
  descripcion: string;
};

type PreferenceChallenge = {
  womanName: string;
  contenders: string[];
  shotBid: number;
  isLocked: boolean;
  winner: string | null;
};

type NoviaGameStage =
  | "cover"
  | "instructions"
  | "intro-video"
  | "questions"
  | "preferences-cover"
  | "preferences-voting"
  | "preferences-challenges"
  | "bonus-track"
  | "bonus-rounds"
  | "final-report";

type QuestionStep = "question" | "respond" | "video" | "result";
type ResultMark = "yes" | "so-so" | "no" | null;
type BonusStep = "question-video" | "respond" | "answer-video" | "result";
type PreferenceVoteStep = "handoff" | "vote";
type PreferenceGameStage = "cover" | "voting" | "challenges" | "final";
type CiertoBiottiItem = {
  title: string;
  story: string;
  verdict: string;
  isTrue: boolean;
};
type MandiolaVote = "true" | "false" | null;
type MandiolaPhase = "vote" | "result" | "summary";
type OracionStage = "cover" | "lines" | "final";
type BonusActivityStage =
  | "personajes"
  | "video-matias"
  | "veneco"
  | "video-sapelli"
  | "intro"
  | "video"
  | "final";
type NovioVoteStep = "handoff" | "vote";
type NovioStage = "intro" | "voting" | "confesiones" | "summary";
type ManuelStage = "intro" | "sorteo" | "bracket" | "final-screen";
type ManuelMatchPhase = "winners-r1" | "winners-final" | "losers-r1" | "losers-final" | "grand-final";
type ManuelTeam = { name: string; players: [string, string] };
type ManuelMatch = {
  id: string;
  teamA: string | null;
  teamB: string | null;
  winner: string | null;
  phase: ManuelMatchPhase;
};
type OracionLine = {
  speaker: "novio" | "todos";
  text: string;
};
type NovioQuestion = {
  question: string;
  options: string[];
  correctOptionIdx: number;
  imageUrl?: string | string[];
};
type NovioConfesion = {
  player: string;
  prompt: string;
};

const ACTIVITIES: Activity[] = [
  {
    id: "preguntas-novia",
    title: "Preguntas Novia",
    subtitle: "Quiz + respuesta en video",
    day: "Jueves 21 Mayo",
    time: "21:30 - 23:00",
    location: "Cuartel base · PRE y Actividad Novia",
    password: "Vale123",
    requiresPassword: true,
    icon: Clapperboard,
    accentClass: "text-neon-pink",
    borderClass: "border-neon-pink/40",
  },
  {
    id: "oracion-equipo",
    title: "Oración de equipo",
    subtitle: "Ritual guiado + brindis coral",
    day: "Jueves 21 Mayo",
    time: "23:00 - 23:20",
    location: "Cuartel base · antes de salir",
    requiresPassword: false,
    icon: BookOpenText,
    accentClass: "text-emerald-300",
    borderClass: "border-emerald-300/40",
  },
  {
    id: "juego-preferencias",
    title: "Juego de preferencias",
    subtitle: "Votación + desafío de shots",
    day: "Jueves 21 Mayo",
    time: "23:20 - 23:50",
    location: "Cuartel base · dinámica de votación",
    requiresPassword: false,
    icon: PartyPopper,
    accentClass: "text-fuchsia-300",
    borderClass: "border-fuchsia-300/40",
  },
  {
    id: "actividad-novio",
    title: "Actividad del novio",
    subtitle: "Despedida: versión sin censura",
    day: "Sábado 23 Mayo",
    time: "21:00 - 22:00",
    location: "Cuartel base · Bloque creado por el novio",
    password: "Cata123",
    requiresPassword: true,
    icon: PartyPopper,
    accentClass: "text-sunset-orange",
    borderClass: "border-sunset-orange/40",
  },
  {
    id: "actividad-mandiola",
    title: "Actividad Mandiola",
    subtitle: "Bloque sorpresa",
    day: "Viernes 22 Mayo",
    time: "20:30 - 21:00",
    location: "Cuartel base · Pre noche",
    password: "FranSoto123",
    requiresPassword: true,
    icon: Trophy,
    accentClass: "text-miami-blue",
    borderClass: "border-miami-blue/40",
  },
  {
    id: "actividad-manuel",
    title: "Actividad Manuel",
    subtitle: "Campeonato Spikeball",
    day: "Viernes 22 Mayo",
    time: "21:30 - 22:00",
    location: "Cuartel base · Desafío relámpago",
    password: "Mika123",
    requiresPassword: true,
    icon: Crown,
    accentClass: "text-amber-300",
    borderClass: "border-amber-300/40",
  },
  {
    id: "bonus",
    title: "BONUS",
    subtitle: "Contenido extra",
    day: "Viernes 22 Mayo",
    time: "19:15 - 20:30",
    location: "Bloque sorpresa · cierre secreto",
    password: "Macamu\u00f1oz",
    requiresPassword: true,
    icon: Sparkles,
    accentClass: "text-fuchsia-300",
    borderClass: "border-fuchsia-300/40",
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

const NOVIO_PLAYERS = [
  "Pedro de Diego",
  "Seba Valenzuela",
  "Jose Tomas Molina",
  "Manuel Bolados",
  "Ignacio Rodriguez",
  "Felipe Bravo",
  "Javier Mandiola",
  "Javier Vargas",
];

const NOVIO_INTRO_TEXT =
  "Bienvenidos, caballeros. Estamos aquí para sacar a la luz todas las anécdotas, traiciones, papelones y malas decisiones del grupo. Esta noche no existen filtros, dignidad ni derecho a guardar silencio. Aquí no gana el más inocente porque claramente ninguno lo es. Así que preparen los shots, afilen la memoria y que comiencen las confesiones.";

const NOVIO_QUESTIONS: NovioQuestion[] = [
  {
    question: "1. ¿Por qué le dicen Ben10 al novio?",
    options: [
      "Porque le metió 10 goles a Cebollita",
      "Porque se comió 10 minas en el CASI",
      "Porque lleva 10 pololas",
      "Porque se comió 10 o más minas en el CASI",
    ],
    correctOptionIdx: 1,
    imageUrl: "/images/novio/pregunta-01-ben10.png",
  },
  {
    question: "2. ¿Quién fue el wingman de la noche de Ben10?",
    options: ["Ignacio Rodriguez", "Matias Reyes", "Jose Tomas Molina", "Javier Vargas"],
    correctOptionIdx: 2,
    imageUrl: "/images/novio/pregunta-02-wingman.png",
  },
  {
    question: "3. ¿Quién fue el ingenioso que le puso BEN10 al novio?",
    options: ["Ignacio Rodriguez", "Manuel Bolados", "Daniel Valenzuela", "Felipe Bravo"],
    correctOptionIdx: 0,
    imageUrl: ["/images/novio/pregunta-03-ben10-origen.png", "/images/novio/pregunta-03-ben10-origen-2.png"],
  },
  {
    question: "4. Adivina el personaje: ¿quién le bajaba los pantalones en el tren a las muchachitas?",
    options: ["Sebastian Biotti", "Matias Sapelli", "Jose Tomas Molina", "Pedro de Diego"],
    correctOptionIdx: 2,
    imageUrl: ["/images/novio/pregunta-04-tren.png", "/images/novio/pregunta-04-tren-2.png"],
  },
  {
    question: "5. ¿Quién de aquí no chupa ano?",
    options: ["Pedro de Diego", "Javier Vargas", "Seba Valenzuela", "Javier Mandiola"],
    correctOptionIdx: 3,
    imageUrl: "/images/novio/pregunta-05-ano.png",
  },
  {
    question: "6. ¿Quién de los de aquí tiene más pelos en el ano?",
    options: ["Pedro de Diego", "Jose Tomas Molina", "Javier Mandiola", "Felipe Bravo"],
    correctOptionIdx: 0,
    imageUrl: ["/images/novio/pregunta-06-pelos.png", "/images/novio/pregunta-06-pelos-2.png"],
  },
  {
    question: "7. ¿Quién de aquí regaló un perro a la polola y la pateó dos semanas después?",
    options: ["Manuel Bolados", "Seba Valenzuela", "Javier Vargas", "Ignacio Rodriguez"],
    correctOptionIdx: 1,
    imageUrl: "/images/novio/pregunta-07-perro.png",
  },
  {
    question: "8. ¿Quién da los peores consejos amorosos?",
    options: ["Daniel Valenzuela", "Ignacio Rodriguez", "Felipe Bravo", "Sebastian Biotti"],
    correctOptionIdx: 2,
    imageUrl: "/images/novio/pregunta-08-consejos.png",
  },
  {
    question: "9. ¿Quién andaba jalando fafafa de las tetas de putas de Bellavista?",
    options: ["Seba Valenzuela", "Ignacio Rodriguez", "Manuel Bolados", "Javier Mandiola"],
    correctOptionIdx: 2,
    imageUrl: "/images/novio/pregunta-09-bellavista-2.png",
  },
  {
    question: "10. ¿Quién de aquí terminó durmiendo bajo una banca en Cantagallo?",
    options: ["Jose Tomas Molina", "Ignacio Rodriguez", "Pedro de Diego", "Javier Vargas"],
    correctOptionIdx: 1,
    imageUrl: "/images/novio/pregunta-10-cantagallo.png",
  },
  {
    question: "11. ¿Quién salió funado por agarrarse con un grupo de minas?",
    options: ["Daniel Valenzuela", "Felipe Bravo", "Manuel Bolados", "Javier Vargas"],
    correctOptionIdx: 3,
    imageUrl: ["/images/novio/pregunta-11-funado.png", "/images/novio/pregunta-11-funado-2.png"],
  },
  {
    question: '12. Para los pajeros, ¿cómo termina esta canción: "Eu Brazzino el..."?',
    options: [
      "La era de este juego",
      "El juego de cadera",
      "La cadera de este juego",
      "El juego de esta era",
    ],
    correctOptionIdx: 3,
    imageUrl: "/images/novio/pregunta-12-brazzino.png",
  },
  {
    question: "13. ¿Quién creía que el semen era azul?",
    options: ["Pedro de Diego", "Javier Vargas", "Manuel Bolados", "Jose Tomas Molina"],
    correctOptionIdx: 1,
    imageUrl: "/images/novio/pregunta-13-semen.png",
  },
  {
    question: "14. ¿Quién de este grupo tiene tula de perro (modo rush)?",
    options: ["Seba Valenzuela", "Ignacio Rodriguez", "Matias Sapelli", "Felipe Bravo"],
    correctOptionIdx: 2,
    imageUrl: ["/images/novio/pregunta-14-tula.png", "/images/novio/pregunta-14-tula-2.png"],
  },
];

const NOVIO_CONFESIONES: NovioConfesion[] = [
  {
    player: "Pedro de Diego",
    prompt:
      "¿Qué pasó con la Cata Barra en el campo? ¿Es cierto que mientras te la chupaba, el guatón te pegó en la pichula?",
  },
  {
    player: "Seba Valenzuela",
    prompt:
      "Cuenta la firme: ¿cómo conociste a tu polola actual y si fue patas negras de Lupita?",
  },
  {
    player: "Jose Tomas Molina",
    prompt: "Momo, cuenta la firme: ¿qué pasó en la pieza del hotel en Mendoza?",
  },
  {
    player: "Manuel Bolados",
    prompt: "Hermano, la firme: para la despedida de Sapene, ¿cómo te portaste?",
  },
  {
    player: "Ignacio Rodriguez",
    prompt:
      "Con lujo de detalles: ¿qué ocurrió cuando la Dani te pilló con la mina en el depa?",
  },
  {
    player: "Felipe Bravo",
    prompt:
      "¿Hubo remember con la Jesu? Si hubo, cuenta cómo fue; si no hubo, cuenta por qué terminaron.",
  },
  {
    player: "Javier Mandiola",
    prompt:
      "Mandolino, la firme: ¿qué pasó con la muchachita de enfermería? ¿Le chupaste el sapolio o no?",
  },
  {
    player: "Javier Vargas",
    prompt:
      "¿Qué pasó en el gym de Talca? Cuenta sobre las fotos que mandabas a las bataclanas y cómo se enteró Cata.",
  },
];

const MANUEL_PLAYERS = [
  "Biotti",
  "Nacho",
  "Manuel",
  "Momo",
  "Javier Vargas",
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

const PREFERENCE_WOMEN: PreferenceWoman[] = [
  {
    name: "Carla",
    cara: "9",
    culo: "10",
    tetas: "5",
    promedio: "8.0",
    descripcion: "Es media comunista",
  },
  {
    name: "Paula",
    cara: "7",
    culo: "6",
    tetas: "7",
    promedio: "6.67",
    descripcion: "Normal",
  },
  {
    name: "Maria",
    cara: "2",
    culo: "8",
    tetas: "8",
    promedio: "6.0",
    descripcion: "Muy caliente",
  },
  {
    name: "Diana",
    cara: "6",
    culo: "10",
    tetas: "5",
    promedio: "7.0",
    descripcion: "Es influencer",
  },
  {
    name: "Nerea",
    cara: "1",
    culo: "9",
    tetas: "9",
    promedio: "6.33",
    descripcion: "La más buena onda",
  },
  {
    name: "Lola",
    cara: "10",
    culo: "5",
    tetas: "5",
    promedio: "6.67",
    descripcion: "Muy tierna",
  },
  {
    name: "Andrea",
    cara: "8",
    culo: "8",
    tetas: "8",
    promedio: "8.0",
    descripcion: "Muy carretera y loca",
  },
  {
    name: "Irene",
    cara: "3",
    culo: "3",
    tetas: "10",
    promedio: "5.33",
    descripcion: "Cocina rico y es infomana",
  },
  {
    name: "Laura",
    cara: "5",
    culo: "7",
    tetas: "7",
    promedio: "6.33",
    descripcion: "Tiene la mejor familia y amigas",
  },
  {
    name: "Lucia",
    cara: "1",
    culo: "1",
    tetas: "1",
    promedio: "1.0",
    descripcion: "Es millonaria y te ama incondicionalmente",
  },
  {
    name: "Ena",
    cara: "5",
    culo: "8",
    tetas: "9",
    promedio: "7.33",
    descripcion: "Monja y tímida",
  },
  {
    name: "Aina",
    cara: "4",
    culo: "??",
    tetas: "4.5 aprox",
    promedio: "incompleto",
    descripcion: "Sin descripción",
  },
  {
    name: "Ana",
    cara: "4.5",
    culo: "4.5",
    tetas: "4.5",
    promedio: "4.5",
    descripcion: "Es con quien más tienes química",
  },
];

const ORACION_TEAM_LINES: OracionLine[] = [
  { speaker: "novio", text: "Hermanos queridos, ¿estamos todos?" },
  { speaker: "todos", text: "¡Estamos!" },
  { speaker: "novio", text: "¿Cómo quién somos?" },
  { speaker: "todos", text: "¡Tomamos!" },
  { speaker: "novio", text: "A las mujeres..." },
  { speaker: "todos", text: "¡Amamos!" },
  { speaker: "novio", text: "Con sus novios..." },
  { speaker: "todos", text: "¡Nos peleamos!" },
  {
    speaker: "novio",
    text: "Dios, que en su infinita bondad, casi siempre borrachos nos tiene...",
  },
  { speaker: "todos", text: "¡Será porque nos conviene!" },
  { speaker: "novio", text: "¿Tomó nuestro padre Adán?" },
  { speaker: "todos", text: "¡Tomó!" },
  { speaker: "novio", text: "¿Tomó nuestra madre Eva?" },
  { speaker: "todos", text: "¡Qué borracha era!" },
  { speaker: "novio", text: "Entonces tomemos, porque el que toma..." },
  { speaker: "todos", text: "¡Se emborracha!" },
  { speaker: "novio", text: "Y el que se emborracha..." },
  { speaker: "todos", text: "¡Duerme!" },
  { speaker: "novio", text: "Y el que duerme..." },
  { speaker: "todos", text: "¡No peca!" },
  { speaker: "novio", text: "Y el que no peca..." },
  { speaker: "todos", text: "¡Va al cielo!" },
  { speaker: "novio", text: "Y como sabemos que al cielo vamos..." },
  { speaker: "todos", text: "¡Tomemos!" },
  { speaker: "novio", text: "Y antes, cuando no nos conocíamos..." },
  { speaker: "todos", text: "¡Tomábamos!" },
  { speaker: "novio", text: "Y ahora que ya nos conocemos..." },
  { speaker: "todos", text: "¡Tomamos!" },
  { speaker: "novio", text: "Pues tomemos hasta que no nos conozcamos..." },
  { speaker: "todos", text: "¡Ni de raja nos vayamos!" },
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
  const [bonusActivityStage, setBonusActivityStage] = useState<BonusActivityStage>("personajes");
  const [preferenceGameStage, setPreferenceGameStage] = useState<PreferenceGameStage>("cover");
  const [preferenceVoterIdx, setPreferenceVoterIdx] = useState(0);
  const [preferenceVoteStep, setPreferenceVoteStep] = useState<PreferenceVoteStep>("handoff");
  const [preferenceVotes, setPreferenceVotes] = useState<(string | null)[]>(() =>
    MANDIOLA_PLAYERS.map(() => null)
  );
  const [preferenceChallenges, setPreferenceChallenges] = useState<PreferenceChallenge[]>([]);
  const [oracionStage, setOracionStage] = useState<OracionStage>("cover");
  const [oracionLineIdx, setOracionLineIdx] = useState(0);
  const [mandiolaQuestionIdx, setMandiolaQuestionIdx] = useState(0);
  const [mandiolaPhase, setMandiolaPhase] = useState<MandiolaPhase>("vote");
  const [mandiolaVotes, setMandiolaVotes] = useState<MandiolaVote[][]>(
    () => CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null))
  );
  const [mandiolaResolvedRounds, setMandiolaResolvedRounds] = useState<boolean[]>(
    () => CIERTO_BIOTTI_ITEMS.map(() => false)
  );
  const [mandiolaGiftRecipientByPlayer, setMandiolaGiftRecipientByPlayer] = useState<
    (string | null)[][]
  >(() => CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null)));
  const [mandiolaGiftPicker, setMandiolaGiftPicker] = useState<{
    roundIdx: number;
    giverIdx: number;
  } | null>(null);
  const [mandiolaShotAnnouncementByRound, setMandiolaShotAnnouncementByRound] = useState<
    (string | null)[]
  >(() => CIERTO_BIOTTI_ITEMS.map(() => null));
  const [noviaStage, setNoviaStage] = useState<NoviaGameStage>("cover");
  const [novioStage, setNovioStage] = useState<NovioStage>("intro");
  const [novioQuestionIdx, setNovioQuestionIdx] = useState(0);
  const [novioVoterIdx, setNovioVoterIdx] = useState(0);
  const [novioVoteStep, setNovioVoteStep] = useState<NovioVoteStep>("handoff");
  const [novioVotes, setNovioVotes] = useState<(number | null)[][]>(() =>
    NOVIO_QUESTIONS.map(() => NOVIO_PLAYERS.map(() => null))
  );
  const [novioConfesionIdx, setNovioConfesionIdx] = useState(0);
  const [manuelStage, setManuelStage] = useState<ManuelStage>("intro");
  const [manuelComodin, setManuelComodin] = useState<string | null>(null);
  const [manuelTeams, setManuelTeams] = useState<ManuelTeam[]>([]);
  const [manuelMatches, setManuelMatches] = useState<ManuelMatch[]>([]);
  const [manuelSorteoRevealed, setManuelSorteoRevealed] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const INTRO_VIDEO_URL = "/videos/vale/Introduccion.mp4";
  const BONUS_MATIAS_VIDEO_URL = "/videos/vale/video-bonus-matias.mp4";
  const BONUS_SAPELLI_VIDEO_URL = "/videos/vale/video-bonus-sapelli.mp4";
  const BONUS_ACTIVITY_VIDEO_URL = "/videos/vale/video-bonus-celedon.mp4";

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
  const currentPreferenceVoterName = MANDIOLA_PLAYERS[preferenceVoterIdx];
  const currentPreferenceVote = preferenceVotes[preferenceVoterIdx];
  const isFirstPreferenceVoter = preferenceVoterIdx === 0;
  const isLastPreferenceVoter = preferenceVoterIdx === MANDIOLA_PLAYERS.length - 1;
  const allPreferenceVotesDone = preferenceVotes.every(Boolean);
  const preferenceVotesByWoman = useMemo(() => {
    const map: Record<string, string[]> = {};
    preferenceVotes.forEach((womanName, voterIdx) => {
      if (!womanName) return;
      if (!map[womanName]) map[womanName] = [];
      map[womanName].push(MANDIOLA_PLAYERS[voterIdx]);
    });
    return map;
  }, [preferenceVotes]);
  const currentOracionLine = ORACION_TEAM_LINES[oracionLineIdx];
  const isFirstOracionLine = oracionLineIdx === 0;
  const isLastOracionLine = oracionLineIdx === ORACION_TEAM_LINES.length - 1;
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
  const finalOutcome =
    overallAccuracy > 75
      ? {
          headline: "BIOTTI CAMPEÓN DEL JUEGO",
          badge: "Victoria del novio",
          summary: "Biotti superó el 75%: ganó el desafío.",
          consequence: "Regla: todos toman al seco.",
          accentClass:
            "border-emerald-300/45 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-cyan-400/10 text-emerald-100",
          badgeClass: "text-emerald-200",
        }
      : overallAccuracy >= 60
        ? {
            headline: "EMPATE ÉPICO",
            badge: "Empate técnico",
            summary: "Biotti quedó entre 60% y 75%.",
            consequence:
              'Regla: novio y todos toman "media" al seco.',
            accentClass:
              "border-amber-300/45 bg-gradient-to-r from-amber-500/20 via-orange-400/10 to-yellow-300/10 text-amber-100",
            badgeClass: "text-amber-200",
          }
        : {
            headline: "BIOTTI PERDIÓ EL DUELO",
            badge: "Novio perdedor",
            summary: "Biotti quedó bajo 60%.",
            consequence: "Regla: el novio mata el vaso al seco.",
            accentClass:
              "border-rose-300/45 bg-gradient-to-r from-rose-500/20 via-red-500/10 to-fuchsia-500/10 text-rose-100",
            badgeClass: "text-rose-200",
          };
  const currentMandiolaItem = CIERTO_BIOTTI_ITEMS[mandiolaQuestionIdx];
  const currentMandiolaVotes = mandiolaVotes[mandiolaQuestionIdx] ?? [];
  const currentMandiolaGifts = mandiolaGiftRecipientByPlayer[mandiolaQuestionIdx] ?? [];
  const currentMandiolaShotAnnouncement =
    mandiolaShotAnnouncementByRound[mandiolaQuestionIdx] ?? null;
  const mandiolaGiftPickerGiverName =
    mandiolaGiftPicker ? MANDIOLA_PLAYERS[mandiolaGiftPicker.giverIdx] : null;
  const mandiolaGiftPickerRecipientOptions = mandiolaGiftPickerGiverName
    ? MANDIOLA_PLAYERS.filter((player) => player !== mandiolaGiftPickerGiverName)
    : [];
  const allMandiolaVotesDone = currentMandiolaVotes.every((vote) => vote !== null);
  const currentNovioQuestion = NOVIO_QUESTIONS[novioQuestionIdx];
  const currentNovioVotes = novioVotes[novioQuestionIdx] ?? [];
  const currentNovioVoterName = NOVIO_PLAYERS[novioVoterIdx];
  const currentNovioSelection = currentNovioVotes[novioVoterIdx];
  const isLastNovioVoter = novioVoterIdx === NOVIO_PLAYERS.length - 1;
  const isLastNovioQuestion = novioQuestionIdx === NOVIO_QUESTIONS.length - 1;
  const currentNovioConfesion = NOVIO_CONFESIONES[novioConfesionIdx];
  const isLastNovioConfesion = novioConfesionIdx === NOVIO_CONFESIONES.length - 1;
  const novioPlayerStats = useMemo(() => {
    const stats = NOVIO_PLAYERS.map((playerName, playerIdx) => {
      let correct = 0;
      let wrong = 0;
      NOVIO_QUESTIONS.forEach((question, questionIdx) => {
        const vote = novioVotes[questionIdx]?.[playerIdx];
        if (vote === null || vote === undefined) return;
        if (vote === question.correctOptionIdx) correct += 1;
        else wrong += 1;
      });
      return { playerName, correct, wrong, total: correct - wrong };
    });
    return stats.sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      if (a.wrong !== b.wrong) return a.wrong - b.wrong;
      return b.total - a.total;
    });
  }, [novioVotes]);
  const maxNovioCorrect = novioPlayerStats[0]?.correct ?? 0;
  const novioWinners = novioPlayerStats.filter((player) => player.correct === maxNovioCorrect);
  const novioLosers = novioPlayerStats.filter((player) => player.correct < maxNovioCorrect);
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
  const mandiolaGiftedCount = mandiolaGiftRecipientByPlayer.reduce(
    (acc, byRound) => acc + byRound.filter((recipient) => Boolean(recipient)).length,
    0
  );
  const mandiolaAvailableGiftShots = Math.max(0, mandiolaCorrectCount - mandiolaGiftedCount);
  const mandiolaPlayerStats = useMemo(() => {
    const stats = MANDIOLA_PLAYERS.map((playerName, playerIdx) => {
      let correct = 0;
      let wrong = 0;
      let gifted = 0;
      let received = 0;

      CIERTO_BIOTTI_ITEMS.forEach((item, roundIdx) => {
        if (!mandiolaResolvedRounds[roundIdx]) return;
        const vote = mandiolaVotes[roundIdx]?.[playerIdx];
        if (vote) {
          const didWin = item.isTrue ? vote === "true" : vote === "false";
          if (didWin) correct += 1;
          else wrong += 1;
        }
        const giftedTo = mandiolaGiftRecipientByPlayer[roundIdx]?.[playerIdx];
        if (giftedTo) gifted += 1;
        const receivedThisRound = mandiolaGiftRecipientByPlayer[roundIdx]?.filter(
          (name) => name === playerName
        ).length;
        received += receivedThisRound ?? 0;
      });

      const shotsToTake = wrong + received;
      const score = correct * 2 - wrong;
      return { playerName, correct, wrong, gifted, received, shotsToTake, score };
    });

    return stats.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correct !== a.correct) return b.correct - a.correct;
      return a.wrong - b.wrong;
    });
  }, [mandiolaResolvedRounds, mandiolaVotes, mandiolaGiftRecipientByPlayer]);
  const mandiolaTotalShotsToTake = mandiolaPlayerStats.reduce(
    (acc, player) => acc + player.shotsToTake,
    0
  );

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

  function resetOracionState() {
    setOracionStage("cover");
    setOracionLineIdx(0);
  }

  function resetBonusActivityState() {
    setBonusActivityStage("personajes");
  }

  function resetPreferenceGameState() {
    setPreferenceGameStage("cover");
    setPreferenceVoterIdx(0);
    setPreferenceVoteStep("handoff");
    setPreferenceVotes(MANDIOLA_PLAYERS.map(() => null));
    setPreferenceChallenges([]);
  }

  function resetMandiolaState() {
    setMandiolaQuestionIdx(0);
    setMandiolaPhase("vote");
    setMandiolaVotes(CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null)));
    setMandiolaResolvedRounds(CIERTO_BIOTTI_ITEMS.map(() => false));
    setMandiolaGiftRecipientByPlayer(CIERTO_BIOTTI_ITEMS.map(() => MANDIOLA_PLAYERS.map(() => null)));
    setMandiolaShotAnnouncementByRound(CIERTO_BIOTTI_ITEMS.map(() => null));
    setMandiolaGiftPicker(null);
  }

  function resetNovioActivityState() {
    setNovioStage("intro");
    setNovioQuestionIdx(0);
    setNovioVoterIdx(0);
    setNovioVoteStep("handoff");
    setNovioVotes(NOVIO_QUESTIONS.map(() => NOVIO_PLAYERS.map(() => null)));
    setNovioConfesionIdx(0);
  }

  function resetManuelState() {
    setManuelStage("intro");
    setManuelComodin(null);
    setManuelTeams([]);
    setManuelMatches([]);
    setManuelSorteoRevealed(0);
  }

  function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function onManuelSetComodin(player: string) {
    setManuelComodin(player);
    const remaining = shuffleArray(MANUEL_PLAYERS.filter((p) => p !== player));
    const teams: ManuelTeam[] = [
      { name: "Equipo A", players: [remaining[0], remaining[1]] },
      { name: "Equipo B", players: [remaining[2], remaining[3]] },
      { name: "Equipo C", players: [remaining[4], remaining[5]] },
      { name: "Equipo D", players: [remaining[6], remaining[7]] },
    ];
    setManuelTeams(teams);
    setManuelSorteoRevealed(0);
  }

  function onManuelSortearComodinRandom() {
    const randomIdx = Math.floor(Math.random() * MANUEL_PLAYERS.length);
    onManuelSetComodin(MANUEL_PLAYERS[randomIdx]);
  }

  function onManuelStartBracket() {
    const matches: ManuelMatch[] = [
      { id: "wr1-1", teamA: manuelTeams[0]?.name ?? null, teamB: manuelTeams[1]?.name ?? null, winner: null, phase: "winners-r1" },
      { id: "wr1-2", teamA: manuelTeams[2]?.name ?? null, teamB: manuelTeams[3]?.name ?? null, winner: null, phase: "winners-r1" },
      { id: "lr1", teamA: null, teamB: null, winner: null, phase: "losers-r1" },
      { id: "wf", teamA: null, teamB: null, winner: null, phase: "winners-final" },
      { id: "lf", teamA: null, teamB: null, winner: null, phase: "losers-final" },
      { id: "gf", teamA: null, teamB: null, winner: null, phase: "grand-final" },
    ];
    setManuelMatches(matches);
    setManuelStage("bracket");
  }

  function onManuelMarkWinner(matchId: string, winnerTeam: string) {
    setManuelMatches((prev) => {
      const next = prev.map((m) => ({ ...m }));
      const matchIdx = next.findIndex((m) => m.id === matchId);
      if (matchIdx === -1) return prev;
      next[matchIdx].winner = winnerTeam;

      const match = next[matchIdx];
      const loser = match.teamA === winnerTeam ? match.teamB : match.teamA;

      if (match.phase === "winners-r1") {
        const wr1First = next.find((m) => m.id === "wr1-1");
        const wr1Second = next.find((m) => m.id === "wr1-2");
        if (wr1First?.winner && wr1Second?.winner) {
          const wf = next.find((m) => m.id === "wf");
          if (wf) { wf.teamA = wr1First.winner; wf.teamB = wr1Second.winner; }
          const lr1 = next.find((m) => m.id === "lr1");
          if (lr1) {
            const loser1 = wr1First.teamA === wr1First.winner ? wr1First.teamB : wr1First.teamA;
            const loser2 = wr1Second.teamA === wr1Second.winner ? wr1Second.teamB : wr1Second.teamA;
            lr1.teamA = loser1;
            lr1.teamB = loser2;
          }
        }
      }

      if (match.phase === "winners-final") {
        const gf = next.find((m) => m.id === "gf");
        if (gf) gf.teamA = winnerTeam;
        const lf = next.find((m) => m.id === "lf");
        if (lf) lf.teamB = loser;
      }

      if (match.phase === "losers-r1") {
        const lf = next.find((m) => m.id === "lf");
        if (lf) lf.teamA = winnerTeam;
      }

      if (match.phase === "losers-final") {
        const gf = next.find((m) => m.id === "gf");
        if (gf) gf.teamB = winnerTeam;
      }

      return next;
    });
  }

  function getManuelTeamPlayers(teamName: string | null): string {
    if (!teamName) return "";
    const team = manuelTeams.find((t) => t.name === teamName);
    return team ? `${team.players[0]} + ${team.players[1]}` : teamName;
  }

  const manuelChampion = manuelMatches.find((m) => m.id === "gf")?.winner ?? null;
  const manuelRunnerUp = manuelChampion
    ? (manuelMatches.find((m) => m.id === "gf")?.teamA === manuelChampion
        ? manuelMatches.find((m) => m.id === "gf")?.teamB
        : manuelMatches.find((m) => m.id === "gf")?.teamA) ?? null
    : null;

  function resetActivityState(activityId: string) {
    if (activityId === "preguntas-novia") {
      resetPreguntasNoviaState();
      return;
    }
    if (activityId === "actividad-mandiola") {
      resetMandiolaState();
      return;
    }
    if (activityId === "oracion-equipo") {
      resetOracionState();
      return;
    }
    if (activityId === "bonus") {
      resetBonusActivityState();
      return;
    }
    if (activityId === "juego-preferencias") {
      resetPreferenceGameState();
      return;
    }
    if (activityId === "actividad-novio") {
      resetNovioActivityState();
      return;
    }
    if (activityId === "actividad-manuel") {
      resetManuelState();
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
    setMandiolaGiftPicker(null);
    setActiveActivityId(null);
  }

  function onRestartCurrentActivity() {
    if (!activeActivityId) return;
    setConfirmModal({
      message: "¿Seguro que quieres reiniciar esta actividad desde el principio?",
      onConfirm: () => {
        resetActivityState(activeActivityId);
        setConfirmModal(null);
      },
    });
  }

  function onOpenActivity(activityId: string) {
    const activity = ACTIVITIES.find((item) => item.id === activityId);
    if (!activity) return;

    if (!activity.requiresPassword) {
      if (activitySessionExists[activityId]) {
        setResumePromptFor(activityId);
      } else {
        openActivity(activityId, { restart: true });
      }
      return;
    }

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
    if (!activity.requiresPassword) return;

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

  function buildPreferenceChallenges() {
    const duplicated = Object.entries(preferenceVotesByWoman)
      .filter(([, voters]) => voters.length > 1)
      .map(([womanName, voters]) => ({
        womanName,
        contenders: voters,
        shotBid: 1,
        isLocked: false,
        winner: null,
      }));
    setPreferenceChallenges(duplicated);
  }

  function markPreferenceVote(womanName: string) {
    setPreferenceVotes((previous) => {
      const next = [...previous];
      next[preferenceVoterIdx] = womanName;
      return next;
    });
  }

  function onNextPreferenceStage() {
    if (preferenceVoteStep === "handoff") {
      setPreferenceVoteStep("vote");
      return;
    }
    if (!currentPreferenceVote) return;
    if (isLastPreferenceVoter) {
      buildPreferenceChallenges();
      setPreferenceGameStage("challenges");
      return;
    }
    setPreferenceVoterIdx((prev) => prev + 1);
    setPreferenceVoteStep("handoff");
  }

  function onPreviousPreferenceStage() {
    if (preferenceVoteStep === "vote") {
      setPreferenceVoteStep("handoff");
      return;
    }
    if (isFirstPreferenceVoter) {
      setPreferenceGameStage("cover");
      return;
    }
    setPreferenceVoterIdx((prev) => prev - 1);
    setPreferenceVoteStep("vote");
  }

  function onIncreaseChallengeBid(challengeIdx: number) {
    setPreferenceChallenges((previous) => {
      const next = [...previous];
      next[challengeIdx] = {
        ...next[challengeIdx],
        shotBid: next[challengeIdx].shotBid + 1,
      };
      return next;
    });
  }

  function onLockChallenge(challengeIdx: number) {
    setPreferenceChallenges((previous) => {
      const next = [...previous];
      next[challengeIdx] = {
        ...next[challengeIdx],
        isLocked: true,
      };
      return next;
    });
  }

  function onResetChallenge(challengeIdx: number) {
    setPreferenceChallenges((previous) => {
      const next = [...previous];
      next[challengeIdx] = {
        ...next[challengeIdx],
        shotBid: 1,
        isLocked: false,
        winner: null,
      };
      return next;
    });
  }

  function onPickChallengeWinner(challengeIdx: number, winnerName: string) {
    setPreferenceChallenges((previous) => {
      const next = [...previous];
      next[challengeIdx] = {
        ...next[challengeIdx],
        winner: winnerName,
      };
      return next;
    });
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

  function markNovioVote(optionIdx: number) {
    setNovioVotes((previous) => {
      const next = previous.map((byQuestion) => [...byQuestion]);
      next[novioQuestionIdx][novioVoterIdx] = optionIdx;
      return next;
    });
  }

  function onNextNovioStage() {
    if (novioStage === "intro") {
      setNovioStage("voting");
      setNovioQuestionIdx(0);
      setNovioVoterIdx(0);
      setNovioVoteStep("handoff");
      return;
    }

    if (novioStage === "voting") {
      if (novioVoteStep === "handoff") {
        setNovioVoteStep("vote");
        return;
      }

      if (currentNovioSelection === null || currentNovioSelection === undefined) return;

      if (isLastNovioVoter && isLastNovioQuestion) {
        setNovioStage("confesiones");
        setNovioConfesionIdx(0);
        return;
      }

      if (isLastNovioVoter) {
        setNovioQuestionIdx((prev) => prev + 1);
        setNovioVoterIdx(0);
        setNovioVoteStep("handoff");
        return;
      }

      setNovioVoterIdx((prev) => prev + 1);
      setNovioVoteStep("handoff");
      return;
    }

    if (novioStage === "confesiones") {
      if (isLastNovioConfesion) {
        setNovioStage("summary");
        return;
      }
      setNovioConfesionIdx((prev) => prev + 1);
    }
  }

  function onPreviousNovioStage() {
    if (novioStage === "intro") return;

    if (novioStage === "summary") {
      setNovioStage("confesiones");
      setNovioConfesionIdx(NOVIO_CONFESIONES.length - 1);
      return;
    }

    if (novioStage === "confesiones") {
      if (novioConfesionIdx > 0) {
        setNovioConfesionIdx((prev) => prev - 1);
        return;
      }
      setNovioStage("voting");
      setNovioQuestionIdx(NOVIO_QUESTIONS.length - 1);
      setNovioVoterIdx(NOVIO_PLAYERS.length - 1);
      setNovioVoteStep("vote");
      return;
    }

    if (novioVoteStep === "vote") {
      setNovioVoteStep("handoff");
      return;
    }

    if (novioVoterIdx > 0) {
      setNovioVoterIdx((prev) => prev - 1);
      setNovioVoteStep("vote");
      return;
    }

    if (novioQuestionIdx > 0) {
      setNovioQuestionIdx((prev) => prev - 1);
      setNovioVoterIdx(NOVIO_PLAYERS.length - 1);
      setNovioVoteStep("vote");
      return;
    }

    setNovioStage("intro");
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
    if (mandiolaPhase === "summary") {
      setMandiolaQuestionIdx(CIERTO_BIOTTI_ITEMS.length - 1);
      setMandiolaPhase("result");
      return;
    }
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
    if (mandiolaPhase === "result" && isLastMandiolaQuestion) {
      setMandiolaPhase("summary");
      return;
    }
    if (isLastMandiolaQuestion) return;
    setMandiolaQuestionIdx((prev) => prev + 1);
    setMandiolaPhase("vote");
  }

  function onOpenMandiolaGiftPicker(playerIdx: number) {
    if (mandiolaPhase !== "result") return;
    const playerName = MANDIOLA_PLAYERS[playerIdx];
    if (!currentMandiolaWinners.includes(playerName)) return;
    const existingRecipient = currentMandiolaGifts[playerIdx];
    if (!existingRecipient && mandiolaAvailableGiftShots <= 0) return;
    setMandiolaGiftPicker({ roundIdx: mandiolaQuestionIdx, giverIdx: playerIdx });
  }

  function onChooseMandiolaGiftRecipient(recipientName: string) {
    if (!mandiolaGiftPicker) return;
    const { roundIdx, giverIdx } = mandiolaGiftPicker;
    const existingRecipient = mandiolaGiftRecipientByPlayer[roundIdx]?.[giverIdx];
    if (!existingRecipient && mandiolaAvailableGiftShots <= 0) return;

    setMandiolaGiftRecipientByPlayer((previous) => {
      const next = previous.map((roundGifts) => [...roundGifts]);
      next[roundIdx][giverIdx] = recipientName;
      return next;
    });
    setMandiolaShotAnnouncementByRound((previous) => {
      const next = [...previous];
      next[roundIdx] = `${recipientName} TOMA UN SHOT`;
      return next;
    });
    setMandiolaGiftPicker(null);
  }

  return (
    <section id="activities" className="relative py-20 px-4 overflow-hidden">
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
          {ACTIVITIES.filter((activity) => activity.requiresPassword).length} juegos con
          contraseña + {ACTIVITIES.filter((activity) => !activity.requiresPassword).length} actividad abierta + horario oficial
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {ACTIVITIES.map((activity, index) => {
            const Icon = activity.icon;
            const isUnlocked = !activity.requiresPassword || Boolean(unlocked[activity.id]);
            const isLastCard = index === ACTIVITIES.length - 1;
            const hasOddCards = ACTIVITIES.length % 2 !== 0;
            return (
              <motion.button
                key={activity.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                onClick={() => onOpenActivity(activity.id)}
                className={cn(
                  "group glass-card rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10",
                  activity.borderClass,
                  hasOddCards && isLastCard && "sm:col-span-2"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                    <Icon className={cn("h-5 w-5", activity.accentClass)} />
                  </div>
                  {isUnlocked ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-300 shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-white/60 shrink-0" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-2xl text-white group-hover:text-white">{activity.title}</h3>
                <p className="mt-1 text-sm text-white/65 font-body">{activity.subtitle}</p>

                <div className="mt-3 grid grid-cols-1 gap-1.5">
                  <div className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-miami-blue shrink-0" />
                    <p className="text-xs sm:text-sm text-white/85 font-body">{activity.day}</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-amber-200 shrink-0" />
                    <p className="text-xs sm:text-sm text-white/85 font-body">{activity.time}</p>
                  </div>
                </div>
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
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={closePasswordModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-fuchsia-300/35 shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-45"
                src="/videos/access-loop.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-fuchsia-950/55 to-sky-950/70" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full border border-fuchsia-300/20"
                animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full border border-cyan-300/20"
                animate={{ rotate: -360, scale: [1, 1.06, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-fuchsia-200/85 font-mono">
                      Protocolo seguro activado
                    </p>
                    <h3 className="mt-2 font-display text-4xl sm:text-5xl text-white leading-none">
                      Archivo Clasificado
                    </h3>
                    <p className="mt-1 font-display text-2xl sm:text-3xl text-fuchsia-300 [text-shadow:0_0_15px_rgba(222,91,255,0.5)]">
                      DESPEDIDA BIOTTI
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/85 hover:bg-black/55"
                    aria-label="Cerrar modal de contraseña"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <motion.div
                  className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4"
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs font-mono uppercase tracking-[0.24em] text-rose-200/90 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" />
                    Contenido secreto bloqueado
                  </p>
                  <p className="mt-2 font-body text-white text-base sm:text-lg">
                    Faltan solo <span className="text-amber-200 font-semibold">2 días</span>. Ingresa la clave para desbloquear la misión.
                  </p>
                </motion.div>

                <div className="mt-4 relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-miami-blue" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(event) => {
                      setPasswordInput(event.target.value);
                      setPasswordError("");
                    }}
                    className="w-full rounded-xl border border-white/25 bg-black/35 pl-10 pr-4 py-3.5 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
                    placeholder="Clave de acceso"
                    autoFocus
                  />
                </div>
                {passwordError && (
                  <p className="mt-2 text-rose-300 text-sm font-body">{passwordError}</p>
                )}
                <button
                  type="button"
                  onClick={onValidatePassword}
                  className="mt-5 w-full rounded-xl border border-cyan-300/55 bg-gradient-to-r from-cyan-400/25 via-miami-blue/20 to-fuchsia-400/20 px-4 py-3 text-cyan-200 font-display text-xl tracking-wider hover:brightness-125 transition-all"
                >
                  DESBLOQUEAR BÓVEDA
                </button>
              </div>
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
                      <p className="font-display text-xl text-amber-200">{mandiolaTotalShotsToTake}</p>
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
                    {mandiolaPhase !== "summary" && (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-display text-2xl text-white">{currentMandiolaItem.title}</h4>
                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-white/70">
                            Pregunta {mandiolaQuestionIdx + 1} / {CIERTO_BIOTTI_ITEMS.length}
                          </span>
                        </div>
                        <p className="mt-2 text-white/85 font-body text-sm leading-relaxed">
                          {currentMandiolaItem.story}
                        </p>
                      </>
                    )}

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
                    ) : mandiolaPhase === "result" ? (
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
                                currentMandiolaWinners.map((player) => {
                                  const playerIdx = MANDIOLA_PLAYERS.indexOf(player);
                                  const recipient = currentMandiolaGifts[playerIdx];
                                  const canGift =
                                    Boolean(recipient) || mandiolaAvailableGiftShots > 0;
                                  return (
                                    <button
                                      key={player}
                                      type="button"
                                      onClick={() => onOpenMandiolaGiftPicker(playerIdx)}
                                      disabled={!canGift}
                                      className={cn(
                                        "rounded-full border px-2.5 py-1 text-xs font-body transition-colors",
                                        recipient
                                          ? "border-emerald-200/70 bg-emerald-500/35 text-emerald-50"
                                          : "border-emerald-200/45 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30",
                                        !canGift && "opacity-45 cursor-not-allowed"
                                      )}
                                    >
                                      {recipient ? `${player} → ${recipient}` : player}
                                    </button>
                                  );
                                })
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
                        {currentMandiolaShotAnnouncement && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-4 sm:p-6 text-center"
                          >
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/85">
                              Shot asignado
                            </p>
                            <h4 className="mt-2 font-display text-3xl sm:text-4xl text-amber-100">
                              {currentMandiolaShotAnnouncement}
                            </h4>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-miami-blue/30 bg-miami-blue/10 p-4 sm:p-5">
                          <p className="text-xs font-mono uppercase tracking-[0.2em] text-miami-blue">
                            Cierre final de la trivia
                          </p>
                          <h4 className="mt-2 font-display text-3xl sm:text-4xl text-white">
                            Ranking + castigos del equipo
                          </h4>
                          <p className="mt-2 text-sm sm:text-base text-white/75 font-body">
                            Resultado completo de la Actividad Mandiola con puntaje y shots por persona.
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-center">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-200/85">
                              Aciertos
                            </p>
                            <p className="font-display text-xl text-emerald-200">{mandiolaCorrectCount}</p>
                          </div>
                          <div className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-3 py-2 text-center">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-rose-200/85">
                              Errores
                            </p>
                            <p className="font-display text-xl text-rose-200">{mandiolaWrongCount}</p>
                          </div>
                          <div className="rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-3 py-2 text-center">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-fuchsia-200/85">
                              Shots regalados
                            </p>
                            <p className="font-display text-xl text-fuchsia-200">{mandiolaGiftedCount}</p>
                          </div>
                          <div className="rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-center">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-amber-200/85">
                              Shots totales a tomar
                            </p>
                            <p className="font-display text-xl text-amber-200">{mandiolaTotalShotsToTake}</p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/20 bg-white/5 p-3 sm:p-4">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/65 mb-3">
                            Ranking por puntaje
                          </p>
                          <div className="space-y-2">
                            {mandiolaPlayerStats.map((player, index) => (
                              <div
                                key={`rank-${player.playerName}`}
                                className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono",
                                      index === 0
                                        ? "bg-amber-400/30 text-amber-100 border border-amber-300/50"
                                        : index === 1
                                          ? "bg-slate-200/20 text-slate-100 border border-slate-200/40"
                                          : index === 2
                                            ? "bg-orange-400/25 text-orange-100 border border-orange-300/45"
                                            : "bg-white/10 text-white/75 border border-white/20"
                                    )}
                                  >
                                    {index + 1}
                                  </span>
                                  <p className="text-white font-body">{player.playerName}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-body">
                                  <span className="rounded-full border border-emerald-300/35 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                                    +{player.correct}
                                  </span>
                                  <span className="rounded-full border border-rose-300/35 bg-rose-500/10 px-2 py-0.5 text-rose-200">
                                    -{player.wrong}
                                  </span>
                                  <span className="rounded-full border border-miami-blue/35 bg-miami-blue/10 px-2 py-0.5 text-miami-blue">
                                    Pts {player.score}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/20 bg-black/25 p-3 sm:p-4">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/65 mb-3">
                            Qué toma cada uno
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mandiolaPlayerStats.map((player) => (
                              <div
                                key={`shots-${player.playerName}`}
                                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 flex items-center justify-between gap-2"
                              >
                                <p className="text-white/90 font-body text-sm">{player.playerName}</p>
                                <p
                                  className={cn(
                                    "text-sm font-body",
                                    player.shotsToTake > 0 ? "text-rose-200" : "text-emerald-200"
                                  )}
                                >
                                  {player.shotsToTake > 0
                                    ? `${player.shotsToTake} shot${player.shotsToTake > 1 ? "s" : ""}`
                                    : "Libre"}
                                </p>
                              </div>
                            ))}
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
                          mandiolaPhase === "summary"
                        }
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                          (mandiolaPhase === "vote" && !allMandiolaVotesDone) ||
                            mandiolaPhase === "summary"
                            ? "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                            : "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                        )}
                      >
                        {mandiolaPhase === "vote"
                          ? "Siguiente"
                          : mandiolaPhase === "result" && isLastMandiolaQuestion
                            ? "Ver cierre final"
                          : mandiolaPhase === "summary"
                            ? "Cierre completado"
                          : isLastMandiolaQuestion
                            ? "Trivia completa"
                            : "Siguiente"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                </div>
              ) : activeActivity.id === "oracion-equipo" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4 sm:p-5">
                    <h3 className="font-display text-3xl sm:text-4xl text-white">Oración de equipo</h3>
                    <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                      Ritual guiado de brindis en formato líder/coro para encender al equipo antes de salir.
                    </p>
                  </div>

                  {oracionStage === "cover" ? (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-emerald-950/55 to-sky-950/70 p-5 sm:p-7">
                      <div className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4 sm:p-6">
                        <h4 className="font-display text-3xl sm:text-4xl text-white">Portada del ritual</h4>
                        <p className="mt-3 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          Cuenta la leyenda que, en un lugar de la Mancha llamado Franco 2x1,
                          Biotti empezó su carrera espiritual en formato cura del carrete.
                        </p>
                        <p className="mt-3 text-white/85 font-body text-sm sm:text-base leading-relaxed">
                          Por eso, en esta despedida recreamos una oración-brindis inspirada en
                          tradiciones universitarias nacidas en el siglo XIII, en Salamanca
                          (Castilla y León, España), adaptada al modo Floripa.
                        </p>
                        <div className="mt-4 rounded-xl border border-white/20 bg-black/20 px-4 py-3">
                          <p className="text-xs font-mono uppercase tracking-[0.18em] text-emerald-200/85">
                            Dinámica
                          </p>
                          <p className="mt-1 text-white/85 font-body text-sm">
                            BIOTTI - EL NOVIO DICE / TODOS DICEN. Un paso por vez, con coro
                            completo y brindis en alto.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setOracionStage("lines")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Comenzar oración
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : oracionStage === "lines" ? (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-emerald-950/60 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Verso {oracionLineIdx + 1} / {ORACION_TEAM_LINES.length}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] font-mono uppercase tracking-[0.18em] rounded-full border px-2 py-1",
                            currentOracionLine.speaker === "novio"
                              ? "border-emerald-300/45 bg-emerald-500/10 text-emerald-200"
                              : "border-fuchsia-300/45 bg-fuchsia-500/10 text-fuchsia-200"
                          )}
                        >
                          {currentOracionLine.speaker === "novio"
                            ? "BIOTTI - EL NOVIO DICE"
                            : "TODOS DICEN"}
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${oracionLineIdx}-${currentOracionLine.text}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "rounded-2xl border p-5 sm:p-7 text-center",
                            currentOracionLine.speaker === "novio"
                              ? "border-emerald-300/35 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10"
                              : "border-fuchsia-300/35 bg-gradient-to-r from-fuchsia-500/15 to-violet-500/10"
                          )}
                        >
                          <p className="font-display text-3xl sm:text-5xl text-white leading-tight">
                            {currentOracionLine.text}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (isFirstOracionLine) {
                              setOracionStage("cover");
                              return;
                            }
                            setOracionLineIdx((prev) => prev - 1);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isLastOracionLine) {
                              setOracionStage("final");
                              return;
                            }
                            setOracionLineIdx((prev) => prev + 1);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 font-body text-miami-blue hover:bg-miami-blue/25"
                        >
                          {isLastOracionLine ? "Ir al cierre" : "Siguiente"}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-3xl border border-amber-300/45 bg-gradient-to-br from-amber-900/40 via-fuchsia-900/30 to-sky-950/70 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl"
                        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl"
                        animate={{ x: [0, -35, 0], y: [0, -15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-2xl"
                        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <div className="relative z-10 rounded-2xl border border-amber-200/40 bg-black/20 p-4 sm:p-6 text-center">
                        <p className="text-xs font-mono uppercase tracking-[0.22em] text-amber-200/90">
                          Cierre de la oración
                        </p>
                        <motion.h4
                          className="mt-3 font-display text-5xl sm:text-7xl text-amber-100 [text-shadow:0_0_24px_rgba(255,200,90,0.45)]"
                          animate={{ scale: [1, 1.06, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          TODOS TOMAN
                        </motion.h4>
                        <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl">
                          {["🍻", "🥂", "🍻", "🥂", "🍻"].map((emoji, idx) => (
                            <motion.span
                              key={`brindis-${idx}`}
                              animate={{ y: [0, -8, 0], rotate: [0, idx % 2 ? -6 : 6, 0] }}
                              transition={{ duration: 1.1, repeat: Infinity, delay: idx * 0.12 }}
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                        <p className="mt-4 text-white/90 font-body text-base sm:text-lg">
                          Se cierra el ritual. Copas arriba y brindis total del equipo.
                        </p>
                      </div>

                      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setOracionStage("lines");
                            setOracionLineIdx(ORACION_TEAM_LINES.length - 1);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={resetOracionState}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/55 bg-fuchsia-500/15 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/25"
                        >
                          Reiniciar oración
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeActivity.id === "bonus" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-4 sm:p-5">
                    <h3 className="font-display text-3xl sm:text-4xl text-white">BONUS ESPECIAL</h3>
                    <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                      Secuencia final de 7 etapas con saludos especiales y cierre de brindis.
                    </p>
                  </div>

                  {bonusActivityStage === "personajes" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-fuchsia-950/60 to-sky-950/70 p-5 sm:p-7">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-6 sm:p-8 text-center"
                      >
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                          Etapa 1
                        </p>
                        <motion.h4
                          className="mt-3 font-display text-3xl sm:text-5xl text-fuchsia-100 leading-tight"
                          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.02, 1] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          Tenemos un par de personajes que te quieren saludar desde lejos.
                        </motion.h4>
                      </motion.div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video-matias")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "video-matias" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-slate-950/75 p-4 sm:p-6">
                      <p className="mb-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                        Etapa 2
                      </p>
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-black/40 p-3">
                        <video
                          controls
                          src={BONUS_MATIAS_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("personajes")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("veneco")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "veneco" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-fuchsia-950/60 to-sky-950/70 p-5 sm:p-7">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-6 sm:p-8 text-center"
                      >
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                          Etapa 3
                        </p>
                        <motion.h4
                          className="mt-3 font-display text-3xl sm:text-5xl text-fuchsia-100 leading-tight"
                          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.02, 1] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          Y de este pelao veneco:
                        </motion.h4>
                      </motion.div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video-matias")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video-sapelli")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "video-sapelli" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-slate-950/75 p-4 sm:p-6">
                      <p className="mb-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                        Etapa 4
                      </p>
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-black/40 p-3">
                        <video
                          controls
                          src={BONUS_SAPELLI_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("veneco")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("intro")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "intro" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-fuchsia-950/60 to-sky-950/70 p-5 sm:p-7">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-6 sm:p-8 text-center"
                      >
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                          Etapa 5
                        </p>
                        <motion.h4
                          className="mt-3 font-display text-4xl sm:text-6xl text-fuchsia-100 leading-tight"
                          animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.03, 1] }}
                          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                        >
                          Y TENEMOS UN SALUDO MUY ESPECIAL......
                        </motion.h4>
                      </motion.div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video-sapelli")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "video" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-slate-950/75 p-4 sm:p-6">
                      <p className="mb-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-fuchsia-200/85">
                        Etapa 6
                      </p>
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-black/40 p-3">
                        <video
                          controls
                          src={BONUS_ACTIVITY_VIDEO_URL}
                          className="w-full rounded-xl max-h-[460px] bg-black"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("intro")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("final")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {bonusActivityStage === "final" && (
                    <div className="relative overflow-hidden rounded-3xl border border-amber-300/45 bg-gradient-to-br from-amber-900/40 via-fuchsia-900/35 to-sky-950/70 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl"
                        animate={{ x: [0, 35, 0], y: [0, 20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl"
                        animate={{ x: [0, -30, 0], y: [0, -10, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="relative z-10 rounded-2xl border border-amber-200/40 bg-black/20 p-6 sm:p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.45 }}
                      >
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/90">
                          Etapa 7
                        </p>
                        <motion.h4
                          className="mt-3 font-display text-5xl sm:text-7xl text-amber-100 [text-shadow:0_0_22px_rgba(255,206,90,0.45)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.45, 1, 0.7, 1], scale: [0.92, 1.03, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          ¡ TODOS TOMAN !
                        </motion.h4>
                        <div className="mt-4 flex items-center justify-center gap-2 text-3xl sm:text-4xl">
                          {["🍻", "🥂", "🍻", "🥂"].map((emoji, idx) => (
                            <motion.span
                              key={`bonus-toast-${idx}`}
                              animate={{ y: [0, -7, 0], rotate: [0, idx % 2 ? -8 : 8, 0] }}
                              transition={{ duration: 1.1, repeat: Infinity, delay: idx * 0.15 }}
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>

                      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("video")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusActivityStage("personajes")}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                        >
                          Reiniciar bonus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeActivity.id === "actividad-novio" ? (
                <div className="space-y-4">
                  {novioStage === "intro" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-rose-950/65 via-fuchsia-950/55 to-sky-950/75 p-5 sm:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.4)]">
                      <div className="rounded-2xl border border-rose-300/35 bg-rose-500/10 p-5 sm:p-6">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-200/90">
                          Actividad del novio
                        </p>
                        <h4 className="mt-3 font-display text-4xl sm:text-5xl text-white leading-tight">
                          Despedida: versión sin censura
                        </h4>
                        <p className="mt-4 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          {NOVIO_INTRO_TEXT}
                        </p>
                        <div className="mt-4 rounded-xl border border-amber-300/35 bg-amber-500/10 px-4 py-3">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-amber-200/90">
                            Dinámica por etapas
                          </p>
                          <p className="mt-1 text-sm text-white/85 font-body">
                            Pregunta &gt; pasa celular &gt; vota jugador &gt; siguiente jugador
                            (modo impostor).
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onNextNovioStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-300/55 bg-gradient-to-r from-rose-500/20 via-fuchsia-500/15 to-amber-500/15 px-4 py-2 text-rose-100 font-body font-semibold hover:brightness-110"
                        >
                          Empezar encuesta
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {novioStage === "voting" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/75 to-rose-950/55 p-4 sm:p-6 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/70">
                          Pregunta {novioQuestionIdx + 1} / {NOVIO_QUESTIONS.length}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-fuchsia-200 rounded-full border border-fuchsia-300/35 bg-fuchsia-500/10 px-2 py-1">
                          Jugador {novioVoterIdx + 1} / {NOVIO_PLAYERS.length}
                        </span>
                      </div>

                      <div className="mt-3 rounded-2xl border border-white/20 bg-black/25 p-4">
                        <h4 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                          {currentNovioQuestion.question}
                        </h4>
                      </div>

                      {currentNovioQuestion.imageUrl && (
                        <div className={cn(
                          "mt-3 rounded-2xl border border-white/15 bg-black/25 p-2",
                          Array.isArray(currentNovioQuestion.imageUrl) && currentNovioQuestion.imageUrl.length > 1
                            ? "grid grid-cols-2 gap-2"
                            : ""
                        )}>
                          {(Array.isArray(currentNovioQuestion.imageUrl)
                            ? currentNovioQuestion.imageUrl
                            : [currentNovioQuestion.imageUrl]
                          ).map((url, imgIdx) => (
                            <img
                              key={`novio-img-${novioQuestionIdx}-${imgIdx}`}
                              src={url}
                              alt={`Imagen ${imgIdx + 1} de la ${currentNovioQuestion.question}`}
                              className="w-full max-h-[320px] object-contain rounded-xl bg-black/45"
                            />
                          ))}
                        </div>
                      )}

                      {novioVoteStep === "handoff" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-6 sm:p-7 text-center"
                        >
                          <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/90">
                            Modo impostor
                          </p>
                          <h5 className="mt-3 font-display text-4xl sm:text-5xl text-amber-100">
                            Pasa el celular a {currentNovioVoterName}
                          </h5>
                        </motion.div>
                      ) : (
                        <div className="mt-4">
                          <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-4 py-3">
                            <p className="text-sm sm:text-base text-white/90 font-body">
                              {currentNovioVoterName}, vota una alternativa.
                            </p>
                          </div>
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {currentNovioQuestion.options.map((option, optionIdx) => (
                              <button
                                key={`novio-option-${novioQuestionIdx}-${optionIdx}`}
                                type="button"
                                onClick={() => markNovioVote(optionIdx)}
                                className={cn(
                                  "rounded-xl border px-4 py-3 text-left font-body text-sm sm:text-base transition-colors",
                                  currentNovioSelection === optionIdx
                                    ? "border-rose-300/65 bg-rose-500/20 text-rose-100"
                                    : "border-white/20 bg-white/5 text-white/85 hover:bg-white/10"
                                )}
                              >
                                <span className="font-semibold text-white/95 mr-1">
                                  Alternativa {optionIdx + 1} -
                                </span>
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={onPreviousNovioStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onNextNovioStage}
                          disabled={
                            novioVoteStep === "vote" &&
                            (currentNovioSelection === null || currentNovioSelection === undefined)
                          }
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body transition-colors",
                            novioVoteStep === "vote" &&
                              (currentNovioSelection === null ||
                                currentNovioSelection === undefined)
                              ? "border-white/20 bg-white/5 text-white/45 cursor-not-allowed"
                              : "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                          )}
                        >
                          {novioVoteStep === "handoff"
                            ? "Jugador listo"
                            : isLastNovioVoter
                              ? isLastNovioQuestion
                                ? "Ir a confesiones"
                                : "Siguiente pregunta"
                              : "Siguiente jugador"}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {novioStage === "confesiones" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-zinc-900/75 to-fuchsia-950/60 p-5 sm:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
                      <p className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                        Segunda parte · confesionario {novioConfesionIdx + 1} /{" "}
                        {NOVIO_CONFESIONES.length}
                      </p>
                      <div className="mt-3 rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-4 sm:p-5">
                        <h4 className="font-display text-3xl sm:text-4xl text-white">
                          {currentNovioConfesion.player}
                        </h4>
                        <p className="mt-3 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          {currentNovioConfesion.prompt}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={onPreviousNovioStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onNextNovioStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                        >
                          {isLastNovioConfesion ? "Ver resultados" : "Siguiente confesión"}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {novioStage === "summary" && (
                    <div className="rounded-3xl border border-emerald-300/35 bg-gradient-to-br from-emerald-900/30 via-sky-950/75 to-slate-950/75 p-5 sm:p-7">
                      <h4 className="font-display text-4xl sm:text-5xl text-white">
                        Resultados finales
                      </h4>
                      <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                        Ranking de precisión del modo impostor y cierre de ganadores/perdedores.
                      </p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-200/90">
                            Ganadores
                          </p>
                          <div className="mt-2 space-y-2">
                            {novioWinners.map((winner) => (
                              <div
                                key={`novio-winner-${winner.playerName}`}
                                className="rounded-xl border border-emerald-200/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100 font-body"
                              >
                                <span className="font-semibold">{winner.playerName}</span> ·{" "}
                                {winner.correct} aciertos
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-rose-300/35 bg-rose-500/10 p-4">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-rose-200/90">
                            Perdedores
                          </p>
                          <div className="mt-2 space-y-2">
                            {novioLosers.length > 0 ? (
                              novioLosers.map((loser) => (
                                <div
                                  key={`novio-loser-${loser.playerName}`}
                                  className="rounded-xl border border-rose-200/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100 font-body"
                                >
                                  <span className="font-semibold">{loser.playerName}</span> ·{" "}
                                  {loser.correct} aciertos
                                </div>
                              ))
                            ) : (
                              <div className="rounded-xl border border-rose-200/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100 font-body">
                                Nadie quedó abajo. Todos empataron arriba.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/20 bg-black/25">
                        <table className="min-w-[640px] w-full text-left">
                          <thead>
                            <tr className="border-b border-white/20 bg-white/10">
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                Puesto
                              </th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                Jugador
                              </th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                Aciertos
                              </th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                Errores
                              </th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                Castigo
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {novioPlayerStats.map((player, idx) => {
                              const totalPlayers = novioPlayerStats.length;
                              const reverseIdx = totalPlayers - 1 - idx;
                              let castigo = "";
                              if (idx < 3) {
                                const shotsToGive = 3 - idx;
                                castigo = `Reparte ${shotsToGive} shot${shotsToGive > 1 ? "s" : ""}`;
                              } else if (reverseIdx < 3) {
                                const shotsToTake = 3 - reverseIdx;
                                castigo = `Toma ${shotsToTake} shot${shotsToTake > 1 ? "s" : ""}`;
                              }
                              return (
                              <tr key={`novio-summary-${player.playerName}`} className="border-b border-white/10">
                                <td className="px-3 py-2 text-sm text-white/85 font-body">#{idx + 1}</td>
                                <td className="px-3 py-2 text-sm text-white font-semibold font-body">
                                  {player.playerName}
                                </td>
                                <td className="px-3 py-2 text-sm text-emerald-200 font-body">
                                  {player.correct}
                                </td>
                                <td className="px-3 py-2 text-sm text-rose-200 font-body">{player.wrong}</td>
                                <td className={cn(
                                  "px-3 py-2 text-sm font-body font-semibold",
                                  idx < 3 ? "text-cyan-200" : reverseIdx < 3 ? "text-amber-200" : "text-white/50"
                                )}>
                                  {castigo || "—"}
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={onPreviousNovioStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={resetNovioActivityState}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                        >
                          Reiniciar juego
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeActivity.id === "juego-preferencias" ? (
                <div className="space-y-4">
                  {preferenceGameStage === "cover" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-sky-950/75 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-5 sm:p-6">
                        <h4 className="font-display text-3xl sm:text-4xl text-white">
                          Juego de preferencias
                        </h4>
                        <p className="mt-3 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          Todos tienen 5 minutos para votar su preferida. Si dos o mas eligen a la
                          misma, se activa el desafio de shots por apuesta escalada.
                        </p>
                        <p className="mt-3 text-white/85 font-body text-sm sm:text-base leading-relaxed">
                          Dinamica: se pasa el telefono integrante por integrante, votan, y luego
                          se resuelven duelos por coincidencias con ganador oficial.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferenceGameStage("voting")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Empezar votacion
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {preferenceGameStage === "voting" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-fuchsia-950/60 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Votante {preferenceVoterIdx + 1} / {MANDIOLA_PLAYERS.length}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-fuchsia-200 rounded-full border border-fuchsia-300/40 bg-fuchsia-500/10 px-2 py-1">
                          {preferenceVoteStep === "handoff" ? "pasa el telefono" : "votacion"}
                        </span>
                      </div>

                      {preferenceVoteStep === "handoff" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-6 sm:p-8 text-center"
                        >
                          <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/85">
                            Preparacion
                          </p>
                          <h4 className="mt-3 font-display text-4xl sm:text-5xl text-amber-100">
                            Pasa el telefono a {currentPreferenceVoterName}
                          </h4>
                        </motion.div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-4">
                            <p className="text-white/85 font-body text-sm sm:text-base">
                              {currentPreferenceVoterName} vota su preferida.
                            </p>
                          </div>
                          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/20 bg-black/25">
                            <table className="min-w-[760px] w-full text-left">
                              <thead>
                                <tr className="border-b border-white/20 bg-white/10">
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Nombre
                                  </th>
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Cara
                                  </th>
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Culo
                                  </th>
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Tetas
                                  </th>
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Promedio
                                  </th>
                                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                    Descripción
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {PREFERENCE_WOMEN.map((woman) => (
                                  <tr
                                    key={`table-${woman.name}`}
                                    className={cn(
                                      "border-b border-white/10",
                                      currentPreferenceVote === woman.name
                                        ? "bg-fuchsia-500/15"
                                        : "bg-transparent"
                                    )}
                                  >
                                    <td className="px-3 py-2 text-sm text-white font-semibold">
                                      {woman.name}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.cara}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.culo}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.tetas}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.promedio}</td>
                                    <td className="px-3 py-2 text-sm text-white/80">{woman.descripcion}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PREFERENCE_WOMEN.map((woman) => (
                              <button
                                key={`woman-pref-${woman.name}`}
                                type="button"
                                onClick={() => markPreferenceVote(woman.name)}
                                className={cn(
                                  "rounded-xl border px-3 py-2 text-left text-sm font-body transition-colors",
                                  currentPreferenceVote === woman.name
                                    ? "border-fuchsia-300/70 bg-fuchsia-500/25 text-fuchsia-100"
                                    : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                )}
                              >
                                {woman.name}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={onPreviousPreferenceStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onNextPreferenceStage}
                          disabled={preferenceVoteStep === "vote" && !currentPreferenceVote}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                            preferenceVoteStep === "vote" && !currentPreferenceVote
                              ? "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                              : "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                          )}
                        >
                          {preferenceVoteStep === "handoff"
                            ? "Ir a votar"
                            : isLastPreferenceVoter
                              ? "Ver desafios"
                              : "Siguiente integrante"}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {preferenceGameStage === "challenges" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-rose-950/55 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <h4 className="font-display text-3xl sm:text-4xl text-white">
                        Desafio de shots por coincidencias
                      </h4>
                      <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                        Suban apuesta, cierren duelo con “te creo” y marquen ganador por tarjeta.
                      </p>

                      <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3">
                        <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/65 mb-2">
                          Resumen de votos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(preferenceVotesByWoman).map(([womanName, voters]) => (
                            <span
                              key={`summary-pref-${womanName}`}
                              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/85 font-body"
                            >
                              {womanName}: {voters.join(", ")}
                            </span>
                          ))}
                        </div>
                      </div>

                      {preferenceChallenges.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4 text-center">
                          <p className="font-display text-2xl text-emerald-100">
                            Sin coincidencias, no hay duelo
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {preferenceChallenges.map((challenge, challengeIdx) => (
                            <div
                              key={`challenge-pref-${challenge.womanName}-${challengeIdx}`}
                              className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4"
                            >
                              <p className="text-xs font-mono uppercase tracking-[0.16em] text-amber-200/85">
                                Coincidencia: {challenge.womanName}
                              </p>
                              <p className="mt-2 text-white/90 font-body text-sm">
                                Contendientes: {challenge.contenders.join(" vs ")}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-white/85 font-body">
                                  Apuesta actual: {challenge.shotBid} shot
                                  {challenge.shotBid > 1 ? "s" : ""}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onIncreaseChallengeBid(challengeIdx)}
                                  className="rounded-lg border border-fuchsia-300/45 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                                >
                                  Subir apuesta
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onLockChallenge(challengeIdx)}
                                  className="rounded-lg border border-miami-blue/45 bg-miami-blue/10 px-3 py-1 text-xs text-miami-blue font-body hover:bg-miami-blue/20"
                                >
                                  Te creo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onResetChallenge(challengeIdx)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300/45 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 font-body hover:bg-amber-500/20"
                                  aria-label="Reiniciar desafío"
                                  title="Reiniciar desafío"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  Reiniciar
                                </button>
                              </div>
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {challenge.contenders.map((contender) => (
                                  <button
                                    key={`winner-pref-${challenge.womanName}-${contender}`}
                                    type="button"
                                    onClick={() => onPickChallengeWinner(challengeIdx, contender)}
                                    className={cn(
                                      "rounded-xl border px-3 py-2 text-sm font-body",
                                      challenge.winner === contender
                                        ? "border-emerald-300/70 bg-emerald-500/25 text-emerald-100"
                                        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                    )}
                                  >
                                    Gana {contender}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 rounded-2xl border border-white/20 bg-black/25 p-3 sm:p-4">
                        <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/65 mb-3">
                          Tabla total con preferencias
                        </p>
                        <div className="overflow-x-auto rounded-xl border border-white/15">
                          <table className="min-w-[760px] w-full text-left">
                            <thead>
                              <tr className="border-b border-white/20 bg-white/10">
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Nombre
                                </th>
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Cara
                                </th>
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Culo
                                </th>
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Tetas
                                </th>
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Promedio
                                </th>
                                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">
                                  Votaron por ella
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {PREFERENCE_WOMEN.map((woman) => {
                                const voters = preferenceVotesByWoman[woman.name] ?? [];
                                return (
                                  <tr
                                    key={`total-pref-${woman.name}`}
                                    className="border-b border-white/10 bg-transparent"
                                  >
                                    <td className="px-3 py-2 text-sm text-white font-semibold">
                                      {woman.name}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.cara}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.culo}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.tetas}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">{woman.promedio}</td>
                                    <td className="px-3 py-2 text-sm text-white/85">
                                      {voters.length > 0 ? voters.join(", ") : "Sin votos"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setPreferenceGameStage("voting")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferenceGameStage("final")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                        >
                          Cerrar juego
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {preferenceGameStage === "final" && (
                    <div className="rounded-3xl border border-fuchsia-300/35 bg-gradient-to-br from-fuchsia-900/35 to-sky-950/70 p-5 sm:p-7 text-center">
                      <h4 className="font-display text-4xl sm:text-5xl text-white">
                        Juego de preferencias completo
                      </h4>
                      <p className="mt-3 text-white/80 font-body">
                        Votacion y desafios cerrados. Ya pueden pasar al siguiente bloque.
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setPreferenceGameStage("challenges")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={resetPreferenceGameState}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                        >
                          Reiniciar juego
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeActivity.id === "actividad-manuel" ? (
                <div className="space-y-4">
                  {manuelStage === "intro" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-amber-950/55 via-sky-950/70 to-slate-950/75 p-5 sm:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.4)]">
                      <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-5 sm:p-6">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/90">
                          Actividad Manuel
                        </p>
                        <h4 className="mt-3 font-display text-4xl sm:text-5xl text-white leading-tight">
                          Campeonato Spikeball
                        </h4>
                        <p className="mt-4 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          Torneo oficial de spikeball con formato de doble eliminación.
                          Se forman 4 parejas al azar + 1 comodín que puede entrar
                          por el jugador más cansado o reemplazando al perdedor con peor diferencia.
                        </p>
                        <div className="mt-4 rounded-xl border border-white/15 bg-black/20 px-4 py-3">
                          <p className="text-xs font-mono uppercase tracking-[0.16em] text-miami-blue/90">
                            Reglas
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-white/85 font-body list-disc list-inside">
                            <li>Partidos a 21 puntos</li>
                            <li>Winners Bracket + Losers Bracket</li>
                            <li>Grand Final: ganador de winners vs ganador de losers</li>
                            <li>El comodín entra cuando se necesite</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={closeActivityModal}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          onClick={() => setManuelStage("sorteo")}
                          className="inline-flex items-center gap-2 rounded-xl border border-amber-300/55 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/15 px-4 py-2 text-amber-100 font-body font-semibold hover:brightness-110"
                        >
                          Comenzar sorteo
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {manuelStage === "sorteo" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/75 to-amber-950/50 p-5 sm:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
                      {!manuelComodin ? (
                        <div>
                          <p className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                            Paso 1 · Definir comodín
                          </p>
                          <h4 className="mt-2 font-display text-3xl sm:text-4xl text-white">
                            ¿Quién será el comodín?
                          </h4>
                          <p className="mt-2 text-white/80 font-body text-sm">
                            Elige un voluntario o sortéalo al azar.
                          </p>
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {MANUEL_PLAYERS.map((player) => (
                              <button
                                key={`comodin-pick-${player}`}
                                type="button"
                                onClick={() => onManuelSetComodin(player)}
                                className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/85 font-body hover:bg-white/10 transition-colors"
                              >
                                {player}
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setManuelStage("intro")}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={onManuelSortearComodinRandom}
                              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/55 bg-fuchsia-500/15 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/25"
                            >
                              Sortear al azar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                            Paso 2 · Parejas sorteadas
                          </p>
                          <div className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4 text-center">
                            <p className="text-xs font-mono uppercase tracking-[0.16em] text-amber-200/85">
                              Comodín
                            </p>
                            <h5 className="mt-1 font-display text-3xl text-amber-100">{manuelComodin}</h5>
                          </div>
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {manuelTeams.map((team, teamIdx) => (
                              <motion.div
                                key={`team-${team.name}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={
                                  teamIdx < manuelSorteoRevealed
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 12 }
                                }
                                transition={{ duration: 0.35, delay: 0.1 }}
                                className="rounded-2xl border border-miami-blue/35 bg-miami-blue/10 p-4"
                              >
                                <p className="text-xs font-mono uppercase tracking-[0.16em] text-miami-blue/90">
                                  {team.name}
                                </p>
                                <p className="mt-2 text-white font-body font-semibold">
                                  {team.players[0]} + {team.players[1]}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => { setManuelComodin(null); setManuelTeams([]); setManuelSorteoRevealed(0); }}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                            >
                              Re-sortear
                            </button>
                            {manuelSorteoRevealed < manuelTeams.length ? (
                              <button
                                type="button"
                                onClick={() => setManuelSorteoRevealed((prev) => prev + 1)}
                                className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-miami-blue/15 px-4 py-2 text-miami-blue font-body hover:bg-miami-blue/25"
                              >
                                Revelar siguiente pareja
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={onManuelStartBracket}
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/55 bg-emerald-500/15 px-4 py-2 text-emerald-100 font-body hover:bg-emerald-500/25"
                              >
                                Comenzar torneo
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {manuelStage === "bracket" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/80 to-sky-950/70 p-4 sm:p-6 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
                      <h4 className="font-display text-3xl sm:text-4xl text-white">Bracket del torneo</h4>
                      <p className="mt-1 text-white/70 font-body text-sm">
                        Comodín: <span className="text-amber-200 font-semibold">{manuelComodin}</span> — entra por el más cansado o reemplaza al perdedor con peor diferencia.
                      </p>

                      <div className="mt-4 space-y-4">
                        {(["winners-r1", "losers-r1", "winners-final", "losers-final", "grand-final"] as ManuelMatchPhase[]).map((phase) => {
                          const phaseMatches = manuelMatches.filter((m) => m.phase === phase);
                          if (phaseMatches.length === 0) return null;
                          const phaseLabels: Record<ManuelMatchPhase, string> = {
                            "winners-r1": "Winners Ronda 1",
                            "winners-final": "Winners Final",
                            "losers-r1": "Losers Ronda 1",
                            "losers-final": "Losers Final",
                            "grand-final": "Grand Final",
                          };
                          const phaseColors: Record<ManuelMatchPhase, string> = {
                            "winners-r1": "border-miami-blue/35 bg-miami-blue/10",
                            "winners-final": "border-emerald-300/35 bg-emerald-500/10",
                            "losers-r1": "border-rose-300/35 bg-rose-500/10",
                            "losers-final": "border-amber-300/35 bg-amber-500/10",
                            "grand-final": "border-fuchsia-300/40 bg-fuchsia-500/15",
                          };
                          return (
                            <div key={`phase-${phase}`} className={cn("rounded-2xl border p-4", phaseColors[phase])}>
                              <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/75">
                                {phaseLabels[phase]}
                              </p>
                              <div className="mt-3 space-y-3">
                                {phaseMatches.map((match) => {
                                  const ready = match.teamA && match.teamB;
                                  return (
                                    <div key={match.id} className="rounded-xl border border-white/15 bg-black/20 p-3">
                                      {!ready ? (
                                        <p className="text-sm text-white/50 font-body">Esperando equipos...</p>
                                      ) : (
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                          <button
                                            type="button"
                                            disabled={!!match.winner}
                                            onClick={() => onManuelMarkWinner(match.id, match.teamA!)}
                                            className={cn(
                                              "flex-1 rounded-lg border px-3 py-2 text-sm font-body transition-colors",
                                              match.winner === match.teamA
                                                ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100 font-semibold"
                                                : match.winner
                                                  ? "border-white/10 bg-white/5 text-white/40"
                                                  : "border-white/25 bg-white/5 text-white/85 hover:bg-white/10"
                                            )}
                                          >
                                            {getManuelTeamPlayers(match.teamA)}
                                            {match.winner === match.teamA && " ✓"}
                                          </button>
                                          <span className="text-xs text-white/50 font-mono text-center">vs</span>
                                          <button
                                            type="button"
                                            disabled={!!match.winner}
                                            onClick={() => onManuelMarkWinner(match.id, match.teamB!)}
                                            className={cn(
                                              "flex-1 rounded-lg border px-3 py-2 text-sm font-body transition-colors",
                                              match.winner === match.teamB
                                                ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100 font-semibold"
                                                : match.winner
                                                  ? "border-white/10 bg-white/5 text-white/40"
                                                  : "border-white/25 bg-white/5 text-white/85 hover:bg-white/10"
                                            )}
                                          >
                                            {getManuelTeamPlayers(match.teamB)}
                                            {match.winner === match.teamB && " ✓"}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setManuelStage("sorteo")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        {manuelChampion && (
                          <button
                            type="button"
                            onClick={() => setManuelStage("final-screen")}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/55 bg-emerald-500/15 px-4 py-2 text-emerald-100 font-body hover:bg-emerald-500/25"
                          >
                            Ver campeón
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {manuelStage === "final-screen" && (
                    <div className="rounded-3xl border border-amber-300/40 bg-gradient-to-br from-amber-900/35 via-fuchsia-950/40 to-sky-950/70 p-5 sm:p-7 text-center">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/90">
                        Campeonato Spikeball
                      </p>
                      <motion.h4
                        className="mt-3 font-display text-5xl sm:text-7xl text-amber-100 [text-shadow:0_0_22px_rgba(255,206,90,0.4)]"
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {getManuelTeamPlayers(manuelChampion)}
                      </motion.h4>
                      <p className="mt-2 text-white/90 font-body text-lg">Campeones del torneo</p>
                      {manuelRunnerUp && (
                        <p className="mt-1 text-white/70 font-body text-sm">
                          Subcampeón: <span className="text-fuchsia-200 font-semibold">{getManuelTeamPlayers(manuelRunnerUp)}</span>
                        </p>
                      )}

                      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/20 bg-black/25 text-left">
                        <table className="min-w-[480px] w-full">
                          <thead>
                            <tr className="border-b border-white/20 bg-white/10">
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">Fase</th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">Enfrentamiento</th>
                              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/75">Ganador</th>
                            </tr>
                          </thead>
                          <tbody>
                            {manuelMatches.filter((m) => m.winner).map((match) => {
                              const phaseLabels: Record<ManuelMatchPhase, string> = {
                                "winners-r1": "Winners R1",
                                "winners-final": "Winners Final",
                                "losers-r1": "Losers R1",
                                "losers-final": "Losers Final",
                                "grand-final": "Grand Final",
                              };
                              return (
                                <tr key={`result-${match.id}`} className="border-b border-white/10">
                                  <td className="px-3 py-2 text-sm text-white/75 font-body">{phaseLabels[match.phase]}</td>
                                  <td className="px-3 py-2 text-sm text-white/85 font-body">{getManuelTeamPlayers(match.teamA)} vs {getManuelTeamPlayers(match.teamB)}</td>
                                  <td className="px-3 py-2 text-sm text-emerald-200 font-body font-semibold">{getManuelTeamPlayers(match.winner)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setManuelStage("bracket")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={resetManuelState}
                          className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                        >
                          Reiniciar torneo
                        </button>
                      </div>
                    </div>
                  )}
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

                  {noviaStage === "preferences-cover" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-950/65 to-sky-950/75 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-5 sm:p-6">
                        <h4 className="font-display text-3xl sm:text-4xl text-white">
                          Juego de preferencias
                        </h4>
                        <p className="mt-3 text-white/90 font-body text-sm sm:text-base leading-relaxed">
                          Ahora viene una votación express: cada integrante tendrá 5 minutos para
                          elegir su preferida entre las mujeres de la lista.
                        </p>
                        <p className="mt-3 text-white/85 font-body text-sm sm:text-base leading-relaxed">
                          Si dos o más votan por la misma, se activa el desafío de shots por
                          apuesta escalada (“yo puedo tomar 1, 2, 3...”) hasta que alguien diga
                          “te creo”. Luego se define el ganador del duelo.
                        </p>
                        <div className="mt-4 rounded-xl border border-white/20 bg-black/20 px-4 py-3">
                          <p className="text-xs font-mono uppercase tracking-[0.18em] text-fuchsia-200/85">
                            Flujo
                          </p>
                          <p className="mt-1 text-white/85 font-body text-sm">
                            Pasa el telefono a cada integrante -&gt; vota -&gt; detectar repetidos
                            -&gt; desafio de shots -&gt; ganador por tarjeta.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setNoviaStage("preferences-challenges");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("preferences-voting")}
                          className="inline-flex items-center gap-2 rounded-xl border border-miami-blue/55 bg-gradient-to-r from-miami-blue/30 to-cyan-400/20 px-4 py-2 text-miami-blue font-body font-semibold hover:brightness-110"
                        >
                          Empezar votacion
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "preferences-voting" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-fuchsia-950/60 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-white/65">
                          Votante {preferenceVoterIdx + 1} / {MANDIOLA_PLAYERS.length}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-fuchsia-200 rounded-full border border-fuchsia-300/40 bg-fuchsia-500/10 px-2 py-1">
                          {preferenceVoteStep === "handoff" ? "pasa el telefono" : "votacion"}
                        </span>
                      </div>

                      {preferenceVoteStep === "handoff" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-6 sm:p-8 text-center"
                        >
                          <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-200/85">
                            Preparacion
                          </p>
                          <h4 className="mt-3 font-display text-4xl sm:text-5xl text-amber-100">
                            Pasa el telefono a {currentPreferenceVoterName}
                          </h4>
                        </motion.div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-4">
                            <p className="text-white/85 font-body text-sm sm:text-base">
                              {currentPreferenceVoterName} vota su preferida.
                            </p>
                          </div>
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PREFERENCE_WOMEN.map((woman) => (
                              <button
                                key={`woman-${woman.name}`}
                                type="button"
                                onClick={() => markPreferenceVote(woman.name)}
                                className={cn(
                                  "rounded-xl border px-3 py-2 text-left text-sm font-body transition-colors",
                                  currentPreferenceVote === woman.name
                                    ? "border-fuchsia-300/70 bg-fuchsia-500/25 text-fuchsia-100"
                                    : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                )}
                              >
                                {woman.name}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={onPreviousPreferenceStage}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={onNextPreferenceStage}
                          disabled={preferenceVoteStep === "vote" && !currentPreferenceVote}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                            preferenceVoteStep === "vote" && !currentPreferenceVote
                              ? "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                              : "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                          )}
                        >
                          {preferenceVoteStep === "handoff"
                            ? "Ir a votar"
                            : isLastPreferenceVoter
                              ? "Ver desafios"
                              : "Siguiente integrante"}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {noviaStage === "preferences-challenges" && (
                    <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/70 to-rose-950/55 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <h4 className="font-display text-3xl sm:text-4xl text-white">
                        Desafio de shots por coincidencias
                      </h4>
                      <p className="mt-2 text-white/80 font-body text-sm sm:text-base">
                        Aqui se resuelven los votos repetidos. Suban apuesta y definan ganador por
                        tarjeta.
                      </p>

                      <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3">
                        <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/65 mb-2">
                          Resumen de votos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(preferenceVotesByWoman).map(([womanName, voters]) => (
                            <span
                              key={`summary-${womanName}`}
                              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/85 font-body"
                            >
                              {womanName}: {voters.join(", ")}
                            </span>
                          ))}
                        </div>
                      </div>

                      {preferenceChallenges.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4 text-center">
                          <p className="font-display text-2xl text-emerald-100">
                            Sin coincidencias, no hay duelo
                          </p>
                          <p className="mt-2 text-emerald-100/80 font-body text-sm">
                            Cada uno voto distinto. Equipo libre de desafio.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {preferenceChallenges.map((challenge, challengeIdx) => (
                            <div
                              key={`challenge-${challenge.womanName}-${challengeIdx}`}
                              className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4"
                            >
                              <p className="text-xs font-mono uppercase tracking-[0.16em] text-amber-200/85">
                                Coincidencia: {challenge.womanName}
                              </p>
                              <p className="mt-2 text-white/90 font-body text-sm">
                                Contendientes: {challenge.contenders.join(" vs ")}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-white/85 font-body">
                                  Apuesta actual: {challenge.shotBid} shot
                                  {challenge.shotBid > 1 ? "s" : ""}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onIncreaseChallengeBid(challengeIdx)}
                                  className="rounded-lg border border-fuchsia-300/45 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-100 font-body hover:bg-fuchsia-500/20"
                                >
                                  Subir apuesta
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onLockChallenge(challengeIdx)}
                                  className="rounded-lg border border-miami-blue/45 bg-miami-blue/10 px-3 py-1 text-xs text-miami-blue font-body hover:bg-miami-blue/20"
                                >
                                  Te creo
                                </button>
                              </div>
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {challenge.contenders.map((contender) => (
                                  <button
                                    key={`winner-${challenge.womanName}-${contender}`}
                                    type="button"
                                    onClick={() => onPickChallengeWinner(challengeIdx, contender)}
                                    className={cn(
                                      "rounded-xl border px-3 py-2 text-sm font-body",
                                      challenge.winner === contender
                                        ? "border-emerald-300/70 bg-emerald-500/25 text-emerald-100"
                                        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                                    )}
                                  >
                                    Gana {contender}
                                  </button>
                                ))}
                              </div>
                              {challenge.isLocked && (
                                <p className="mt-2 text-xs text-amber-100/90 font-body">
                                  Duelo cerrado: alguien acepto el reto con {challenge.shotBid} shot
                                  {challenge.shotBid > 1 ? "s" : ""}.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setNoviaStage("preferences-voting")}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoviaStage("bonus-track")}
                          disabled={!allPreferenceVotesDone}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-body",
                            allPreferenceVotesDone
                              ? "border-miami-blue/55 bg-miami-blue/15 text-miami-blue hover:bg-miami-blue/25"
                              : "border-white/15 bg-white/10 text-white/40 cursor-not-allowed"
                          )}
                        >
                          Ir a Bonus Track
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
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
                      className={cn(
                        "rounded-3xl border bg-gradient-to-br p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
                        overallAccuracy > 75 &&
                          "border-emerald-300/35 from-emerald-900/45 via-sky-950/70 to-black/75",
                        overallAccuracy >= 60 &&
                          overallAccuracy <= 75 &&
                          "border-amber-300/35 from-amber-900/45 via-sky-950/70 to-black/75",
                        overallAccuracy < 60 &&
                          "border-rose-300/35 from-rose-900/45 via-sky-950/70 to-black/75"
                      )}
                    >
                      <div className="rounded-2xl border border-white/20 bg-white/5 p-4 sm:p-5">
                        <p className={cn("text-xs font-mono uppercase tracking-[0.2em]", finalOutcome.badgeClass)}>
                          {finalOutcome.badge}
                        </p>
                        <h4 className="mt-2 font-display text-3xl sm:text-5xl text-white">
                          {finalOutcome.headline}
                        </h4>
                        <p className="mt-2 text-white/75 font-body text-sm sm:text-base">
                          Resultado oficial según precisión final del juego.
                        </p>
                      </div>

                      <div className={cn("mt-4 rounded-2xl border p-4 sm:p-5", finalOutcome.accentClass)}>
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] opacity-90">
                          Veredicto final
                        </p>
                        <p className="mt-1 font-display text-2xl sm:text-3xl">{finalOutcome.summary}</p>
                        <p className="mt-2 font-body text-sm sm:text-base">{finalOutcome.consequence}</p>
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
                          Precisión final: {overallAccuracy.toFixed(0)}%
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 font-body">
                          Shots estimados: {overallNoCount}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 font-body">
                          Estado: {overallAccuracy > 75 ? "ganó" : overallAccuracy >= 60 ? "empate" : "perdió"}
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

              <AnimatePresence>
                {mandiolaGiftPicker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1120] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                    onClick={() => setMandiolaGiftPicker(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      onClick={(event) => event.stopPropagation()}
                      className="w-full max-w-md rounded-2xl border border-white/25 glass-card p-6"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-2xl text-white">¿A quién le regalas?</h3>
                        <button
                          type="button"
                          onClick={() => setMandiolaGiftPicker(null)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/80 hover:bg-black/50"
                          aria-label="Cerrar modal de regalo de shot"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-white/75 font-body text-sm">
                        {mandiolaGiftPickerGiverName} elige quién toma un shot.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {mandiolaGiftPickerRecipientOptions.map((player) => (
                          <button
                            key={`gift-recipient-${player}`}
                            type="button"
                            onClick={() => onChooseMandiolaGiftRecipient(player)}
                            className="rounded-xl border border-fuchsia-300/40 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-100 font-body hover:bg-fuchsia-500/20 transition-colors"
                          >
                            {player}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/25 glass-card p-6"
            >
              <p className="text-white font-body text-base sm:text-lg leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white/85 font-body hover:bg-white/15 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="rounded-xl border border-rose-300/55 bg-rose-500/15 px-4 py-2 text-rose-100 font-body font-semibold hover:bg-rose-500/25 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

