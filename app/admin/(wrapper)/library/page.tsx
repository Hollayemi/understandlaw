"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpen, Download, ShoppingCart, TrendingUp,
  Plus, Search, Eye, Clock, Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import { useAdminListBooksQuery, useAdminGetBookStatsQuery, useAdminListOrdersQuery, useAdminDeleteBookMutation, useAdminToggleBookFeaturedMutation, useAdminToggleBookStatusMutation, useAdminUpdateOrderStatusMutation } from "@/redux/slices/admin/library.slice";
import { Book, BookOrder, OrderStatus } from "@/redux/types/library";
import { BookCard, OrderModal, UploadBookModal } from "./_components";
import {toast} from "sonner";

// Stat Bar Component
function StatBar({ items }: { items: Array<{ label: string; value: string | number; icon: React.ElementType; color: string; bg: string }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {items.map(stat => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-xl border border-[#F3F4F6] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <Icon size={14} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[22px] font-bold text-[#111827]">{stat.value}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// Table Component for Orders
function Table({ columns, data, keyField, emptyMessage, emptyIcon }: {
  columns: Array<{ key: string; header: string; render?: (item: any) => React.ReactNode; width?: string }>;
  data: any[];
  keyField: string;
  emptyMessage: string;
  emptyIcon: React.ElementType;
}) {
  const EmptyIcon = emptyIcon;
  
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
        <EmptyIcon size={36} className="text-[#E5E7EB] mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#9CA3AF]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#F3F4F6] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] border-b border-[#F3F4F6]">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Page Header Component
function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">{title}</h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// Order Status Config
const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending: { label: "Pending", bg: "#FFFBEB", text: "#92400E", icon: Clock },
  processing: { label: "Processing", bg: "#EFF6FF", text: "#1E3A8A", icon: RefreshCw },
  shipped: { label: "Shipped", bg: "#F5F3FF", text: "#4C1D95", icon: Truck },
  delivered: { label: "Delivered", bg: "#ECFDF5", text: "#065F46", icon: CheckCircle },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", text: "#991B1B", icon: XCircle },
};

// Import missing icons
import { RefreshCw, Truck, CheckCircle, XCircle } from "lucide-react";

export default function AdminLibraryPage() {
  const [activeTab, setActiveTab] = useState<"books" | "orders">("books");
  const [showUpload, setShowUpload] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [bookFormatFilter, setBookFormatFilter] = useState("all");
  const [bookStatusFilter, setBookStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<BookOrder | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookPage, setBookPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

  // RTK Query hooks
  const { 
    data: booksData, 
    isLoading: booksLoading, 
    refetch: refetchBooks,
    isFetching: booksFetching 
  } = useAdminListBooksQuery({
    search: bookSearch || undefined,
    format: bookFormatFilter === "all" ? undefined : bookFormatFilter as any,
    status: bookStatusFilter === "all" ? undefined : bookStatusFilter as any,
    page: bookPage,
    limit: 12,
  });

  const { 
    data: statsData, 
    refetch: refetchStats,
    isLoading: statsLoading 
  } = useAdminGetBookStatsQuery();
  
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    refetch: refetchOrders,
    isFetching: ordersFetching 
  } = useAdminListOrdersQuery({
    status: orderStatusFilter === "all" ? undefined : orderStatusFilter as any,
    search: orderSearch || undefined,
    page: orderPage,
    limit: 20,
  });

  const [deleteBook, { isLoading: deletingBook }] = useAdminDeleteBookMutation();
  const [toggleFeatured, { isLoading: togglingFeatured }] = useAdminToggleBookFeaturedMutation();
  const [toggleStatus, { isLoading: togglingStatus }] = useAdminToggleBookStatusMutation();
  const [updateOrderStatus, { isLoading: updatingOrder }] = useAdminUpdateOrderStatusMutation();

  const books = booksData?.data?.data || [];
  const orders = ordersData?.data?.data || [];
  const stats = statsData?.data;

  // Handlers
  const handleDeleteBook = async (id: string) => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      try {
        await deleteBook(id).unwrap();
        toast.success("Book deleted successfully");
        refetchBooks();
        refetchStats();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete book");
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeatured(id).unwrap();
      toast.success("Featured status updated");
      refetchBooks();
      refetchStats();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update featured status");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Book status updated");
      refetchBooks();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update book status");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    try {
      await updateOrderStatus({ orderId, status, trackingNumber }).unwrap();
      toast.success(`Order marked as ${status}`);
      refetchOrders();
      refetchStats();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handleAddBook = () => {
    refetchBooks();
    refetchStats();
    setShowUpload(false);
  };

  const handleEditBook = (b: Book) => {
    setEditingBook(b);
    // You can open an edit modal here
    toast.info("Edit functionality coming soon");
  };

  // Order table columns
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
            <p className="text-[11px] text-[#9CA3AF]">#{o?._id?.slice(-6)} · Qty {o.quantity}</p>
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
        <span className="text-[12px] font-bold text-[#7C3AED]">NGN {o.totalAmount.toLocaleString()}</span>
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
      render: (o: BookOrder) => <span className="text-[11px] text-[#6B7280]">{new Date(o.orderedAt).toLocaleDateString()}</span>,
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

  // Loading states
  if (statsLoading && !statsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#7C3AED]" size={40} />
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      {showUpload && (
        <UploadBookModal 
          onClose={() => setShowUpload(false)} 
          onAdd={handleAddBook} 
        />
      )}
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#7C3AED] hover:bg-[#5B21B6] transition-colors">
              <Plus size={13} /> Upload Book
            </button>
          }
        />

        {/* Stats */}
        <StatBar items={[
          { label: "Total Books", value: stats?.totalBooks || 0, icon: BookOpen, color: "#7C3AED", bg: "#FFF0F5" },
          { label: "Total Downloads", value: (stats?.totalDownloads || 0).toLocaleString(), icon: Download, color: "#3B82F6", bg: "#EFF6FF" },
          { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "#9CA3AF", bg: "#F9FAFB" },
        ]} />

        {/* Revenue strip */}
        <div className="bg-gradient-to-r from-[#111827] to-[#1E3A5F] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Total Revenue from Book Orders</p>
            <p className="text-2xl font-bold text-white mt-0.5">NGN {(stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <TrendingUp size={14} className="text-[#10B981]" />
            <span className="text-[#10B981] font-semibold">+18%</span> vs last month
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 mb-5 w-fit">
          {([
            { id: "books", label: "Books", count: stats?.totalBooks || 0, icon: BookOpen },
            { id: "orders", label: "Orders", count: stats?.totalOrders || 0, icon: ShoppingCart },
          ] as const).map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === t.id ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                <Icon size={13} /> {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.id ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* BOOKS TAB */}
        {activeTab === "books" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input 
                  value={bookSearch} 
                  onChange={e => {
                    setBookSearch(e.target.value);
                    setBookPage(1);
                  }}
                  placeholder="Search books…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
                {[
                  { value: "all", label: "All" },
                  { value: "pdf", label: "PDF" },
                  { value: "physical", label: "Physical" },
                  { value: "both", label: "Both" },
                ].map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => {
                      setBookFormatFilter(opt.value);
                      setBookPage(1);
                    }}
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
                  <button 
                    key={opt.value} 
                    onClick={() => {
                      setBookStatusFilter(opt.value);
                      setBookPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${bookStatusFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {(booksFetching || booksLoading) && (
                <Loader2 size={16} className="animate-spin text-[#7C3AED] ml-2" />
              )}
            </div>

            {books.length === 0 && !booksFetching && !booksLoading ? (
              <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
                <BookOpen size={36} className="text-[#E5E7EB] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#9CA3AF]">No books found</p>
                <button onClick={() => setShowUpload(true)}
                  className="mt-4 flex items-center gap-1.5 mx-auto text-[12px] font-bold text-[#7C3AED] hover:underline">
                  <Plus size={12} /> Upload your first book
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {books.map((book: Book) => (
                    <BookCard 
                      key={book._id} 
                      book={book}
                      onEdit={handleEditBook}
                      onToggleStatus={handleToggleStatus}
                      onToggleFeatured={handleToggleFeatured}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                  {/* Upload card */}
                  <button onClick={() => setShowUpload(true)}
                    className="rounded-2xl border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-8 text-center hover:border-[#7C3AED]/40 hover:bg-pink-50/20 transition-all group min-h-[340px]">
                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                      <Plus size={18} className="text-[#9CA3AF] group-hover:text-[#7C3AED] transition-colors" />
                    </div>
                    <p className="text-[13px] font-bold text-[#9CA3AF] group-hover:text-[#111827] transition-colors">Upload Book</p>
                    <p className="text-[11px] text-[#D1D5DB] mt-1">PDF, physical, or both</p>
                  </button>
                </div>

                {/* Pagination */}
                {booksData?.data && booksData.data.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-[11px] text-[#9CA3AF]">
                      Showing {books.length} of {booksData.data.total} books
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookPage(p => Math.max(1, p - 1))}
                        disabled={bookPage === 1 || booksFetching}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1.5 text-[12px] text-[#6B7280]">
                        Page {bookPage} of {booksData.data.totalPages}
                      </span>
                      <button
                        onClick={() => setBookPage(p => Math.min(booksData.data.totalPages, p + 1))}
                        disabled={bookPage === booksData.data.totalPages || booksFetching}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input 
                  value={orderSearch} 
                  onChange={e => {
                    setOrderSearch(e.target.value);
                    setOrderPage(1);
                  }}
                  placeholder="Search orders…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] outline-none focus:border-[#7C3AED] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1 flex-wrap">
                {[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                  { value: "cancelled", label: "Cancelled" },
                ].map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => {
                      setOrderStatusFilter(opt.value);
                      setOrderPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${orderStatusFilter === opt.value ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {(ordersFetching || ordersLoading) && (
                <Loader2 size={16} className="animate-spin text-[#7C3AED] ml-2" />
              )}
            </div>

            <Table
              columns={orderColumns}
              data={orders}
              keyField="id"
              emptyMessage="No orders found."
              emptyIcon={ShoppingCart}
            />

            {/* Pagination */}
            {ordersData?.data && ordersData.data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[11px] text-[#9CA3AF]">
                  Showing {orders.length} of {ordersData.data.total} orders
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                    disabled={orderPage === 1 || ordersFetching}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-[12px] text-[#6B7280]">
                    Page {orderPage} of {ordersData.data.totalPages}
                  </span>
                  <button
                    onClick={() => setOrderPage(p => Math.min(ordersData.data.totalPages, p + 1))}
                    disabled={orderPage === ordersData.data.totalPages || ordersFetching}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}