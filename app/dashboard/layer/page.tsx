"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, BookOpen, Clock, Award, BarChart2 } from "lucide-react";

//  Mock data 
const USER = { name: "Stephen", initials: "SO" };

const STATS = [
  { icon: BookOpen,  color: "#F59E0B", bg: "#FFFBEB", value: 20, label: "Completed"      },
  { icon: Clock,     color: "#3B82F6", bg: "#EFF6FF", value:  6, label: "In Progress"    },
  { icon: Award,     color: "#10B981", bg: "#ECFDF5", value:  3, label: "Certificates"   },
  { icon: BarChart2, color: "#E8317A", bg: "#FFF0F5", value: "84h", label: "Study Time"  },
];

// Hours Spent data (Study vs Assessment)
const CHART_DATA = [
  { month: "Jan", study: 28, exam: 12 },
  { month: "Feb", study: 38, exam: 15 },
  { month: "Mar", study: 52, exam: 22 },
  { month: "Apr", study: 38, exam: 18 },
  { month: "May", study: 44, exam: 14 },
  { month: "Jun", study: 22, exam: 8  },
];
const MAX_VAL = 60;

const MESSAGES = [
  { initials: "AO", color: "#3B82F6", name: "Adaeze Okonkwo",  preview: "Your consultation is confirmed...", time: "11:30 AM", unread: 2, typing: true },
  { initials: "EN", color: "#10B981", name: "Emeka Nwosu",     preview: "Thank you for the review.",         time: "Today",    unread: 0, typing: false },
  { initials: "FB", color: "#8B5CF6", name: "Fatimah Bello",   preview: "You missed the session.",           time: "Today",    unread: 0, typing: false },
];

const ONGOING = [
  {
    icon: "🚔",
    color: "#3B82F6",
    title: "Rights During Arrest & Detention",
    date: "Apr 1, 2025",
    rating: 4.3,
    lessons: 10,
    progress: 65,
    instructor: "Adaeze Okonkwo",
  },
  {
    icon: "🏠",
    color: "#10B981",
    title: "Tenant & Landlord Law",
    date: "Mar 15, 2025",
    rating: 4.1,
    lessons: 8,
    progress: 30,
    instructor: "Emeka Nwosu",
  },
];

//  Chart bar component 
function ChartBar({ val, max, color, tooltip, month }: {
  val: number; max: number; color: string; tooltip: string; month?: string;
}) {
  const [show, setShow] = useState(false);
  const h = Math.round((val / max) * 140);
  return (
    <div className="flex flex-col items-center gap-1 flex-1 relative group"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg z-10">
          {tooltip}
        </div>
      )}
      <div className="w-full rounded-t-lg transition-all duration-300" style={{ height: h, background: color, minHeight: 4, opacity: show ? 1 : 0.85 }} />
      {month && <span className="text-[10px] text-gray-400">{month}</span>}
    </div>
  );
}

//  Main 
export default function DashboardOverviewPage() {
  const [msgTab, setMsgTab] = useState<"project" | "direct">("project");

  return (
    <div className="flex-1 p-5 xl:p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good Morning, {USER.name} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Let's learn something new today!</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 transition-colors shadow-sm">
            <Search size={16} className="text-gray-500" />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 transition-colors shadow-sm">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8317A] rounded-full" />
          </button>
          <Link
            href="/dashboard/marketplace"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
          >
            Find a Lawyer
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Messages row */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 mb-7">

        {/* Hours Spent chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-base">Hours Spent</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#E8317A" }} /> Study
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-gray-200" /> Assessments
              </div>
            </div>
          </div>

          {/* Y axis labels + bars */}
          <div className="flex gap-3">
            {/* Y labels */}
            <div className="flex flex-col justify-between text-right pr-1 pb-5" style={{ height: 165 }}>
              {[60, 40, 20, 0].map((v) => (
                <span key={v} className="text-[10px] text-gray-400">{v} Hr</span>
              ))}
            </div>

            {/* Bars */}
            <div className="flex-1 relative">
              {/* Gridlines */}
              <div className="absolute inset-0 bottom-5 flex flex-col justify-between pointer-events-none">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="w-full h-px bg-gray-100" />
                ))}
              </div>

              {/* Bar pairs */}
              <div className="flex items-end gap-2 pb-5" style={{ height: 165 }}>
                {CHART_DATA.map((d, i) => (
                  <div key={d.month} className="flex items-end gap-0.5 flex-1">
                    <ChartBar val={d.study} max={MAX_VAL} color="#E8317A"
                      tooltip={`${d.month}: ${d.study}h Study`} />
                    <ChartBar val={d.exam} max={MAX_VAL} color="#E5E7EB"
                      tooltip={`${d.month}: ${d.exam}h Assessment`} month={d.month} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="font-bold text-gray-900 text-base mb-4">Messages</h2>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
            {(["project", "direct"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMsgTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  msgTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "project" ? "Lawyer Messages" : "Direct"}
              </button>
            ))}
          </div>

          {/* Message list */}
          <div className="flex flex-col gap-3">
            {MESSAGES.map((msg) => (
              <div key={msg.name} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${msg.color}, ${msg.color}80)` }}
                >
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-900 truncate">{msg.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{msg.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {msg.typing ? <em className="text-[#E8317A] not-italic">Typing…</em> : msg.preview}
                  </p>
                </div>
                {msg.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E8317A] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {msg.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ongoing Modules */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 text-base">Ongoing Modules</h2>
          <Link href="/dashboard/learn" className="text-xs font-semibold text-[#E8317A] hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60">
                {["Module Name", "Date Started", "Rating", "Lessons", "Progress", "Legal Expert"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ONGOING.map((m, i) => (
                <tr key={m.title} className={`transition-colors hover:bg-gray-50/70 ${i < ONGOING.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: `${m.color}15` }}>
                        {m.icon}
                      </div>
                      <Link href={`/dashboard/learn/${m.title.toLowerCase().replace(/\s+/g,"-")}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[#E8317A] transition-colors truncate max-w-[200px]">
                        {m.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{m.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      ★ {m.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{m.lessons}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-1.5 rounded-full" style={{ width: `${m.progress}%`, background: m.color }} />
                      </div>
                      <span className="text-[10px] text-gray-400">{m.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{m.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
