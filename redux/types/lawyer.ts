export type VerificationStatus =
  | "pending"
  | "credential_check"
  | "training"
  | "assessment"
  | "verified"
  | "approved"
  | "rejected";

export type LawyerBadge = "Verified Lawyer" | "Top Rated" | "Responsive";

export type SubscriptionTier = "basic" | "pro";

export type OnboardingStep =
  | "personal"
  | "professional"
  | "specialisms"
  | "fees"
  | "documents"
  | "review";

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface FeeSchedule {
  message: number;
  call: number;
  video: number;
}

export interface VerificationDocument {
  _id?: string;
  label: string;
  filename: string;
  fileUrl: string;
  uploadedAt: string;
  sizeBytes: number;
  verified: boolean | null;
}

export interface LawyerUser {
    _id: string;
    email: string;
    firstName: string;
    fullName: string;
    lastName: string;
    isActive: boolean;
    lastLoginAt: string;
}

export interface LawyerFees {
    sms: number;
    message: number;
    call: number;
    video: number;
}

export interface LawyerFull {
    _id: string;
    id: string;
    email: string;
    firstName: string;
    isUserActive: boolean;
    avatarInitials: string;
    picture: string;
    fullName: string;
    lastName: string;
    isActive: boolean;
    lastLoginAt: string;
    specialisms: Specialism[];
    languages: string[];
    verificationStatus: "pending" | "approved" | "rejected";
    badges: any[];
    rating: any;
    isAvailable: boolean;
    fees: LawyerFees;
    ratingAvg: number;
    reviewCount: number;
    consultationCount: number;
    responseTimeLabel: string;
    responseTime: number;
    subscriptionTier: "basic" | "premium" | "professional"; // adjust as needed
    colorA: string; // hex color
    colorB: string; // hex color
    verificationDocuments: any[]; // replace with specific type if known
    title: string;
    bio: string;
    location: string;
    state: string;
    stateCode: string;
    nbaNumber: string;
    yearOfCall: number;
    calledAt: string; // year as string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export interface OnboardingPersonal {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
}

export interface OnboardingProfessional {
  nbaNumber: string;
  yearOfCall: number | "";
  calledAt: string;
  title: string;
  bio: string;
  location: string;
  state: string;
  stateCode: string;
  languages: string[];
}
export interface Specialism {
  _id: string;
  name: string;
  displayName: string;
  group: string;
}
export interface OnboardingSpecialisms {
  specialisms: string[];
}

export interface OnboardingFees {
  fees: FeeSchedule;
}

export interface OnboardingDocuments {
  /** Each item corresponds to a required document slot */
  documents: {
    label: string;
    file: File | null;
    fileUrl: string;
    filename: string;
    sizeBytes: number;
    uploaded: boolean;
    uploading: boolean;
    error: string | null;
  }[];
}

// ─── API Payload types ────────────────────────────────────────────────────────

export interface SubmitVerificationPayload {
  nbaNumber: string;
  yearOfCall: number;
  calledAt: string;
  title?: string;
  bio?: string;
  location?: string;
  state?: string;
  stateCode?: string;
  languages?: string[];
  specialisms?: string[];
  fees?: Partial<FeeSchedule>;
  documents?: {
    label: string;
    filename: string;
    fileUrl: string;
    sizeBytes: number;
  }[];
}

export interface UpdateLawyerProfilePayload {
  title?: string;
  bio?: string;
  specialisms?: string[];
  languages?: string[];
  location?: string;
  state?: string;
  stateCode?: string;
  fees?: Partial<FeeSchedule>;
}

export interface SetAvailabilityPayload {
  available: boolean;
}

// Admin payloads
export interface ListLawyersParams {
  verificationStatus?: VerificationStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
  isAvailable?: boolean;
}

export interface AdvanceVerificationPayload {
  profileId: string;
  note?: string;
}

export interface RejectVerificationPayload {
  infoNeeded?: string;
  profileId: string;
  reason: string;
}

export interface VerifyDocumentPayload {
  profileId: string;
  documentId: string;
  verified: boolean;
}

export interface UpdateLawyerStatusPayload {
  profileId: string;
  action: "suspend" | "reactivate";
  reason: string;
}

export interface EmailLawyerPayload {
  profileId: string;
  subject: string;
  body: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedLawyers {
  data: LawyerFull[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LawyerStats {
  total: number;
  byStatus: Record<VerificationStatus, number>;
  avgRating: number;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface UploadedDocument {
  id: string;
  label: string;
  fileUrl: string;
  filename: string;
  sizeBytes: number;
  uploaded: boolean;
  uploading: boolean;
  progress: number;
  error?: string;
  base64?: string;
  mimeType?: string;
}

export interface FormData {
  nbaNumber: string;
  yearOfCall: string;
  state: string;
  location: string;
  phone: string;
  
  // Specialisms & Languages
  specialisms: string[];
  languages: string[];
  
  // Your Story
  bio: string;
  education: EducationEntry[];
  notableWork: string[];
  
  // Consultation Setup
  fees: {
    message: number;
    call: number;
    video: number;
  };
  responseTime: string;
  available: boolean;
}


// Marketplace Stats
export interface MarketplaceStats {
  totalLawyers: number;
  averageRating: number;
  totalConsultations: number;
  verifiedLawyers: number;
  responseRate: number; // percentage
  averageResponseTime: number; // in hours
}

// Booking Consultation
export interface BookConsultationPayload {
  lawyerNbaNumber: string;
  mode: "message" | "call" | "video" | "sms";
  topic: string;
  description?: string;
  preferredTimeSlot?: string; // for call/video
  timezone?: string;
}

// Lightweight metadata for a document attached to a consultation/match request.
// Actual file bytes are uploaded separately; this just references what was attached.
export interface ConsultationDocumentMeta {
  name: string;
  sizeBytes: number;
  fileUrl?: string;
  /** Who attached it — the client themselves, or the firm's team (e.g. a refined case brief). */
  source?: "citizen" | "firm";
  /** Optional human label, e.g. "Case Brief", "Tenancy Agreement". */
  label?: string;
  uploadedAt?: string;
}

// ─── Payment proof (lawyer-uploaded invoice / receipt) ─────────────────────────

export type PaymentProofType = "invoice" | "receipt";
export type PaymentProofStatus = "pending" | "verified" | "rejected";

/**
 * A payment invoice or receipt the lawyer uploads for a consultation, so the
 * admin team can confirm the client's payment was properly documented before
 * the consultation is closed out as completed.
 */
export interface PaymentProofMeta extends ConsultationDocumentMeta {
  /** Unique id for this proof, used when the admin verifies/rejects it. */
  id?: string;
  type: PaymentProofType;
  status?: PaymentProofStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  /** Reason given by admin when rejecting a proof, so the lawyer knows what to fix. */
  rejectionReason?: string;
}

export interface BookingResponse {
  consultationId: string;
  status: "pending" | "accepted" | "scheduled" | "completed" | "cancelled";
  fee: number;
  lawyerResponseTime: string;
  estimatedResponseAt: string;
}

// Request Lawyer Match
export interface RequestMatchPayload {
  specialism: string;
  urgency: string | null;
  topic: string;
  location: string;
  waiver: boolean;
  waiverReason: string;
  whenHappened: Date;
  description: string;
  mode: "message" | "call" | "video";
  notes?: string;
  documents?: ConsultationDocumentMeta[];
}

export interface MatchResponse {
  requestId: string;
  status: "pending" | "matched" | "expired";
  estimatedMatchTime: string; // e.g., "2 hours"
  matchedLawyer?: {
    id: string;
    name: string;
    nbaNumber: string;
  };
}

// Availability
export interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  timezone: string;
}

// Submit Review
export interface SubmitReviewPayload {
  nbaNumber: string;
  consultationId: string;
  rating: number; // 1-5
  comment: string;
  tags?: string[]; // e.g., ["responsive", "knowledgeable"]
}

export interface ReviewResponse {
  reviewId: string;
  status: "pending" | "published" | "flagged";
  createdAt: string;
}