import { Specialism } from './lawyer';
export type ConsultStatus =
  | "pending"
  | "paid"
  | "processing"
  | "awaiting_lawyer"
  | "active"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";

export type ConsultMode = "message" | "call" | "video";
export type MatchStatus = "pending" | "unassigned" | "matching" | "matched" | "expired";

export interface Message {
  id: string;
  sender: "citizen" | "lawyer";
  senderName: string;
  text: string;
  time: string;
}

export interface CitizenInfo {
  id: string;
  name: string;
  initials: string;
  picture?: string;
  color?: string;
  email?: string;
  state?: string;
}

export interface LawyerInfo {
  id: string;
  name: string;
  initials: string;
  color: string;
  specialisms: Specialism[];
  myPayout?: string;
  nbaNumber: string;
}

export interface Consultation {
  id: string;
  citizen: CitizenInfo;
  lawyer: LawyerInfo;
  lawyerPayout: number;
  mode: ConsultMode;
  conversationId: string;
  receiptId: string;
  topic: string;
  detail: string;
  status: ConsultStatus;
  fee: number;
  platformFee: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  ratingNote?: string;
  duration?: string;
  disputed: boolean;
  disputeReason?: string;
  lawyerResponseAt: string;
  paymentRef: string;
  transcript: Message[];
  flagged: boolean;
  flagReason?: string;
  refundRequested: boolean;
  refundApproved?: boolean;
  refundReason?: string;
}



export interface Consultation2 {
  id: string;
  lawyer: {
    name: string;
    initials: string;
    color: string;
    nbaNumber: string;
    specialisms: Specialism[];
  };
  conversationId: string;
  receiptId: string;
  mode: ConsultMode;
  topic: string;
  detail?: string;
  status: ConsultStatus;
  fee: number;
  platformFee: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  ratingNote?: string;
  disputed?: boolean;
  disputeReason?: string;
  refundRequested?: boolean;
  refundApproved?: boolean;
  transcript: Message[];
  paymentRef?: string;
  lawyerResponseAt?: string;
}

export interface MatchRequest {
  id: string;
  citizen: CitizenInfo;
  specialism: string;
  urgency: string;
  budget: string;
  description: string;
  status: MatchStatus;
  createdAt: string;
  expiresAt: string;
  matchedLawyer?: string;
  matchedLawyerId?: string;
}

// API Response types
export interface ConsultationStats {
  total: number;
  totalSpent: number;
  active: number;
  disputed: number;
  completed: number;
  pendingPayment: number;
  awaitingLawyer: number;
  cancelled: number;
  refunded: number;
  totalRevenue: number;
  platformRevenue: number;
  lawyerPayoutTotal: number;
}

export interface PaginatedConsultations {
  data: Consultation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedMatchRequests {
  data: MatchRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListConsultationsParams {
  status?: ConsultStatus | "all";
  mode?: ConsultMode | "all";
  search?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  citizenId?: string;
  lawyerId?: string;
  disputed?: boolean;
  flagged?: boolean;
}

export interface ListMatchRequestsParams {
  status?: MatchStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
  urgency?: string;
}

export interface LawyerPerformanceStats {
  lawyerId: string;
  lawyerName: string;
  lawyerInitials: string;
  lawyerColor: string;
  nbaNumber: string;
  totalSessions: number;
  completedSessions: number;
  disputedSessions: number;
  averageRating: number;
  totalRevenue: number;
  completionRate: number;
}

export interface DashboardStats {
  consultations: ConsultationStats;
  matchRequests: {
    total: number;
    unassigned: number;
    matching: number;
    matched: number;
    expired: number;
  };
  recentActivity: {
    id: string;
    type: "consultation_started" | "consultation_completed" | "dispute_raised" | "lawyer_matched";
    description: string;
    timestamp: string;
  }[];
}

// API Payload types
export interface UpdateConsultationStatusPayload {
  consultationId: string;
  status: ConsultStatus;
  note?: string;
}

export interface ResolveDisputePayload {
  consultationId: string;
  decision: "citizen" | "lawyer";
  refundAmount?: number;
  reason: string;
}

export interface FlagConsultationPayload {
  consultationId: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface ApproveRefundPayload {
  consultationId: string;
  approved: boolean;
  adminNote?: string;
}

export interface AssignLawyerToMatchPayload {
  matchRequestId: string;
  lawyerId: string;
}

export interface AutoMatchPayload {
  matchRequestId: string;
}

export interface BulkActionPayload {
  consultationIds: string[];
  action: "flag" | "refund" | "cancel";
  reason: string;
}

// Admin action responses
export interface AdminActionResult {
  success: boolean;
  message: string;
  affectedCount: number;
  consultationIds: string[];
}

// Export CSV types
export interface ExportConsultationsParams {
  status?: ConsultStatus | "all";
  startDate?: string;
  endDate?: string;
  format: "csv" | "excel";
}

export interface LawyerPerformanceParams {
  startDate?: string;
  endDate?: string;
  minSessions?: number;
}