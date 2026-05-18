export type BookFormat = "pdf" | "physical" | "both";
export type BookStatus = "active" | "inactive" | "draft";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type BookCategory =
  | "criminal" | "tenancy" | "employment" | "contracts"
  | "business" | "family" | "consumer" | "road" | "constitutional";

export interface Book {
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

export interface BookOrder {
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

export interface LibraryStats {
  totalBooks: number;
  totalDownloads: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  featuredBooks: number;
}

export interface LibraryState {
  books: Book[];
  orders: BookOrder[];
  stats: LibraryStats;
  selectedBook: Book | null;
  selectedOrder: BookOrder | null;
  bookFilter: {
    tab: "all" | "pdf" | "physical" | "both";
    category: BookCategory | "all";
    status: BookStatus | "all";
    search: string;
  };
  orderFilter: {
    status: OrderStatus | "all";
    search: string;
  };
  loading: {
    books: boolean;
    orders: boolean;
    upload: boolean;
    order: boolean;
    delete: boolean;
    stats: boolean;
  };
  error: string | null;
  uploadProgress: number;
}


export interface ListBooksParams {
  search?: string;
  category?: BookCategory | "all";
  status?: BookStatus | "all";
  format?: BookFormat | "all";
  page?: number;
  limit?: number;
}

export interface ListOrdersParams {
  status?: OrderStatus | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateBookPayload {
  id: string;
  updates: Partial<Book>;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
}

export interface UploadBookPayload {
  formData: FormData;
  onProgress?: (progress: number) => void;
}
