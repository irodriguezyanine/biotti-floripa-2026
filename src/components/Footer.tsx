"use client";

import { motion } from "framer-motion";

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
