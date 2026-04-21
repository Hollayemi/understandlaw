"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function HomeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F3F3]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
