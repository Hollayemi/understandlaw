
export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  MODERATOR = "moderator",
  ANALYST = "analyst",
  SUPPORT = "support",
}

export enum AuditAction {
  LOGIN = "login",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",

  // Admin management
  ADMIN_CREATED = "admin_created",
  ADMIN_UPDATED = "admin_updated",
  ADMIN_ACTIVATED = "admin_activated",
  ADMIN_DEACTIVATED = "admin_deactivated",
  ADMIN_REMOVED = "admin_removed",
  ROLE_CHANGED = "role_changed",

  // Module actions
  MODULE_CREATED = "module_created",
  MODULE_UPDATED = "module_updated",
  MODULE_DELETED = "module_deleted",
  MODULE_PUBLISHED = "module_published",

  // Topic actions
  TOPIC_CREATED = "topic_created",
  TOPIC_UPDATED = "topic_updated",
  TOPIC_DELETED = "topic_deleted",

  // Content actions
  CONTENT_UPLOADED = "content_uploaded",
  CONTENT_DELETED = "content_deleted",

  // User actions
  CITIZEN_SUSPENDED = "citizen_suspended",
  CITIZEN_ACTIVATED = "citizen_activated",
  LAWYER_VERIFIED = "lawyer_verified",
  LAWYER_REJECTED = "lawyer_rejected",

  // Comment actions
  COMMENT_RESOLVED = "comment_resolved",
  COMMENT_DELETED = "comment_deleted",
}

export interface AdminUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
  removedBy: string | null;
  // Onboarding fields
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStep;
  acceptedTermsAt: string | null;
  profileCompletedAt: string | null;
  trainingCompletedAt: string | null;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password?: string; // Optional for invite flow
  role: AdminRole;
  sendInvite?: boolean;
}

export interface UpdateAdminPayload {
  name?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface AdminFilters {
  role?: AdminRole | "all";
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface OnboardingCompletePayload {
  acceptedTerms: boolean;
  profileData?: {
    name?: string;
    email?: string;
  };
  trainingCompleted?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface InviteAdminPayload {
  email: string;
  role: AdminRole;
  message?: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: AuditAction;
  targetType: string;
  targetId: string | number;
  meta: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogFilters {
  adminId?: string;
  action?: AuditAction;
  targetType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export type OnboardingStep =
  | "welcome"
  | "accept_terms"
  | "profile"
  | "training"
  | "complete";

export interface AdminOnboardingState {
  currentStep: OnboardingStep;
  acceptedTerms: boolean;
  profileCompleted: boolean;
  trainingCompleted: boolean;
  hasCompletedOnboarding: boolean;
  onboardingData: {
    name?: string;
    email?: string;
    role?: AdminRole;
  };
}
