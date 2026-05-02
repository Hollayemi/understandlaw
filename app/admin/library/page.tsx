"use client";
import React, { useState } from "react";
import {
  BookOpen, Download, ShoppingCart, Star, TrendingUp,
  Plus, Upload, Search, Filter, MoreHorizontal, Eye,
  Edit2, Trash2, Check, X, FileText, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle, Save,
  Loader2, ChevronDown, ChevronUp, Image as ImageIcon,
  Tag, Hash, BookMarked, Globe, ShieldCheck, Layers,
  RefreshCw, Download as DownloadIcon, ExternalLink,
  DollarSign, Archive, Flame, Info,
} from "lucide-react";
import {
  StatBar, FilterBar, Table, StatusBadge, Avatar, PageHeader,
} from "../_components";

// ─── Types ────────────────────────────────────────────────────────────────────
type BookFormat = "pdf" | "physical" | "both";
type BookStatus = "active" | "inactive" | "draft";
type BookCategory =
  | "criminal" | "tenancy" | "employment" | "contracts"
  | "business" | "family" | "consumer" | "road" | "constitutional";
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: BookCategory;
  coverUrl: string | null;
  pdfUrl: string | null;
  format: BookFormat;
  status: BookStatus;
  pricePhysical: number | null;
  totalPages: number;
  isbn: string;
  publishedYear: number;
  tags: string[];
  downloadCount: number;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  stockCount: number | null;
}

interface BookOrder {
  id: string;
  bookId: string;
  bookTitle: string;
  coverUrl: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  deliveryAddress: string;
  phone: string;
  state: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  paymentRef: string;
  orderedAt: string;
  updatedAt: string;
  trackingNumber: string | null;
  notes: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  {
    id: "b001",
    title: "Know Your Rights: Arrest & Detention in Nigeria",
    author: "Adaeze Okonkwo",
    description: "A plain-English guide to Section 35 of the 1999 Constitution covering every stage of a police encounter.",
    category: "criminal",
    coverUrl: "/images/police_law.jpg",
    pdfUrl: "/books/arrest-rights.pdf",
    format: "both",
    status: "active",
    pricePhysical: 3500,
    totalPages: 142,
    isbn: "978-978-XXX-001",
    publishedYear: 2024,
    tags: ["arrest", "police", "Section 35", "detention"],
    downloadCount: 1847,
    orderCount: 234,
    createdAt: "2025-01-10",
    updatedAt: "2025-04-20",
    featured: true,
    stockCount: 80,
  },
  {
    id: "b002",
    title: "Tenant Rights Handbook: Nigeria Edition",
    author: "Emeka Nwosu",
    description: "Everything a tenant needs to know — notice periods, illegal lockouts, deposit recovery.",
    category: "tenancy",
    coverUrl: "/images/tenancy_law.jpg",
    pdfUrl: "/books/tenant-rights.pdf",
    format: "both",
    status: "active",
    pricePhysical: 2800,
    totalPages: 98,
    isbn: "978-978-XXX-002",
    publishedYear: 2024,
    tags: ["tenancy", "eviction", "landlord", "deposit"],
    downloadCount: 1203,
    orderCount: 189,
    createdAt: "2025-02-03",
    updatedAt: "2025-04-18",
    featured: true,
    stockCount: 120,
  },
  {
    id: "b003",
    title: "Labour Law Guide for Nigerian Workers",
    author: "Fatimah Bello",
    description: "Wrongful termination, severance pay, NSITF contributions — a guide to the Labour Act Cap. L1.",
    category: "employment",
    coverUrl: "/images/employment_law.jpg",
    pdfUrl: "/books/labour-law.pdf",
    format: "pdf",
    status: "active",
    pricePhysical: null,
    totalPages: 176,
    isbn: "978-978-XXX-003",
    publishedYear: 2024,
    tags: ["employment", "labour", "termination", "severance"],
    downloadCount: 2914,
    orderCount: 0,
    createdAt: "2025-02-18",
    updatedAt: "2025-04-15",
    featured: false,
    stockCount: null,
  },
  {
    id: "b004",
    title: "Nigerian Contract Law: A Citizen's Guide",
    author: "Chidi Okafor",
    description: "Offer, acceptance, consideration, capacity, and remedies for breach — all explained plainly.",
    category: "contracts",
    coverUrl: "/images/contract_law.jpg",
    pdfUrl: null,
    format: "physical",
    status: "active",
    pricePhysical: 4200,
    totalPages: 210,
    isbn: "978-978-XXX-004",
    publishedYear: 2023,
    tags: ["contracts", "agreement", "breach"],
    downloadCount: 0,
    orderCount: 67,
    createdAt: "2025-03-01",
    updatedAt: "2025-04-22",
    featured: false,
    stockCount: 45,
  },
  {
    id: "b005",
    title: "CAMA 2020: Business Registration Simplified",
    author: "Amina Garba",
    description: "Everything you need to register and manage a company under CAMA 2020.",
    category: "business",
    coverUrl: null,
    pdfUrl: "/books/cama-2020.pdf",
    format: "pdf",
    status: "active",
    pricePhysical: null,
    totalPages: 88,
    isbn: "978-978-XXX-005",
    publishedYear: 2025,
    tags: ["CAMA", "CAC", "business registration"],
    downloadCount: 891,
    orderCount: 0,
    createdAt: "2025-03-14",
    updatedAt: "2025-04-10",
    featured: false,
    stockCount: null,
  },
  {
    id: "b006",
    title: "VAPP Act & Domestic Violence: Know Your Protection",
    author: "Ngozi Eze",
    description: "Plain-English breakdown of the Violence Against Persons Act 2015.",
    category: "family",
    coverUrl: null,
    pdfUrl: "/books/vapp-act.pdf",
    format: "both",
    status: "draft",
    pricePhysical: 1500,
    totalPages: 64,
    isbn: "978-978-XXX-006",
    publishedYear: 2025,
    tags: ["domestic violence", "VAPP", "protection order"],
    downloadCount: 0,
    orderCount: 0,
    createdAt: "2025-04-19",
    updatedAt: "2025-04-21",
    featured: false,
    stockCount: 200,
  },
];

const ORDERS: BookOrder[] = [
  {
    id: "o001", bookId: "b001", bookTitle: "Know Your Rights: Arrest & Detention in Nigeria",
    coverUrl: "/images/police_law.jpg", userId: "u001", userName: "Chidinma Okafor",
    userEmail: "chidinma@gmail.com", deliveryAddress: "12 Udi Road, GRA", phone: "08012345678",
    state: "Enugu", quantity: 2, unitPrice: 3500, totalAmount: 7000, status: "delivered",
    paymentRef: "PAY-20250415-001", orderedAt: "Apr 15, 2025 · 09:22", updatedAt: "Apr 18, 2025",
    trackingNumber: "GIG-4521887", notes: "",
  },
  {
    id: "o002", bookId: "b002", bookTitle: "Tenant Rights Handbook: Nigeria Edition",
    coverUrl: "/images/tenancy_law.jpg", userId: "u002", userName: "Babatunde Lawal",
    userEmail: "babatunde@yahoo.com", deliveryAddress: "45 Allen Avenue, Ikeja", phone: "08098765432",
    state: "Lagos", quantity: 1, unitPrice: 2800, totalAmount: 2800, status: "shipped",
    paymentRef: "PAY-20250419-002", orderedAt: "Apr 19, 2025 · 16:44", updatedAt: "Apr 20, 2025",
    trackingNumber: "GIG-4521999", notes: "Deliver before 5pm",
  },
  {
    id: "o003", bookId: "b001", bookTitle: "Know Your Rights: Arrest & Detention in Nigeria",
    coverUrl: "/images/police_law.jpg", userId: "u003", userName: "Amina Garba",
    userEmail: "amina.g@hotmail.com", deliveryAddress: "7B Bompai Road", phone: "07011223344",
    state: "Kano", quantity: 3, unitPrice: 3500, totalAmount: 10500, status: "processing",
    paymentRef: "PAY-20250421-003", orderedAt: "Apr 21, 2025 · 11:05", updatedAt: "Apr 21, 2025",
    trackingNumber: null, notes: "",
  },
  {
    id: "o004", bookId: "b004", bookTitle: "Nigerian Contract Law: A Citizen's Guide",
    coverUrl: "/images/contract_law.jpg", userId: "u004", userName: "Ikechukwu Eze",
    userEmail: "ikechukwu@gmail.com", deliveryAddress: "23 Trans Amadi Industrial Layout",
    phone: "09055667788", state: "Rivers", quantity: 1, unitPrice: 4200, totalAmount: 4200,
    status: "pending", paymentRef: "PAY-20250421-004", orderedAt: "Apr 21, 2025 · 14:22",
    updatedAt: "Apr 21, 2025", trackingNumber: null, notes: "Payment pending confirmation",
  },
  {
    id: "o005", bookId: "b002", bookTitle: "Tenant Rights Handbook: Nigeria Edition",
    coverUrl: "/images/tenancy_law.jpg", userId: "u006", userName: "Emeka Obi",
    userEmail: "emekaobi@live.com", deliveryAddress: "Plot 14, Awka Road", phone: "08077889900",
    state: "Anambra", quantity: 1, unitPrice: 2800, totalAmount: 2800, status: "cancelled",
    paymentRef: "PAY-20250417-005", orderedAt: "Apr 17, 2025 · 08:33", updatedAt: "Apr 17, 2025",
    trackingNumber: null, notes: "Customer requested cancellation",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<BookCategory, { label: string; color: string; bg: string }> = {
  criminal:      { label: "Criminal",      color: "#3B82F6", bg: "#EFF6FF" },
  tenancy:       { label: "Tenancy",       color: "#10B981", bg: "#ECFDF5" },
  employment:    { label: "Employment",    color: "#8B5CF6", bg: "#F5F3FF" },
  contracts:     { label: "Contracts",     color: "#F59E0B", bg: "#FFFBEB" },
  business:      { label: "Business",      color: "#06B6D4", bg: "#ECFEFF" },
  family:        { label: "Family",        color: "#EF4444", bg: "#FEF2F2" },
  consumer:      { label: "Consumer",      color: "#E8317A", bg: "#FFF0F5" },
  road:          { label: "Road Traffic",  color: "#F97316", bg: "#FFF7ED" },
  constitutional:{ label: "Constitutional",color: "#7C3AED", bg: "#F5F3FF" },
};

const FORMAT_CONFIG: Record<BookFormat, { label: string; color: string; bg: string }> = {
  pdf:      { label: "PDF Only",   color: "#3B82F6", bg: "#EFF6FF" },
  physical: { label: "Physical",   color: "#F59E0B", bg: "#FFFBEB" },
  both:     { label: "PDF + Book", color: "#10B981", bg: "#ECFDF5" },
};

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock },
  processing: { label: "Processing", bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6", icon: RefreshCw },
  shipped:    { label: "Shipped",    bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6", icon: Truck },
  delivered:  { label: "Delivered",  bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: CheckCircle },
  cancelled:  { label: "Cancelled",  bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: XCircle },
};

const BOOK_STATUS_CFG: Record<BookStatus, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: "Active",   bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  inactive: { label: "Inactive", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  draft:    { label: "Draft",    bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
};

// ─── Upload Book Modal ─────────────────────────────────────────────────────────
function UploadBookModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: Book) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: "", author: "", category: "criminal" as BookCategory,
    description: "", isbn: "", publishedYear: new Date().getFullYear().toString(),
    totalPages: "", format: "pdf" as BookFormat,
    pricePhysical: "", stockCount: "",
    tags: [] as string[],
    coverType: "upload" as "upload" | "url",
    coverUrl: "",
    pdfType: "upload" as "upload" | "url",
    pdfUrl: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (t: string) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  const simulateUpload = async () => {
    setUploading(true);
    for (let i = 10; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 180));
      setProgress(i);
    }
    await new Promise(r => setTimeout(r, 300));
    const newBook: Book = {
      id: `b${Date.now()}`,
      title: form.title,
      author: form.author,
      description: form.description,
      category: form.category,
      coverUrl: form.coverUrl || null,
      pdfUrl: form.format !== "physical" ? (form.pdfUrl || "/books/placeholder.pdf") : null,
      format: form.format,
      status: "draft",
      pricePhysical: form.format !== "pdf" ? Number(form.pricePhysical) : null,
      totalPages: Number(form.totalPages) || 0,
      isbn: form.isbn,
      publishedYear: Number(form.publishedYear),
      tags: form.tags,
      downloadCount: 0,
      orderCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      featured: false,
      stockCount: form.format !== "pdf" ? (Number(form.stockCount) || null) : null,
    };
    setUploading(false);
    onAdd(newBook);
    setStep(3);
  };

  const inputCls = "w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div>
            <h3 className="font-bold text-[#111827] text-sm">Upload New Book</h3>
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

          {/* Step 1: Book Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Book Title *</label>
                <input value={form.title} onChange={set("title")} placeholder="e.g. Know Your Rights: Arrest in Nigeria" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Author *</label>
                  <input value={form.author} onChange={set("author")} placeholder="e.g. Adaeze Okonkwo" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={set("category")} className={`${inputCls} bg-white`}>
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={set("description")}
                  placeholder="What will readers learn from this book?"
                  className="w-full h-20 px-3 py-2.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">ISBN</label>
                  <input value={form.isbn} onChange={set("isbn")} placeholder="978-XXX" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Year</label>
                  <input value={form.publishedYear} onChange={set("publishedYear")} type="number" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Pages</label>
                  <input value={form.totalPages} onChange={set("totalPages")} type="number" placeholder="0" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Type a tag and press Enter" className={`${inputCls} flex-1`} />
                  <button onClick={addTag} className="px-3 rounded-xl bg-[#F3F4F6] text-[#6B7280] text-[12px] font-semibold hover:bg-[#E5E7EB] transition-colors">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-[#EF4444]"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setStep(2)} disabled={!form.title || !form.author}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-40 transition-colors">
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Format & Files */}
          {step === 2 && (
            <div className="space-y-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] text-[#9CA3AF] hover:text-[#111827] transition-colors mb-2">
                ← Back
              </button>

              {/* Format selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Book Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["pdf", "physical", "both"] as BookFormat[]).map(f => (
                    <button key={f} onClick={() => setForm(prev => ({ ...prev, format: f }))}
                      className={`py-3 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${form.format === f ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF]"}`}>
                      {f === "pdf" ? "📄 PDF Only" : f === "physical" ? "📦 Physical" : "📚 Both"}
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Upload */}
              {form.format !== "physical" && (
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">PDF File</label>
                  <div className="flex gap-2 mb-2">
                    {(["upload", "url"] as const).map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, pdfType: t }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${form.pdfType === t ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                        {t === "upload" ? <Upload size={11} /> : <Globe size={11} />}
                        {t === "upload" ? "Upload" : "URL"}
                      </button>
                    ))}
                  </div>
                  {form.pdfType === "upload" ? (
                    <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center hover:border-[#E8317A] transition-colors cursor-pointer">
                      <FileText size={22} className="text-[#D1D5DB] mx-auto mb-2" />
                      <p className="text-[12px] font-semibold text-[#9CA3AF]">Click to upload PDF</p>
                      <p className="text-[10px] text-[#D1D5DB] mt-0.5">PDF only · Max 50MB</p>
                    </div>
                  ) : (
                    <input value={form.pdfUrl} onChange={set("pdfUrl")} placeholder="https://example.com/book.pdf" className={inputCls} />
                  )}
                </div>
              )}

              {/* Cover Image */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Cover Image</label>
                <div className="flex gap-2 mb-2">
                  {(["upload", "url"] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, coverType: t }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${form.coverType === t ? "border-[#E8317A] bg-pink-50 text-[#E8317A]" : "border-[#E5E7EB] text-[#6B7280]"}`}>
                      {t === "upload" ? <Upload size={11} /> : <Globe size={11} />}
                      {t === "upload" ? "Upload" : "URL"}
                    </button>
                  ))}
                </div>
                {form.coverType === "upload" ? (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center hover:border-[#E8317A] transition-colors cursor-pointer">
                    <ImageIcon size={22} className="text-[#D1D5DB] mx-auto mb-2" />
                    <p className="text-[12px] font-semibold text-[#9CA3AF]">Click to upload cover</p>
                    <p className="text-[10px] text-[#D1D5DB] mt-0.5">JPG or PNG · 600×900px recommended</p>
                  </div>
                ) : (
                  <input value={form.coverUrl} onChange={set("coverUrl")} placeholder="https://example.com/cover.jpg" className={inputCls} />
                )}
              </div>

              {/* Physical book pricing */}
              {form.format !== "pdf" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Price (NGN)</label>
                    <input value={form.pricePhysical} onChange={set("pricePhysical")} type="number" placeholder="e.g. 3500" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Stock Count</label>
                    <input value={form.stockCount} onChange={set("stockCount")} type="number" placeholder="e.g. 100" className={inputCls} />
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6]">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Summary</p>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Title</span><span className="font-semibold text-[#111827] truncate max-w-[180px]">{form.title}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Author</span><span className="font-semibold text-[#111827]">{form.author}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF]">Format</span><span className="font-semibold text-[#111827]">{FORMAT_CONFIG[form.format].label}</span></div>
                  {form.pricePhysical && (
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Price</span><span className="font-semibold text-[#111827]">NGN {Number(form.pricePhysical).toLocaleString()}</span></div>
                  )}
                </div>
              </div>

              <button onClick={simulateUpload} disabled={uploading}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Uploading... {progress}%
                  </>
                ) : (
                  <><Upload size={13} /> Upload Book</>
                )}
              </button>

              {uploading && (
                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div className="h-1.5 bg-[#E8317A] rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border-2 border-[#6EE7B7] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={26} className="text-[#10B981]" />
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-1">Book Uploaded Successfully</h3>
              <p className="text-[13px] text-[#9CA3AF] mb-2">"{form.title}" has been saved as a draft.</p>
              <p className="text-[11px] text-[#9CA3AF] mb-6">Go to the book settings to publish it or update the status.</p>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Modal ────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onUpdateStatus }: {
  order: BookOrder;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, tracking?: string) => void;
}) {
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);
  const cfg = ORDER_STATUS_CFG[order.status];
  const Icon = cfg.icon;

  const update = async (status: OrderStatus) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdateStatus(order.id, status, tracking || undefined);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full" style={{ background: cfg.dot }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">Order {order.id}</h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mt-1"
                style={{ background: cfg.bg, color: cfg.text }}>
                <Icon size={10} /> {cfg.label}
              </span>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Book */}
          <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-4">
            <div className="w-10 h-14 rounded-lg bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {order.coverUrl ? (
                <img src={order.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : <BookOpen size={14} className="text-[#9CA3AF]" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-[#111827] leading-snug">{order.bookTitle}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Qty: {order.quantity} × NGN {order.unitPrice.toLocaleString()}</p>
              <p className="text-[12px] font-bold text-[#E8317A] mt-0.5">NGN {order.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2 text-[12px] mb-4">
            {[
              { l: "Customer", v: order.userName },
              { l: "Email", v: order.userEmail },
              { l: "Phone", v: order.phone },
              { l: "Address", v: order.deliveryAddress },
              { l: "State", v: order.state },
              { l: "Payment Ref", v: order.paymentRef },
              { l: "Ordered", v: order.orderedAt },
            ].map(({ l, v }) => (
              <div key={l} className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">{l}</span>
                <span className="font-semibold text-[#111827] truncate max-w-[200px]">{v}</span>
              </div>
            ))}
          </div>

          {/* Tracking */}
          {(order.status === "processing" || order.status === "shipped") && (
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Tracking Number</label>
              <input value={tracking} onChange={e => setTracking(e.target.value)}
                placeholder="e.g. GIG-1234567"
                className="w-full h-10 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
              />
            </div>
          )}

          {order.trackingNumber && order.status !== "processing" && (
            <div className="flex items-center gap-2 p-3 bg-[#F5F3FF] border border-[#C4B5FD] rounded-xl mb-4">
              <Truck size={13} className="text-[#8B5CF6]" />
              <span className="text-[12px] font-semibold text-[#4C1D95]">Tracking: {order.trackingNumber}</span>
            </div>
          )}

          {order.notes && (
            <div className="flex items-start gap-2 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl mb-4">
              <Info size={12} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#92400E]">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {order.status === "pending" && (
              <button onClick={() => update("processing")} disabled={saving}
                className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Mark as Processing
              </button>
            )}
            {order.status === "processing" && (
              <button onClick={() => update("shipped")} disabled={saving}
                className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />} Mark as Shipped
              </button>
            )}
            {order.status === "shipped" && (
              <button onClick={() => update("delivered")} disabled={saving}
                className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} Mark as Delivered
              </button>
            )}
            {(order.status === "pending" || order.status === "processing") && (
              <button onClick={() => update("cancelled")} disabled={saving}
                className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] flex items-center justify-center gap-1.5 transition-colors">
                <X size={12} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ─────────────────────────────────────────────────────────────────
function BookCard({ book, onEdit, onToggleStatus, onToggleFeatured, onDelete }: {
  book: Book;
  onEdit: (b: Book) => void;
  onToggleStatus: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_CONFIG[book.category];
  const fmt = FORMAT_CONFIG[book.format];
  const sts = BOOK_STATUS_CFG[book.status];

  return (
    <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Cover */}
      <div className="relative h-40 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}08)` }}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={36} style={{ color: cat.color, opacity: 0.25 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: fmt.bg, color: fmt.color }}>
            {fmt.label}
          </span>
        </div>

        {book.featured && (
          <div className="absolute top-3 right-10 flex items-center gap-1 text-[9px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">
            <Flame size={9} /> Featured
          </div>
        )}

        {/* Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1">
                  {[
                    { icon: Edit2,   label: "Edit Book",       action: () => { onEdit(book); setMenuOpen(false); },            color: "#111827" },
                    { icon: book.featured ? Star : Star, label: book.featured ? "Unfeature" : "Feature",
                      action: () => { onToggleFeatured(book.id); setMenuOpen(false); }, color: "#F59E0B" },
                    { icon: book.status === "active" ? X : Check,
                      label: book.status === "active" ? "Deactivate" : "Activate",
                      action: () => { onToggleStatus(book.id); setMenuOpen(false); }, color: book.status === "active" ? "#EF4444" : "#10B981" },
                    { icon: Trash2, label: "Delete",           action: () => { onDelete(book.id); setMenuOpen(false); },       color: "#EF4444" },
                  ].map(({ icon: Icon, label, action, color }) => (
                    <button key={label} onClick={action}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-left"
                      style={{ color }}>
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: sts.bg, color: sts.text }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sts.dot }} />
            {sts.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-bold text-[#111827] leading-snug mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-[11px] text-[#9CA3AF] mb-3">by {book.author} · {book.publishedYear} · {book.totalPages}pp</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 bg-[#F9FAFB] rounded-xl p-2.5">
          {book.format !== "physical" && (
            <div className="text-center">
              <p className="text-[12px] font-bold text-[#3B82F6]">{book.downloadCount.toLocaleString()}</p>
              <p className="text-[9px] text-[#9CA3AF]">Downloads</p>
            </div>
          )}
          {book.format !== "pdf" && (
            <div className="text-center">
              <p className="text-[12px] font-bold text-[#E8317A]">{book.orderCount}</p>
              <p className="text-[9px] text-[#9CA3AF]">Orders</p>
            </div>
          )}
          {book.format !== "pdf" && (
            <div className="text-center">
              <p className="text-[12px] font-bold text-[#111827]">
                {book.stockCount !== null ? book.stockCount : "∞"}
              </p>
              <p className="text-[9px] text-[#9CA3AF]">Stock</p>
            </div>
          )}
          {book.format !== "physical" && book.format === "pdf" && (
            <div className="text-center col-span-2">
              <p className="text-[12px] font-bold text-[#10B981]">Free</p>
              <p className="text-[9px] text-[#9CA3AF]">PDF Download</p>
            </div>
          )}
        </div>

        {/* Price */}
        {book.pricePhysical !== null && (
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#E8317A] mb-3">
            <DollarSign size={11} />
            NGN {book.pricePhysical.toLocaleString()} / copy
          </div>
        )}

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md">{t}</span>
            ))}
            {book.tags.length > 3 && <span className="text-[10px] text-[#9CA3AF]">+{book.tags.length - 3}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {book.pdfUrl && (
            <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold text-[#3B82F6] hover:border-[#3B82F6] hover:bg-blue-50 transition-all">
              <Eye size={11} /> Preview PDF
            </a>
          )}
          <button onClick={() => onEdit(book)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all">
            <Edit2 size={11} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Library Page ──────────────────────────────────────────────────
export default function AdminLibraryPage() {
  const [activeTab, setActiveTab] = useState<"books" | "orders">("books");
  const [showUpload, setShowUpload] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [bookFormatFilter, setBookFormatFilter] = useState("all");
  const [bookStatusFilter, setBookStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<BookOrder | null>(null);

  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [orders, setOrders] = useState<BookOrder[]>(ORDERS);

  // Stats
  const stats = {
    totalBooks: books.length,
    totalDownloads: books.reduce((s, b) => s + b.downloadCount, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending" || o.status === "processing").length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0),
  };

  // Filtered books
  const filteredBooks = books.filter(b => {
    if (bookFormatFilter !== "all" && b.format !== bookFormatFilter) return false;
    if (bookStatusFilter !== "all" && b.status !== bookStatusFilter) return false;
    if (bookSearch) {
      const q = bookSearch.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return o.userName.toLowerCase().includes(q) || o.bookTitle.toLowerCase().includes(q) ||
        o.paymentRef.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddBook = (book: Book) => {
    setBooks(prev => [book, ...prev]);
    setShowUpload(false);
  };

  const handleToggleStatus = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
  };

  const handleToggleFeatured = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, featured: !b.featured } : b));
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, tracking?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId
      ? { ...o, status, trackingNumber: tracking || o.trackingNumber, updatedAt: "Just now" }
      : o
    ));
  };

  const orderColumns = [
    {
      key: "order",
      header: "Order",
      render: (o: BookOrder) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {o.coverUrl
              ? <img src={o.coverUrl} alt="" className="w-full h-full object-cover" />
              : <BookOpen size={13} className="text-[#9CA3AF]" />}
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#111827] max-w-[160px] truncate">{o.bookTitle}</p>
            <p className="text-[11px] text-[#9CA3AF]">{o.id} · Qty {o.quantity}</p>
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (o: BookOrder) => (
        <div>
          <p className="text-[12px] font-semibold text-[#111827]">{o.userName}</p>
          <p className="text-[11px] text-[#9CA3AF]">{o.state}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (o: BookOrder) => (
        <span className="text-[12px] font-bold text-[#E8317A]">NGN {o.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o: BookOrder) => {
        const cfg = ORDER_STATUS_CFG[o.status];
        const Icon = cfg.icon;
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.text }}>
            <Icon size={10} /> {cfg.label}
          </span>
        );
      },
    },
    {
      key: "tracking",
      header: "Tracking",
      render: (o: BookOrder) => o.trackingNumber
        ? <span className="text-[11px] font-mono text-[#8B5CF6]">{o.trackingNumber}</span>
        : <span className="text-[11px] text-[#D1D5DB]">—</span>,
    },
    {
      key: "date",
      header: "Ordered",
      render: (o: BookOrder) => <span className="text-[11px] text-[#6B7280]">{o.orderedAt.split("·")[0].trim()}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      render: (o: BookOrder) => (
        <button onClick={() => setSelectedOrder(o)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <>
      {showUpload && <UploadBookModal onClose={() => setShowUpload(false)} onAdd={handleAddBook} />}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Legal Library"
          subtitle="Manage books available for download and physical purchase."
          action={
            <button onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
              <Plus size={13} /> Upload Book
            </button>
          }
        />

        {/* Stats */}
        <StatBar items={[
          { label: "Total Books",    value: stats.totalBooks,                        icon: BookOpen,      color: "#E8317A", bg: "#FFF0F5" },
          { label: "Total Downloads",value: stats.totalDownloads.toLocaleString(),   icon: Download,      color: "#3B82F6", bg: "#EFF6FF" },
          { label: "Total Orders",   value: stats.totalOrders,                       icon: ShoppingCart,  color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Pending Orders", value: stats.pendingOrders,                     icon: Clock,         color: "#9CA3AF", bg: "#F9FAFB" },
        ]} />

        {/* Revenue strip */}
        <div className="bg-gradient-to-r from-[#111827] to-[#1E3A5F] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Total Revenue from Book Orders</p>
            <p className="text-2xl font-bold text-white mt-0.5">NGN {stats.revenue.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <TrendingUp size={14} className="text-[#10B981]" />
            <span className="text-[#10B981] font-semibold">+18%</span> vs last month
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
          {([
            { id: "books",  label: "Books", count: books.length,           icon: BookOpen },
            { id: "orders", label: "Orders", count: orders.length,          icon: ShoppingCart },
          ] as const).map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                <Icon size={13} /> {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.id ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* ─── BOOKS TAB ─────────────────────────────────────── */}
        {activeTab === "books" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input value={bookSearch} onChange={e => setBookSearch(e.target.value)}
                  placeholder="Search books…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                {[
                  { value: "all",      label: "All" },
                  { value: "pdf",      label: "PDF" },
                  { value: "physical", label: "Physical" },
                  { value: "both",     label: "Both" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setBookFormatFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${bookFormatFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                {[
                  { value: "all",      label: "All Status" },
                  { value: "active",   label: "Active" },
                  { value: "draft",    label: "Draft" },
                  { value: "inactive", label: "Inactive" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setBookStatusFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${bookStatusFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
                <BookOpen size={36} className="text-[#E5E7EB] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#9CA3AF]">No books found</p>
                <button onClick={() => setShowUpload(true)}
                  className="mt-4 flex items-center gap-1.5 mx-auto text-[12px] font-bold text-[#E8317A] hover:underline">
                  <Plus size={12} /> Upload your first book
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book}
                    onEdit={() => {}}
                    onToggleStatus={handleToggleStatus}
                    onToggleFeatured={handleToggleFeatured}
                    onDelete={handleDeleteBook}
                  />
                ))}
                {/* Upload card */}
                <button onClick={() => setShowUpload(true)}
                  className="rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-8 text-center hover:border-[#E8317A]/40 hover:bg-pink-50/20 transition-all group min-h-[340px]">
                  <div className="w-10 h-10 rounded-full bg-[#F3F4F6] group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                    <Plus size={18} className="text-[#9CA3AF] group-hover:text-[#E8317A] transition-colors" />
                  </div>
                  <p className="text-[13px] font-bold text-[#9CA3AF] group-hover:text-[#111827] transition-colors">Upload Book</p>
                  <p className="text-[11px] text-[#D1D5DB] mt-1">PDF, physical, or both</p>
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── ORDERS TAB ────────────────────────────────────── */}
        {activeTab === "orders" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search orders…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                {[
                  { value: "all",        label: "All" },
                  { value: "pending",    label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped",    label: "Shipped" },
                  { value: "delivered",  label: "Delivered" },
                  { value: "cancelled",  label: "Cancelled" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setOrderStatusFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${orderStatusFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Table
              columns={orderColumns}
              data={filteredOrders}
              keyField="id"
              emptyMessage="No orders found."
              emptyIcon={<ShoppingCart size={36} />}
            />

            <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
              <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}