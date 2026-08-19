"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  LogOut, Camera, Check, Eye, EyeOff,
  Smartphone, Moon, Sun, Monitor,
  Trash2, Download, AlertTriangle, Loader2, Save,
  ExternalLink,
  X,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useUserData } from "@/hook/useData";
import { Toggle } from "./types";
import { CitizenUser, CitizenProfile } from "@/redux/types";
import ThumbnailUpload, { UploadedImage } from "@/app/components/ui/fileUploader";
import { 
  useUpdateMyProfileMutation,
} from "@/redux/slices/citizens.slice";

import {
  useListPublicPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useChangePlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useUpdateAutoRenewMutation,
  useGetMyBillingHistoryQuery,
} from "@/redux/slices/subscription.slice";


export function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="sm:w-44 flex-shrink-0">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{desc}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function ToggleSwitch({
  value,
  onChange,
  disabled,
}: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        value ? "bg-maroon-500" : "bg-gray-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
        value ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}

export function ToggleRow({ item, onChange }: { item: Toggle; onChange: (id: string, v: boolean) => void }) {
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [localValue, setLocalValue] = useState(item.value);

  // Sync local value when prop changes
  useEffect(() => {
    setLocalValue(item.value);
  }, [item.value]);

  const handleToggle = async (newValue: boolean) => {
    setLocalValue(newValue); // Optimistic update
    try {
      await updateProfile({ [item.key]: newValue }).unwrap();
      onChange(item.id, newValue);
    } catch (error) {
      setLocalValue(!newValue); // Rollback on error
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-xs font-semibold text-gray-800">{item.label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
      </div>
      <div className="flex items-center gap-2">
        {isLoading && <Loader2 size={14} className="animate-spin text-gray-400" />}
        <ToggleSwitch 
          value={localValue} 
          onChange={handleToggle}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

// Profile tab 
export function ProfileSettings({ user, profile }: { user: CitizenUser, profile: CitizenProfile }) {
  const { userInfo, refetch } = useUserData();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    state: profile.stateCode || "",
    bio: profile.bio || "",
  });

  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const result = await updateProfile({
        ...form,
        avatarUrl: images[0]?.base64 || undefined
      }).unwrap();
      
      // Refetch user data to get updated avatar
      await refetch();

      setSaving(true);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Clear images after successful upload
      if (images.length > 0) {
        setImages([]);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  useEffect(() => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      state: profile.stateCode || "",
      bio: profile.bio || "",
    });
  }, [userInfo]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full h-11! px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors";

  const STATES = ["Lagos", "Abuja", "Rivers", "Kano", "Kaduna", "Oyo", "Anambra", "Enugu", "Delta", "Kwara", "Ondo", "Ogun", "Edo", "Cross River", "Akwa Ibom"];

  return (
    <div>
      {/* Avatar section */}
      <Section title="Profile Photo">
        <div className="flex items-start gap-5">
          <div className="relative">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="image" className="w-16 h-16 rounded-2xl" /> : <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-maroon-500 to-maroon-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              AO
            </div>}
            <button className="px-2 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
              Remove
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Profile picture</p>
            <p className="text-xs text-gray-500 mb-3">JPG or PNG, max 2MB.</p>
            <ThumbnailUpload images={images} title=" " setImages={setImages} maxImages={1}>
              <div className="flex gap-2 -mt-2">
                <div className="px-4 py-2 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
                  Upload photo
                </div>
              </div>
            </ThumbnailUpload>
            {images.length > 0 && (
              <button onClick={handleUpdate} disabled={isLoading}
                className="mt-2 flex-1 py-2.5 px-5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-40 transition-colors">
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Personal Information" desc="This information is used to personalise your experience. It is not shared with lawyers unless you choose to include it in a consultation request.">
        <Field label="First Name">
          <input value={form.firstName} onChange={set("firstName")} className={inputCls} />
        </Field>
        <Field label="Last Name">
          <input value={form.lastName} onChange={set("lastName")} className={inputCls} />
        </Field>
        <Field label="Email Address" desc="Used for login and notifications">
          <div className="flex gap-2">
            <input value={form.email} onChange={set("email")} type="email" className={`${inputCls} flex-1`} />
            <span className={`flex items-center gap-1 text-[11px] ${user.isVerified ? "text-green-700 bg-green-50 border border-green-100" : "text-red-700 bg-red-50 border border-red-100"} px-2.5 py-1 rounded-lg font-semibold flex-shrink-0`}>
              {user.isVerified ? <Check size={10} /> : <X size={10} />} {!user.isVerified && "Not"} Verified
            </span>
          </div>
        </Field>
        <Field label="Phone Number" desc="Optional. Used for SMS notifications">
          <div className="flex gap-2">
            <div className="h-11 px-3 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl flex items-center text-sm text-gray-600 flex-shrink-0">
              +234
            </div>
            <input value={form.phone} onChange={set("phone")} type="tel" className={`${inputCls} flex-1`} placeholder="080 0000 0000" />
          </div>
        </Field>
        <Field label="State" desc="Used to surface relevant lawyers near you">
          <select value={form.state} onChange={set("state")}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 transition-colors bg-white">
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Bio" desc="Optional, appears on community posts if you make them public">
          <textarea value={form.bio} onChange={set("bio")} placeholder="A brief note about yourself..."
            className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 resize-none outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors"
          />
        </Field>
      </Section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Changes take effect immediately after saving.</p>
        <button onClick={handleUpdate} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
            : saved ? <><Check size={13} /> Saved</>
              : <><Save size={13} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

// Notifications tab 
export function NotificationSettings({ user }: { user: CitizenUser }) {
  const [items, setItems] = useState<Toggle[]>([
    { id: "n1", label: "Lawyer response notifications", key: "notifLawyerResponse", desc: "Get notified when a lawyer accepts or declines your consultation request.", value: user.notifLawyerResponse },
    { id: "n2", label: "Consultation reminders", key: "notifConsultReminder", desc: "Reminder 24 hours and 1 hour before a scheduled call or video session.", value: user.notifConsultReminder },
    { id: "n3", label: "Match alerts", key: "notifMatchAlert", desc: "Get notified when a lawyer is matched to your lawyer request.", value: user.notifMatchAlert },
    { id: "n4", label: "Message notifications", key: "notifMessages", desc: "Notify me when a lawyer sends a written consultation reply.", value: user.notifMessages },
    { id: "n5", label: "Review reminders", key: "notifReviewReminder", desc: "Remind me to rate a lawyer after a completed consultation.", value: user.notifReviewReminder },
    { id: "n6", label: "Weekly learning digest", key: "notifWeeklyDigest", desc: "A weekly summary of new legal topics and library additions.", value: user.notifWeeklyDigest },
    { id: "n7", label: "Streak reminders", key: "notifStreakReminder", desc: "Daily nudge to keep my learning streak alive.", value: user.notifStreakReminder },
    { id: "n8", label: "Platform updates", key: "notifPlatformUpdates", desc: "News about new features, lawyers, and content releases.", value: user.notifPlatformUpdates },
    { id: "n9", label: "Legal news alerts", key: "notifLegalNews", desc: "Notify me of major Nigerian legal developments relevant to my saved topics.", value: user.notifLegalNews },
    { id: "n10", label: "Promotional emails", key: "notifPromotional", desc: "Offers, referral rewards, and premium feature announcements.", value: user.notifPromotional },
  ]);

  const [channels, setChannels] = useState<Toggle[]>([
    { id: "ch1", label: "Email", key: "notifEmail", desc: `Send notifications to ${user.email}`, value: user.notifEmail },
    { id: "ch2", label: "SMS", key: "notifSms", desc: `Send critical alerts to ${user.phone}`, value: user.notifSms },
    { id: "ch3", label: "Push (browser)", key: "notifPush", desc: "Browser push notifications when on the platform.", value: user.notifPush },
    { id: "ch4", label: "In-app badge", key: "notifInAppBadge", desc: "Show unread count badges in the sidebar.", value: user.notifInAppBadge },
  ]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Toggle[]>>) => (id: string, v: boolean) =>
    setter(prev => prev.map(x => x.id === id ? { ...x, value: v } : x));

  return (
    <div>
      <Section title="Notification Channels" desc="Choose how you want to be contacted.">
        {channels.map(c => <ToggleRow key={c.id} item={c} onChange={toggle(setChannels)} />)}
      </Section>

      <Section title="Consultation Alerts" desc="Notifications related to your lawyer requests and consultations.">
        {items.slice(0, 5).map(i => <ToggleRow key={i.id} item={i} onChange={toggle(setItems)} />)}
      </Section>

      <Section title="Learning & Community" desc="Notifications related to your legal education progress.">
        {items.slice(5).map(i => <ToggleRow key={i.id} item={i} onChange={toggle(setItems)} />)}
      </Section>
    </div>
  );
}

// Privacy tab 
export function PrivacySettings({ user }: { user: CitizenUser }) {
  const [items, setItems] = useState<Toggle[]>([
    { id: "p1", label: "Show my reading activity to the community", key: "showActivityPublic", desc: "Let others see which legal topics you have studied (anonymous unless you opt in).", value: user.showActivityPublic },
    { id: "p2", label: "Allow anonymous analytics", key: "allowAnonymousAnalytics", desc: "Help us improve content quality with anonymous usage data. No personal info is shared.", value: user.allowAnonymousAnalytics },
    { id: "p3", label: "Personalised content recommendations", key: "personalizedRecommend", desc: "Use my reading history to suggest relevant topics and library entries.", value: user.personalizedRecommend },
    { id: "p4", label: "Show profile in community discussions", key: "showProfileInCommunity", desc: "Your name and avatar may appear when you comment or like community posts.", value: user.showProfileInCommunity },
  ]);

  const toggle = (id: string, v: boolean) => setItems(prev => prev.map(x => x.id === id ? { ...x, value: v } : x));

  return (
    <div>
      <Section title="Visibility & Data" desc="Control what is visible to others and how your data is used.">
        {items.map(i => <ToggleRow key={i.id} item={i} onChange={toggle} />)}
      </Section>

      <Section title="Data Export">
        <div className="flex items-start gap-4 py-2">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900 mb-1">Download your data</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Export a copy of your profile, reading history, consultation requests, and highlights. Delivered to your email within 24 hours.</p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
            <Download size={12} /> Request Export
          </button>
        </div>
      </Section>

      <Section title="Danger Zone">
        <div className="flex items-start gap-4 py-2 pb-5 border-b border-gray-50">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900 mb-1">Clear reading history</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Remove all records of topics you have read. Your certificates and highlights are kept.</p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
            <Trash2 size={12} /> Clear History
          </button>
        </div>
        <div className="flex items-start gap-4 pt-5">
          <div className="flex-1">
            <p className="text-xs font-semibold text-red-700 mb-1">Delete account</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Permanently delete your account, profile, and all associated data. This cannot be undone. Active consultations must be closed first.</p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors">
            <Trash2 size={12} /> Delete Account
          </button>
        </div>
      </Section>
    </div>
  );
}

// Security tab 
export function SecuritySettings({ profile }: { profile: CitizenProfile }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 placeholder:text-gray-400 transition-colors";

  const SESSIONS = [
    { device: "Chrome on Windows", location: "Lagos, Nigeria", time: "Active now", current: true },
    { device: "Safari on iPhone", location: "Lagos, Nigeria", time: "2 hours ago", current: false },
    { device: "Chrome on Android", location: "Abuja, Nigeria", time: "3 days ago", current: false },
  ];

  return (
    <div>
      <Section title="Change Password" desc="Use a strong password that you do not use anywhere else.">
        <Field label="Current Password">
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} placeholder="Enter current password" className={inputCls} />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <Field label="New Password">
          <div className="relative">
            <input type={showNew ? "text" : "password"} placeholder="Min. 8 characters" className={inputCls} />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <Field label="Confirm Password">
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} placeholder="Repeat new password" className={inputCls} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <div className="pt-4 flex justify-end">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-60 hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #9B2E3D, #82212D)" }}>
            {saving ? <><Loader2 size={13} className="animate-spin" /> Updating...</>
              : saved ? <><Check size={13} /> Updated</>
                : "Update Password"}
          </button>
        </div>
      </Section>

      <Section title="Two-Factor Authentication" desc="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1 pr-5">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-900">Authenticator App (TOTP)</p>
              {twoFAEnabled && <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">Active</span>}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {twoFAEnabled ? "Two-factor authentication is enabled. Your account is protected." : "Use an app like Google Authenticator to generate one-time codes at login."}
            </p>
          </div>
          <ToggleSwitch value={twoFAEnabled} onChange={setTwoFAEnabled} />
        </div>
        {twoFAEnabled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
            <Shield size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-800">Your account is secured</p>
              <p className="text-[11px] text-green-700 mt-0.5">Login requires both your password and a 6-digit code from your authenticator app.</p>
            </div>
          </div>
        )}
      </Section>

      {/* <Section  title="Active Sessions" desc="These devices are currently signed in to your account.">
        <div className="flex flex-col gap-0">
          {SESSIONS.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Monitor size={14} className="text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-900">{s.device}</p>
                    {s.current && <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-bold">Current</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.location} &middot; {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={12} /> Sign out of all other sessions
          </button>
        </div>
      </Section> */}
    </div>
  );
}

// Appearance tab 
export function AppearanceSettings({ profile }: { profile: CitizenProfile }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [accentColor, setAccentColor] = useState("#9B2E3D");

  const themes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ] as const;

  const accents = ["#9B2E3D", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"];

  return (
    <div>
      <Section title="Theme">
        <div className="grid grid-cols-3 gap-3">
          {themes.map(t => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-[1.5px] transition-all ${active ? "border-maroon-500 bg-pink-50/50" : "border-gray-200 hover:border-gray-300"}`}>
                <Icon size={18} className={active ? "text-maroon-500" : "text-gray-400"} />
                <span className={`text-xs font-semibold ${active ? "text-maroon-500" : "text-gray-600"}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Reading Preferences" desc="These settings affect how legal content is displayed in the learn module.">
        <Field label="Font Size">
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map(s => (
              <button key={s} onClick={() => setFontSize(s)}
                className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-xs font-semibold capitalize transition-all ${fontSize === s ? "border-maroon-500 bg-pink-50/50 text-maroon-500" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Accent Colour" desc="Used for highlights, buttons, and progress indicators">
          <div className="flex gap-3 flex-wrap">
            {accents.map(c => (
              <button key={c} onClick={() => setAccentColor(c)}
                className="w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform flex items-center justify-center"
                style={{ background: c, borderColor: accentColor === c ? c : "transparent", outlineOffset: 2, outline: accentColor === c ? `2px solid ${c}` : "none" }}>
                {accentColor === c && <Check size={13} className="text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Accessibility">
        {[
          { label: "Reduce motion", desc: "Minimise animations and transitions throughout the app.", v: reducedMotion, s: setReducedMotion },
          { label: "High contrast mode", desc: "Increase contrast for text and interactive elements.", v: highContrast, s: setHighContrast },
          { label: "Dyslexia-friendly font", desc: "Use an OpenDyslexic-style font in the reading module.", v: dyslexicFont, s: setDyslexicFont },
        ].map(a => (
          <div key={a.label} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
            <div className="flex-1 pr-5">
              <p className="text-xs font-semibold text-gray-900">{a.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{a.desc}</p>
            </div>
            <ToggleSwitch value={a.v} onChange={a.s} />
          </div>
        ))}
      </Section>
    </div>
  );
}

// Legal Preferences tab 
export function LegalSettings({ profile, user }: { profile: CitizenProfile, user: any }) {
  const [interests, setInterests] = useState<string[]>(["criminal", "employment", "tenancy"]);
  const [lang, setLang] = useState("en");
  const [jurisdiction, setJurisdiction] = useState("federal");

  const AREAS = [
    { id: "criminal", label: "Police & Criminal Rights" },
    { id: "tenancy", label: "Landlord & Tenancy" },
    { id: "employment", label: "Employment & Labour" },
    { id: "business", label: "Business & Commerce" },
    { id: "family", label: "Family Law" },
    { id: "consumer", label: "Consumer Rights" },
    { id: "road", label: "Road Traffic" },
    { id: "contract", label: "Contracts" },
  ];

  const toggle = (id: string) => setInterests(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <div>
      {user?.role !== "lawyer" &&<Section title="Areas of Interest" desc="We use these to personalise your content feed, topic recommendations, and lawyer suggestions.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AREAS.map(a => {
            const on = interests.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggle(a.id)}
                className={`relative flex items-center gap-2 p-3 rounded-xl border-[1.5px] text-xs font-medium transition-all text-left ${on ? "border-maroon-500 bg-pink-50/60 text-maroon-500" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {on && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-maroon-500 flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>}
                {a.label}
              </button>
            );
          })}
        </div>
      </Section>}

      <Section title="Content Language" desc="Language used for legal summaries and educational content.">
        <Field label="Preferred Language">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 transition-colors bg-white">
            <option value="en">English</option>
            <option value="yo">Yoruba (coming soon)</option>
            <option value="ig">Igbo (coming soon)</option>
            <option value="ha">Hausa (coming soon)</option>
            <option value="pcm">Nigerian Pidgin (coming soon)</option>
          </select>
        </Field>
        <Field label="Primary Jurisdiction" desc="Used to surface the most relevant state laws in the library">
          <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-maroon-500 transition-colors bg-white">
            <option value="federal">Federal (All Nigeria)</option>
            <option value="lagos">Lagos State</option>
            <option value="abuja">Federal Capital Territory</option>
            <option value="rivers">Rivers State</option>
            <option value="kano">Kano State</option>
            <option value="oyo">Oyo State</option>
          </select>
        </Field>
      </Section>

      <Section title="Legal Disclaimer">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-1">Educational Content Notice</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              All content on LawTicha is for general informational and educational purposes only.
              It does not constitute legal advice and does not create a lawyer-client relationship.
              For advice specific to your situation, consult a verified lawyer through the marketplace.
            </p>
            <Link href="/legal/terms" className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold underline mt-2">
              Read full terms <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Update the SubscriptionSettings component
export function SubscriptionSettings({ user }: { user: any }) {
  // Use the new subscription hooks
  const { data: subscriptionData, refetch: refetchSubscription } = useGetMySubscriptionQuery(undefined, {
    skip: user?.role !== "lawyer",
  });
  
  const { data: billingData, refetch: refetchBilling } = useGetMyBillingHistoryQuery(
    { page: 1, pageSize: 10 },
    {
      skip: user?.role !== "lawyer",
    }
  );
  
  const { data: plansData } = useListPublicPlansQuery(
    {},
    {
      skip: user?.role !== "lawyer",
    }
  );
  
  // Use the new mutation hooks
  const [subscribe] = useSubscribeMutation();
  const [changePlan] = useChangePlanMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [reactivate] = useReactivateSubscriptionMutation();
  const [updateAutoRenew] = useUpdateAutoRenewMutation();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showChangePlan, setShowChangePlan] = useState(false);
  
  const subscription = subscriptionData?.data;
  const billingHistory = billingData?.data || [];
  const plans = plansData?.data || [];

  const handleSubscribe = async (planId: string) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await subscribe({
        planId,
        interval: selectedInterval,
        autoRenew: true,
      }).unwrap();
      
      setSuccess("Subscription initiated! Redirecting to payment...");
      
      // Check if payment URL is returned
      if (result.data?.payment?.authorization_url) {
        window.location.href = result.data.payment.authorization_url;
      } else if (result.data?.payment?.authorization_url) {
        window.location.href = result.data.payment.authorization_url;
      } else {
        // If no payment URL, subscription was successful without payment
        setSuccess("Subscription successful!");
        await refetchSubscription();
        await refetchBilling();
        setSelectedPlan(null);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to subscribe. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await changePlan({
        planId,
        interval: selectedInterval,
      }).unwrap();
      
      setSuccess("Plan change initiated! Redirecting to payment...");
      
      if (result.data?.payment?.authorization_url) {
        window.location.href = result.data.payment.authorization_url;
      } else {
        setSuccess("Plan changed successfully!");
        await refetchSubscription();
        await refetchBilling();
        setShowChangePlan(false);
        setSelectedPlan(null);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to change plan. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setProcessing(true);
    try {
      await cancelSubscription({ 
        reason: "Cancelled by user",
        immediate: false // Cancel at period end
      }).unwrap();
      setSuccess("Subscription cancelled successfully. You'll have access until the end of your billing period.");
      await refetchSubscription();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to cancel subscription.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const handleReactivate = async () => {
    setProcessing(true);
    try {
      await reactivate().unwrap();
      setSuccess("Subscription reactivated successfully.");
      await refetchSubscription();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to reactivate subscription.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    setProcessing(true);
    try {
      await updateAutoRenew({ autoRenew: !subscription.autoRenew }).unwrap();
      await refetchSubscription();
      setSuccess(`Auto-renew ${!subscription.autoRenew ? 'enabled' : 'disabled'} successfully.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to update auto-renew setting.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelled': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'expired': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'inactive': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-700 bg-red-50 border-red-200';
      case 'refunded': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Active Subscription Section */}
      <Section title="Current Subscription" desc="Manage your subscription plan and billing details.">
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-sm font-bold text-gray-900">{subscription.planName}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(subscription.status)}`}>
                    {subscription.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  {subscription.cancelAtPeriodEnd && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border text-amber-700 bg-amber-50 border-amber-200">
                      Cancels at period end
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar size={12} />
                    <span>Started: {formatDate(subscription.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock size={12} />
                    <span>
                      {subscription.status === 'active' ? 'Renews' : 'Ended'}: {formatDate(subscription.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <CreditCard size={12} />
                    <span>₦{subscription.price?.toLocaleString() || 0}/{subscription.interval || 'month'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <RefreshCw size={12} />
                    <span>Auto-renew: {subscription.autoRenew ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {subscription.status === 'active' && (
                <>
                  <button
                    onClick={() => setShowChangePlan(!showChangePlan)}
                    disabled={processing}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={13} />
                    Change Plan
                  </button>
                  <button
                    onClick={handleToggleAutoRenew}
                    disabled={processing}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={processing ? "animate-spin" : ""} />
                    {subscription.autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew"}
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-[1.5px] border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
              {(subscription.status === 'cancelled' || subscription.status === 'inactive') && (
                <button
                  onClick={handleReactivate}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-maroon-500 text-xs font-semibold text-white hover:bg-[#d02a6e] transition-all disabled:opacity-50"
                >
                  <RefreshCw size={13} className={processing ? "animate-spin" : ""} />
                  Reactivate Subscription
                </button>
              )}
            </div>

            {/* Change Plan Section */}
            {showChangePlan && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Change Plan</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plans
                    .filter(p => p.id !== subscription.planId.id)
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedPlan === plan.id
                            ? "border-maroon-500 bg-pink-50/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{plan.name}</h4>
                            {plan.isPopular && (
                              <span className="text-[10px] font-semibold text-maroon-500 bg-pink-50 px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₦{plan.price}</p>
                            <p className="text-[10px] text-gray-500">/{plan.interval}</p>
                          </div>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {plan.features?.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                              <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {plan.features?.length > 3 && (
                            <li className="text-xs text-gray-400">+{plan.features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>
                    ))}
                </div>
                {selectedPlan && (
                  <div className="mt-4 flex shadow gap-3">
                    <button
                      onClick={() => handleChangePlan(selectedPlan)}
                      disabled={processing}
                      className="flex-1 py-2.5 rounded-lg bg-maroon-500 text-xs font-bold text-white hover:bg-[#d02a6e] transition-all disabled:opacity-50"
                    >
                      {processing ? <Loader2 size={13} className="animate-spin mx-auto" /> : "Confirm Change"}
                    </button>
                    <button
                      onClick={() => {
                        setShowChangePlan(false);
                        setSelectedPlan(null);
                      }}
                      className="px-4 py-2.5 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No active subscription</p>
            <p className="text-xs text-gray-400 mt-1">Choose a plan below to get started</p>
          </div>
        )}
      </Section>

      {/* Subscription Plans - Only show if no subscription or cancelled/expired */}
      {(!subscription || subscription.status === 'cancelled' || subscription.status === 'expired' || subscription.status === 'inactive') && (
        <Section title="Choose a Plan" desc="Select the plan that works best for you.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === plan.id 
                    ? "border-maroon-500 bg-pink-50/30" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{plan.name}</h4>
                    {plan.isPopular && (
                      <span className="text-[10px] font-semibold text-maroon-500 bg-pink-50 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₦{plan.price?.toLocaleString() || 0}</p>
                    <p className="text-[10px] text-gray-500">/{plan.interval}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">{plan.description}</p>
                <ul className="space-y-1.5 mb-4">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  disabled={processing}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPlan === plan.id
                      ? "bg-maroon-500 text-white hover:bg-[#d02a6e]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  {processing ? <Loader2 size={13} className="animate-spin mx-auto" /> : "Select Plan"}
                </button>
              </div>
            ))}
          </div>
          
          {selectedPlan && (
            <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-600 mb-3">
                Selected plan: <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSubscribe(selectedPlan)}
                  disabled={processing}
                  className="flex-1 py-2.5 rounded-lg bg-maroon-500 text-xs font-bold text-white hover:bg-[#d02a6e] transition-all disabled:opacity-50"
                >
                  {processing ? <Loader2 size={13} className="animate-spin mx-auto" /> : "Subscribe Now"}
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2.5 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Billing History */}
      <Section title="Billing History" desc="View your payment history and download invoices.">
        {billingHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Date</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Description</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Amount</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Status</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Method</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-gray-500">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-gray-600">{formatDate(item.date)}</td>
                    <td className="py-2.5 px-3 text-gray-700">{item.description}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">₦{item.amount?.toLocaleString() || 0}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBillingStatusColor(item.status)}`}>
                        {item.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{item.paymentMethod || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-right">
                      {item.invoiceUrl ? (
                        <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-maroon-500 hover:text-[#d02a6e] font-semibold transition-colors">
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No billing history yet</p>
          </div>
        )}
      </Section>
    </div>
  );
}