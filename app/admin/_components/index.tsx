"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// ─── Section Title ────────────────────────────────────────────────────────────
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[15px] font-bold text-[#111827] leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  color?: string;
  bg?: string;
}
export function StatCard({ icon: Icon, label, value, trend, color = "#E8317A", bg = "#FFF0F5" }: StatCardProps) {
  const positive = trend ? trend.value >= 0 : null;
  return (
    <div className="bg-pink-600 rounded-2xl border border-[#F3F4F6] p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-white [#111827] leading-none">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1.5">
            {positive ? (
              <ChevronUp size={12} className="text-emerald-500" />
            ) : (
              <ChevronDown size={12} className="text-red-400" />
            )}
            <span className={`text-[11px] font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-[11px] text-[#9CA3AF]">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stat Bar (compact row version) ──────────────────────────────────────────
interface StatBarItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
}
interface StatBarProps {
  items: StatBarItem[];
}
export function StatBar({ items }: StatBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <StatCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          color={item.color}
          bg={item.bg}
        />
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
type StatusVariant = "active" | "inactive" | "pending" | "approved" | "rejected" | "warning";

const STATUS_CONFIG: Record<StatusVariant, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: "Active",   bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  inactive: { label: "Inactive", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  pending:  { label: "Pending",  bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  approved: { label: "Approved", bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  rejected: { label: "Rejected", bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  warning:  { label: "Warning",  bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
}
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {label ?? cfg.label}
    </span>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function Table<T>({ columns, data, keyField, emptyMessage = "No data found.", emptyIcon }: TableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9FAFB]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  {emptyIcon && <div className="flex justify-center mb-3 opacity-30">{emptyIcon}</div>}
                  <p className="text-sm text-[#9CA3AF]">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={String(row[keyField])} className="hover:bg-[#F9FAFB] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Avatar Initials ──────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}
const AVATAR_SIZES = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm" };

export function Avatar({ initials, color = "#E8317A", size = "md" }: AvatarProps) {
  return (
    <div
      className={`${AVATAR_SIZES[size]} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
    >
      {initials}
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
interface FilterBarProps {
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  rightSlot?: React.ReactNode;
}
export function FilterBar({
  options, value, onChange,
  searchPlaceholder, searchValue, onSearchChange,
  rightSlot,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {onSearchChange && (
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder ?? "Search…"}
            className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
          />
        </div>
      )}

      <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
              value === opt.value
                ? "bg-white text-[#111827] shadow-sm"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                value === opt.value ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
              }`}>
                {opt.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
