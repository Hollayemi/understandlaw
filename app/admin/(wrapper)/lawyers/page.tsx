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
import { useAdminListLawyersQuery } from "@/redux/slices/admin/lawyer.slice";
import { formatTime, fullName, getInitial } from "@/utils/function";
import { LawyerFull } from "@/redux/types/lawyer";

//  Types 
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
  scnNumber: string;
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

//  Mock Data 

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "Verified":   { bg: "#FFFBEB", text: "#92400E" },
  "Top Rated":  { bg: "#ECFDF5", text: "#065F46" },
  "Responsive": { bg: "#EFF6FF", text: "#1E3A8A" },
};

//  Lawyer Detail Drawer 
function LawyerDrawer({ lawyer, onClose }: { lawyer: LawyerFull; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-1 w-full"  />
        <div className="p-6 border-b border-[#F3F4F6]">
          <div className="flex items-start gap-4">
            <Avatar initials={lawyer.avatarInitials || ""}  size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[#111827]">{lawyer.fullName}</h2>
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
              { label: "Sessions",  value: lawyer.consultationCount },
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
              { icon: Calendar, label: "Joined",       value: formatTime(lawyer.createdAt) },
              { icon: BadgeCheck, label: "SCN Number", value: lawyer.scnNumber },
              { icon: Award,    label: "Year of Call", value: `${lawyer.yearOfCall} years` },
              { icon: Clock,    label: "Response",     value: lawyer.responseTimeLabel },
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
              style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}>
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

//  Row Actions 
function ActionsMenu({ lawyer, onView }: { lawyer: LawyerFull; onView: () => void }) {
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


export default function LawyersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerFull | null>(null);

  const { data, isLoading } = useAdminListLawyersQuery({})

const lawyers = data?.data?.data || []

console.log(lawyers)

  const stats = [
    { label: "Total Lawyers",  value: lawyers.length,                                            icon: Scale,      color: "#9B2E3D", bg: "#FFF0F5" },
    { label: "Active",         value: lawyers.filter(l => l.isAvailable).length,         icon: BadgeCheck, color: "#10B981", bg: "#ECFDF5" },
    { label: "Avg Rating",     value: (lawyers.filter(l => l.rating > 0).reduce((s, l) => s + l.rating, 0) / lawyers.filter(l => l.rating > 0).length).toFixed(1),
                                                                                                  icon: Star,       color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Pending Review", value: lawyers.filter(l => l.verificationStatus === "pending").length,        icon: Clock,      color: "#9CA3AF", bg: "#F9FAFB" },
  ];

  const filtered = lawyers.filter(l => {
    if (tab === "active"   && l.isAvailable)   return false;
    if (tab === "inactive" && !l.isAvailable) return false;
    if (tab === "pending"  && l.verificationStatus !== "pending")  return false;
    if (search) {
      const q = search.toLowerCase();
      return l.fullName.toLowerCase().includes(q) || l.scnNumber.toLowerCase().includes(q) || l.state.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      key: "lawyer",
      header: "Lawyer",
      render: (l: LawyerFull) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar initials={l.avatarInitials}  size="md" />
            {l.isAvailable && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white" />}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{l.fullName}</p>
            <p className="text-[11px] text-[#9CA3AF]">{l.scnNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialisms",
      header: "Specialisms",
      render: (l: LawyerFull) => (
        <div className="flex flex-wrap gap-1">
          {l.specialisms.map(s => (
            <span key={s._id} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280]">{s.name}</span>
          ))}
        </div>
      ),
    },
    {
      key: "location",
      header: "State",
      render: (l: LawyerFull) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <MapPin size={11} className="text-[#9CA3AF]" /> {l.state}
        </div>
      ),
    },
    {
      key: "performance",
      header: "Performance",
      render: (l: LawyerFull) => (
        l?.rating > 0 ? (
          <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
            <span className="text-amber-500 font-semibold">★ {l.rating}</span>
            <span className="flex items-center gap-1"><MessageSquare size={10} /> {l.consultationCount}</span>
          </div>
        ) : <span className="text-[11px] text-[#D1D5DB]">No data yet</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (l: LawyerFull) => <StatusBadge status={l.verificationStatus} />,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (l: LawyerFull) => <span className="text-[12px] text-[#6B7280]">{formatTime(l.lastLoginAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      render: (l: LawyerFull) => <ActionsMenu lawyer={l} onView={() => setSelectedLawyer(l)} />,
    },
  ];

  return (
    <>
      {selectedLawyer && <LawyerDrawer lawyer={selectedLawyer} onClose={() => setSelectedLawyer(null)} />}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Lawyers"
          subtitle="SCN-verified legal professionals on the LawTicha marketplace."
          action={
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
              <Download size={13} /> Export CSV
            </button>
          }
        />

        <StatBar items={stats} />

        <FilterBar
          options={[
            { value: "all",      label: "All",      count: lawyers.length },
            { value: "active",   label: "Active",   count: lawyers.filter(l => l.isAvailable).length },
            { value: "inactive", label: "Inactive", count: lawyers.filter(l => !l.isAvailable).length },
            { value: "pending",  label: "Pending",  count: lawyers.filter(l => l.verificationStatus === "pending").length },
          ]}
          value={tab}
          onChange={setTab}
          searchPlaceholder="Search by name, SCN number, or state…"
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
          keyField="_id"
          emptyMessage="No lawyers match your search."
          emptyIcon={<Scale size={36} />}
        />

        <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
          <span>Showing {filtered.length} of {lawyers.length} lawyers</span>
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
