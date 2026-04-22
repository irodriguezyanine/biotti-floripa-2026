"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type ItineraryItem = {
  time: string;
  activity: string;
  isFlight?: boolean;
};

const ITINERARY_DAYS: {
  day: string;
  date: string;
  items: ItineraryItem[];
}[] = [
  {
    day: "JUEVES",
    date: "21 Mayo 2026",
    items: [
      { time: "05:00 - 14:30", activity: "Vuelo de ida SCL → GRU → FLN", isFlight: true },
      { time: "TBD", activity: "Check-in y bienvenida en Floripa" },
      { time: "TBD", activity: "Actividad por definir" },
    ],
  },
  {
    day: "VIERNES",
    date: "22 Mayo 2026",
    items: [
      { time: "TBD", activity: "Mañana por definir" },
      { time: "TBD", activity: "Tarde por definir" },
      { time: "TBD", activity: "Noche por definir" },
    ],
  },
  {
    day: "SÁBADO",
    date: "23 Mayo 2026",
    items: [
      { time: "TBD", activity: "Mañana por definir" },
      { time: "TBD", activity: "Tarde por definir" },
      { time: "TBD", activity: "Noche por definir" },
    ],
  },
  {
    day: "DOMINGO",
    date: "24 Mayo 2026",
    items: [
      { time: "13:10 - 21:35", activity: "Vuelo de vuelta FLN → POA → SCL", isFlight: true },
      { time: "TBD", activity: "Cierre de misión" },
    ],
  },
];

function DayBlock({
  day,
  date,
  items,
  delay = 0,
}: {
  day: string;
  date: string;
  items: ItineraryItem[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="glass-card rounded-2xl border border-white/20 p-6 sm:p-7"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="font-display text-xl sm:text-2xl text-white">
          {day} <span className="text-miami-blue">·</span> {date}
        </h3>
        <Calendar className="w-5 h-5 text-miami-blue shrink-0" />
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${day}-${index}-${item.time}`}
            className={cn(
              "rounded-xl border px-4 py-3 flex items-start gap-3 transition-colors",
              item.isFlight
                ? "border-miami-blue/50 bg-miami-blue/10"
                : "border-white/15 bg-white/5"
            )}
          >
            <div
              className={cn(
                "mt-0.5 shrink-0",
                item.isFlight ? "text-miami-blue" : "text-white/60"
              )}
            >
              {item.isFlight ? <Plane className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs sm:text-sm text-white/70">{item.time}</p>
              <p
                className={cn(
                  "font-body text-sm sm:text-base",
                  item.isFlight ? "text-miami-blue font-semibold" : "text-white/90"
                )}
              >
                {item.activity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Itinerary() {
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
          Estructura base del viaje · vuelos destacados y agenda por completar
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ITINERARY_DAYS.map((day, index) => (
            <DayBlock
              key={day.date}
              day={day.day}
              date={day.date}
              items={day.items}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
