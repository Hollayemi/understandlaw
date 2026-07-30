export interface DashboardOverviewStats {
  citizens: {
    total: number;
    active: number;
    inactive: number;
    newThisWeek: number;
    growthPercent: number;
  };
  lawyers: {
    total: number;
    verified: number;
    pendingVerification: number;
    newThisWeek: number;
  };
  consultations: {
    total: number;
    active: number;
    completed: number;
    disputed: number;
    newToday: number;
  };
  revenue: {
    totalGross: number;
    platformCommission: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number;
  };
  community: {
    totalPosts: number;
    pendingReview: number;
    reportedPosts: number;
    newToday: number;
  };
  library: {
    totalBooks: number;
    totalDownloads: number;
    pendingOrders: number;
    revenueThisMonth: number;
  };
}

export interface RevenueDataPoint {
  date: string;          // ISO date e.g. "2025-04-01"
  label: string;         // e.g. "Apr 1"
  gross: number;
  commission: number;
  lawyerPayout: number;
}

export interface ConsultationDataPoint {
  date: string;
  label: string;
  completed: number;
  disputed: number;
  cancelled: number;
}

export interface UserGrowthDataPoint {
  date: string;
  label: string;
  citizens: number;
  lawyers: number;
  cumCitizens: number;
  cumLawyers: number;
}

export interface TopLawyerRow {
  lawyerId: string;
  fullName: string;
  avatarInitials: string;
  colorA: string;
  colorB: string;
  scnNumber: string;
  specialisms: string[];
  consultationCount: number;
  rating: number;
  reviewCount: number;
  totalEarned: number;
  completionRate: number;
  disputeCount: number;
}

export interface RecentActivity {
  id: string;
  type: "consultation_booked" | "lawyer_applied" | "citizen_joined" | "dispute_raised" | "post_reported" | "order_placed";
  actorName: string;
  actorInitials: string;
  actorColor: string;
  description: string;
  metadata?: Record<string, string | number>;
  createdAt: string;
}

export interface PendingActionItem {
  id: string;
  type: "lawyer_verification" | "dispute" | "reported_post" | "pending_order";
  title: string;
  subtitle: string;
  urgency: "critical" | "high" | "medium";
  count?: number;
  createdAt: string;
}

export interface DashboardAnalytics {
  period: "7d" | "30d" | "90d" | "1y";
  revenue: RevenueDataPoint[];
  consultations: ConsultationDataPoint[];
  userGrowth: UserGrowthDataPoint[];
  topLawyers: TopLawyerRow[];
  recentActivity: RecentActivity[];
  pendingActions: PendingActionItem[];
  consultationsByMode: { message: number; call: number; video: number };
  consultationsByStatus: Record<string, number>;
  lawyersBySpecialism: { specialism: string; count: number }[];
  citizensByState: { state: string; count: number }[];
}
