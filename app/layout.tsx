import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono, Bebas_Neue, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/redux/provider";
import { Toaster } from "./components/ui/sonner";
import { UserDataProvider } from "@/context/userContext";
import AuthGuard from "./components/wrapper/AuthGuard";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LawTicha - Nigerian Legal Knowledge, Simplified",
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
    title: "LawTicha. The Law Was Written For Everyone. Now Understand It.",
    description:
      "Making Nigerian law simple, accessible, and actionable for every citizen,  regardless of education, income, or location.",
    siteName: "LawTicha",
    locale: "en_NG",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ProviderWrapper session={session}>
          <UserDataProvider>
            <AuthGuard>
              <Toaster
                toastOptions={
                  {
                    position: "top-right",
                    error: {
                      classNames: {
                        toast: "border border-red-500 bg-red-50 text-red-700 font-medium",
                        title: "text-red-700",
                        description: "text-red-600",
                        actionButton: "bg-red-100 text-red-800 hover:bg-red-200",
                        cancelButton: "text-red-500",
                      },
                    },
                    success: {
                      classNames: {
                        toast: "border border-green-500 bg-green-50 text-green-700 font-medium",
                        title: "text-green-700",
                        description: "text-green-600",
                        actionButton: "bg-green-100 text-green-800 hover:bg-green-200",
                        cancelButton: "text-green-500",
                      },
                    },
                  } as any
                }
              />
              {children}
            </AuthGuard>

          </UserDataProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}
