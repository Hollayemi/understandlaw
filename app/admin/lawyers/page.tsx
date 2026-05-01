"use client";
import React, { useState } from "react";
import {
  Scale, BadgeCheck, Star, TrendingUp, Download,
  MoreHorizontal, Eye, Ban, Mail, MapPin, Calendar,
  MessageSquare, Filter, Clock, Award, ShieldX, Users,
} from "lucide-react";
import {
  StatBar, FilterBar, Table, StatusBadge, Avatar, PageHeader,
} from "../_components";

// ─── Types ────────────────────────────────────────────────────────────────────
type LawyerStatus = "active" | "inactive" | "pending";

interface Lawyer {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  state: string;
  specialisms: string[];
  nbaNumber: string;
  yearsCall: number;
  joinedAt: string;
  status: LawyerStatus;
  rating: number;
  reviewCount: number;
  consultations: number;
  responseTime: string;
  badges: string[];
  lastActive: string;
  available: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LAWYERS: Lawyer[] = [
  {
    id: "l001", name: "Adaeze Okonkwo",  initials: "AO", color: "#1E3A5F",
    email: "adaeze@lawticha.ng", phone: "08012345678", state: "Lagos",
    specialisms: ["Criminal", "Employment"], nbaNumber: "NBA/LAG/2014/01847",
    yearsCall: 10, joinedAt: "Jan 5, 2025", status: "active",
    rating: 4.9, reviewCount: 84, consultations: 312,
    responseTime: "< 1 hr", badges: ["Verified", "Top Rated", "Responsive"],
    lastActive: "2 hours ago", available: true,
  },
  {
    id: "l002", name: "Emeka Nwosu",     initials: "EN", color: "#1A3B2E",
    email: "emeka@lawticha.ng",  phone: "08098765432", state: "Abuja",
    specialisms: ["Property", "Business"], nbaNumber: "NBA/ABJ/2012/00934",
    yearsCall: 12, joinedAt: "Jan 10, 2025", status: "active",
    rating: 4.8, reviewCount: 112, consultations: 487,
    responseTime: "< 2 hrs", badges: ["Verified", "Top Rated"],
    lastActive: "5 hours ago", available: true,
  },
  {
    id: "l003", name: "Fatimah Bello",   initials: "FB", color: "#2D1A3B",
    email: "fatimah@lawticha.ng", phone: "07011223344", state: "Kano",
    specialisms: ["Family", "Criminal"], nbaNumber: "NBA/KAN/2016/02211",
    yearsCall: 8, joinedAt: "Jan 20, 2025", status: "active",
    rating: 4.7, reviewCount: 56, consultations: 198,
    responseTime: "< 3 hrs", badges: ["Verified", "Responsive"],
    lastActive: "1 day ago", available: false,
  },
  {
    id: "l004", name: "Chidi Okafor",    initials: "CO", color: "#1A2D3B",
    email: "chidi@lawticha.ng",  phone: "08055667788", state: "Lagos",
    specialisms: ["Business", "Consumer"], nbaNumber: "NBA/LAG/2015/03102",
    yearsCall: 9, joinedAt: "Feb 2, 2025", status: "active",
    rating: 4.6, reviewCount: 73, consultations: 254,
    responseTime: "< 2 hrs", badges: ["Verified", "Top Rated"],
    lastActive: "3 hours ago", available: true,
  },
  {
    id: "l005", name: "Ngozi Eze",       initials: "NE", color: "#2D1A1A",
    email: "ngozi@lawticha.ng",  phone: "09055443322", state: "Rivers",
    specialisms: ["Employment", "Consumer"], nbaNumber: "NBA/PHC/2017/01563",
    yearsCall: 7, joinedAt: "Feb 14, 2025", status: "active",
    rating: 4.8, reviewCount: 49, consultations: 163,
    responseTime: "< 1 hr", badges: ["Verified", "Responsive"],
    lastActive: "6 hours ago", available: true,
  },
  {
    id: "l006", name: "Abubakar Sadiq",  initials: "AS", color: "#2A2D1A",
    email: "abubakar@lawticha.ng", phone: "08033221100", state: "Kaduna",
    specialisms: ["Property", "Road Traffic"], nbaNumber: "NBA/KAD/2018/00789",
    yearsCall: 6, joinedAt: "Mar 1, 2025", status: "inactive",
    rating: 4.5, reviewCount: 38, consultations: 121,
    responseTime: "< 4 hrs", badges: ["Verified"],
    lastActive: "3 weeks ago", available: false,
  },
  {
    id: "l007", name: "Obiageli Nwachukwu", initials: "ON", color: "#1E4040",
    email: "obi.n@lawticha.ng", phone: "07077665544", state: "Anambra",
    specialisms: ["Family", "Employment"], nbaNumber: "NBA/AWK/2019/00456",
    yearsCall: 5, joinedAt: "Mar 15, 2025", status: "pending",
    rating: 0, reviewCount: 0, consultations: 0,
    responseTime: "N/A", badges: [],
    lastActive: "Just joined", available: false,
  },
];

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "Verified":   { bg: "#FFFBEB", text: "#92400E" },
  "Top Rated":  { bg: "#ECFDF5", text: "#065F46" },
  "Responsive": { bg: "#EFF6FF", text: "#1E3A8A" },
};

// ─── Lawyer Detail Drawer ─────────────────────────────────────────────────────
function LawyerDrawer({ lawyer, onClose }: { lawyer: Lawyer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${lawyer.color}, ${lawyer.color}99)` }} />
        <div className="p-6 border-b border-[#F3F4F6]">
          <div className="flex items-start gap-4">
            <Avatar initials={lawyer.initials} color={lawyer.color} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[#111827]">{lawyer.name}</h2>
              <p className="text-xs text-[#6B7280]">{lawyer.specialisms.join(" · ")}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {lawyer.badges.map(b => (
                  <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: BADGE_COLORS[b]?.bg, color: BADGE_COLORS[b]?.text }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors text-lg font-light">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Rating",    value: lawyer.rating > 0 ? `★ ${lawyer.rating}` : "N/A" },
              { label: "Reviews",   value: lawyer.reviewCount },
              { label: "Sessions",  value: lawyer.consultations },
            ].map(s => (
              <div key={s.label} className="bg-[#F9FAFB] rounded-xl p-3 text-center border border-[#F3F4F6]">
                <p className="text-sm font-bold text-[#111827]">{s.value}</p>
                <p className="text-[10px] text-[#9CA3AF]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[
              { icon: Mail,     label: "Email",        value: lawyer.email },
              { icon: MapPin,   label: "State",        value: lawyer.state },
              { icon: Calendar, label: "Joined",       value: lawyer.joinedAt },
              { icon: BadgeCheck, label: "NBA Number", value: lawyer.nbaNumber },
              { icon: Award,    label: "Year of Call", value: `${lawyer.yearsCall} years` },
              { icon: Clock,    label: "Response",     value: lawyer.responseTime },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-[13px]">
                <Icon size={13} className="text-[#9CA3AF] flex-shrink-0" />
                <span className="text-[#9CA3AF] w-24 flex-shrink-0">{label}</span>
                <span className="font-medium text-[#111827] truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              Send Message
            </button>
            <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#EF4444] border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
              Suspend Lawyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Row Actions ──────────────────────────────────────────────────────────────
function ActionsMenu({ lawyer, onView }: { lawyer: Lawyer; onView: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1">
            {[
              { icon: Eye, label: "View Profile", action: () => { onView(); setOpen(false); }, color: "#111827" },
              { icon: Mail, label: "Send Email", action: () => setOpen(false), color: "#111827" },
              { icon: Ban, label: "Suspend", action: () => setOpen(false), color: "#EF4444" },
            ].map(({ icon: Icon, label, action, color }) => (
              <button key={label} onClick={action}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-left"
                style={{ color }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LawyersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  const stats = [
    { label: "Total Lawyers",  value: LAWYERS.length,                                            icon: Scale,      color: "#E8317A", bg: "#FFF0F5" },
    { label: "Active",         value: LAWYERS.filter(l => l.status === "active").length,         icon: BadgeCheck, color: "#10B981", bg: "#ECFDF5" },
    { label: "Avg Rating",     value: (LAWYERS.filter(l => l.rating > 0).reduce((s, l) => s + l.rating, 0) / LAWYERS.filter(l => l.rating > 0).length).toFixed(1),
                                                                                                  icon: Star,       color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Pending Review", value: LAWYERS.filter(l => l.status === "pending").length,        icon: Clock,      color: "#9CA3AF", bg: "#F9FAFB" },
  ];

  const filtered = LAWYERS.filter(l => {
    if (tab === "active"   && l.status !== "active")   return false;
    if (tab === "inactive" && l.status !== "inactive") return false;
    if (tab === "pending"  && l.status !== "pending")  return false;
    if (search) {
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.nbaNumber.toLowerCase().includes(q) || l.state.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      key: "lawyer",
      header: "Lawyer",
      render: (l: Lawyer) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar initials={l.initials} color={l.color} size="md" />
            {l.available && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white" />}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{l.name}</p>
            <p className="text-[11px] text-[#9CA3AF]">{l.nbaNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialisms",
      header: "Specialisms",
      render: (l: Lawyer) => (
        <div className="flex flex-wrap gap-1">
          {l.specialisms.map(s => (
            <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280]">{s}</span>
          ))}
        </div>
      ),
    },
    {
      key: "location",
      header: "State",
      render: (l: Lawyer) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <MapPin size={11} className="text-[#9CA3AF]" /> {l.state}
        </div>
      ),
    },
    {
      key: "performance",
      header: "Performance",
      render: (l: Lawyer) => (
        l.rating > 0 ? (
          <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
            <span className="text-amber-500 font-semibold">★ {l.rating}</span>
            <span className="flex items-center gap-1"><MessageSquare size={10} /> {l.consultations}</span>
          </div>
        ) : <span className="text-[11px] text-[#D1D5DB]">No data yet</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (l: Lawyer) => <StatusBadge status={l.status} />,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (l: Lawyer) => <span className="text-[12px] text-[#6B7280]">{l.lastActive}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      render: (l: Lawyer) => <ActionsMenu lawyer={l} onView={() => setSelectedLawyer(l)} />,
    },
  ];

  return (
    <>
      {selectedLawyer && <LawyerDrawer lawyer={selectedLawyer} onClose={() => setSelectedLawyer(null)} />}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Lawyers"
          subtitle="NBA-verified legal professionals on the LawTicha marketplace."
          action={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
              <Download size={13} /> Export CSV
            </button>
          }
        />

        <StatBar items={stats} />

        <FilterBar
          options={[
            { value: "all",      label: "All",      count: LAWYERS.length },
            { value: "active",   label: "Active",   count: LAWYERS.filter(l => l.status === "active").length },
            { value: "inactive", label: "Inactive", count: LAWYERS.filter(l => l.status === "inactive").length },
            { value: "pending",  label: "Pending",  count: LAWYERS.filter(l => l.status === "pending").length },
          ]}
          value={tab}
          onChange={setTab}
          searchPlaceholder="Search by name, NBA number, or state…"
          searchValue={search}
          onSearchChange={setSearch}
          rightSlot={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              <Filter size={13} /> More Filters
            </button>
          }
        />

        <Table
          columns={columns}
          data={filtered}
          keyField="id"
          emptyMessage="No lawyers match your search."
          emptyIcon={<Scale size={36} />}
        />

        <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
          <span>Showing {filtered.length} of {LAWYERS.length} lawyers</span>
          <div className="flex items-center gap-1">
            {[1, 2, "…", 5].map((p, i) => (
              <button key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${
                  p === 1 ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
