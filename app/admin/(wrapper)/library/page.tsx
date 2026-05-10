"use client";
import { useState } from "react";
import {
  BookOpen, Download, ShoppingCart, TrendingUp,
  Plus, Search, Eye, Clock } from "lucide-react";
import {
  StatBar, Table, PageHeader,
} from "../_components";
import { Book, BookOrder, OrderStatus } from "./_components/types";
import { BookCard, OrderModal, UploadBookModal } from "./_components";
import { BOOKS, ORDER_STATUS_CFG, ORDERS } from "./_components/data";

//  Types 

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
          { label: "Total Books", value: stats.totalBooks, icon: BookOpen, color: "#E8317A", bg: "#FFF0F5" },
          { label: "Total Downloads", value: stats.totalDownloads.toLocaleString(), icon: Download, color: "#3B82F6", bg: "#EFF6FF" },
          { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "#9CA3AF", bg: "#F9FAFB" },
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
            { id: "books", label: "Books", count: books.length, icon: BookOpen },
            { id: "orders", label: "Orders", count: orders.length, icon: ShoppingCart },
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

        {/*  BOOKS TAB  */}
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
                  { value: "all", label: "All" },
                  { value: "pdf", label: "PDF" },
                  { value: "physical", label: "Physical" },
                  { value: "both", label: "Both" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setBookFormatFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${bookFormatFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                {[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
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
                    onEdit={() => { }}
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

        {/*  ORDERS TAB  */}
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
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                  { value: "cancelled", label: "Cancelled" },
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