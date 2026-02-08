"use client";

import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

const PLAYLIST_URL =
  "https://open.spotify.com/playlist/37i9dQZF1DXa8NOEUWPn9W?si=brazilian-bass"; // Brazilian bass style - user can replace

export default function Footer() {
  return (
    <footer className="relative py-20 px-4 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 mb-12 inline-block"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-neon-pink" />
            <span className="font-display text-xl text-white">
              MUSIC & VIBE
            </span>
          </div>
          <p className="text-white/70 font-body text-sm mb-4">
            Brazilian Bass / Tech House · Playlist oficial de la misión
          </p>
          <a
            href={PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1DB954]/20 border border-[#1DB954]/50 text-white hover:bg-[#1DB954]/30 transition-colors font-body text-sm"
          >
            <span>Escuchar en Spotify</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-sm text-white/50"
        >
          Lo que pasa en Floripa, se queda en la Blockchain.
        </motion.p>
        <p className="mt-2 text-white/30 text-xs font-body">
          BIOTTI LA ÚLTIMA VUELTA · Floripa 2026
        </p>
      </div>
    </footer>
  );
}
