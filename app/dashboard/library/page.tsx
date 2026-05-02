"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Download, ShoppingCart, Search, Filter,
  Star, ChevronRight, X, Check, Loader2, MapPin,
  Phone, Send, Package, Truck, Info, Shield,
  Tag, FileText, BookMarked, Flame, Globe,
  DollarSign, ChevronDown, Eye, Heart, Share2,
  Clock, CheckCircle, Home, Briefcase,
  Building2, Car, Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BookFormat = "pdf" | "physical" | "both";
type BookCategory =
  | "criminal" | "tenancy" | "employment" | "contracts"
  | "business" | "family" | "consumer" | "road" | "constitutional";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: BookCategory;
  coverUrl: string | null;
  pdfUrl: string | null;
  format: BookFormat;
  pricePhysical: number | null;
  totalPages: number;
  isbn: string;
  publishedYear: number;
  tags: string[];
  downloadCount: number;
  orderCount: number;
  featured: boolean;
  stockCount: number | null;
  rating: number;
  reviewCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  {
    id: "b001",
    title: "Know Your Rights: Arrest & Detention in Nigeria",
    author: "Adaeze Okonkwo",
    description: "A plain-English guide to Section 35 of the 1999 Constitution. Covers every stage of a police encounter — from the moment of arrest to bail and court appearances. Know exactly what officers can and cannot do.",
    category: "criminal",
    coverUrl: "/images/police_law.jpg",
    pdfUrl: "/books/arrest-rights.pdf",
    format: "both",
    pricePhysical: 3500,
    totalPages: 142,
    isbn: "978-978-XXX-001",
    publishedYear: 2024,
    tags: ["arrest", "police", "Section 35", "detention", "bail"],
    downloadCount: 1847,
    orderCount: 234,
    featured: true,
    stockCount: 80,
    rating: 4.8,
    reviewCount: 247,
  },
  {
    id: "b002",
    title: "Tenant Rights Handbook: Nigeria Edition",
    author: "Emeka Nwosu",
    description: "Everything a tenant in Nigeria needs to know — notice periods, illegal lockouts, deposit recovery, and what to do when your landlord breaks the law. Covers Lagos Tenancy Law 2011.",
    category: "tenancy",
    coverUrl: "/images/tenancy_law.jpg",
    pdfUrl: "/books/tenant-rights.pdf",
    format: "both",
    pricePhysical: 2800,
    totalPages: 98,
    isbn: "978-978-XXX-002",
    publishedYear: 2024,
    tags: ["tenancy", "eviction", "landlord", "deposit"],
    downloadCount: 1203,
    orderCount: 189,
    featured: true,
    stockCount: 120,
    rating: 4.6,
    reviewCount: 183,
  },
  {
    id: "b003",
    title: "Labour Law Guide for Nigerian Workers",
    author: "Fatimah Bello",
    description: "Wrongful termination, severance pay, NSITF contributions, workplace harassment — a comprehensive guide to the Labour Act Cap. L1 in plain English for every Nigerian worker.",
    category: "employment",
    coverUrl: "/images/employment_law.jpg",
    pdfUrl: "/books/labour-law.pdf",
    format: "pdf",
    pricePhysical: null,
    totalPages: 176,
    isbn: "978-978-XXX-003",
    publishedYear: 2024,
    tags: ["employment", "labour", "termination", "severance"],
    downloadCount: 2914,
    orderCount: 0,
    featured: false,
    stockCount: null,
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: "b004",
    title: "Nigerian Contract Law: A Citizen's Guide",
    author: "Chidi Okafor",
    description: "Understand what makes a contract legally binding in Nigeria. Covers offer, acceptance, consideration, capacity, and remedies for breach. Stop signing what you don't understand.",
    category: "contracts",
    coverUrl: "/images/contract_law.jpg",
    pdfUrl: null,
    format: "physical",
    pricePhysical: 4200,
    totalPages: 210,
    isbn: "978-978-XXX-004",
    publishedYear: 2023,
    tags: ["contracts", "agreement", "breach", "consideration"],
    downloadCount: 0,
    orderCount: 67,
    featured: false,
    stockCount: 45,
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: "b005",
    title: "CAMA 2020: Business Registration Simplified",
    author: "Amina Garba",
    description: "Everything you need to register and manage a company or business name under CAMA 2020. CAC procedures, director duties, and common mistakes — all made simple.",
    category: "business",
    coverUrl: null,
    pdfUrl: "/books/cama-2020.pdf",
    format: "pdf",
    pricePhysical: null,
    totalPages: 88,
    isbn: "978-978-XXX-005",
    publishedYear: 2025,
    tags: ["CAMA", "CAC", "business registration", "company"],
    downloadCount: 891,
    orderCount: 0,
    featured: false,
    stockCount: null,
    rating: 4.4,
    reviewCount: 67,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<BookCategory, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  criminal:      { label: "Police & Criminal", color: "#3B82F6", bg: "#EFF6FF", icon: Shield },
  tenancy:       { label: "Tenancy",           color: "#10B981", bg: "#ECFDF5", icon: Home },
  employment:    { label: "Employment",        color: "#8B5CF6", bg: "#F5F3FF", icon: Briefcase },
  contracts:     { label: "Contracts",         color: "#F59E0B", bg: "#FFFBEB", icon: FileText },
  business:      { label: "Business",          color: "#06B6D4", bg: "#ECFEFF", icon: Building2 },
  family:        { label: "Family Law",        color: "#EF4444", bg: "#FEF2F2", icon: Users },
  consumer:      { label: "Consumer Rights",   color: "#E8317A", bg: "#FFF0F5", icon: Globe },
  road:          { label: "Road Traffic",      color: "#F97316", bg: "#FFF7ED", icon: Car },
  constitutional:{ label: "Constitutional",    color: "#7C3AED", bg: "#F5F3FF", icon: Shield },
};

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
];

// ─── Download Modal ────────────────────────────────────────────────────────────
function DownloadModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setDownloading(true);
    for (let i = 10; i <= 100; i += 15) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(Math.min(i, 100));
    }
    await new Promise(r => setTimeout(r, 300));
    setDownloading(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]" />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-20 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {book.coverUrl
                ? <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                : <BookOpen size={18} className="text-[#9CA3AF]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#111827] text-sm leading-snug">{book.title}</h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">by {book.author} · {book.totalPages} pages</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-semibold text-[#111827]">{book.rating}</span>
                <span className="text-[11px] text-[#9CA3AF]">({book.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#10B981] font-semibold">
                <Download size={10} /> {book.downloadCount.toLocaleString()} downloads
              </div>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          {!done ? (
            <>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 mb-5">
                <p className="text-[12px] text-[#1E3A8A] flex items-start gap-2">
                  <Info size={13} className="flex-shrink-0 mt-0.5 text-[#3B82F6]" />
                  This PDF is free to download. Please do not redistribute or sell it. Educational use only.
                </p>
              </div>

              {!downloading ? (
                <button onClick={handleDownload}
                  className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}>
                  <Download size={14} /> Download Free PDF
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mb-1.5">
                    <span>Downloading…</span><span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-2 bg-[#3B82F6] rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border-2 border-[#6EE7B7] flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={22} className="text-[#10B981]" />
              </div>
              <p className="text-sm font-bold text-[#111827] mb-1">Download Started!</p>
              <p className="text-[11px] text-[#9CA3AF] mb-4">Your PDF is downloading. Check your downloads folder.</p>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Modal ───────────────────────────────────────────────────────────────
function OrderModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", state: "Lagos", quantity: 1, notes: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: k === "quantity" ? Math.max(1, Number(e.target.value)) : e.target.value }));

  const total = (book.pricePhysical || 0) * form.quantity;
  const inputCls = "w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div>
            <h3 className="font-bold text-[#111827] text-sm">Order Physical Copy</h3>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Step {step} of 3</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(n => (
              <React.Fragment key={n}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  step === n ? "bg-[#E8317A] text-white" : step > n ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}>{step > n ? <Check size={11} /> : n}</div>
                {n < 3 && <div className="w-5 h-px bg-[#E5E7EB]" />}
              </React.Fragment>
            ))}
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Book preview */}
          <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-5">
            <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#E5E7EB]">
              {book.coverUrl ? <img src={book.coverUrl} alt="" className="w-full h-full object-cover" /> : <BookOpen size={14} className="text-[#9CA3AF] m-auto mt-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111827] truncate">{book.title}</p>
              <p className="text-[11px] text-[#9CA3AF]">by {book.author}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[14px] font-bold text-[#E8317A]">NGN {(book.pricePhysical || 0).toLocaleString()}</p>
              <p className="text-[10px] text-[#9CA3AF]">per copy</p>
            </div>
          </div>

          {/* Step 1: Contact & Delivery */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Phone *</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="080XXXXXXXX" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Email Address *</label>
                <input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Delivery Address *</label>
                <input value={form.address} onChange={set("address")} placeholder="Street address, area..." className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">State</label>
                  <select value={form.state} onChange={set("state")} className={`${inputCls} bg-white`}>
                    {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Quantity</label>
                  <input value={form.quantity} onChange={set("quantity")} type="number" min={1}
                    max={book.stockCount || 99} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Notes (optional)</label>
                <textarea value={form.notes} onChange={set("notes")} placeholder="Any delivery instructions..."
                  className="w-full h-16 px-3 py-2.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <button onClick={() => setStep(2)}
                disabled={!form.name || !form.phone || !form.email || !form.address}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-40 transition-colors">
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Confirm & Pay */}
          {step === 2 && (
            <div className="space-y-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#111827] transition-colors mb-1">
                ← Back
              </button>

              {/* Order summary */}
              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Order Summary</p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Name</span><span className="font-semibold">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Phone</span><span className="font-semibold">{form.phone}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Address</span><span className="font-semibold truncate max-w-[180px]">{form.address}, {form.state}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Quantity</span><span className="font-semibold">{form.quantity} {form.quantity > 1 ? "copies" : "copy"}</span></div>
                  <div className="flex justify-between border-t border-[#F3F4F6] pt-2 mt-2">
                    <span className="text-[#9CA3AF] font-semibold">Book price</span>
                    <span className="font-bold">NGN {(book.pricePhysical || 0).toLocaleString()} × {form.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Shipping</span>
                    <span className="text-[#10B981] font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                    <span className="font-bold text-[#111827] text-[14px]">Total</span>
                    <span className="font-bold text-[#E8317A] text-[14px]">NGN {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="flex items-start gap-2.5 p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                <Package size={14} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-[#92400E] mb-0.5">Estimated Delivery</p>
                  <p className="text-[11px] text-[#92400E] leading-relaxed">
                    {form.state === "Lagos" ? "3–5 business days" : "5–10 business days"} to {form.state}. You'll receive a tracking number via email.
                  </p>
                </div>
              </div>

              {/* Payment notice */}
              <div className="flex items-start gap-2.5 p-3.5 bg-[#EFF6FF] border border-[#93C5FD] rounded-xl">
                <Shield size={14} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1E3A8A] leading-relaxed">
                  Payment is processed securely via <strong>Paystack</strong>. You'll be redirected to complete payment after placing the order.
                </p>
              </div>

              <button onClick={submit} disabled={submitting}
                className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                {submitting
                  ? <><Loader2 size={13} className="animate-spin" /> Processing…</>
                  : <><Send size={13} /> Place Order & Pay NGN {total.toLocaleString()}</>
                }
              </button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border-2 border-[#6EE7B7] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={26} className="text-[#10B981]" />
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-1">Order Placed!</h3>
              <p className="text-[13px] text-[#9CA3AF] mb-1">
                Your order for <strong className="text-[#111827]">"{book.title}"</strong> has been received.
              </p>
              <p className="text-[11px] text-[#9CA3AF] mb-5">
                A confirmation and tracking number will be sent to <strong>{form.email}</strong> once your order is dispatched.
              </p>
              <div className="bg-[#F9FAFB] rounded-xl p-4 text-left mb-5 space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Delivery to</span><span className="font-semibold text-[#111827]">{form.state}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Quantity</span><span className="font-semibold text-[#111827]">{form.quantity} {form.quantity > 1 ? "copies" : "copy"}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Amount paid</span><span className="font-bold text-[#E8317A]">NGN {total.toLocaleString()}</span></div>
              </div>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-[13px] font-bold hover:bg-[#1F2937] transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ─────────────────────────────────────────────────────────────────
function BookCard({
  book,
  onDownload,
  onOrder,
  onPreview,
}: {
  book: Book;
  onDownload: (b: Book) => void;
  onOrder: (b: Book) => void;
  onPreview: (b: Book) => void;
}) {
  const [saved, setSaved] = useState(false);
  const cat = CATEGORY_CONFIG[book.category];
  const CatIcon = cat.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Cover */}
      <div className="relative h-44 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}08)` }}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon size={44} style={{ color: cat.color, opacity: 0.2 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
          {book.featured && (
            <span className="flex items-center gap-1 text-[9px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">
              <Flame size={9} /> Featured
            </span>
          )}
        </div>

        {/* Format pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111827]">
            {book.format === "pdf" ? "📄 Free PDF" : book.format === "physical" ? "📦 Physical Only" : "📄 PDF + 📦 Book"}
          </span>
        </div>

        {/* Save */}
        <button onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
          <Heart size={14} className={saved ? "text-[#E8317A] fill-[#E8317A]" : "text-gray-500"} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-[11px] text-gray-500 mb-2">by {book.author} · {book.publishedYear} · {book.totalPages}pp</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11} className={i <= Math.round(book.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-gray-700">{book.rating}</span>
          <span className="text-[10px] text-gray-400">({book.reviewCount})</span>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">{book.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3">
          {book.format !== "physical" && (
            <span className="flex items-center gap-1">
              <Download size={10} className="text-[#3B82F6]" />
              {book.downloadCount.toLocaleString()} downloads
            </span>
          )}
          {book.format !== "pdf" && (
            <span className="flex items-center gap-1">
              <ShoppingCart size={10} className="text-[#E8317A]" />
              {book.orderCount} orders
            </span>
          )}
          {book.stockCount !== null && book.stockCount < 20 && (
            <span className="text-amber-600 font-semibold">Only {book.stockCount} left!</span>
          )}
        </div>

        {/* Price */}
        {book.pricePhysical !== null && (
          <p className="text-[13px] font-bold text-[#E8317A] mb-3">
            NGN {book.pricePhysical.toLocaleString()} / copy
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          {book.pdfUrl && (
            <button onClick={() => onDownload(book)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}>
              <Download size={12} /> Download Free PDF
            </button>
          )}
          {book.format !== "pdf" && (
            <button onClick={() => onOrder(book)}
              disabled={book.stockCount !== null && book.stockCount === 0}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
              <ShoppingCart size={12} />
              {book.stockCount === 0 ? "Out of Stock" : `Order Physical — NGN ${(book.pricePhysical || 0).toLocaleString()}`}
            </button>
          )}
          <button onClick={() => onPreview(book)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all">
            <Eye size={11} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Book Detail Drawer ────────────────────────────────────────────────────────
function BookDrawer({ book, onClose, onDownload, onOrder }: {
  book: Book;
  onClose: () => void;
  onDownload: (b: Book) => void;
  onOrder: (b: Book) => void;
}) {
  const cat = CATEGORY_CONFIG[book.category];
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="h-1.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}80)` }} />

        {/* Cover hero */}
        <div className="relative h-52 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat.color}30, ${cat.color}10)` }}>
          {book.coverUrl ? (
            <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={60} style={{ color: cat.color, opacity: 0.2 }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
            <X size={14} />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>
              {cat.label}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1">
          <h2 className="text-base font-bold text-[#111827] mb-1 leading-snug">{book.title}</h2>
          <p className="text-[12px] text-[#9CA3AF] mb-3">by {book.author} · {book.publishedYear} · {book.totalPages} pages</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={13} className={i <= Math.round(book.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-[12px] font-bold text-[#111827]">{book.rating}</span>
            <span className="text-[11px] text-[#9CA3AF]">({book.reviewCount} reviews)</span>
          </div>

          <p className="text-[13px] text-[#374151] leading-relaxed mb-4">{book.description}</p>

          {/* Details */}
          <div className="space-y-2 text-[12px] mb-5">
            {[
              { label: "ISBN", value: book.isbn },
              { label: "Format", value: book.format === "pdf" ? "PDF (free download)" : book.format === "physical" ? "Physical book" : "PDF + Physical" },
              { label: "Pages", value: `${book.totalPages} pages` },
              ...(book.pricePhysical ? [{ label: "Price", value: `NGN ${book.pricePhysical.toLocaleString()} / copy` }] : []),
              ...(book.stockCount !== null ? [{ label: "In Stock", value: `${book.stockCount} copies` }] : []),
              ...(book.downloadCount > 0 ? [{ label: "Downloads", value: book.downloadCount.toLocaleString() }] : []),
            ].map(d => (
              <div key={d.label} className="flex items-center justify-between py-1.5 border-b border-[#F9FAFB]">
                <span className="text-[#9CA3AF]">{d.label}</span>
                <span className="font-semibold text-[#111827]">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {book.tags.map(t => (
              <span key={t} className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            {book.pdfUrl && (
              <button onClick={() => { onDownload(book); onClose(); }}
                className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}>
                <Download size={14} /> Download Free PDF
              </button>
            )}
            {book.format !== "pdf" && (
              <button onClick={() => { onOrder(book); onClose(); }}
                disabled={book.stockCount !== null && book.stockCount === 0}
                className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
                <ShoppingCart size={14} />
                Order Physical Copy — NGN {(book.pricePhysical || 0).toLocaleString()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main User Library Page ───────────────────────────────────────────────────
export default function UserLibraryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [downloadBook, setDownloadBook] = useState<Book | null>(null);
  const [orderBook, setOrderBook] = useState<Book | null>(null);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  const filtered = BOOKS.filter(b => {
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    if (formatFilter === "free" && b.format === "physical") return false;
    if (formatFilter === "physical" && b.format === "pdf") return false;
    if (search) {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const featured = BOOKS.filter(b => b.featured);

  return (
    <>
      {downloadBook && <DownloadModal book={downloadBook} onClose={() => setDownloadBook(null)} />}
      {orderBook && <OrderModal book={orderBook} onClose={() => setOrderBook(null)} />}
      {previewBook && (
        <BookDrawer
          book={previewBook}
          onClose={() => setPreviewBook(null)}
          onDownload={b => { setPreviewBook(null); setDownloadBook(b); }}
          onOrder={b => { setPreviewBook(null); setOrderBook(b); }}
        />
      )}

      <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-semibold text-gray-800">Legal Library</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 xl:px-8 py-7">

          {/* Hero */}
          <div className="rounded-2xl overflow-hidden mb-7 relative"
            style={{ background: "linear-gradient(135deg, #0B1120 0%, #1E3A5F 60%, #0B1120 100%)" }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative p-6 xl:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={14} className="text-[#E8317A]" />
                    <span className="text-xs font-bold text-[#E8317A] uppercase tracking-widest">Legal Library</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white leading-tight mb-2">Nigerian Law Books</h1>
                  <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                    Free PDF guides written by verified Nigerian lawyers. Download instantly, or order a printed copy delivered to your door.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: BOOKS.length, l: "Books" },
                    { v: `${BOOKS.reduce((s, b) => s + b.downloadCount, 0).toLocaleString()}+`, l: "Downloads" },
                    { v: BOOKS.filter(b => b.format !== "physical").length, l: "Free PDFs" },
                  ].map(s => (
                    <div key={s.l} className="bg-white/6 border border-white/8 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-white">{s.v}</p>
                      <p className="text-[10px] text-gray-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured */}
          {featured.length > 0 && (
            <section className="mb-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#E8317A] inline-block" />
                  Featured Books
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {featured.map(book => (
                  <div key={book.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex gap-4 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                    onClick={() => setPreviewBook(book)}>
                    <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {book.coverUrl ? <img src={book.coverUrl} alt="" className="w-full h-full object-cover" /> : <BookOpen size={20} className="text-gray-300 m-auto mt-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: CATEGORY_CONFIG[book.category].color }}>
                        {CATEGORY_CONFIG[book.category].label}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug my-1">{book.title}</h3>
                      <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{book.description}</p>
                      <div className="flex items-center gap-3">
                        {book.pdfUrl && (
                          <button onClick={e => { e.stopPropagation(); setDownloadBook(book); }}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#3B82F6] hover:underline">
                            <Download size={11} /> Free PDF
                          </button>
                        )}
                        {book.format !== "pdf" && (
                          <button onClick={e => { e.stopPropagation(); setOrderBook(book); }}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#E8317A] hover:underline">
                            <ShoppingCart size={11} /> NGN {(book.pricePhysical || 0).toLocaleString()}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, author, or topic…"
                  className="w-full h-10 pl-9 pr-4 rounded-xl border-[1.5px] border-gray-200 text-sm outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {[
                    { v: "all",      l: "All" },
                    { v: "free",     l: "Free PDF" },
                    { v: "physical", l: "Physical" },
                  ].map(opt => (
                    <button key={opt.v} onClick={() => setFormatFilter(opt.v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${formatFilter === opt.v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${categoryFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                All Categories
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => {
                const Icon = v.icon;
                return (
                  <button key={k} onClick={() => setCategoryFilter(k)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${categoryFilter === k ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                    style={categoryFilter === k ? { background: v.color } : {}}>
                    <Icon size={11} /> {v.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Book Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <BookOpen size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">No books found</p>
              <button onClick={() => { setSearch(""); setCategoryFilter("all"); setFormatFilter("all"); }}
                className="mt-3 text-xs text-[#E8317A] font-semibold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onDownload={setDownloadBook}
                  onOrder={setOrderBook}
                  onPreview={setPreviewBook}
                />
              ))}
            </div>
          )}

          {/* Trust footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
            {[
              { icon: Shield,    t: "Written by verified Nigerian lawyers" },
              { icon: Download,  t: "Free PDFs — no registration required" },
              { icon: Truck,     t: "Physical copies delivered nationwide" },
              { icon: BookOpen,  t: "Plain English, no legal jargon" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-1.5">
                <Icon size={12} className="text-gray-300" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}