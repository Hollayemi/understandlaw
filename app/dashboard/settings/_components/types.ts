export type SettingsTab = "profile" | "notifications" | "privacy" | "security" | "appearance" | "legal";

export interface Toggle {
  id: string;
  label: string;
  desc: string;
  value: boolean;
}
