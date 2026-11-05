import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/source-serif-4";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

const siteUrl = process.env.APP_URL ?? "https://pesdeseda.com.br";
const siteIndexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pés de Seda | Ana Maria Lourenço",
  description: "Conheça Pés de Seda, o e-book em que Ana Maria Lourenço registra um cuidado que atravessa gerações.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Pés de Seda",
    title: "Pés de Seda | Ana Maria Lourenço",
    description: "Um e-book de autocuidado inspirado em um conhecimento transmitido entre gerações.",
  },
  robots: { index: siteIndexable, follow: siteIndexable },
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
