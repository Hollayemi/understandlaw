// "use client"
import type { Metadata } from "next";
import React from "react";
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
  title: "UnderstandLaw — Nigerian Legal Knowledge, Simplified",
  description:
    "Plain-English guides to Nigerian law, a searchable library of legislation, and instant access to verified lawyers. Know your rights. No jargon.",
  keywords: [
    "Nigerian law",
    "legal rights Nigeria",
    "find a lawyer Nigeria",
    "tenant rights Nigeria",
    "employment law Nigeria",
    "understand law",
    "legal help Nigeria",
  ],
  openGraph: {
    title: "UnderstandLaw — The Law Was Written For Everyone. Now Understand It.",
    description:
      "Making Nigerian law simple, accessible, and actionable for every citizen — regardless of education, income, or location.",
    siteName: "UnderstandLaw",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
