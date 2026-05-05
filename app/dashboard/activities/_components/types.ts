export type RequestStatus = "pending" | "accepted" | "completed" | "declined" | "cancelled" | "matched";
export type RequestKind   = "consultation" | "lawyer_request";
export type ConsultMode   = "message" | "call" | "video";

export interface TimelineEvent {
  time: string;
  label: string;
  note?: string;
}

export interface ConsultRequest {
  id: string;
  kind: "consultation";
  lawyerName: string;
  lawyerInitials: string;
  lawyerColorA: string;
  lawyerColorB: string;
  lawyerTitle: string;
  mode: ConsultMode;
  topic: string;
  detail: string;
  status: RequestStatus;
  fee: number;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  timeline: TimelineEvent[];
  nbaNumber: string;
  receiptId?: string;
}

export interface LawyerRequest {
  id: string;
  kind: "lawyer_request";
  specialism: string;
  urgency: string;
  location: string;
  budget: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  matchedLawyerName?: string;
  matchedLawyerInitials?: string;
  matchedLawyerColorA?: string;
  matchedLawyerColorB?: string;
  matchedAt?: string;
  timeline: TimelineEvent[];
}

export type AnyRequest = ConsultRequest | LawyerRequest;
