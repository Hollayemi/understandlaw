export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}


export interface CitizenProfile {
  userId: string;
  phone?: string;
  stateCode?: string;
  bio?: string;

  // Gamification
  xpTotal: number;
  xpLevel: number;
  streakDays: number;
  streakLastAt?: string;

  // Learning stats
  topicsCompletedCount: number;
  certificatesCount: number;
  totalStudyMinutes: number;

  createdAt?: string;
  updatedAt?: string;
}
export type StatusVariant = "active" | "inactive" | "pending" | "suspended" | "approved" | "rejected" | "warning";
export interface CitizenUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "citizen";
  state: string;
  status: StatusVariant;
  authProvider: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;

    // Preferences
  preferredLanguage: string;
  jurisdictionCode: string;
  legalInterestAreas: string[];

  // Privacy
  showActivityPublic: boolean;
  allowAnonymousAnalytics: boolean;
  personalizedRecommend: boolean;
  showProfileInCommunity: boolean;

  // Notification channels
  notifEmail: boolean;
  notifSms: boolean;
  notifPush: boolean;
  notifInAppBadge: boolean;

  // Notification types
  notifLawyerResponse: boolean;
  notifConsultReminder: boolean;
  notifMatchAlert: boolean;
  notifMessages: boolean;
  notifReviewReminder: boolean;
  notifWeeklyDigest: boolean;
  notifStreakReminder: boolean;
  notifPlatformUpdates: boolean;
  notifLegalNews: boolean;
  notifPromotional: boolean;

  // Appearance
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  accentColor: string;
  reducedMotion: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;

  twoFaEnabled: boolean;
  acceptedTermsAt?: string;

}

export interface CitizenFull {
  user: CitizenUser;
  profile: CitizenProfile;
}

export interface UpdateCitizenProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
  bio?: string;
  avatarUrl?: string;

  stateCode?: string;
  preferredLanguage?: string;
  jurisdictionCode?: string;
  legalInterestAreas?: string[];
  theme?: "light" | "dark" | "system";
  fontSize?: "small" | "medium" | "large";
  accentColor?: string;
  reducedMotion?: boolean;
  highContrast?: boolean;
  dyslexicFont?: boolean;
}

export interface UpdateNotificationsPayload {
  notifEmail?: boolean;
  notifSms?: boolean;
  notifPush?: boolean;
  notifInAppBadge?: boolean;
  notifLawyerResponse?: boolean;
  notifConsultReminder?: boolean;
  notifMatchAlert?: boolean;
  notifMessages?: boolean;
  notifReviewReminder?: boolean;
  notifWeeklyDigest?: boolean;
  notifStreakReminder?: boolean;
  notifPlatformUpdates?: boolean;
  notifLegalNews?: boolean;
  notifPromotional?: boolean;
}

export interface UpdatePrivacyPayload {
  showActivityPublic?: boolean;
  allowAnonymousAnalytics?: boolean;
  personalizedRecommend?: boolean;
  showProfileInCommunity?: boolean;
}

export interface AwardXPPayload {
  points: number;
  reason?: string;
}


export interface LawyerProfile extends CitizenUser {
  barNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  firmName?: string;
  bio?: string;
}



export interface AuthResponse {
  user: CitizenFull;
  accessToken: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  isActive: string;
  role: string;
  lastLogin: string;
  removedAt: string;
  removedBy: string;
}

export interface AdminAuthResponse {
  admin: AdminProfile;
  accessToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'citizen' | 'lawyer';
}

export interface Pagination<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface DeactivateAccountRequest {
  password: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
