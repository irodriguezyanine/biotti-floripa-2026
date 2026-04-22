"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
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
        time: "15:00 - 16:00",
        activity: "Check-in y bienvenida en Floripa",
        description:
          "Instalación en la casa, reparto de piezas y configuración base del fin de semana.",
      },
      {
        time: "16:00 - 17:00",
        activity: "Actividad todo el día · Praia de Canasvieiras",
        description:
          "Primera exploración cerca del alojamiento: mar tranquilo, playa amplia y buen punto para arrancar el tour de playas del norte.",
      },
      {
        time: "17:00 - 18:00",
        activity: "Actividad todo el día · Jurerê Tradicional",
        description:
          "Recorrido por Jurerê Tradicional para sunset temprano y reconocimiento de bares/restaurantes cercanos.",
      },
      {
        time: "18:00 - 19:00",
        activity: "Actividad todo el día · Praia de Daniela",
        description:
          "Parada en Daniela para cerrar el bloque playa con un entorno más relajado y perfecto para fotos del team.",
      },
      {
        time: "19:00 - 20:00",
        activity: "ALMUERZO tardío de llegada",
        description:
          "Comida de aterrizaje para recuperar energía tras vuelos y traslados.",
        isMeal: true,
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
        activity: "Traslado / preparación del día",
        description:
          "Salida en bloque hacia el sector norte para evitar horas punta.",
      },
      {
        time: "12:00 - 13:00",
        activity: "Actividad todo el día · Praia Brava",
        description:
          "Playa con más energía y olas, ideal para arrancar la jornada de exploración.",
      },
      {
        time: "13:00 - 14:00",
        activity: "Actividad todo el día · Praia da Lagoinha",
        description:
          "Tramo de agua más calma y entorno familiar para descansar y seguir el tour.",
      },
      {
        time: "14:00 - 15:00",
        activity: "ALMUERZO",
        description:
          "Parada oficial de almuerzo para reponer combustible y seguir la ruta.",
        isMeal: true,
      },
      {
        time: "15:00 - 16:00",
        activity: "Actividad todo el día · Ponta das Canas",
        description:
          "Spot cercano y cómodo para moverse en grupo grande sin largos traslados.",
      },
      {
        time: "16:00 - 17:00",
        activity: "Actividad todo el día · Canasvieiras",
        description:
          "Retorno a Canasvieiras para cerrar el bloque playa con servicios y accesos rápidos.",
      },
      {
        time: "17:00 - 18:00",
        activity: "Actividad todo el día · Jurerê",
        description:
          "Última parada del circuito en Jurerê para sunset y contenido oficial de la despedida.",
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
        activity: "Actividad todo el día · Santo Antônio de Lisboa",
        description:
          "Paseo corto por zona histórica para cambiar ritmo antes del bloque playa.",
      },
      {
        time: "12:00 - 13:00",
        activity: "Actividad todo el día · Praia do Forte",
        description:
          "Playa cercana al norte con paisaje más tranquilo, perfecta para fotos y descanso.",
      },
      {
        time: "14:00 - 15:00",
        activity: "ALMUERZO",
        description:
          "Almuerzo principal del sábado con menú contundente para sostener la jornada.",
        isMeal: true,
      },
      {
        time: "16:00 - 17:00",
        activity: "Actividad todo el día · Jurerê Internacional",
        description:
          "Paso por Jurerê Internacional para ambiente premium y recorrido de tarde.",
      },
      {
        time: "18:00 - 19:00",
        activity: "Actividad todo el día · Canajurê",
        description:
          "Tramo final del tour entre Canasvieiras y Jurerê, ideal para cierre de tarde.",
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
        activity: "Actividad todo el día · Praia de Canasvieiras (despedida)",
        description:
          "Último paseo corto por playa cercana antes de ir al aeropuerto.",
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

              {!selectedItem.item.isFlight && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 font-body">
                  <MapPin className="w-4 h-4 text-neon-pink" />
                  Click en cada bloque para ver detalle de la actividad.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
