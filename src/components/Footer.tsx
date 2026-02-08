"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";

const SPOTIFY_TRACK_URL = "https://open.spotify.com/track/0QAUgW2vTmlUWhbiNeSkWm";

export default function Footer() {
  return (
    <footer className="relative py-20 px-4 border-t border-white/10 overflow-hidden">
      {/* Fondo fiesta Brasil - misma imagen que Hero */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(/party-brasil.png)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/90 via-violet-950/95 to-sky-950/95" />
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 glass-card rounded-2xl p-8 mb-12 inline-block border-fuchsia-500/30"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-[#1DB954]" />
            <span className="font-display text-xl text-white">
              MUSIC & VIBE
            </span>
          </div>
          <p className="text-white/70 font-body text-sm mb-4">
            La canción de la despedida · Reproduce en el reproductor flotante arriba
          </p>
          <a
            href={SPOTIFY_TRACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1DB954]/20 border border-[#1DB954]/50 text-white hover:bg-[#1DB954]/30 transition-colors font-body text-sm"
          >
            <span>Abrir en Spotify</span>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 font-mono text-sm text-white/50"
        >
          Lo que pasa en Floripa, se queda en la Blockchain.
        </motion.p>
        <p className="relative z-10 mt-2 text-white/30 text-xs font-body">
          DESPEDIDA DE SOLTEROS DE BIOTTI · LA ÚLTIMA VUELTA · Floripa 2026
        </p>
      </div>
    </footer>
  );
}
