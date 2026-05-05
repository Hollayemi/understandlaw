
export type ConsultMode = "message" | "call" | "video";
export type ModalType = "consult" | "request" | "profile" | null;

export interface Lawyer {
  id: string;
  name: string;
  initials: string;
  colorA: string;
  colorB: string;
  title: string;
  specialisms: string[];
  location: string;
  state: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  consultations: number;
  fee: { message: number; call: number; video: number };
  badges: string[];
  available: boolean;
  bio: string;
  yearsCall: number;
  languages: string[];
  nbaNumber: string;
}
