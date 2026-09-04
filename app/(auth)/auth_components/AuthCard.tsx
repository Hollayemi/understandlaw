"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/app/components/ui/logo";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="md:bg-white md:rounded-3xl md:shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden px-2 md:p-7"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-2"
      >
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo showText={true} />
        </Link>

      </motion.div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {children}
    </motion.div>
  );
}