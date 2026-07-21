export type SettingsTab = 
  | "profile" 
  | "notifications" 
  | "privacy" 
  | "security" 
  | "appearance" 
  | "legal" 
  | "subscription"
  | "lawyer-profile";

export interface Toggle {
  id: string;
  label: string;
  desc: string;
  key: string;
  value: boolean;
}

// Subscription & Billing Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  price: number;
  interval: 'monthly' | 'yearly';
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  paymentMethod: string;
  transactionId?: string;
}

export interface SubscriptionPayload {
  planId: string;
  interval: 'monthly' | 'yearly';
  autoRenew?: boolean;
  promoCode?: string;
}