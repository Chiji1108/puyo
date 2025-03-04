import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Puyo Game - ぷよぷよ風パズルゲーム",
  description:
    "Next.jsで実装したぷよぷよ風パズルゲーム。同じ色のぷよを4つ以上つなげて連鎖を作ろう！",
  keywords: ["ぷよぷよ", "パズルゲーム", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Cline with Claude" }],
  openGraph: {
    title: "Puyo Game - ぷよぷよ風パズルゲーム",
    description:
      "Next.jsで実装したぷよぷよ風パズルゲーム。同じ色のぷよを4つ以上つなげて連鎖を作ろう！",
    url: "https://puyo-silk.vercel.app/",
    siteName: "Puyo Game",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
