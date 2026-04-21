import { ReactNode } from "react";

// ── Section label with gold bar ────────────────────────────────────────────
interface SectionLabelProps {
  children: ReactNode;
  light?: boolean;
}
export function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#C9922A] to-[#E8B04A]" />
      <span
        className={`text-xs font-semibold uppercase tracking-[0.15em] ${
          light ? "text-[#C9922A]" : "text-[#C9922A]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

// ── Verified Badge Chip ─────────────────────────────────────────────────────
interface BadgeChipProps {
  icon?: ReactNode;
  children: ReactNode;
  variant?: "gold" | "slate" | "green" | "red";
}
export function BadgeChip({ icon, children, variant = "gold" }: BadgeChipProps) {
  const variants = {
    gold: "bg-[#C9922A]/10 border-[#C9922A]/20 text-[#E8B04A]",
    slate: "bg-[#162543] border-white/8 text-[#8B9BB4]",
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
}
export function StatCard({ value, label, suffix }: StatCardProps) {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-end gap-1 justify-center md:justify-start">
        <span
          className="text-4xl xl:text-5xl font-bold leading-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, #C9922A 0%, #F5D98A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {value}
        </span>
        {suffix && <span className="text-xl text-[#C9922A] font-semibold mb-1">{suffix}</span>}
      </div>
      <p className="text-xs text-[#8B9BB4] mt-1 font-medium">{label}</p>
    </div>
  );
}

// ── Feature Icon Box ───────────────────────────────────────────────────────
interface FeatureIconProps {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
}
export function FeatureIcon({ icon, size = "md" }: FeatureIconProps) {
  const sizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center relative`}
      style={{
        background: "linear-gradient(135deg, rgba(201,146,42,0.15) 0%, rgba(201,146,42,0.05) 100%)",
        border: "1px solid rgba(201,146,42,0.2)",
      }}
    >
      <div className="text-[#E8B04A]">{icon}</div>
    </div>
  );
}

// ── Card wrapper ───────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  dark?: boolean;
}
export function Card({ children, className = "", hover = true, dark = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        dark
          ? "bg-[#0F1D35] border-white/6"
          : "bg-white border-[#E8E2D9]"
      } ${hover ? "card-hover" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-[#C9922A]/30 to-transparent ${className}`} />
  );
}
