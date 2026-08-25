import React from "react";
import Link from "next/link";
import HomeWrapper from "@/app/components/wrapper";
import { Play, Clock, User, Filter, Search } from "lucide-react";

const VIDEOS = [
  {
    id: "getting-started",
    title: "Getting Started with LawTicha",
    desc: "Learn how to navigate the platform, find legal guides, and connect with verified lawyers.",
    duration: "2:30",
    category: "Platform Guides",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop",
    views: "12K",
  },
  {
    id: "tenancy-rights",
    title: "Your Rights as a Tenant in Nigeria",
    desc: "Understand eviction procedures, rent control, and what to do if your landlord violates your rights.",
    duration: "4:15",
    category: "Tenancy",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop",
    views: "8.5K",
  },
  {
    id: "employment-rights",
    title: "Know Your Employment Rights",
    desc: "Wrongful termination, severance pay, and how to handle workplace discrimination.",
    duration: "3:45",
    category: "Employment",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=225&fit=crop",
    views: "6.2K",
  },
  {
    id: "police-encounters",
    title: "What to Do During a Police Encounter",
    desc: "Your rights during arrest, search, and detention. Know what to say and what not to say.",
    duration: "5:00",
    category: "Rights",
    thumbnail: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=225&fit=crop",
    views: "15K",
  },
  {
    id: "contract-basics",
    title: "Understanding Contracts in Nigeria",
    desc: "What makes a contract valid, common pitfalls, and how to enforce your rights.",
    duration: "3:20",
    category: "Contracts",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop",
    views: "4.7K",
  },
  {
    id: "family-law",
    title: "Family Law: Marriage & Divorce",
    desc: "Understanding marriage laws, divorce procedures, and child custody in Nigeria.",
    duration: "4:50",
    category: "Family",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop",
    views: "3.9K",
  },
  {
    id: "business-registration",
    title: "How to Register a Business in Nigeria",
    desc: "Step-by-step guide to registering your business with the CAC.",
    duration: "3:30",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    views: "5.1K",
  },
  {
    id: "consumer-rights",
    title: "Your Rights as a Consumer",
    desc: "Product liability, refunds, and how to file complaints against businesses.",
    duration: "2:55",
    category: "Consumer",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop",
    views: "3.2K",
  },
];

const CATEGORIES = ["All", "Platform Guides", "Tenancy", "Employment", "Rights", "Contracts", "Family", "Business", "Consumer"];

export default function VideoGuidesPage() {
  return (
    <HomeWrapper>
      {/* Hero */}
      <section className="bg-white pt-16 pb-10 lg:pt-20 lg:pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--maroon-600)" }}
            >
              Learn
            </p>
            <h1
              className="text-[clamp(34px,6vw,56px)] leading-[1.05] tracking-tight uppercase text-gray-900 font-black"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              Video <span className="text-maroon-600">Guides</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-500 mt-4 max-w-xl mx-auto">
              Watch short, plain-English videos that explain Nigerian law in simple terms.
            </p>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-white py-12 xl:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-maroon-500/20 focus:border-maroon-500 transition-all text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    cat === "All"
                      ? "bg-maroon-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {VIDEOS.map((video) => (
              <Link
                key={video.id}
                href={`/learn/videos/${video.id}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-maroon-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-maroon-600 bg-pink-50 px-2 py-0.5 rounded">
                    {video.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-2 group-hover:text-maroon-600 transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.desc}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{video.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}