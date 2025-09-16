import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/context/progressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Understanding Rubik's Cube",
  description: "Develop your own algorithm for solving the Rubik's Cube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
