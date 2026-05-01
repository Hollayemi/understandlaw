"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users, UserCheck, UserX, ShieldAlert, Download,
  MoreHorizontal, Eye, Ban, Mail, Phone, MapPin,
  Calendar, BookOpen, MessageSquare, ChevronRight,
  Filter, RefreshCw, TrendingUp,
} from "lucide-react";
import {
  StatBar, FilterBar, Table, StatusBadge, Avatar, PageHeader,
} from "../_components";

// ─── Types ────────────────────────────────────────────────────────────────────
type CitizenStatus = "active" | "inactive" | "warning";

interface Citizen {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  state: string;
  joinedAt: string;
  status: CitizenStatus;
  topicsRead: number;
  consultations: number;
  lastActive: string;
  reportCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CITIZENS: Citizen[] = [
  { id: "u001", name: "Chidinma Okafor",  initials: "CO", color: "#3B82F6", email: "chidinma@gmail.com",  phone: "08012345678", state: "Enugu",         joinedAt: "Jan 12, 2025",  status: "active",   topicsRead: 14, consultations: 2, lastActive: "2 hours ago",   reportCount: 0 },
  { id: "u002", name: "Babatunde Lawal",  initials: "BL", color: "#10B981", email: "babatunde@yahoo.com", phone: "08098765432", state: "Lagos",         joinedAt: "Feb 3, 2025",   status: "active",   topicsRead: 22, consultations: 1, lastActive: "1 day ago",     reportCount: 0 },
  { id: "u003", name: "Amina Garba",      initials: "AG", color: "#8B5CF6", email: "amina.g@hotmail.com", phone: "07011223344", state: "Kano",          joinedAt: "Feb 18, 2025",  status: "active",   topicsRead:  9, consultations: 0, lastActive: "3 days ago",    reportCount: 0 },
  { id: "u004", name: "Ikechukwu Eze",    initials: "IE", color: "#F59E0B", email: "ikechukwu@gmail.com", phone: "09055667788", state: "Port Harcourt", joinedAt: "Mar 1, 2025",   status: "active",   topicsRead: 31, consultations: 3, lastActive: "5 hours ago",   reportCount: 0 },
  { id: "u005", name: "Funmilayo Adeyemi",initials: "FA", color: "#EF4444", email: "funmi.a@gmail.com",   phone: "08033445566", state: "Ibadan",        joinedAt: "Mar 14, 2025",  status: "warning",  topicsRead:  4, consultations: 0, lastActive: "2 weeks ago",   reportCount: 2 },
  { id: "u006", name: "Emeka Obi",        initials: "EO", color: "#06B6D4", email: "emekaobi@live.com",   phone: "08077889900", state: "Anambra",       joinedAt: "Mar 28, 2025",  status: "active",   topicsRead: 18, consultations: 1, lastActive: "6 hours ago",   reportCount: 0 },
  { id: "u007", name: "Halima Yusuf",     initials: "HY", color: "#EC4899", email: "halima.y@gmail.com",  phone: "07022334455", state: "Kaduna",        joinedAt: "Apr 2, 2025",   status: "inactive", topicsRead:  2, consultations: 0, lastActive: "1 month ago",   reportCount: 0 },
  { id: "u008", name: "Chukwuemeka Nwosu",initials: "CN", color: "#F97316", email: "c.nwosu@gmail.com",   phone: "08099887766", state: "Lagos",         joinedAt: "Apr 9, 2025",   status: "warning",  topicsRead:  7, consultations: 0, lastActive: "3 days ago",    reportCount: 1 },
  { id: "u009", name: "Adaeze Onyekachi", initials: "AO", color: "#6366F1", email: "adaeze.o@email.ng",   phone: "07033445566", state: "Abuja",         joinedAt: "Apr 15, 2025",  status: "active",   topicsRead: 26, consultations: 4, lastActive: "1 hour ago",    reportCount: 0 },
  { id: "u010", name: "Mustapha Ibrahim", initials: "MI", color: "#14B8A6", email: "mustapha.i@gmail.com",phone: "08055443322", state: "Sokoto",        joinedAt: "Apr 20, 2025",  status: "active",   topicsRead:  5, consultations: 0, lastActive: "4 days ago",    reportCount: 0 },
];

// ─── Row Actions Menu ─────────────────────────────────────────────────────────
function ActionsMenu({ citizen }: { citizen: Citizen }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 overflow-hidden">
            {[
              { icon: Eye,  label: "View Profile",    color: "#111827" },
              { icon: Mail, label: "Send Email",       color: "#111827" },
              { icon: Ban,  label: "Suspend Account",  color: "#EF4444" },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] transition-colors text-left"
                style={{ color }}
                onClick={() => setOpen(false)}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CitizensPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const stats = [
    { label: "Total Citizens", value: CITIZENS.length,                                              icon: Users,      color: "#E8317A", bg: "#FFF0F5" },
    { label: "Active",         value: CITIZENS.filter(c => c.status === "active").length,           icon: UserCheck,  color: "#10B981", bg: "#ECFDF5" },
    { label: "Inactive",       value: CITIZENS.filter(c => c.status === "inactive").length,         icon: UserX,      color: "#9CA3AF", bg: "#F9FAFB" },
    { label: "Flagged",        value: CITIZENS.filter(c => c.status === "warning").length,          icon: ShieldAlert, color: "#F59E0B", bg: "#FFFBEB" },
  ];

  const filtered = CITIZENS.filter(c => {
    if (tab === "active"   && c.status !== "active")   return false;
    if (tab === "inactive" && c.status !== "inactive") return false;
    if (tab === "flagged"  && c.status !== "warning")  return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      key: "citizen",
      header: "Citizen",
      render: (c: Citizen) => (
        <div className="flex items-center gap-3">
          <Avatar initials={c.initials} color={c.color} size="md" />
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{c.name}</p>
            <p className="text-[11px] text-[#9CA3AF]">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "State",
      render: (c: Citizen) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <MapPin size={11} className="text-[#9CA3AF]" />
          {c.state}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (c: Citizen) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <Calendar size={11} className="text-[#9CA3AF]" />
          {c.joinedAt}
        </div>
      ),
    },
    {
      key: "activity",
      header: "Activity",
      render: (c: Citizen) => (
        <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1"><BookOpen size={10} /> {c.topicsRead} topics</span>
          <span className="flex items-center gap-1"><MessageSquare size={10} /> {c.consultations} sessions</span>
        </div>
      ),
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (c: Citizen) => <span className="text-[12px] text-[#6B7280]">{c.lastActive}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c: Citizen) => <StatusBadge status={c.status} />,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      render: (c: Citizen) => <ActionsMenu citizen={c} />,
    },
  ];

  return (
    <div className="p-6 xl:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Citizens"
        subtitle="All registered users on the LawTicha platform."
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:border-[#9CA3AF] transition-colors">
            <Download size={13} />
            Export CSV
          </button>
        }
      />

      <StatBar items={stats} />

      <FilterBar
        options={[
          { value: "all",      label: "All",      count: CITIZENS.length },
          { value: "active",   label: "Active",   count: CITIZENS.filter(c => c.status === "active").length },
          { value: "inactive", label: "Inactive", count: CITIZENS.filter(c => c.status === "inactive").length },
          { value: "flagged",  label: "Flagged",  count: CITIZENS.filter(c => c.status === "warning").length },
        ]}
        value={tab}
        onChange={setTab}
        searchPlaceholder="Search by name, email, or state…"
        searchValue={search}
        onSearchChange={setSearch}
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
            <Filter size={13} />
            More Filters
          </button>
        }
      />

      <Table
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No citizens match your search."
        emptyIcon={<Users size={36} />}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
        <span>Showing {filtered.length} of {CITIZENS.length} citizens</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, "…", 12].map((p, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${
                p === 1 ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
