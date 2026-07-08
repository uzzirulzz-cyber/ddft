import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Use a monospace stack for numeric/code areas
const monoFont = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brock Exchange — Trade Smarter. Grow Faster.",
  description: "Brock Exchange — premium crypto trading platform and admin console. Trade smarter, grow faster.",
  keywords: ["Brock Exchange", "crypto", "exchange", "trading", "bitcoin", "ethereum", "admin"],
  authors: [{ name: "Brock Exchange" }],
  icons: {
    icon: "/brock-mark.svg",
    apple: "/brock-logo.png",
  },
  openGraph: {
    title: "Brock Exchange",
    description: "Trade Smarter. Grow Faster.",
    siteName: "Brock Exchange",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${monoFont.variable} antialiased`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
