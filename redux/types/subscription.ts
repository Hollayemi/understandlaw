// redux/types/subscription.ts

export type BillingInterval = "monthly" | "yearly";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "expired"
  | "pending";

export type InvoiceStatus = "paid" | "pending" | "failed" | "refunded";

//  Subscription Plan (admin-managed catalogue) 

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: BillingInterval;
  features: string[];
  isPopular?: boolean;
  badge?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

//  Lightweight user shape as populated on subscriptions / invoices 

export interface SubscriberUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

//  Subscription (a citizen's plan) 

export interface Subscription {
  id: string;
  userId: SubscriberUser;
  planId: SubscriptionPlan;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  price: number;
  interval: BillingInterval;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
  cancelledAt?: string;
  cancelReason?: string;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

//  Billing history / invoices 

export interface BillingHistory {
  id: string;
  userId: string | SubscriberUser;
  subscriptionId?: string;
  planId?: string | SubscriptionPlan;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  invoiceUrl?: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

//  Dashboard stats 

export interface SubscriptionStats {
  totalPlans: number;
  activePlans: number;
  totalSubscribers: number;
  activeSubscribers: number;
  cancelledSubscribers: number;
  totalRevenue: number;
}

//  List / query params (admin) 

export interface ListPlansParams {
  isActive?: boolean;
  interval?: BillingInterval;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListSubscribersParams {
  status?: SubscriptionStatus;
  planId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListInvoicesParams {
  userId?: string;
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
  search?: any;
  page?: number;
  pageSize?: number;
}

//  Payloads (admin) 

export interface CreatePlanPayload {
  name: string;
  description: string;
  price: number;
  interval: BillingInterval;
  features?: string[];
  isPopular?: boolean;
  badge?: string;
  isActive?: boolean;
}

export interface UpdatePlanPayload {
  id: string;
  updates: Partial<CreatePlanPayload>;
}

export interface UpdateSubscriberPayload {
  id: string;
  updates: Partial<{
    status: SubscriptionStatus;
    autoRenew: boolean;
    cancelAtPeriodEnd: boolean;
    endDate: string;
  }>;
}

export interface UpdateInvoicePayload {
  id: string;
  updates: Partial<{
    status: InvoiceStatus;
    invoiceUrl: string;
    description: string;
  }>;
}

//  Payloads / responses (citizen / user-facing) 

export interface SubscribePayload {
  planId: string;
  interval: BillingInterval;
  autoRenew?: boolean;
  promoCode?: string;
}

export interface ChangeMyPlanPayload {
  planId: string;
  interval?: BillingInterval;
}

export interface CancelSubscriptionPayload {
  reason?: string;
  immediate?: boolean;
}

export interface UpdateAutoRenewPayload {
  autoRenew: boolean;
}

export interface GetBillingHistoryParams {
  page?: number;
  pageSize?: number;
}

export interface ListPublicPlansParams {
  interval?: BillingInterval;
}

// Shape returned by Paystack init, forwarded from the backend on subscribe / change-plan
export interface PaymentInitResult {
  reference: string;
  authorization_url?: string;
  access_code?: string;
  [key: string]: unknown;
}

export interface SubscriptionPaymentResponse {
  subscription: Subscription;
  payment: PaymentInitResult;
}