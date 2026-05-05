export type BookFormat = "pdf" | "physical" | "both";
export type BookStatus = "active" | "inactive" | "draft";
export type BookCategory =
  | "criminal" | "tenancy" | "employment" | "contracts"
  | "business" | "family" | "consumer" | "road" | "constitutional";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

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
