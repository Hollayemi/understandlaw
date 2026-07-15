import { Specialism } from './lawyer';
import { ConsultationDocumentMeta } from './lawyer';
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
export type MatchStatus = "pending" | "unassigned" | "in_review" | "ready_for_call" | "matching" | "recommended" | "matched" | "expired";

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
  /** Documents attached at intake (by the client) or added by the firm's team. */
  documents?: ConsultationDocumentMeta[];
  /** The firm's refined case brief for the assigned lawyer, if this came through the firm-assisted flow. */
  caseBrief?: ConsultationDocumentMeta;
  /** Additional context shared with the lawyer, collected at intake. */
  notes?: string;
  /** Human-readable urgency, e.g. "Within 3 days". */
  urgencyLabel?: string;
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
  documents?: ConsultationDocumentMeta[];
  caseBrief?: ConsultationDocumentMeta;
  notes?: string;
  urgencyLabel?: string;
}

export interface RecommendedLawyerRef {
  id: string;
  lawyerId: string;
  lawyerProfileId: string;
  picture: string;
  name: string;
  initials: string;
  nbaNumber: string;
  title?: string;
  color: string;
  fee: string;
  ratingAvg: number;
  responseTimeLabel: number
}

export interface MatchRequest {
  id: string;
  citizen: CitizenInfo;
  specialism: Specialism;
  topic: string;
  urgency: string;
  budget: string;
  description: string;
  status: MatchStatus;
  createdAt: string;
  expiresAt: string;
  matchedLawyer?: string;
  matchedLawyerId?: string;
  /** How the citizen wants the firm to handle this before a lawyer is picked. */
  mode: ConsultMode;
  /** Additional context the citizen shared at intake. */
  notes?: string;
  /** Documents attached by the citizen, plus anything the firm's team adds. */
  documents?: ConsultationDocumentMeta[];
  /** The firm's refined summary of the case, prepared for whichever lawyer picks it up. */
  caseBrief?: ConsultationDocumentMeta;
  /** Message the admin sent directly to the citizen (message-mode requests). */
  adminMessage?: string;
  adminMessageAt?: string;
  /** Call/video session the admin organized (call or video mode requests). */
  scheduledCall?: { dateTime: string; link?: string; note?: string };
  /** Shortlist of lawyers the firm is recommending for the citizen to choose from. */
  recommendedLawyers?: RecommendedLawyerRef[];
  /** Set once the citizen (or admin) finalizes a match — the resulting paid consultation. */
  consultationId?: string;
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