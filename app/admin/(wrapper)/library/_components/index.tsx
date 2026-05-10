"use client";
import React, { useState } from "react";
import { Book, BookCategory, BookFormat, BookOrder, OrderStatus } from "./types";
import { BOOK_STATUS_CFG, CATEGORY_CONFIG, FORMAT_CONFIG, ORDER_STATUS_CFG } from "./data";
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

export function UploadBookModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: Book) => void }) {
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

//  Order Detail Modal 
export function OrderModal({ order, onClose, onUpdateStatus }: {
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

//  Book Card 
export function BookCard({ book, onEdit, onToggleStatus, onToggleFeatured, onDelete }: {
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
