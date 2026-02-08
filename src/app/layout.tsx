import type { Metadata } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DESPEDIDA DE SOLTEROS DE BIOTTI | LA ÚLTIMA VUELTA | Floripa 2026",
  description: "Despedida de solteros de Biotti — La Última Vuelta. Florianópolis, Brasil. Playas, fiesta, cócteles. 21-24 Mayo 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden">
        <div className="grain-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
