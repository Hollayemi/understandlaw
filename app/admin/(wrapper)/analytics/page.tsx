"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users, Scale, MessageSquare, DollarSign, BookOpen, TrendingUp,
  TrendingDown, AlertTriangle, Clock, CheckCircle, ShieldAlert,
  BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw, Eye,
  Star, Activity, Zap, FileText, MapPin, Award, Briefcase,
  Calendar, Download, Filter, ChevronDown, X, Search,
} from "lucide-react";
import {
  useGetDashboardOverviewQuery,
  useGetDashboardAnalyticsQuery,
} from "@/redux/slices/admin/dashboard.admin.slice";
import { TopLawyerRow } from "@/redux/types/dashboard";

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

// ─── Activity Type Configuration ──────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  consultation_booked: { bg: "#EFF6FF", text: "#1E3A8A", icon: MessageSquare, label: "Consultation Booked" },
  lawyer_applied: { bg: "#FFFBEB", text: "#92400E", icon: Scale, label: "Lawyer Applied" },
  citizen_joined: { bg: "#ECFDF5", text: "#065F46", icon: Users, label: "Citizen Joined" },
  dispute_raised: { bg: "#FEF2F2", text: "#991B1B", icon: AlertTriangle, label: "Dispute Raised" },
  post_reported: { bg: "#FFF0F5", text: "#9D174D", icon: ShieldAlert, label: "Post Reported" },
  order_placed: { bg: "#F5F3FF", text: "#4C1D95", icon: BookOpen, label: "Order Placed" },
};

const URGENCY_CONFIG = {
  critical: { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", dot: "#EF4444" },
  high: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B" },
  medium: { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE", dot: "#3B82F6" },
};

const PERIOD_OPTIONS = ["7d", "30d", "90d", "1y"] as const;
type Period = typeof PERIOD_OPTIONS[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  trendLabel,
  color,
  bg,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  trendLabel?: string;
  color: string;
  bg: string;
  href?: string;
}) {
  const isPositive = trend !== undefined ? trend >= 0 : null;

  const content = (
    <div className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
        {href && <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors" />}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{typeof value === "number" ? formatCompactNumber(value) : value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          {isPositive ? (
            <TrendingUp size={12} className="text-emerald-500" />
          ) : (
            <TrendingDown size={12} className="text-red-400" />
          )}
          <span className={`text-[11px] font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{trend.toFixed(1)}%
          </span>
          {trendLabel && <span className="text-[11px] text-gray-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function LineChart({ data, lines, height = 160 }: {
  data: any[];
  lines: { key: string; color: string; label: string }[];
  height?: number;
}) {
  const maxValue = Math.max(
    ...data.flatMap(d => lines.map(l => d[l.key] || 0)),
    1
  );

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
          <div key={i} className="border-t border-gray-100" />
        ))}
      </div>
      <svg width="100%" height={height} className="overflow-visible">
        {lines.map((line, lineIdx) => {
          const points = data.map((point, idx) => {
            const x = (idx / (data.length - 1)) * 100;
            const y = 100 - ((point[line.key] || 0) / maxValue) * 100;
            return `${x},${y}`;
          }).join(" ");
          
          return (
            <g key={line.key}>
              <polyline
                points={points}
                fill="none"
                stroke={line.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={lineIdx === 0 ? 1 : 0.6}
              />
              {data.map((point, idx) => {
                const x = (idx / (data.length - 1)) * 100;
                const y = 100 - ((point[line.key] || 0) / maxValue) * 100;
                if (idx === data.length - 1) {
                  return (
                    <circle
                      key={`${line.key}-${idx}`}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill={line.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                }
                return null;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MiniBarChart({ data, valueKey, color }: {
  data: any[];
  valueKey: string;
  color: string;
}) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => {
        const height = ((d[valueKey] || 0) / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-medium px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap z-10">
              {formatNumber(d[valueKey])}
            </div>
            <div
              className="w-full rounded-t transition-all duration-200 group-hover:opacity-80"
              style={{ height: `${Math.max(height, 4)}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6 }}
            />
            {data.length <= 10 && (
              <span className="text-[9px] text-gray-300 mt-1">{d.label?.slice(0, 3)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments, size = 100 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = size / 2 - 10;
  const center = size / 2;
  let currentAngle = -Math.PI / 2;

  const arcs = segments.map(segment => {
    const angle = (segment.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;
    
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      "Z",
    ].join(" ");
    
    return { ...segment, path: pathData };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, idx) => (
        <path key={idx} d={arc.path} fill={arc.color} stroke="white" strokeWidth="2" />
      ))}
      <circle cx={center} cy={center} r={radius * 0.6} fill="white" />
    </svg>
  );
}

function TopLawyersTable({ lawyers }: { lawyers: TopLawyerRow[] }) {
  const [search, setSearch] = useState("");
  
  const filtered = lawyers.filter(l => 
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.nbaNumber.toLowerCase().includes(search.toLowerCase()) ||
    l.specialisms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search lawyers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500">Lawyer</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500">SCN#</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500">Specialisms</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500">Sessions</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500">Rating</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500">Earned</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500">Completion</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 10).map((lawyer) => (
              <tr key={lawyer.lawyerId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                      style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}
                    >
                      {lawyer.avatarInitials}
                    </div>
                    <span className="font-medium text-gray-900">{lawyer.fullName}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-600 text-xs">{lawyer.nbaNumber}</td>
                <td className="py-3 px-2">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialisms.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    {lawyer.specialisms.length > 2 && (
                      <span className="text-[10px] text-gray-400">+{lawyer.specialisms.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-semibold text-gray-900">{formatCompactNumber(lawyer.consultationCount)}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-900">{lawyer.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({lawyer.reviewCount})</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-semibold text-gray-900">{formatCurrency(lawyer.totalEarned)}</td>
                <td className="py-3 px-2 text-right">
                  <span className={`text-xs font-semibold ${lawyer.completionRate >= 80 ? "text-emerald-600" : lawyer.completionRate >= 60 ? "text-amber-600" : "text-red-600"}`}>
                    {lawyer.completionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  
  const { data: overviewData, isLoading: overviewLoading, refetch } = useGetDashboardOverviewQuery();
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery({ period });
  
  const ov = overviewData?.data;
  const an = analyticsData?.data;
  
  const isLoading = overviewLoading || analyticsLoading;

  if (isLoading && !ov) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-100 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const totalConsultations = (ov?.consultations.total || 0);
  const consultationSegments = [
    { label: "Completed", value: ov?.consultations.completed || 0, color: "#10B981" },
    { label: "Active", value: ov?.consultations.active || 0, color: "#3B82F6" },
    { label: "Disputed", value: ov?.consultations.disputed || 0, color: "#EF4444" },
  ];

  const modeTotal = (an?.consultationsByMode?.message || 0) + 
                    (an?.consultationsByMode?.call || 0) + 
                    (an?.consultationsByMode?.video || 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive platform metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
            {PERIOD_OPTIONS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Revenue Trends</h3>
              <p className="text-xs text-gray-400 mt-0.5">Gross vs Commission vs Lawyer Payout</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-pink-500" />
                <span className="text-gray-500">Commission</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-300" />
                <span className="text-gray-500">Gross</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span className="text-gray-500">Payout</span>
              </span>
            </div>
          </div>
          {an?.revenue?.length ? (
            <>
              <LineChart
                data={an.revenue}
                lines={[
                  { key: "gross", color: "#93C5FD", label: "Gross" },
                  { key: "commission", color: "#E8317A", label: "Commission" },
                  { key: "lawyerPayout", color: "#34D399", label: "Payout" },
                ]}
                height={180}
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400">
                {an.revenue.slice(-7).map((d:any) => (
                  <span key={d.date}>{d.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No revenue data available</div>
          )}
        </div>

        {/* Consultation Trends */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Consultation Trends</h3>
              <p className="text-xs text-gray-400 mt-0.5">Completed vs Disputed vs Cancelled</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-gray-500">Completed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
                <span className="text-gray-500">Disputed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
                <span className="text-gray-500">Cancelled</span>
              </span>
            </div>
          </div>
          {an?.consultations?.length ? (
            <>
              <LineChart
                data={an.consultations}
                lines={[
                  { key: "completed", color: "#10B981", label: "Completed" },
                  { key: "disputed", color: "#F87171", label: "Disputed" },
                  { key: "cancelled", color: "#D1D5DB", label: "Cancelled" },
                ]}
                height={180}
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400">
                {an.consultations.slice(-7).map((d:any) => (
                  <span key={d.date}>{d.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No consultation data available</div>
          )}
        </div>
      </div>

      {/* User Growth + Distribution */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* User Growth */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">User Growth</h3>
              <p className="text-xs text-gray-400 mt-0.5">Cumulative citizens vs lawyers</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-pink-500" />
                <span className="text-gray-500">Citizens</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-gray-500">Lawyers</span>
              </span>
            </div>
          </div>
          {an?.userGrowth?.length ? (
            <>
              <LineChart
                data={an.userGrowth}
                lines={[
                  { key: "cumCitizens", color: "#E8317A", label: "Citizens" },
                  { key: "cumLawyers", color: "#3B82F6", label: "Lawyers" },
                ]}
                height={160}
              />
              <div className="flex justify-between mt-3 text-[10px] text-gray-400">
                {an.userGrowth.slice(-7).map((d:any) => (
                  <span key={d.date}>{d.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-400 text-sm">No user growth data available</div>
          )}
        </div>

        {/* Distribution Section */}
        <div className="space-y-5">
          {/* Consultation Mode & Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Consultation Distribution</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Mode Breakdown */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3">By Mode</p>
                <div className="space-y-2.5">
                  {an?.consultationsByMode && modeTotal > 0 ? (
                    <>
                      {[
                        { label: "Written Message", key: "message", color: "#10B981" },
                        { label: "Scheduled Call", key: "call", color: "#3B82F6" },
                        { label: "Video Session", key: "video", color: "#8B5CF6" },
                      ].map(mode => {
                        const value = an.consultationsByMode[mode.key as keyof typeof an.consultationsByMode] || 0;
                        const pct = (value / modeTotal) * 100;
                        return (
                          <div key={mode.key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">{mode.label}</span>
                              <span className="font-semibold text-gray-900">{formatNumber(value)} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: mode.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">No mode data</p>
                  )}
                </div>
              </div>

              {/* Status Breakdown */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3">By Status</p>
                <div className="flex justify-center">
                  <DonutChart segments={consultationSegments} size={90} />
                </div>
                <div className="flex justify-center gap-4 mt-3 text-xs">
                  {consultationSegments.map(seg => (
                    <div key={seg.label} className="text-center">
                      <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: seg.color }} />
                      <span className="text-gray-600">{seg.label}</span>
                      <p className="font-semibold text-gray-900">{formatNumber(seg.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Geographic & Specialism */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              {/* Lawyers by Specialism */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={14} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500">Lawyers by Specialism</p>
                </div>
                {an?.lawyersBySpecialism?.length ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {an.lawyersBySpecialism.slice(0, 6).map(s => (
                      <div key={s.specialism} className="flex justify-between text-xs">
                        <span className="text-gray-600">{s.specialism}</span>
                        <span className="font-semibold text-gray-900">{s.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No specialism data</p>
                )}
              </div>

              {/* Citizens by State */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500">Citizens by State</p>
                </div>
                {an?.citizensByState?.length ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {an.citizensByState.slice(0, 6).map(s => (
                      <div key={s.state} className="flex justify-between text-xs">
                        <span className="text-gray-600">{s.state}</span>
                        <span className="font-semibold text-gray-900">{formatNumber(s.count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No geographic data</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Lawyers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Top Performing Lawyers</h3>
              <p className="text-xs text-gray-400 mt-0.5">Ranked by consultation volume and client satisfaction</p>
            </div>
            <Link href="/admin/lawyers" className="text-xs text-pink-500 font-semibold hover:underline">
              View All Lawyers →
            </Link>
          </div>
        </div>
        <div className="p-5">
          {an?.topLawyers?.length ? (
            <TopLawyersTable lawyers={an.topLawyers} />
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">No lawyer data available</div>
          )}
        </div>
      </div>

      {/* Bottom Row: Pending Actions + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pending Actions</h3>
              <p className="text-xs text-gray-400 mt-0.5">Items requiring your attention</p>
            </div>
            {an?.pendingActions && an.pendingActions.length > 0 && (
              <span className="text-xs font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">
                {an.pendingActions.length}
              </span>
            )}
          </div>
          <div className="p-5 max-h-96 overflow-y-auto">
            {an?.pendingActions && an.pendingActions.length > 0 ? (
              <div className="space-y-2.5">
                {an.pendingActions.map(action => {
                  const urgency = URGENCY_CONFIG[action.urgency];
                  const typeLabels: Record<string, string> = {
                    lawyer_verification: "Lawyer Verification",
                    dispute: "Dispute Resolution",
                    reported_post: "Reported Content",
                    pending_order: "Order Fulfillment",
                  };
                  return (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm"
                      style={{ backgroundColor: urgency.bg, borderColor: urgency.border }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: urgency.dot }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold" style={{ color: urgency.text }}>{action.title}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/50" style={{ color: urgency.text }}>
                            {typeLabels[action.type] || action.type}
                          </span>
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: urgency.text, opacity: 0.7 }}>{action.subtitle}</p>
                        <p className="text-[9px] mt-1 text-gray-400 flex items-center gap-1">
                          <Clock size={9} /> {timeAgo(action.createdAt)}
                        </p>
                      </div>
                      {action.count && action.count > 1 && (
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: urgency.text }}>×{action.count}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All caught up! No pending actions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live platform feed</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-semibold">Live</span>
            </div>
          </div>
          <div className="p-5 max-h-96 overflow-y-auto">
            {an?.recentActivity && an.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {an.recentActivity.map(activity => {
                  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.consultation_booked;
                  const Icon = config.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-2.5 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: activity.actorColor || config.bg }}
                      >
                        {activity.actorInitials ? (
                          <span className="text-[10px] font-bold text-white">{activity.actorInitials}</span>
                        ) : (
                          <Icon size={14} style={{ color: config.text }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          <span className="font-semibold">{activity.actorName}</span>
                          <span className="text-gray-400"> {activity.description}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-400">{timeAgo(activity.createdAt)}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{config.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <Activity size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}