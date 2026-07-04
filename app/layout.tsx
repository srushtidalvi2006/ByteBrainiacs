import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import NeuralBackground from "@/components/NeuralBackground"; // ← add this

const bodyFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Byte Brainiacs",
  description: "The ML Showdown",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={bodyFont.className}>
        <NeuralBackground />
        <main style={{ position: "relative", zIndex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}