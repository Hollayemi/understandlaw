"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import {
  Search,
  Star,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  Scale,
  X,
} from "lucide-react";
import { useGetMarketplaceLawyersQuery } from "@/redux/slices/lawyers.slice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { LawyerFull, Specialism } from "@/redux/types/lawyer";

type SortBy = "rating" | "reviews" | "response" | "fee";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function startingFee(lawyer: LawyerFull) {
  const values = Object.values(lawyer.fees || {}).filter(
    (v): v is number => typeof v === "number" && v > 0
  );
  if (values.length === 0) return null;
  return Math.min(...values);
}

/** Sample data has empty `badges` arrays, so derive sensible ones from
 *  the fields we do have rather than relying on the backend to fill it. */
function deriveBadges(lawyer: LawyerFull): string[] {
  const badges: string[] = [];
  if (Array.isArray(lawyer.badges) && lawyer.badges.length > 0) {
    return lawyer.badges as string[];
  }
  if (lawyer.verificationStatus === "approved") badges.push("Verified");
  const rating = lawyer.ratingAvg || (lawyer as unknown as { rating?: number }).rating || 0;
  if (rating >= 4.5 && lawyer.reviewCount >= 5) {
    badges.push("Top Rated");
  }
  if (lawyer.responseTime && lawyer.responseTime <= 2) badges.push("Responsive");
  return badges;
}

export function LawyerCard({ lawyer }: { lawyer: LawyerFull }) {
  const badges = deriveBadges(lawyer);
  const fee = startingFee(lawyer);
  const rating = lawyer.ratingAvg || (lawyer as unknown as { rating?: number }).rating || 0;
  const slug = (lawyer as unknown as { scnNumber?: string }).scnNumber || lawyer.id || lawyer._id;

  return (
    <Link
      href={`/${slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 hover:border-[var(--maroon-600)]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          {lawyer.picture ? (
            <img
              src={lawyer.picture}
              alt={lawyer.fullName}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: (lawyer as unknown as { colorA?: string }).colorA
                  ? `linear-gradient(135deg, ${(lawyer as unknown as { colorA?: string }).colorA}, ${(lawyer as unknown as { colorB?: string }).colorB})`
                  : "linear-gradient(135deg, var(--maroon-600), var(--maroon-900))",
              }}
            >
              {lawyer.avatarInitials}
            </div>
          )}
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
              lawyer.isAvailable ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 text-[15px] truncate">{lawyer.fullName}</h3>
          <p className="text-xs text-gray-500 truncate">{lawyer.title}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {lawyer.location ? `${lawyer.location}, ` : ""}
              {lawyer.state}
            </span>
          </div>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
              style={
                b === "Verified"
                  ? { background: "rgba(107,18,32,0.08)", color: "var(--maroon-700)" }
                  : b === "Top Rated"
                  ? { background: "#FEF3C7", color: "#92400E" }
                  : { background: "#DCFCE7", color: "#166534" }
              }
            >
              {b === "Verified" && <ShieldCheck className="w-3 h-3" />}
              {b === "Top Rated" && <Star className="w-3 h-3" />}
              {b === "Responsive" && <Zap className="w-3 h-3" />}
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-5">
        {lawyer.specialisms?.slice(0, 2).map((s) => (
          <span
            key={s._id}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-100"
          >
            {s.displayName}
          </span>
        ))}
        {lawyer.specialisms?.length > 2 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400">
            +{lawyer.specialisms.length - 2} more
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 text-xs">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {rating > 0 ? rating.toFixed(1) : "New"}
            {lawyer.reviewCount > 0 && <span className="text-gray-400">({lawyer.reviewCount})</span>}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lawyer.responseTime ? `${lawyer.responseTime}h` : "—"}
          </span>
        </div>
        <span className="font-semibold text-gray-900">
          {fee ? `From ${formatNaira(fee)}` : "Contact for fee"}
        </span>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialism, setSpecialism] = useState("all");
  const [state, setState] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(t);
  }, [search]);

  const handleSpecialismChange = (value: string) => {
    setSpecialism(value);
    setPage(1);
  };
  const handleStateChange = (value: string) => {
    setState(value);
    setPage(1);
  };
  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
    setPage(1);
  };

  const queryParams = {
    specialism: specialism !== "all" ? specialism : undefined,
    state: state !== "all" ? state : undefined,
    search: debouncedSearch || undefined,
    sortBy,
    page,
    pageSize,
  };

  const { data: response, isLoading, isFetching, error, refetch } =
    useGetMarketplaceLawyersQuery(queryParams);
  const { data: specialismsResponse } = useListSpecialismsQuery();
  const SPECIALISMS = specialismsResponse?.data || [];

  const lawyers: LawyerFull[] = response?.data?.data || [];
  const total = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const currentPage = response?.data?.page || page;

  const availableStates = ["all", ...Array.from(new Set(lawyers.map((l) => l.state).filter(Boolean)))];

  const clearFilters = useCallback(() => {
    setSpecialism("all");
    setState("all");
    setSearch("");
    setDebouncedSearch("");
  }, []);

  const hasActiveFilters = specialism !== "all" || state !== "all" || debouncedSearch !== "";

  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-10 lg:pt-20 lg:pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--maroon-600)" }}
          >
            Lawyer Marketplace
          </p>
          <h1
            className="text-[clamp(30px,5vw,48px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            Find the right lawyer
            <br />
            <span className="text-maroon-600">for your situation.</span>
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500 mt-5 max-w-xl mx-auto">
            Every lawyer here is SCN-verified. Filter by specialisation, state, and
            budget, then book directly.
          </p>

          <div className="relative max-w-lg mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialisation, or location..."
              className="w-full h-12 pl-11 pr-4 border-[1.5px] border-gray-200 rounded-full text-sm text-gray-900 bg-white outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="bg-[#F3F3F3] py-10 xl:py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <select
              value={specialism}
              onChange={(e) => handleSpecialismChange(e.target.value)}
              className="h-11 px-4 rounded-full border-[1.5px] border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-gray-900 transition-colors"
            >
              <option value="all">All Specialisations</option>
              {SPECIALISMS.map((s: Specialism) => (
                <option key={s._id} value={s._id}>
                  {s.displayName}
                </option>
              ))}
            </select>

            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-11 px-4 rounded-full border-[1.5px] border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-gray-900 transition-colors"
            >
              <option value="all">All States</option>
              {availableStates
                .filter((s) => s !== "all")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortBy)}
              className="h-11 px-4 rounded-full border-[1.5px] border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-gray-900 transition-colors"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="response">Fastest Response</option>
              <option value="fee">Lowest Fee</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 h-11 px-4 rounded-full text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}

            <span className="ml-auto text-sm text-gray-500 hidden sm:block">
              <span className="font-semibold text-gray-900">{total}</span> lawyers found
            </span>
          </div>

          {isFetching && lawyers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: "var(--maroon-600)" }} />
              <p className="text-sm text-gray-500">Loading verified lawyers...</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Unable to load lawyers</p>
              <p className="text-xs text-gray-500 mb-4">Please check your connection and try again.</p>
              <button
                onClick={() => refetch()}
                className="btn-maroon px-5 py-2.5 text-sm inline-flex"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && lawyers.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <Scale className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500 mb-1">No lawyers found for this filter</p>
              <button onClick={clearFilters} className="text-xs font-semibold hover:underline" style={{ color: "var(--maroon-700)" }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && lawyers.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lawyers.map((l) => (
                <LawyerCard key={l._id || l.id} lawyer={l} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className="w-9 h-9 rounded-full text-xs font-semibold transition-colors"
                      style={
                        currentPage === pageNum
                          ? { background: "var(--maroon-700)", color: "#fff" }
                          : { background: "#fff", border: "1px solid #E5E7EB", color: "#4B5563" }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </HomeWrapper>
  );
}