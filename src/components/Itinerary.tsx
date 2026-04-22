"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Plane, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

type ItineraryItem = {
  time: string;
  activity: string;
  isFlight?: boolean;
  isMeal?: boolean;
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
      { time: "05:00 - 14:30", activity: "Vuelo de ida SCL → GRU → FLN", isFlight: true },
      { time: "15:00 - 16:00", activity: "Check-in y bienvenida en Floripa" },
      { time: "16:00 - 17:00", activity: "Piscina / descanso" },
      { time: "17:00 - 18:00", activity: "Activación pre noche" },
      { time: "18:00 - 19:00", activity: "Tiempo libre" },
      { time: "19:00 - 20:00", activity: "ALMUERZO tardío de llegada", isMeal: true },
      { time: "22:00 - 23:00", activity: "Comida y cierre del día", isMeal: true },
    ],
  },
  {
    id: "viernes",
    day: "VIERNES",
    date: "22 Mayo 2026",
    items: [
      { time: "10:00 - 11:00", activity: "Desayuno / activación suave" },
      { time: "11:00 - 12:00", activity: "Traslado / preparación del día" },
      { time: "12:00 - 13:00", activity: "Actividad todo el día" },
      { time: "13:00 - 14:00", activity: "Actividad todo el día" },
      { time: "14:00 - 15:00", activity: "ALMUERZO", isMeal: true },
      { time: "15:00 - 16:00", activity: "Actividad todo el día" },
      { time: "16:00 - 17:00", activity: "Actividad todo el día" },
      { time: "17:00 - 18:00", activity: "Actividad todo el día" },
      { time: "20:30 - 21:00", activity: "Actividad Mandiola" },
      { time: "21:30 - 22:00", activity: "Actividad de Manuel Catepillan" },
      { time: "22:00 - 23:00", activity: "Comida", isMeal: true },
    ],
  },
  {
    id: "sabado",
    day: "SÁBADO",
    date: "23 Mayo 2026",
    items: [
      { time: "10:00 - 11:00", activity: "Desayuno / recuperación" },
      { time: "11:00 - 12:00", activity: "Bloque libre" },
      { time: "12:00 - 13:00", activity: "Actividad grupal" },
      { time: "14:00 - 15:00", activity: "ALMUERZO", isMeal: true },
      { time: "16:00 - 17:00", activity: "Playa / piscina" },
      { time: "18:00 - 19:00", activity: "Sunset" },
      { time: "20:00 - 21:00", activity: "Comida", isMeal: true },
      { time: "21:00 - 22:00", activity: "Actividad creada por el novio" },
      { time: "23:00 - 00:00", activity: "Pre / salida nocturna" },
    ],
  },
  {
    id: "domingo",
    day: "DOMINGO",
    date: "24 Mayo 2026",
    items: [
      { time: "10:00 - 11:00", activity: "Desayuno y check-out", isMeal: true },
      { time: "11:00 - 12:00", activity: "Cierre de misión / traslado" },
      { time: "13:10 - 21:35", activity: "Vuelo de vuelta FLN → POA → SCL", isFlight: true },
    ],
  },
];

export default function Itinerary() {
  const [activeDayId, setActiveDayId] = useState(ITINERARY_DAYS[0].id);
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
              <div
                key={`${activeDay.id}-${index}-${item.time}`}
                className={cn(
                  "rounded-xl border px-4 py-3 flex items-start gap-3 transition-colors",
                  item.isFlight
                    ? "border-miami-blue/50 bg-miami-blue/10"
                    : item.isMeal
                      ? "border-amber-400/45 bg-amber-400/10"
                      : "border-white/15 bg-white/5"
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
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
