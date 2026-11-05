import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/source-serif-4";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

export const metadata: Metadata = {
  title: "Pés de Seda | Ana Maria Lourenço",
  description: "Conheça Pés de Seda, o e-book em que Ana Maria Lourenço registra um cuidado que atravessa gerações.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#FAF7F0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
