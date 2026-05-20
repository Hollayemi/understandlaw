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
  STATUS_CONFIG,
} from "../_components";
import { useListCitizensQuery } from "@/redux/slices/citizens.slice";
import { CitizenFull } from "@/redux/types";

//  Types 
type CitizenStatus = "active" | "inactive" | "warning";



//  Row Actions Menu 
function ActionsMenu({ citizen }: { citizen: CitizenFull }) {
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
              { icon: Eye, label: "View Profile", color: "#111827" },
              { icon: Mail, label: "Send Email", color: "#111827" },
              { icon: Ban, label: "Suspend Account", color: "#EF4444" },
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

//  Main Page 
export default function CitizensPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const { data } = useListCitizensQuery({})

  const CITIZENS = data?.data?.data || []

  console.log("Citizens data:", CITIZENS);

  const stats = [
    { label: "Total Citizens", value: CITIZENS?.length, icon: Users, color: "#E8317A", bg: "#FFF0F5" },
    { label: "Active", value: CITIZENS.filter(c => c.user.status === "active").length, icon: UserCheck, color: "#10B981", bg: "#ECFDF5" },
    { label: "Inactive", value: CITIZENS.filter(c => c.user.status === "inactive").length, icon: UserX, color: "#9CA3AF", bg: "#F9FAFB" },
    { label: "Flagged", value: CITIZENS.filter(c => c.user.status === "warning").length, icon: ShieldAlert, color: "#F59E0B", bg: "#FFFBEB" },
  ];

  const filtered = CITIZENS.filter(c => {
    if (tab === "active" && c.user.status !== "active") return false;
    if (tab === "inactive" && c.user.status !== "inactive") return false;
    if (tab === "flagged" && c.user.status !== "warning") return false;
    if (search) {
      const q = search.toLowerCase();
      return c.user.firstName.toLowerCase().includes(q) || c.user.email.toLowerCase().includes(q) || c.user.status.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      key: "citizen",
      header: "Citizen",
      render: (c: CitizenFull) => (
        <div className="flex items-center gap-3">
          <Avatar initials={c.user.firstName.charAt(0)} color={STATUS_CONFIG[c.user.status].text} size="md" />
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{c.user.fullName}</p>
            <p className="text-[11px] text-[#9CA3AF]">{c.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "State",
      render: (c: CitizenFull) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <MapPin size={11} className="text-[#9CA3AF]" />
          {c.profile.stateCode}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (c: CitizenFull) => (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <Calendar size={11} className="text-[#9CA3AF]" />
          {c.user.createdAt}
        </div>
      ),
    },
    {
      key: "activity",
      header: "Activity",
      render: (c: CitizenFull) => (
        <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1"><BookOpen size={10} /> {c.profile.topicsCompletedCount} topics</span>
          <span className="flex items-center gap-1"><MessageSquare size={10} /> {c.profile.totalStudyMinutes} minutes</span>
        </div>
      ),
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (c: CitizenFull) => <span className="text-[12px] text-[#6B7280]">{c.user.lastLoginAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c: CitizenFull) => <StatusBadge status={c.user.status} />,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      render: (c: CitizenFull) => <ActionsMenu citizen={c} />,
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
          { value: "all", label: "All", count: CITIZENS.length },
          { value: "active", label: "Active", count: CITIZENS.filter(c => c.user.status === "active").length },
          { value: "inactive", label: "Inactive", count: CITIZENS.filter(c => c.user.status === "inactive").length },
          { value: "flagged", label: "Flagged", count: CITIZENS.filter(c => c.user.status === "warning").length },
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
        keyField="user"
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${p === 1 ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
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
