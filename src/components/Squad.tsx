"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserCheck, X } from "lucide-react";

type CrewMember = {
  name: string;
  fullName: string;
  nickname: string;
  age: number;
  bio: string;
  photoUrl?: string;
  tag?: string;
  gold?: boolean;
};

const CREW: CrewMember[] = [
  {
    name: "Biotti",
    fullName: "Sebastián Biotti",
    nickname: "Benjamin Vicuña, Ricardo Arjona, Biotti, Ben10, Lula, Sebita",
    age: 31,
    bio: "El novio. Capitán de la misión Floripa y creador oficial del caos controlado.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776828295/biotti-floripa-2026/gallery/czqymndkwmzq4cathfdm.jpg",
    tag: "THE GROOM / EL OBJETIVO",
    gold: true,
  },
  {
    name: "Nacho",
    fullName: "Ignacio Rodríguez Yanine",
    nickname: "Nachorezha, Nacho",
    age: 31,
    bio: "Organizador de la despedida y creador de esta página. Siempre con plan B, plan C y logística al minuto.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776828867/biotti-floripa-2026/gallery/tczzueuwslouzjsd7gpw.jpg",
  },
  {
    name: "Manuel",
    fullName: "Manuel Catepillan",
    nickname: "Bolados, Manuel",
    age: 31,
    bio: "Experto en dinámicas de grupo y host oficial de la noche.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776828966/biotti-floripa-2026/gallery/k2sa01uihnc7i5dfggov.jpg",
  },
  {
    name: "Momo",
    fullName: "Jose Tomas Molino Niño Quesepeda",
    nickname: "Momo, Molina, Joseto, JT",
    age: 31,
    bio: "Motor de la logística y primer voluntario para cualquier locura.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829175/biotti-floripa-2026/gallery/ke5bcczq30sawrom2kw6.png",
  },
  {
    name: "Joaco Honorato",
    fullName: "Joaquín Honorato",
    nickname: "Joaco, honorato",
    age: 31,
    bio: "Encargado de buena vibra y scouting de spots para el grupo.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829603/biotti-floripa-2026/gallery/iggpty2qky1cidycrrwf.png",
  },
  {
    name: "Javier Vargas",
    fullName: "Javier Vargas",
    nickname: "Vargas",
    age: 31,
    bio: "Controla el tempo del equipo, dentro y fuera de la cancha.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829375/biotti-floripa-2026/gallery/aoijt4xx1h9e14cx3eyt.png",
  },
  {
    name: "Mandiola",
    fullName: "Mandiola",
    nickname: "Mando Prime",
    age: 31,
    bio: "Diseñador de actividades sorpresa y energía infinita.",
  },
  {
    name: "Pedro De Diego",
    fullName: "Pedro De Diego",
    nickname: "Depedro, Dediego, Pedro",
    age: 31,
    bio: "Siempre listo para playa, asado y tercer tiempo.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829437/biotti-floripa-2026/gallery/crq6kedfhzfytyaamf5v.png",
  },
  {
    name: "Seba Valenzuela",
    fullName: "Sebastián Valenzuela",
    nickname: "Seba, Venezuela",
    age: 31,
    bio: "Refuerzo confirmado para mantener arriba el ánimo del grupo.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829538/biotti-floripa-2026/gallery/g5nyizbsscsk8fxs4o5a.png",
  },
  {
    name: "Felipe Bravo",
    fullName: "Felipe Bravo",
    nickname: "Bravo",
    age: 31,
    bio: "Jugador versátil: suma en logística, fiesta y post partido.",
    photoUrl:
      "https://res.cloudinary.com/dindgpi3d/image/upload/v1776829262/biotti-floripa-2026/gallery/w8l4lb9vruvbibvl8kxf.png",
  },
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
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const selectedMember = useMemo(
    () => CREW.find((member) => member.name === selectedName) ?? null,
    [selectedName]
  );

  return (
    <section id="crew" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo fiesta Brasil */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{
          backgroundImage: `url(/party-brasil.png)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-violet-950/90 to-sky-950/95" />
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
          {CREW.map((person) => (
            <motion.div
              key={person.name}
              variants={item}
              onClick={() => setSelectedName(person.name)}
              className={cn(
                "glass-card rounded-xl p-4 sm:p-5 transition-all duration-300",
                "hover:border-neon-pink/60 hover:shadow-neon-pink/20 hover:shadow-lg",
                "cursor-pointer"
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
        </motion.div>

        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-sky-950/80 backdrop-blur-sm px-4 py-8 flex items-center justify-center"
            onClick={() => setSelectedName(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                "w-full max-w-xl rounded-2xl border border-white/25 glass-card overflow-hidden"
              )}
            >
              <div className="relative h-64 sm:h-72 bg-black/35">
                <img
                  src={selectedMember.photoUrl || "/party-brasil.png"}
                  alt={`Foto de ${selectedMember.fullName}`}
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedName(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white hover:bg-black/75"
                  aria-label="Cerrar ficha de integrante"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-miami-blue font-mono mb-2">
                  Ficha del equipo
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white">
                  {selectedMember.fullName}
                </h3>
                <p className="text-neon-pink font-body text-sm mt-1">
                  Sobrenombre: {selectedMember.nickname}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wider text-white/55 font-mono">
                      Edad
                    </p>
                    <p className="text-white font-body font-semibold">{selectedMember.age} años</p>
                  </div>
                </div>
                <p className="text-white/80 font-body text-sm mt-4">{selectedMember.bio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
