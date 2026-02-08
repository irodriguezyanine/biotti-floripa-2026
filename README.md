# BIOTTI LA ÚLTIMA VUELTA · Floripa 2026

Landing de alto impacto para la despedida de soltero de Sebastián Biotti en Florianópolis, Brasil (21-24 Mayo 2026).

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + tailwind-merge + clsx
- **Framer Motion** (countdown, scroll reveal, animaciones)
- **Lucide React** (iconos)
- Fuentes: **Anton** (títulos), **Space Grotesk** (cuerpo), **JetBrains Mono** (countdown/códigos)

## Cómo ejecutar

```bash
cd biotti-floripa-2026
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app/layout.tsx` — Layout con fuentes y grain overlay
- `src/app/page.tsx` — Página principal (Hero, Crew, Vuelos, Footer)
- `src/components/Countdown.tsx` — Cuenta regresiva hasta 21 Mayo 2026 05:00
- `src/components/Hero.tsx` — Hero con countdown y CTA
- `src/components/Squad.tsx` — THE CREW / Wanted List (glass cards)
- `src/components/FlightDashboard.tsx` — Deployment Strategy (vuelos ida/vuelta)
- `src/components/Footer.tsx` — Music & Vibe + frase blockchain

## Build para producción

```bash
npm run build
npm start
```
