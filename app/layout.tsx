import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Pausa — ayuda ante mensajes sospechosos";
const description = "Una guía calmada y accesible para reconocer señales de fraude y elegir un siguiente paso seguro.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "pausa-digital.elesdex.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/pausa-icon-v2-192.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/favicon.svg",
      apple: "/pausa-apple-touch-icon-v2.png",
    },
    appleWebApp: { capable: true, statusBarStyle: "default", title: "Pausa" },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Pausa — ¿Qué revisamos?" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F3EA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
