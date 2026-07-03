import { ConsultMode } from "@/redux/types/consultation";
import {
  Search, Filter, MapPin, Star, Clock, Shield, Zap,
  CheckCircle, MessageSquare, Video, Phone, Calendar,
  ChevronRight, ChevronDown, X, ArrowRight, Send,
  BadgeCheck, Award, TrendingUp, Users, Lock,
  FileText, AlertCircle, ChevronLeft, Loader2,
  SlidersHorizontal, BookOpen, Briefcase, Building2,
  Scale, Home, Heart, Car, Globe, Check, Plus,
  Bell, UserPlus, ClipboardList, Sparkles, Info,
} from "lucide-react";
// import { ConsultMode, Lawyer } from "./types";

export const SPECIALISMS = [
  { id: "all",        label: "All Areas",        icon: Scale },
  { id: "criminal",   label: "Criminal Law",      icon: Shield },
  { id: "property",   label: "Property & Tenancy",icon: Home },
  { id: "employment", label: "Employment",         icon: Briefcase },
  { id: "business",   label: "Business & CAC",     icon: Building2 },
  { id: "family",     label: "Family Law",         icon: Heart },
  { id: "consumer",   label: "Consumer Rights",    icon: Globe },
  { id: "road",       label: "Road Traffic",       icon: Car },
];



export const BADGE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "Verified Lawyer": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Top Rated":       { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7" },
  "Responsive":      { bg: "#EFF6FF", text: "#1E3A8A", border: "#93C5FD" },
};

export const BADGE_ICON: Record<string, React.ElementType> = {
  "Verified Lawyer": BadgeCheck,
  "Top Rated":       Award,
  "Responsive":      Zap,
};

export const CONSULT_MODES: { id: ConsultMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "message", label: "Written Message",  icon: MessageSquare, desc: "Async,  reply within response time" },
  { id: "call",    label: "Scheduled Call",   icon: Phone,         desc: "Audio call, you pick the time slot" },
  { id: "video",   label: "Video Session",    icon: Video,         desc: "Face-to-face via secure video link" },
];