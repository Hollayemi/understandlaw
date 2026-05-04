import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

//  Types 
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
  pricePhysical: number | null;  // null = free
  totalPages: number;
  isbn: string;
  publishedYear: number;
  tags: string[];
  downloadCount: number;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  stockCount: number | null;  // null = unlimited / pdf only
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

interface LibraryState {
  books: Book[];
  orders: BookOrder[];
  stats: LibraryStats;
  selectedBook: Book | null;
  selectedOrder: BookOrder | null;
  // UI filters
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
  // Loading states
  loading: {
    books: boolean;
    orders: boolean;
    upload: boolean;
    order: boolean;
  };
  error: string | null;
  uploadProgress: number;
}

//  Mock initial data 
const MOCK_BOOKS: Book[] = [
  {
    id: "b001",
    title: "Know Your Rights: Arrest & Detention in Nigeria",
    author: "Adaeze Okonkwo",
    description: "A plain-English guide to Section 35 of the 1999 Constitution. Covers every stage of a police encounter,  from the moment of arrest to bail and court appearances.",
    category: "criminal",
    coverUrl: "/images/police_law.jpg",
    pdfUrl: "/books/arrest-rights.pdf",
    format: "both",
    status: "active",
    pricePhysical: 3500,
    totalPages: 142,
    isbn: "978-978-XXX-001",
    publishedYear: 2024,
    tags: ["arrest", "police", "Section 35", "detention", "bail"],
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
    description: "Everything a tenant in Nigeria needs to know,  notice periods, illegal lockouts, deposit recovery, and what to do when your landlord breaks the law.",
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
    description: "Wrongful termination, severance pay, NSITF contributions, workplace harassment,  a comprehensive guide to the Labour Act Cap. L1.",
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
    description: "Understand what makes a contract legally binding in Nigeria. Covers offer, acceptance, consideration, capacity, and remedies for breach.",
    category: "contracts",
    coverUrl: "/images/contract_law.jpg",
    pdfUrl: null,
    format: "physical",
    status: "active",
    pricePhysical: 4200,
    totalPages: 210,
    isbn: "978-978-XXX-004",
    publishedYear: 2023,
    tags: ["contracts", "agreement", "breach", "consideration"],
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
    description: "Everything you need to register and manage a company or business name under CAMA 2020. CAC procedures made simple.",
    category: "business",
    coverUrl: null,
    pdfUrl: "/books/cama-2020.pdf",
    format: "pdf",
    status: "active",
    pricePhysical: null,
    totalPages: 88,
    isbn: "978-978-XXX-005",
    publishedYear: 2025,
    tags: ["CAMA", "CAC", "business registration", "company"],
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
    description: "A plain-English breakdown of the Violence Against Persons (Prohibition) Act 2015. How to get a protection order and what the law guarantees you.",
    category: "family",
    coverUrl: null,
    pdfUrl: "/books/vapp-act.pdf",
    format: "both",
    status: "draft",
    pricePhysical: 1500,
    totalPages: 64,
    isbn: "978-978-XXX-006",
    publishedYear: 2025,
    tags: ["domestic violence", "VAPP", "protection order", "family"],
    downloadCount: 0,
    orderCount: 0,
    createdAt: "2025-04-19",
    updatedAt: "2025-04-21",
    featured: false,
    stockCount: 200,
  },
];

const MOCK_ORDERS: BookOrder[] = [
  {
    id: "o001",
    bookId: "b001",
    bookTitle: "Know Your Rights: Arrest & Detention in Nigeria",
    coverUrl: "/images/police_law.jpg",
    userId: "u001",
    userName: "Chidinma Okafor",
    userEmail: "chidinma@gmail.com",
    deliveryAddress: "12 Udi Road, GRA",
    phone: "08012345678",
    state: "Enugu",
    quantity: 2,
    unitPrice: 3500,
    totalAmount: 7000,
    status: "delivered",
    paymentRef: "PAY-20250415-001",
    orderedAt: "2025-04-15T09:22:00Z",
    updatedAt: "2025-04-18T14:30:00Z",
    trackingNumber: "GIG-4521887",
    notes: "",
  },
  {
    id: "o002",
    bookId: "b002",
    bookTitle: "Tenant Rights Handbook: Nigeria Edition",
    coverUrl: "/images/tenancy_law.jpg",
    userId: "u002",
    userName: "Babatunde Lawal",
    userEmail: "babatunde@yahoo.com",
    deliveryAddress: "45 Allen Avenue, Ikeja",
    phone: "08098765432",
    state: "Lagos",
    quantity: 1,
    unitPrice: 2800,
    totalAmount: 2800,
    status: "shipped",
    paymentRef: "PAY-20250419-002",
    orderedAt: "2025-04-19T16:44:00Z",
    updatedAt: "2025-04-20T10:15:00Z",
    trackingNumber: "GIG-4521999",
    notes: "Please deliver before 5pm",
  },
  {
    id: "o003",
    bookId: "b001",
    bookTitle: "Know Your Rights: Arrest & Detention in Nigeria",
    coverUrl: "/images/police_law.jpg",
    userId: "u003",
    userName: "Amina Garba",
    userEmail: "amina.g@hotmail.com",
    deliveryAddress: "7B Bompai Road",
    phone: "07011223344",
    state: "Kano",
    quantity: 3,
    unitPrice: 3500,
    totalAmount: 10500,
    status: "processing",
    paymentRef: "PAY-20250421-003",
    orderedAt: "2025-04-21T11:05:00Z",
    updatedAt: "2025-04-21T11:05:00Z",
    trackingNumber: null,
    notes: "",
  },
  {
    id: "o004",
    bookId: "b004",
    bookTitle: "Nigerian Contract Law: A Citizen's Guide",
    coverUrl: "/images/contract_law.jpg",
    userId: "u004",
    userName: "Ikechukwu Eze",
    userEmail: "ikechukwu@gmail.com",
    deliveryAddress: "23 Trans Amadi Industrial Layout",
    phone: "09055667788",
    state: "Rivers",
    quantity: 1,
    unitPrice: 4200,
    totalAmount: 4200,
    status: "pending",
    paymentRef: "PAY-20250421-004",
    orderedAt: "2025-04-21T14:22:00Z",
    updatedAt: "2025-04-21T14:22:00Z",
    trackingNumber: null,
    notes: "Payment pending confirmation",
  },
  {
    id: "o005",
    bookId: "b002",
    bookTitle: "Tenant Rights Handbook: Nigeria Edition",
    coverUrl: "/images/tenancy_law.jpg",
    userId: "u006",
    userName: "Emeka Obi",
    userEmail: "emekaobi@live.com",
    deliveryAddress: "Plot 14, Awka Road",
    phone: "08077889900",
    state: "Anambra",
    quantity: 1,
    unitPrice: 2800,
    totalAmount: 2800,
    status: "cancelled",
    paymentRef: "PAY-20250417-005",
    orderedAt: "2025-04-17T08:33:00Z",
    updatedAt: "2025-04-17T20:17:00Z",
    trackingNumber: null,
    notes: "Customer requested cancellation",
  },
];

//  Async Thunks 
export const fetchBooks = createAsyncThunk(
  "library/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      // Replace with real API call: await fetch('/api/admin/library/books')
      await new Promise((r) => setTimeout(r, 600));
      return MOCK_BOOKS;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch books");
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "library/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_ORDERS;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);

export const uploadBook = createAsyncThunk(
  "library/uploadBook",
  async (bookData: Partial<Book>, { rejectWithValue, dispatch }) => {
    try {
      // Simulate upload progress
      for (let i = 10; i <= 90; i += 10) {
        await new Promise((r) => setTimeout(r, 150));
        dispatch(setUploadProgress(i));
      }
      await new Promise((r) => setTimeout(r, 400));
      dispatch(setUploadProgress(100));

      const newBook: Book = {
        id: `b${Date.now()}`,
        title: bookData.title || "Untitled",
        author: bookData.author || "",
        description: bookData.description || "",
        category: bookData.category || "criminal",
        coverUrl: bookData.coverUrl || null,
        pdfUrl: bookData.pdfUrl || null,
        format: bookData.format || "pdf",
        status: "draft",
        pricePhysical: bookData.pricePhysical || null,
        totalPages: bookData.totalPages || 0,
        isbn: bookData.isbn || "",
        publishedYear: bookData.publishedYear || new Date().getFullYear(),
        tags: bookData.tags || [],
        downloadCount: 0,
        orderCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featured: false,
        stockCount: bookData.stockCount || null,
      };
      return newBook;
    } catch (err: any) {
      return rejectWithValue(err.message || "Upload failed");
    }
  }
);

export const updateBook = createAsyncThunk(
  "library/updateBook",
  async ({ id, updates }: { id: string; updates: Partial<Book> }, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      return { id, updates: { ...updates, updatedAt: new Date().toISOString() } };
    } catch (err: any) {
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

export const deleteBook = createAsyncThunk(
  "library/deleteBook",
  async (bookId: string, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      return bookId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "library/updateOrderStatus",
  async (
    { orderId, status, trackingNumber }: { orderId: string; status: OrderStatus; trackingNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((r) => setTimeout(r, 600));
      return { orderId, status, trackingNumber, updatedAt: new Date().toISOString() };
    } catch (err: any) {
      return rejectWithValue(err.message || "Status update failed");
    }
  }
);

//  Slice 
const initialState: LibraryState = {
  books: MOCK_BOOKS,
  orders: MOCK_ORDERS,
  stats: {
    totalBooks: MOCK_BOOKS.length,
    totalDownloads: MOCK_BOOKS.reduce((s, b) => s + b.downloadCount, 0),
    totalOrders: MOCK_ORDERS.length,
    totalRevenue: MOCK_ORDERS
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.totalAmount, 0),
    pendingOrders: MOCK_ORDERS.filter((o) => o.status === "pending" || o.status === "processing").length,
    featuredBooks: MOCK_BOOKS.filter((b) => b.featured).length,
  },
  selectedBook: null,
  selectedOrder: null,
  bookFilter: {
    tab: "all",
    category: "all",
    status: "all",
    search: "",
  },
  orderFilter: {
    status: "all",
    search: "",
  },
  loading: { books: false, orders: false, upload: false, order: false },
  error: null,
  uploadProgress: 0,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setSelectedBook(state, action: PayloadAction<Book | null>) {
      state.selectedBook = action.payload;
    },
    setSelectedOrder(state, action: PayloadAction<BookOrder | null>) {
      state.selectedOrder = action.payload;
    },
    setBookFilter(state, action: PayloadAction<Partial<LibraryState["bookFilter"]>>) {
      state.bookFilter = { ...state.bookFilter, ...action.payload };
    },
    setOrderFilter(state, action: PayloadAction<Partial<LibraryState["orderFilter"]>>) {
      state.orderFilter = { ...state.orderFilter, ...action.payload };
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload;
    },
    toggleFeatured(state, action: PayloadAction<string>) {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) book.featured = !book.featured;
      state.stats.featuredBooks = state.books.filter((b) => b.featured).length;
    },
    toggleStatus(state, action: PayloadAction<string>) {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.status = book.status === "active" ? "inactive" : "active";
      }
    },
    incrementDownload(state, action: PayloadAction<string>) {
      const book = state.books.find((b) => b.id === action.payload);
      if (book) {
        book.downloadCount += 1;
        state.stats.totalDownloads += 1;
      }
    },
    clearError(state) {
      state.error = null;
    },
    recomputeStats(state) {
      state.stats = {
        totalBooks: state.books.length,
        totalDownloads: state.books.reduce((s, b) => s + b.downloadCount, 0),
        totalOrders: state.orders.length,
        totalRevenue: state.orders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + o.totalAmount, 0),
        pendingOrders: state.orders.filter(
          (o) => o.status === "pending" || o.status === "processing"
        ).length,
        featuredBooks: state.books.filter((b) => b.featured).length,
      };
    },
  },
  extraReducers: (builder) => {
    // fetchBooks
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading.books = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading.books = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading.books = false;
        state.error = action.payload as string;
      });

    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.payload as string;
      });

    // uploadBook
    builder
      .addCase(uploadBook.pending, (state) => {
        state.loading.upload = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadBook.fulfilled, (state, action) => {
        state.loading.upload = false;
        state.uploadProgress = 0;
        state.books.unshift(action.payload);
        state.stats.totalBooks += 1;
      })
      .addCase(uploadBook.rejected, (state, action) => {
        state.loading.upload = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });

    // updateBook
    builder
      .addCase(updateBook.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const idx = state.books.findIndex((b) => b.id === id);
        if (idx !== -1) {
          state.books[idx] = { ...state.books[idx], ...updates };
        }
      });

    // deleteBook
    builder
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b.id !== action.payload);
        state.stats.totalBooks = state.books.length;
      });

    // updateOrderStatus
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading.order = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading.order = false;
        const { orderId, status, trackingNumber, updatedAt } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = status;
          order.updatedAt = updatedAt;
          if (trackingNumber) order.trackingNumber = trackingNumber;
        }
        // Recompute pending count
        state.stats.pendingOrders = state.orders.filter(
          (o) => o.status === "pending" || o.status === "processing"
        ).length;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading.order = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedBook,
  setSelectedOrder,
  setBookFilter,
  setOrderFilter,
  setUploadProgress,
  toggleFeatured,
  toggleStatus,
  incrementDownload,
  clearError,
  recomputeStats,
} = librarySlice.actions;

//  Selectors 
export const selectAllBooks = (state: { library: LibraryState }) => state.library.books;
export const selectAllOrders = (state: { library: LibraryState }) => state.library.orders;
export const selectLibraryStats = (state: { library: LibraryState }) => state.library.stats;
export const selectSelectedBook = (state: { library: LibraryState }) => state.library.selectedBook;
export const selectSelectedOrder = (state: { library: LibraryState }) => state.library.selectedOrder;
export const selectBookFilter = (state: { library: LibraryState }) => state.library.bookFilter;
export const selectOrderFilter = (state: { library: LibraryState }) => state.library.orderFilter;
export const selectUploadLoading = (state: { library: LibraryState }) => state.library.loading.upload;
export const selectUploadProgress = (state: { library: LibraryState }) => state.library.uploadProgress;
export const selectLibraryError = (state: { library: LibraryState }) => state.library.error;

export const selectFilteredBooks = (state: { library: LibraryState }) => {
  const { books, bookFilter } = state.library;
  return books.filter((b) => {
    if (bookFilter.tab !== "all" && b.format !== bookFilter.tab) return false;
    if (bookFilter.category !== "all" && b.category !== bookFilter.category) return false;
    if (bookFilter.status !== "all" && b.status !== bookFilter.status) return false;
    if (bookFilter.search) {
      const q = bookFilter.search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
};

export const selectFilteredOrders = (state: { library: LibraryState }) => {
  const { orders, orderFilter } = state.library;
  return orders.filter((o) => {
    if (orderFilter.status !== "all" && o.status !== orderFilter.status) return false;
    if (orderFilter.search) {
      const q = orderFilter.search.toLowerCase();
      return (
        o.userName.toLowerCase().includes(q) ||
        o.bookTitle.toLowerCase().includes(q) ||
        o.paymentRef.toLowerCase().includes(q)
      );
    }
    return true;
  });
};

export const selectBookById = (id: string) => (state: { library: LibraryState }) =>
  state.library.books.find((b) => b.id === id) ?? null;

export default librarySlice.reducer;