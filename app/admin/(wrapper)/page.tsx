"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users, Scale, MessageSquare, DollarSign, BookOpen, TrendingUp,
  TrendingDown, AlertTriangle, Clock, CheckCircle, ShieldAlert,
  BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw, Eye,
  Star, Activity, Zap, FileText,
} from "lucide-react";
import {
  useGetDashboardOverviewQuery,
  useGetDashboardAnalyticsQuery,
} from "@/redux/slices/admin/dashboard.admin.slice";


function formatCurrency(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}
function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ACTIVITY_COLORS: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  consultation_booked: { bg: "#EFF6FF", text: "#1E3A8A", icon: MessageSquare },
  lawyer_applied:      { bg: "#FFFBEB", text: "#92400E", icon: Scale },
  citizen_joined:      { bg: "#ECFDF5", text: "#065F46", icon: Users },
  dispute_raised:      { bg: "#FEF2F2", text: "#991B1B", icon: AlertTriangle },
  post_reported:       { bg: "#FFF0F5", text: "#9D174D", icon: ShieldAlert },
  order_placed:        { bg: "#F5F3FF", text: "#4C1D95", icon: BookOpen },
};

const URGENCY_STYLE = {
  critical: { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", dot: "#EF4444" },
  high:     { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B" },
  medium:   { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE", dot: "#3B82F6" },
};

function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}


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
    <div className="group bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-gray-900 leading-tight">
              {typeof value === "number" ? formatCompactNumber(value) : value}
            </p>
          </div>
        </div>
        {href && <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-400" />}
      </div>

      {(sub || trend !== undefined) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={10} className="text-emerald-500" />
              ) : (
                <TrendingDown size={10} className="text-red-400" />
              )}
              <span className={`text-[10px] font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                {isPositive ? "+" : ""}{trend.toFixed(1)}%
              </span>
              {trendLabel && <span className="text-[9px] text-gray-400">{trendLabel}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function MiniBarChart({ data, valueKey, color }: {
  data: { label: string; [k: string]: any }[];
  valueKey: string;
  color: string;
}) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => {
        const pct = Math.max(((d[valueKey] || 0) / max) * 100, 3);
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#111827] text-white text-[9px] font-bold px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
              {d[valueKey]?.toLocaleString()}
            </div>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{ height: `${pct}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5 }}
            />
            {data.length <= 8 && (
              <span className="text-[9px] text-[#D1D5DB]">{d.label?.slice(0, 3)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments, size = 80 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let cumAngle = -Math.PI / 2;

  const arcs = segments.map(seg => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = angle >= 2 * Math.PI - 0.001
      ? `M${cx},${cy - r} A${r},${r} 0 1,1 ${cx - 0.001},${cy - r} Z`
      : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
    return { ...seg, path };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <path key={i} d={arc.path} fill={arc.color} opacity={0.9} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.6} fill="white" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const { data: overviewData, isLoading: overviewLoading, refetch } = useGetDashboardOverviewQuery();
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery({ period });

  const ov = overviewData?.data;
  const an = analyticsData?.data;

  const isLoading = overviewLoading || analyticsLoading;

  // ── Skeleton ──
  if (overviewLoading && !ov) {
    return (
      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-64 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const revenueSegments = [
    { label: "Commission", value: ov?.revenue.platformCommission || 0, color: "#F97316" },
    { label: "Lawyer payout", value: (ov?.revenue.totalGross || 0) - (ov?.revenue.platformCommission || 0), color: "#F3F4F6" },
  ];

  const consultSegments = [
    { label: "Completed", value: ov?.consultations.completed || 0, color: "#10B981" },
    { label: "Active",    value: ov?.consultations.active    || 0, color: "#3B82F6" },
    { label: "Disputed",  value: ov?.consultations.disputed  || 0, color: "#EF4444" },
  ];

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">LawTicha platform overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
            {(["7d", "30d", "90d", "1y"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${period === p ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users}        label="Total Citizens"     value={ov?.citizens.total       || 0} sub={`+${ov?.citizens.newThisWeek || 0} this week`}              trend={ov?.citizens.growthPercent}    trendLabel="vs last period" color="#F97316" bg="#FFF0F5" href="/admin/citizens" />
        <StatCard icon={Scale}        label="Verified Lawyers"   value={ov?.lawyers.verified     || 0} sub={`${ov?.lawyers.pendingVerification || 0} pending review`}   color="#10B981" bg="#ECFDF5" href="/admin/lawyers" />
        <StatCard icon={MessageSquare} label="Consultations"     value={ov?.consultations.total  || 0} sub={`${ov?.consultations.active || 0} active`}                  color="#3B82F6" bg="#EFF6FF" href="/admin/consultations" />
        <StatCard icon={DollarSign}   label="Platform Revenue"  value={formatCurrency(ov?.revenue.platformCommission || 0)} sub={`${formatCurrency(ov?.revenue.totalGross || 0)} gross`} trend={ov?.revenue.growthPercent} trendLabel="vs last month" color="#F59E0B" bg="#FFFBEB" />
      </div>

      {/* Secondary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Activity}     label="Active Sessions"   value={ov?.consultations.active    || 0} color="#10B981" bg="#ECFDF5" />
        <StatCard icon={AlertTriangle} label="Disputes"         value={ov?.consultations.disputed  || 0} color="#EF4444" bg="#FEF2F2" href="/admin/consultations" />
        <StatCard icon={ShieldAlert}  label="Pending Reviews"   value={ov?.community.pendingReview || 0} color="#F59E0B" bg="#FFFBEB" href="/admin/community" />
        <StatCard icon={BookOpen}     label="Pending Orders"    value={ov?.library.pendingOrders   || 0} color="#8B5CF6" bg="#F5F3FF" href="/admin/library" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">

        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-bold text-[#111827]">Revenue</h3>
              <p className="text-[11px] text-[#9CA3AF]">Gross vs commission over time</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#F97316] inline-block" /> Commission</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#BFDBFE] inline-block" /> Gross</span>
            </div>
          </div>
          {an?.revenue?.length ? (
            <div className="flex items-end gap-1 h-36">
              {an.revenue.map((d, i) => {
                const maxGross = Math.max(...an.revenue.map(r => r.gross), 1);
                const gPct = Math.max((d.gross / maxGross) * 100, 3);
                const cPct = Math.max((d.commission / maxGross) * 100, 3);
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 bg-[#111827] text-white text-[9px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                      Gross: ₦{d.gross.toLocaleString()}<br />Commission: ₦{d.commission.toLocaleString()}
                    </div>
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t-sm bg-[#BFDBFE]" style={{ height: `${gPct}%` }} />
                      <div className="w-full rounded-t-sm bg-[#F97316] absolute bottom-5" style={{ height: `${cPct}%` }} />
                    </div>
                    <span className="text-[9px] text-[#D1D5DB]">{d.label?.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center">
              <p className="text-[12px] text-[#9CA3AF]">No data for selected period</p>
            </div>
          )}
        </div>

        {/* Donut breakdown */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-[14px] font-bold text-[#111827]">Consultations</h3>
            <p className="text-[11px] text-[#9CA3AF]">Status breakdown</p>
          </div>
          <div className="flex items-center justify-center">
            <DonutChart segments={consultSegments} size={100} />
          </div>
          <div className="flex flex-col gap-2">
            {consultSegments.map(seg => {
              const total = consultSegments.reduce((s, x) => s + x.value, 0) || 1;
              const pct = Math.round((seg.value / total) * 100);
              return (
                <div key={seg.label} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[#6B7280]">{seg.label}</span>
                  </div>
                  <span className="font-semibold text-[#111827]">{seg.value.toLocaleString()} <span className="text-[#9CA3AF] font-normal">({pct}%)</span></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User growth + mode breakdown */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-bold text-[#111827]">User Growth</h3>
              <p className="text-[11px] text-[#9CA3AF]">Citizens vs Lawyers</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#F97316] inline-block" /> Citizens</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#3B82F6] inline-block" /> Lawyers</span>
            </div>
          </div>
          {an?.userGrowth?.length ? (
            <div className="flex items-end gap-1 h-28">
              {an.userGrowth.slice(-14).map((d, i) => {
                const maxC = Math.max(...an.userGrowth.map(x => x.citizens), 1);
                return (
                  <div key={i} className="flex flex-col items-end gap-0.5 flex-1 group relative">
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#111827] text-white text-[9px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                      Citizens: {d.citizens} | Lawyers: {d.lawyers}
                    </div>
                    <div className="w-full rounded-t-sm bg-[#F97316] opacity-70" style={{ height: `${Math.max((d.citizens / maxC) * 100, 3)}%` }} />
                    <div className="w-full rounded-t-sm bg-[#3B82F6]" style={{ height: `${Math.max((d.lawyers / Math.max(...an.userGrowth.map(x => x.lawyers), 1)) * 100, 3)}%` }} />
                    <span className="text-[8px] text-[#D1D5DB]">{d.label?.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center"><p className="text-[12px] text-[#9CA3AF]">No data</p></div>
          )}
        </div>

        {/* Consultation mode + specialism */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-[#111827] mb-4">Consultation Modes</h3>
          {an?.consultationsByMode ? (
            <div className="space-y-3">
              {[
                { label: "Written message", value: an.consultationsByMode.message, color: "#10B981" },
                { label: "Scheduled call",  value: an.consultationsByMode.call,    color: "#3B82F6" },
                { label: "Video session",   value: an.consultationsByMode.video,   color: "#8B5CF6" },
              ].map(item => {
                const total = Object.values(an.consultationsByMode).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#6B7280]">{item.label}</span>
                      <span className="font-semibold text-[#111827]">{item.value.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-[12px] text-[#9CA3AF]">No data</p>}

          {an?.lawyersBySpecialism && an.lawyersBySpecialism.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Lawyers by specialism</p>
              <div className="flex flex-wrap gap-1.5">
                {an.lawyersBySpecialism.slice(0, 8).map(s => (
                  <span key={s.specialism} className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">
                    {s.specialism} <span className="text-[#9CA3AF]">({s.count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Pending actions + Top lawyers + Activity feed */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Pending actions */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#111827]">Pending Actions</h3>
            {an?.pendingActions && an.pendingActions.length > 0 && (
              <span className="text-[10px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded-full">
                {an.pendingActions.length}
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {an?.pendingActions && an.pendingActions.length > 0 ? an.pendingActions.map(action => {
              const s = URGENCY_STYLE[action.urgency];
              return (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: s.bg, borderColor: s.border }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: s.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold" style={{ color: s.text }}>{action.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: s.text, opacity: 0.7 }}>{action.subtitle}</p>
                  </div>
                  {action.count && action.count > 1 && (
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color: s.text }}>{action.count}</span>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <CheckCircle size={24} className="text-[#10B981] mx-auto mb-2" />
                <p className="text-[12px] text-[#9CA3AF]">All clear!</p>
              </div>
            )}
          </div>
        </div>

        {/* Top lawyers */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#111827]">Top Lawyers</h3>
            <Link href="/admin/reviews" className="text-[11px] text-[#F97316] font-semibold hover:underline">View all</Link>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {an?.topLawyers && an.topLawyers.length > 0 ? an.topLawyers.slice(0, 5).map((l, i) => (
              <div key={l.lawyerId} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#D1D5DB] w-4 flex-shrink-0">{i + 1}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${l.colorA}, ${l.colorA}80)` }}>
                  {l.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#111827] truncate">{l.fullName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-[#111827]">{l.rating?.toFixed(1)}</span>
                    <span className="text-[10px] text-[#9CA3AF]">({l.reviewCount})</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-bold text-[#111827]">{l.consultationCount}</p>
                  <p className="text-[9px] text-[#9CA3AF]">sessions</p>
                </div>
              </div>
            )) : (
              <p className="text-[12px] text-[#9CA3AF] text-center py-6">No data yet</p>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#111827]">Recent Activity</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] text-[#10B981] font-semibold">Live</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-80 overflow-y-auto">
            {an?.recentActivity && an.recentActivity.length > 0 ? an.recentActivity.slice(0, 12).map(item => {
              const cfg = ACTIVITY_COLORS[item.type] || ACTIVITY_COLORS.consultation_booked;
              const Icon = cfg.icon;
              return (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                    <Icon size={12} style={{ color: cfg.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#374151] leading-snug">
                      <span className="font-semibold">{item.actorName}</span>{" "}
                      <span className="text-[#9CA3AF]">{item.description}</span>
                    </p>
                    <p className="text-[10px] text-[#D1D5DB] mt-0.5">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[12px] text-[#9CA3AF] text-center py-6">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}