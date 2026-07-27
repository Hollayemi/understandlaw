"use client";

import React from "react";
import { motion } from "framer-motion";

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
      className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden p-7"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {children}
    </motion.div>
  );
}