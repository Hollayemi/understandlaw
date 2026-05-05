"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Filter, MapPin, Star, Clock, Shield, Zap,
  CheckCircle, MessageSquare, Video, Phone, Calendar,
  ChevronRight, ChevronDown, X, ArrowRight, Send,
  BadgeCheck, Award, TrendingUp, Users, Lock,
  FileText, AlertCircle, ChevronLeft, Loader2,
  SlidersHorizontal, BookOpen, Briefcase, Building2,
  Scale, Home, Heart, Car, Globe, Check, Plus,
  Bell, UserPlus, ClipboardList, Sparkles, Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Lawyer, ModalType } from "./_components/types";
import { ConsultModal, LawyerCard, RequestLawyerModal, VerificationSteps } from "./_components";
import { LAWYERS, SPECIALISMS } from "./_components/data";




//  Sub-components 


//  Main Marketplace Page 
export default function MarketplacePage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [activeLawyer, setActiveLawyer] = useState<Lawyer | null>(null);
  const [filterSpecialism, setFilterSpecialism] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const openConsult = useCallback((l: Lawyer) => { setActiveLawyer(l); setModal("consult"); }, []);
  const openProfile = useCallback((l: Lawyer) => { setActiveLawyer(l); setModal("profile"); }, []);
  const closeModal = useCallback(() => { setModal(null); setActiveLawyer(null); }, []);

  const states = ["all", "Lagos", "Abuja", "Rivers", "Kano", "Kaduna"];

  const filtered = LAWYERS
    .filter(l => {
      if (filterSpecialism !== "all" && !l.specialisms.includes(filterSpecialism)) return false;
      if (filterState !== "all" && l.state !== filterState) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.state.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "response") return a.responseTime.localeCompare(b.responseTime);
      if (sortBy === "fee") return a.fee.message - b.fee.message;
      return 0;
    });

  return (
    <>
      {/*  Modals  */}
      {modal === "consult" && activeLawyer && <ConsultModal lawyer={activeLawyer} onClose={closeModal} />}
      {modal === "request" && <RequestLawyerModal onClose={closeModal} />}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

        {/*  Top bar  */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-semibold text-gray-800">Lawyer Marketplace</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors shadow-sm">
              <Bell size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 xl:px-8 py-7">

          {/*  Hero band  */}
          <div className="rounded-2xl overflow-hidden mb-7 relative"
            style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E3A5F 60%, #0B1120 100%)" }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#E8317A]/8 blur-[80px] pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 p-6 xl:p-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck size={14} className="text-[#E8317A]" />
                  <span className="text-xs font-bold text-[#E8317A] uppercase tracking-widest">Verified Lawyers Only</span>
                </div>
                <h1 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2">
                  Find the Right Lawyer for Your Situation
                </h1>
                <p className="text-sm text-gray-400 max-w-lg leading-relaxed mb-5">
                  Every lawyer on this platform has been verified against Nigerian Bar Association records. Browse, compare, and book a consultation in minutes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setModal("request")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                  >
                    <UserPlus size={14} />
                    Request a Lawyer
                  </button>
                  <button
                    onClick={() => setModal("request")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/8 hover:border-white/40 transition-all"
                  >
                    <ClipboardList size={14} />
                    Post a Legal Request
                  </button>
                </div>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[160px]">
                {[
                  { icon: Users,      v: "6",    l: "Verified lawyers" },
                  { icon: Star,       v: "4.7",  l: "Average rating" },
                  { icon: CheckCircle,v: "1.5k+",l: "Consultations done" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.l} className="bg-white/6 border border-white/8 rounded-xl p-3 flex items-center gap-2.5">
                      <Icon size={14} className="text-[#E8317A] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{s.v}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{s.l}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/*  Verification steps  */}
          <VerificationSteps />

          <div className="mt-7 grid xl:grid-cols-[260px_1fr] gap-6">

            {/*  LEFT: Filters  */}
            <div className="hidden xl:flex flex-col gap-5">

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or area..."
                  className="w-full h-11 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                />
              </div>

              {/* Specialism filter */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Area of Law</p>
                <div className="flex flex-col gap-0.5">
                  {SPECIALISMS.map(s => {
                    const Icon = s.icon;
                    const active = filterSpecialism === s.id;
                    const count = s.id === "all" ? LAWYERS.length : LAWYERS.filter(l => l.specialisms.includes(s.id)).length;
                    return (
                      <button key={s.id} onClick={() => setFilterSpecialism(s.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${active ? "bg-pink-50 text-[#E8317A] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                        <Icon size={14} className={active ? "text-[#E8317A]" : "text-gray-400"} />
                        <span className="flex-1">{s.label}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${active ? "bg-pink-100 text-[#E8317A]" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State filter */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">State</p>
                <div className="flex flex-col gap-0.5">
                  {states.map(s => {
                    const active = filterState === s;
                    const count = s === "all" ? LAWYERS.length : LAWYERS.filter(l => l.state === s).length;
                    return (
                      <button key={s} onClick={() => setFilterState(s)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${active ? "bg-pink-50 text-[#E8317A] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                        <span>{s === "all" ? "All States" : s}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${active ? "bg-pink-100 text-[#E8317A]" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Request box */}
              <div className="bg-[#0B1120] rounded-2xl p-5 border border-white/6">
                <div className="w-9 h-9 rounded-xl bg-[#E8317A]/15 border border-[#E8317A]/20 flex items-center justify-center mb-3">
                  <Sparkles size={15} className="text-[#E8317A]" />
                </div>
                <p className="text-sm font-bold text-white mb-1">Not sure who to pick?</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Describe your situation and we will match you with the best-suited verified lawyer.
                </p>
                <button
                  onClick={() => setModal("request")}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                >
                  <UserPlus size={12} /> Request a Match
                </button>
              </div>
            </div>

            {/*  RIGHT: Lawyer grid  */}
            <div>
              {/* Sort + mobile filter bar */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 relative xl:hidden">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search lawyers..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                  />
                </div>

                <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{filtered.length}</span> lawyers found
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <SlidersHorizontal size={12} /> Filter
                  </button>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-[#E8317A] transition-colors font-medium"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="response">Fastest Response</option>
                    <option value="fee">Lowest Fee</option>
                  </select>
                </div>
              </div>

              {/* Mobile filter pills */}
              {filtersOpen && (
                <div className="xl:hidden bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
                  <div className="flex flex-wrap gap-2">
                    {SPECIALISMS.map(s => (
                      <button key={s.id} onClick={() => setFilterSpecialism(s.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterSpecialism === s.id ? "bg-[#E8317A] text-white border-[#E8317A]" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lawyer cards */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Scale size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No lawyers found for this filter</p>
                  <button onClick={() => { setFilterSpecialism("all"); setFilterState("all"); setSearchQuery(""); }}
                    className="mt-3 text-xs text-[#E8317A] font-semibold hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(l => (
                    <LawyerCard key={l.id} lawyer={l} onConsult={openConsult} onProfile={openProfile} />
                  ))}

                  {/* Request card */}
                  <div
                    className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#E8317A]/40 hover:bg-pink-50/30 transition-all group"
                    onClick={() => setModal("request")}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                      <Plus size={18} className="text-gray-400 group-hover:text-[#E8317A] transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-gray-500 group-hover:text-gray-800 transition-colors">Request a Lawyer</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Describe your need and get matched with the right lawyer</p>
                  </div>
                </div>
              )}

              {/* Trust footer */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
                {[
                  { icon: Lock,         t: "Secure payments via Paystack" },
                  { icon: Shield,       t: "NBA-verified credentials" },
                  { icon: FileText,     t: "Transparent pricing before booking" },
                  { icon: AlertCircle,  t: "Refund policy for unsatisfactory sessions" },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Icon size={12} className="text-gray-300" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}