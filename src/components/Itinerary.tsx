"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Plane,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ItineraryItem = {
  time: string;
  activity: string;
  description: string;
  isFlight?: boolean;
  isMeal?: boolean;
  suggestion?: {
    name: string;
    summary: string;
    address: string;
    distanceFromHouse: string;
    routeUrl: string;
  };
};

type ItineraryDay = {
  id: string;
  day: string;
  date: string;
  items: ItineraryItem[];
};

const ITINERARY_DAYS: ItineraryDay[] = [
  {
    id: "jueves",
    day: "JUEVES",
    date: "21 Mayo 2026",
    items: [
      {
        time: "05:00 - 14:30",
        activity: "Vuelo de ida SCL → GRU → FLN",
        description:
          "Despliegue oficial del equipo hacia Florianópolis. Objetivo: llegar con energía para iniciar la misión.",
        isFlight: true,
      },
      {
        time: "14:30 - 15:30",
        activity: "Traslado aeropuerto → casa",
        description:
          "Traslado estimado de 1 hora desde FLN al alojamiento para comenzar la logística local.",
      },
      {
        time: "15:30 - 16:30",
        activity: "Check-in y bienvenida en Floripa",
        description:
          "Instalación en la casa, reparto de piezas y configuración base del fin de semana.",
      },
      {
        time: "16:30 - 17:30",
        activity: "Playa",
        description:
          "Inicio del recorrido en playa base del sector norte, ideal para aterrizar el día sin traslados largos.",
        suggestion: {
          name: "Praia de Canasvieiras",
          summary:
            "Playa amplia, mar tranquilo y excelente opción para arrancar el viaje con poca logística.",
          address: "Canasvieiras, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 3 km desde la casa · 8 a 10 min en auto · 35 a 40 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+de+Canasvieiras,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "17:30 - 18:30",
        activity: "Playa",
        description:
          "Segundo bloque continuo en la misma playa para cumplir jornada de 2 horas completas.",
        suggestion: {
          name: "Praia de Canasvieiras",
          summary:
            "Ideal para seguir el primer día con servicios cerca, ambiente relajado y acceso simple.",
          address: "Canasvieiras, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 3 km desde la casa · 8 a 10 min en auto · 35 a 40 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+de+Canasvieiras,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "18:30 - 20:30",
        activity: "ALMUERZO tardío de llegada",
        description:
          "Almuerzo extendido de 2 horas para recuperar energía tras vuelos y arranque del viaje.",
        isMeal: true,
      },
      {
        time: "20:30 - 21:30",
        activity: "Bloque libre / descanso",
        description:
          "Hora libre para duchas, descanso y preparación de salida nocturna.",
      },
      {
        time: "22:00 - 23:00",
        activity: "Comida y cierre del día",
        description:
          "Cena liviana para cerrar la jornada y dejar al equipo listo para el viernes.",
        isMeal: true,
      },
    ],
  },
  {
    id: "viernes",
    day: "VIERNES",
    date: "22 Mayo 2026",
    items: [
      {
        time: "10:00 - 11:00",
        activity: "Desayuno / activación suave",
        description:
          "Inicio con desayuno de equipo y coordinación de rutas para el bloque de playa.",
      },
      {
        time: "11:00 - 12:00",
        activity: "Traslado hacia circuito de playas norte",
        description:
          "Salida del grupo hacia las playas conectadas del sector norte para recorrer sin repetir.",
      },
      {
        time: "12:00 - 13:00",
        activity: "Playa",
        description:
          "Primera playa del viernes, bahía calma para comenzar el bloque largo de recorrido.",
        suggestion: {
          name: "Praia da Lagoinha",
          summary:
            "Bahía tranquila y protegida, perfecta para un bloque largo con el grupo y sin tanto oleaje.",
          address: "Praia da Lagoinha, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 10 km desde la casa · 20 a 25 min en auto · no recomendable caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+da+Lagoinha,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "13:00 - 14:00",
        activity: "Playa",
        description:
          "Segundo bloque seguido en Lagoinha para completar mínimo 2 horas por playa.",
        suggestion: {
          name: "Praia da Lagoinha",
          summary:
            "Muy buena para descansar, moverse cómodo y mantener la ruta sin alejarse demasiado del norte.",
          address: "Praia da Lagoinha, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 10 km desde la casa · 20 a 25 min en auto · no recomendable caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+da+Lagoinha,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "13:00 - 15:00",
        activity: "ALMUERZO",
        description:
          "Almuerzo extendido de 2 horas para recargar antes de continuar el circuito.",
        isMeal: true,
      },
      {
        time: "15:00 - 16:30",
        activity: "Actividad Sorpresa 🔒🕵️🎭🎉",
        description:
          "Bloque 1 de misión secreta. Sin pistas de ubicación: solo energía alta, pruebas sorpresa y fiesta.",
      },
      {
        time: "16:30 - 18:00",
        activity: "Actividad Sorpresa 🧩🎲🕶️🎊",
        description:
          "Bloque 2 de dinámica oculta con desafíos de equipo, misterio total y ambiente de celebración.",
      },
      {
        time: "18:00 - 19:15",
        activity: "Actividad Sorpresa 🎯🎭🪩🔥",
        description:
          "Bloque 3 de la secuencia sorpresa: ritmo alto, cambios inesperados y momentos épicos del grupo.",
      },
      {
        time: "19:15 - 20:30",
        activity: "Actividad Sorpresa 🥷🔐🎉🍻",
        description:
          "Bloque 4 final del tramo secreto antes de las actividades nocturnas formales.",
      },
      {
        time: "20:30 - 21:00",
        activity: "Actividad Mandiola",
        description:
          "Dinámica sorpresa dirigida por Mandiola para romper el hielo pre noche.",
      },
      {
        time: "21:30 - 22:00",
        activity: "Actividad de Manuel Catepillan",
        description:
          "Bloque especial creado por Manuel: desafío relámpago de equipo y risas garantizadas.",
      },
      {
        time: "22:00 - 23:00",
        activity: "Comida",
        description:
          "Cena en grupo para cerrar viernes y preparar salida nocturna.",
        isMeal: true,
      },
    ],
  },
  {
    id: "sabado",
    day: "SÁBADO",
    date: "23 Mayo 2026",
    items: [
      {
        time: "10:00 - 11:00",
        activity: "Desayuno / recuperación",
        description:
          "Desayuno de recuperación con planificación flexible del último día completo.",
      },
      {
        time: "11:00 - 12:00",
        activity: "Traslado hacia circuito de playas sábado",
        description:
          "Movilización para continuar ruta sin repetir playas del viernes.",
      },
      {
        time: "12:00 - 13:00",
        activity: "Playa",
        description:
          "Primera playa del sábado, inicio del bloque de dos horas continuas.",
        suggestion: {
          name: "Jurerê Tradicional",
          summary:
            "Alternativa clásica y muy cercana, ideal para playa relajada, arena cómoda y fácil logística.",
          address: "Praia de Jurerê, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 1 km desde la casa · 3 a 5 min en auto · 12 a 15 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+de+Jurere,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "13:00 - 14:00",
        activity: "Playa",
        description:
          "Segundo bloque en Jurerê Tradicional para cumplir jornada completa por playa.",
        suggestion: {
          name: "Jurerê Tradicional",
          summary:
            "Muy práctica para moverse en grupo grande y volver rápido a la casa si hace falta.",
          address: "Praia de Jurerê, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 1 km desde la casa · 3 a 5 min en auto · 12 a 15 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Praia+de+Jurere,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "14:00 - 16:00",
        activity: "ALMUERZO",
        description:
          "Almuerzo principal del sábado en formato de 2 horas para recuperación de energía.",
        isMeal: true,
      },
      {
        time: "16:00 - 17:00",
        activity: "Playa",
        description:
          "Paso por Jurerê Internacional para ambiente premium y recorrido de tarde.",
        suggestion: {
          name: "Jurerê Internacional",
          summary:
            "Playa con mejor infraestructura, buen ambiente y excelente opción para una tarde más premium.",
          address: "Jurerê Internacional, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 1.5 km desde la casa · 5 min en auto · 18 a 22 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Jurere+Internacional,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "18:00 - 19:00",
        activity: "Playa",
        description:
          "Segundo bloque seguido en Jurerê Internacional para completar 2 horas.",
        suggestion: {
          name: "Jurerê Internacional",
          summary:
            "Buen cierre de tarde para combinar playa, sunset y entorno con más servicios cercanos.",
          address: "Jurerê Internacional, Florianópolis - SC, Brasil",
          distanceFromHouse:
            "Aprox. 1.5 km desde la casa · 5 min en auto · 18 a 22 min caminando",
          routeUrl:
            "https://www.google.com/maps/search/?api=1&query=Jurere+Internacional,+Florianopolis,+SC,+Brasil",
        },
      },
      {
        time: "20:00 - 21:00",
        activity: "Comida",
        description:
          "Cena previa al hito nocturno del sábado.",
        isMeal: true,
      },
      {
        time: "21:00 - 22:00",
        activity: "Actividad creada por el novio",
        description:
          "Bloque especial liderado por Biotti: dinámica central del viaje y momento principal del grupo.",
      },
      {
        time: "23:00 - 00:00",
        activity: "Pre / salida nocturna",
        description:
          "Cierre del día con previa organizada y salida coordinada.",
      },
    ],
  },
  {
    id: "domingo",
    day: "DOMINGO",
    date: "24 Mayo 2026",
    items: [
      {
        time: "10:00 - 11:00",
        activity: "Desayuno y check-out",
        description:
          "Último desayuno del team, revisión de equipaje y check-out coordinado.",
        isMeal: true,
      },
      {
        time: "11:00 - 12:00",
        activity: "Traslado casa → aeropuerto",
        description:
          "Bloque reservado para traslado estimado de 1 hora rumbo al aeropuerto.",
      },
      {
        time: "13:10 - 21:35",
        activity: "Vuelo de vuelta FLN → POA → SCL",
        description:
          "Retorno oficial de la misión. Objetivo: llegar todos completos y con historias para siempre.",
        isFlight: true,
      },
    ],
  },
];

export default function Itinerary() {
  const [activeDayId, setActiveDayId] = useState(ITINERARY_DAYS[0].id);
  const [selectedItem, setSelectedItem] = useState<{
    day: string;
    date: string;
    item: ItineraryItem;
  } | null>(null);
  const activeDay = useMemo(
    () => ITINERARY_DAYS.find((day) => day.id === activeDayId) ?? ITINERARY_DAYS[0],
    [activeDayId]
  );

  return (
    <section id="itinerary" className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url(/party-brasil.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-violet-950/90 to-sky-950/95" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          ITINERARIO <span className="text-neon-pink">21-24 MAYO</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/65 font-body text-sm mb-12"
        >
          Agenda por pestañas · horarios detallados por tramo
        </motion.p>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
          {ITINERARY_DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setActiveDayId(day.id)}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm sm:text-base transition-all font-body",
                activeDayId === day.id
                  ? "bg-miami-blue/20 border-miami-blue/60 text-miami-blue"
                  : "bg-white/5 border-white/20 text-white/75 hover:bg-white/10"
              )}
            >
              {day.day}
            </button>
          ))}
        </div>

        <motion.div
          key={activeDay.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card rounded-2xl border border-white/20 p-6 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="font-display text-xl sm:text-2xl text-white">
              {activeDay.day} <span className="text-miami-blue">·</span> {activeDay.date}
            </h3>
            <Calendar className="w-5 h-5 text-miami-blue shrink-0" />
          </div>

          <div className="space-y-2">
            {activeDay.items.map((item, index) => (
              <button
                key={`${activeDay.id}-${index}-${item.time}`}
                type="button"
                onClick={() =>
                  setSelectedItem({
                    day: activeDay.day,
                    date: activeDay.date,
                    item,
                  })
                }
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 flex items-start gap-3 transition-colors",
                  item.isFlight
                    ? "border-miami-blue/50 bg-miami-blue/10"
                    : item.isMeal
                      ? "border-amber-400/45 bg-amber-400/10"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 shrink-0",
                    item.isFlight
                      ? "text-miami-blue"
                      : item.isMeal
                        ? "text-amber-300"
                        : "text-white/60"
                  )}
                >
                  {item.isFlight ? (
                    <Plane className="w-4 h-4" />
                  ) : item.isMeal ? (
                    <UtensilsCrossed className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs sm:text-sm text-white/70">{item.time}</p>
                  <p
                    className={cn(
                      "font-body text-sm sm:text-base",
                      item.isFlight
                        ? "text-miami-blue font-semibold"
                        : item.isMeal
                          ? "text-amber-200 font-semibold"
                          : "text-white/90"
                    )}
                  >
                    {item.activity}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] bg-sky-950/80 backdrop-blur-sm px-4 py-8 flex items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-white/25 glass-card p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-miami-blue font-mono mb-1">
                    {selectedItem.day} · {selectedItem.date}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl text-white">
                    {selectedItem.item.activity}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white hover:bg-black/70"
                  aria-label="Cerrar actividad"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3 flex items-center gap-2 text-sm text-white/75 font-mono">
                <Clock className="w-4 h-4 text-miami-blue" />
                {selectedItem.item.time}
              </div>

              <p className="mt-4 text-white/85 font-body leading-relaxed">
                {selectedItem.item.description}
              </p>

              {selectedItem.item.suggestion && (
                <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 space-y-3">
                  <p className="text-neon-pink font-body font-semibold">
                    Sugerencia: {selectedItem.item.suggestion.name}
                  </p>
                  <p className="text-white/80 text-sm font-body">
                    {selectedItem.item.suggestion.summary}
                  </p>
                  <div className="flex items-start gap-2 text-white/70 text-sm font-body">
                    <MapPin className="w-4 h-4 mt-0.5 text-miami-blue shrink-0" />
                    <span>{selectedItem.item.suggestion.address}</span>
                  </div>
                  <p className="text-xs font-mono text-white/55">
                    {selectedItem.item.suggestion.distanceFromHouse}
                  </p>
                  <a
                    href={selectedItem.item.suggestion.routeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-miami-blue/45 bg-miami-blue/15 px-3 py-2 text-sm text-miami-blue hover:bg-miami-blue/25 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir ruta
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
