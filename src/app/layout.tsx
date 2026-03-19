import type { Metadata } from "next";
import { Inter, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/components/RootLayoutClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Couples Expense Splitter",
  description: "Split expenses fairly between partners and track who owes whom with real-time balance calculations and settlement suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-retro-cream text-retro-dark-brown">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
