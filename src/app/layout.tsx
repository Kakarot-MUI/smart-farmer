import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CropAdvisor — Smart Farmer Information & Crop Advisory System",
  description:
    "AI-powered crop recommendations, fertilizer optimization, and disease detection for smart farming. Get personalized agricultural advice based on your soil and weather data.",
  keywords: [
    "crop recommendation",
    "smart farming",
    "soil analysis",
    "fertilizer advisor",
    "plant disease detection",
    "agriculture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2E7D32" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-farm-cream font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
