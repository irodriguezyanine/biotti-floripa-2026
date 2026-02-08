"use client";

import { motion } from "framer-motion";
import { Plane, MapPin } from "lucide-react";

const DEPLOYMENT = {
  outbound: {
    title: "VUELO DE IDA",
    date: "Jueves 21 Mayo 2026",
    legs: [
      {
        flight: "LA611",
        from: "SCL",
        to: "GRU",
        dep: "05:00",
        arr: "10:10",
        label: "Santiago → São Paulo",
      },
      {
        flight: "LA3302",
        from: "GRU",
        to: "FLN",
        dep: "13:15",
        arr: "14:30",
        label: "São Paulo → Florianópolis",
      },
    ],
    note: "Escala en São Paulo · Llegada a Floripa 14:30",
  },
  return: {
    title: "VUELO DE VUELTA",
    date: "Domingo 24 Mayo 2026",
    legs: [
      {
        flight: "LA4781",
        from: "FLN",
        to: "POA",
        dep: "13:10",
        arr: "14:15",
        label: "Florianópolis → Porto Alegre",
      },
      {
        flight: "LA741",
        from: "POA",
        to: "SCL",
        dep: "19:05",
        arr: "21:35",
        label: "Porto Alegre → Santiago",
      },
    ],
    note: "Escala en Porto Alegre · Fin de la misión 21:35",
  },
};

function LegCard({
  flight,
  from,
  to,
  dep,
  arr,
  label,
  isLast,
}: {
  flight: string;
  from: string;
  to: string;
  dep: string;
  arr: string;
  label: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-4 py-4">
      <div className="flex flex-col items-center shrink-0">
        <span className="font-mono text-lg sm:text-xl font-bold text-miami-blue text-neon-cyan">
          {from}
        </span>
        <span className="text-xs text-white/60 font-body">{dep}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-white/10" />
        <div className="shrink-0 px-2 py-1 rounded bg-white/5 border border-white/20 font-mono text-xs text-white/80">
          {flight}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-white/20" />
      </div>
      <div className="flex flex-col items-center shrink-0">
        <span className="font-mono text-lg sm:text-xl font-bold text-neon-pink text-neon-pink">
          {to}
        </span>
        <span className="text-xs text-white/60 font-body">{arr}</span>
      </div>
      {!isLast && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-body">
          Escala
        </div>
      )}
    </div>
  );
}

function FlightBlock({
  title,
  date,
  legs,
  note,
  delay = 0,
}: {
  title: string;
  date: string;
  legs: typeof DEPLOYMENT.outbound.legs;
  note: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-white/20"
    >
      <div className="flex items-center gap-2 mb-6">
        <Plane className="w-5 h-5 text-miami-blue" />
        <h3 className="font-display text-xl sm:text-2xl text-white">{title}</h3>
      </div>
      <p className="text-sm text-white/70 font-body mb-6">{date}</p>
      <div className="space-y-2 border-l-2 border-dashed border-white/20 pl-4">
        {legs.map((leg, i) => (
          <LegCard
            key={leg.flight}
            {...leg}
            isLast={i === legs.length - 1}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-miami-blue/90 font-mono flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {note}
      </p>
    </motion.div>
  );
}

export default function FlightDashboard() {
  return (
    <section id="flight" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          DEPLOYMENT <span className="text-miami-blue">STRATEGY</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/60 font-body text-sm mb-12"
        >
          Cronograma de vuelos · SCL → GRU → FLN
        </motion.p>

        <div className="space-y-8">
          <FlightBlock
            title={DEPLOYMENT.outbound.title}
            date={DEPLOYMENT.outbound.date}
            legs={DEPLOYMENT.outbound.legs}
            note={DEPLOYMENT.outbound.note}
            delay={0}
          />
          <FlightBlock
            title={DEPLOYMENT.return.title}
            date={DEPLOYMENT.return.date}
            legs={DEPLOYMENT.return.legs}
            note={DEPLOYMENT.return.note}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
