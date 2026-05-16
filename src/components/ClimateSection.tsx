"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CloudSun, Droplets, Thermometer, Wind } from "lucide-react";

type DailyForecast = {
  date: string;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
  rainProbability: number;
  windKmh: number;
};

const LOCATION_LABEL = "Av. dos Búzios, Jurerê, Florianópolis, Santa Catarina, Brasil";
const START_DATE = "2026-05-20";
const END_DATE = "2026-05-24";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-27.4329&longitude=-48.4994&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=America%2FSao_Paulo&start_date=2026-05-20&end_date=2026-05-24";

function weatherCodeToLabel(code: number) {
  if (code === 0) return { emoji: "☀️", label: "Despejado" };
  if (code === 1 || code === 2) return { emoji: "🌤️", label: "Parcial nublado" };
  if (code === 3) return { emoji: "☁️", label: "Nublado" };
  if (code >= 45 && code <= 48) return { emoji: "🌫️", label: "Neblina" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { emoji: "🌧️", label: "Lluvia" };
  }
  if (code >= 71 && code <= 77) return { emoji: "❄️", label: "Nieve" };
  if (code >= 95) return { emoji: "⛈️", label: "Tormenta" };
  return { emoji: "🌦️", label: "Variable" };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(`${date}T12:00:00`));
}

export default function ClimateSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState<DailyForecast[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadForecast() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(OPEN_METEO_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("No se pudo cargar el pronóstico.");
        }
        const data = await response.json();
        const daily = data?.daily;
        if (!daily?.time || !Array.isArray(daily.time)) {
          throw new Error("Formato de pronóstico inválido.");
        }

        const next: DailyForecast[] = daily.time.map((date: string, index: number) => ({
          date,
          weatherCode: Number(daily.weather_code?.[index] ?? 0),
          minTemp: Number(daily.temperature_2m_min?.[index] ?? 0),
          maxTemp: Number(daily.temperature_2m_max?.[index] ?? 0),
          rainProbability: Number(daily.precipitation_probability_max?.[index] ?? 0),
          windKmh: Number(daily.windspeed_10m_max?.[index] ?? 0),
        }));

        if (isMounted) setForecast(next);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadForecast();
    return () => {
      isMounted = false;
    };
  }, []);

  const subtitle = useMemo(
    () => `${LOCATION_LABEL} · ${START_DATE} al ${END_DATE}`,
    []
  );

  return (
    <section id="climate" className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url(/party-brasil.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-violet-950/90 to-sky-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-white"
        >
          CLIMA <span className="text-miami-blue">EN JURERÊ</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 font-body text-xs sm:text-sm mb-10"
        >
          {subtitle}
        </motion.p>

        {loading ? (
          <div className="glass-card rounded-2xl border border-white/20 p-8 text-center text-white/70">
            Cargando pronóstico...
          </div>
        ) : error ? (
          <div className="glass-card rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-center text-rose-100">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {forecast.map((day, index) => {
              const weather = weatherCodeToLabel(day.weatherCode);
              return (
                <motion.article
                  key={day.date}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl border border-white/20 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60 font-mono">
                    {formatDate(day.date)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-2xl">{weather.emoji}</span>
                    <p className="text-white font-body text-sm">{weather.label}</p>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="inline-flex items-center gap-2 text-white/85">
                      <Thermometer className="w-4 h-4 text-amber-300" />
                      {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                    </p>
                    <p className="inline-flex items-center gap-2 text-white/75 ml-0">
                      <Droplets className="w-4 h-4 text-miami-blue" />
                      {Math.round(day.rainProbability)}% lluvia
                    </p>
                    <p className="inline-flex items-center gap-2 text-white/75 ml-0">
                      <Wind className="w-4 h-4 text-white/80" />
                      {Math.round(day.windKmh)} km/h
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center text-white/50 text-xs font-body inline-flex items-center justify-center gap-2 w-full">
          <CloudSun className="w-4 h-4" />
          Fuente: Open-Meteo (actualización en tiempo real)
        </div>
      </div>
    </section>
  );
}

