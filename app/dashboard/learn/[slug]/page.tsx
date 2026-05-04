"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, Maximize2, Star, Clock, BookOpen, Search, ChevronRight, Check } from "lucide-react";

//  Mock module data 
const MODULE = {
  slug:       "rights-during-arrest",
  title:      "Rights During Arrest & Detention",
  tag:        "Police & Law Enforcement",
  tagColor:   "#3B82F6",
  gradient:   "linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%)",
  icon:       '/images/police_law.jpg',
  rating:     4.3,
  weeks:      4,
  lessons:    14,
  instructor: { name: "Adaeze Okonkwo", email: "adaeze@understandlaw.ng", initials: "AO", color: "#3B82F6" },
  duration:   "30:45",
  currentTime: "00:46",
  progress:   2.5, // percent of video played
  description: `Understanding your rights during a police arrest is one of the most critical things every Nigerian should know. Section 35 of the 1999 Constitution guarantees your right to personal liberty,  and limits exactly what officers can lawfully do.

This module walks through the precise steps of a lawful arrest, what the police must tell you, your right to silence, and when detention beyond 24 hours becomes unlawful. Armed with this knowledge, you can protect yourself calmly and legally.`,
};

const TOPICS = [
  { title: "Understand the Basics of Arrest",              done: true  },
  { title: "What Police Must Tell You",                    done: true  },
  { title: "Your Right to Remain Silent",                  done: false, active: true },
  { title: "24-Hour Detention Rule",                       done: false },
  { title: "Lawful vs. Unlawful Arrest",                   done: false },
  { title: "What You Can & Cannot Refuse",                 done: false },
  { title: "How to Assert Your Rights Safely",             done: false },
  { title: "Bail During Arrest",                           done: false },
  { title: "Police Caution & Its Meaning",                 done: false },
  { title: "SARS-Specific Encounter Rights",               done: false },
  { title: "Documenting an Encounter",                     done: false },
  { title: "Section 35,  Full Text Explained",             done: false },
  { title: "Real-Life Scenario Walkthrough",               done: false },
  { title: "What to Do After an Unlawful Arrest",          done: false },
];

const completedCount = TOPICS.filter((t) => t.done).length;

//  Component 
export default function ModuleDetailPage() {
  const [playing, setPlaying] = useState(false);
  const [descOpen, setDescOpen] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 py-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/dashboard/learn" className="hover:text-gray-900 transition-colors">Learn</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link href="/dashboard/learn" className="hover:text-gray-900 transition-colors shrink-0">All Modules</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-900 font-semibold truncate max-w-[160px]">{MODULE.title}</span>
        </nav>
        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Search size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Main two-column layout */}
      <div className="grid xl:grid-cols-[1fr_340px] gap-6 p-5 xl:p-6">

        {/* LEFT,  content */}
        <div className="flex flex-col gap-5">

          {/* Video player */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Player viewport */}
            <div
              className="relative flex items-center justify-center"
              style={{ background: MODULE.gradient, aspectRatio: "16/9" }}
            >
              {/* Content preview */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <img src={MODULE.icon} alt={MODULE.title} className="w-full h-full object-cover" />
              </div>

              {/* Play button */}
              <button
                onClick={() => setPlaying(!playing)}
                className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all"
              >
                {playing
                  ? <Pause size={24} className="text-white" />
                  : <Play size={24} className="text-white ml-1" />
                }
              </button>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setPlaying(!playing)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                {playing ? <Pause size={14} className="text-gray-600" /> : <Play size={14} className="text-gray-600 ml-0.5" />}
              </button>

              {/* Progress bar */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 flex-shrink-0">{MODULE.currentTime}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden relative cursor-pointer">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${MODULE.progress}%`, background: "linear-gradient(90deg, #E8317A, #ff6fa8)" }}
                  />
                </div>
                <span className="text-[11px] text-gray-500 flex-shrink-0">{MODULE.duration}</span>
              </div>

              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0">
                <Maximize2 size={13} className="text-gray-500" />
              </button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0">
                <Volume2 size={13} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Instructor strip */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${MODULE.instructor.color}, ${MODULE.instructor.color}80)` }}
              >
                {MODULE.instructor.initials}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{MODULE.instructor.name}</p>
                <p className="text-xs text-gray-400">{MODULE.instructor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-semibold text-amber-500">
                <Star size={13} className="fill-amber-400 text-amber-400" />{MODULE.rating}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-gray-400" />{MODULE.weeks} weeks
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-gray-400" />{MODULE.lessons} lessons
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <h2 className="font-bold text-gray-900 text-sm truncate max-w-[120px]">{MODULE.title}</h2>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: MODULE.tagColor }}
                >
                  {MODULE.tag}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Description
                </span>
                <ChevronRight
                  size={16}
                  className={`text-gray-400 transition-transform ${descOpen ? "rotate-90" : ""}`}
                />
              </div>
            </button>

            {descOpen && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4 whitespace-pre-line">
                {MODULE.description}
              </div>
            )}
          </div>

          {/* Talk to a lawyer nudge */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #111827 0%, #1E3A5F 100%)" }}
          >
            <span className="text-3xl flex-shrink-0">⚖️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Need advice about your specific situation?</p>
              <p className="text-xs text-gray-400 mt-0.5">Our verified lawyers specialise in Police & Criminal Rights</p>
            </div>
            <Link
              href="/dashboard/marketplace"
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
            >
              Find Lawyer
            </Link>
          </div>
        </div>

        {/* RIGHT,  progress tracker */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Your Progress</h3>
              <span className="text-xs font-bold text-gray-500">
                {completedCount}/{TOPICS.length}
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="px-5 pt-3 pb-2">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / TOPICS.length) * 100}%`,
                    background: "linear-gradient(90deg, #E8317A, #ff6fa8)"
                  }}
                />
              </div>
            </div>

            {/* Topic list */}
            <div className="flex flex-col divide-y divide-gray-50">
              {TOPICS.map((topic, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                    topic.active ? "bg-pink-50/50" : topic.done ? "" : "opacity-60"
                  } ${!topic.done ? "hover:bg-gray-50 cursor-pointer" : ""}`}
                >
                  {/* Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      topic.done
                        ? "bg-[#E8317A] border-[#E8317A]"
                        : topic.active
                        ? "border-[#E8317A] bg-white"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {topic.done ? (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    ) : topic.active ? (
                      <div className="w-2 h-2 rounded-full bg-[#E8317A]" />
                    ) : null}
                  </div>

                  <span
                    className={`text-xs leading-snug flex-1 ${
                      topic.done
                        ? "text-gray-400 line-through"
                        : topic.active
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {topic.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Completion nudge */}
            <div className="px-5 py-4 bg-gray-50/60 border-t border-gray-50">
              <p className="text-[11px] text-gray-500 text-center">
                Complete all topics to earn your{" "}
                <span className="text-[#E8317A] font-semibold">Certificate of Completion</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
