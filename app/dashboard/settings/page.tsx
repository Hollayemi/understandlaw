"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight, User, Bell, Lock, Shield, Palette,
  Scale, LogOut, Camera, Check, X, Eye, EyeOff,
  Smartphone, Globe, Moon, Sun, Monitor,
  Trash2, Download, AlertTriangle, ChevronDown,
  ToggleLeft, ToggleRight, Mail, Phone, MapPin,
  BookOpen, MessageSquare, Star, Loader2, Save,
  Key, Fingerprint, Clock, Info, ExternalLink,
  SlidersHorizontal, Volume2, VolumeX, Languages,
} from "lucide-react";

//  Types 
type SettingsTab = "profile" | "notifications" | "privacy" | "security" | "appearance" | "legal";

interface Toggle {
  id: string;
  label: string;
  desc: string;
  value: boolean;
}

//  Section wrapper 
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
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

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
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

function ToggleSwitch({
  value,
  onChange,
  disabled,
}: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        value ? "bg-[#E8317A]" : "bg-gray-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function ToggleRow({ item, onChange }: { item: Toggle; onChange: (id: string, v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-xs font-semibold text-gray-800">{item.label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
      </div>
      <ToggleSwitch value={item.value} onChange={(v) => onChange(item.id, v)} />
    </div>
  );
}

//  Profile tab 
function ProfileSettings() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "Adaeze",
    lastName:  "Okonkwo",
    email:     "adaeze.okonkwo@gmail.com",
    phone:     "08012345678",
    state:     "Lagos",
    bio:       "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors";

  const STATES = ["Lagos","Abuja","Rivers","Kano","Kaduna","Oyo","Anambra","Enugu","Delta","Kwara","Ondo","Ogun","Edo","Cross River","Akwa Ibom"];

  return (
    <div>
      {/* Avatar section */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8317A] to-[#ff6fa8] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              AO
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
              <Camera size={11} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Profile picture</p>
            <p className="text-xs text-gray-500 mb-3">JPG or PNG, max 2MB.</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
                Upload photo
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
                Remove
              </button>
            </div>
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
            <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg font-semibold flex-shrink-0">
              <Check size={10} /> Verified
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
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] transition-colors bg-white">
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Bio" desc="Optional — appears on community posts if you make them public">
          <textarea value={form.bio} onChange={set("bio")} placeholder="A brief note about yourself..."
            className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 resize-none outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors"
          />
        </Field>
      </Section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Changes take effect immediately after saving.</p>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  : saved ? <><Check size={13} /> Saved</>
                  : <><Save size={13} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

//  Notifications tab 
function NotificationSettings() {
  const [items, setItems] = useState<Toggle[]>([
    { id: "n1",  label: "Lawyer response notifications",    desc: "Get notified when a lawyer accepts or declines your consultation request.", value: true  },
    { id: "n2",  label: "Consultation reminders",           desc: "Reminder 24 hours and 1 hour before a scheduled call or video session.",   value: true  },
    { id: "n3",  label: "Match alerts",                     desc: "Get notified when a lawyer is matched to your lawyer request.",            value: true  },
    { id: "n4",  label: "Message notifications",            desc: "Notify me when a lawyer sends a written consultation reply.",              value: true  },
    { id: "n5",  label: "Review reminders",                 desc: "Remind me to rate a lawyer after a completed consultation.",              value: false },
    { id: "n6",  label: "Weekly learning digest",           desc: "A weekly summary of new legal topics and library additions.",             value: true  },
    { id: "n7",  label: "Streak reminders",                 desc: "Daily nudge to keep my learning streak alive.",                           value: false },
    { id: "n8",  label: "Platform updates",                 desc: "News about new features, lawyers, and content releases.",                 value: true  },
    { id: "n9",  label: "Legal news alerts",                desc: "Notify me of major Nigerian legal developments relevant to my saved topics.", value: false },
    { id: "n10", label: "Promotional emails",               desc: "Offers, referral rewards, and premium feature announcements.",            value: false },
  ]);

  const [channels, setChannels] = useState<Toggle[]>([
    { id: "ch1", label: "Email",            desc: "Send notifications to adaeze.okonkwo@gmail.com",  value: true  },
    { id: "ch2", label: "SMS",              desc: "Send critical alerts to +234 801 234 5678",        value: false },
    { id: "ch3", label: "Push (browser)",   desc: "Browser push notifications when on the platform.", value: true  },
    { id: "ch4", label: "In-app badge",     desc: "Show unread count badges in the sidebar.",         value: true  },
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

//  Privacy tab 
function PrivacySettings() {
  const [items, setItems] = useState<Toggle[]>([
    { id: "p1", label: "Show my reading activity to the community",  desc: "Let others see which legal topics you have studied (anonymous unless you opt in).", value: false },
    { id: "p2", label: "Allow anonymous analytics",                  desc: "Help us improve content quality with anonymous usage data. No personal info is shared.", value: true  },
    { id: "p3", label: "Personalised content recommendations",       desc: "Use my reading history to suggest relevant topics and library entries.",              value: true  },
    { id: "p4", label: "Show profile in community discussions",      desc: "Your name and avatar may appear when you comment or like community posts.",           value: false },
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

//  Security tab 
function SecuritySettings() {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] placeholder:text-gray-400 transition-colors";

  const SESSIONS = [
    { device: "Chrome on Windows", location: "Lagos, Nigeria",  time: "Active now",     current: true  },
    { device: "Safari on iPhone",  location: "Lagos, Nigeria",  time: "2 hours ago",    current: false },
    { device: "Chrome on Android", location: "Abuja, Nigeria",  time: "3 days ago",     current: false },
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
            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}>
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

      <Section title="Active Sessions" desc="These devices are currently signed in to your account.">
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
      </Section>
    </div>
  );
}

//  Appearance tab 
function AppearanceSettings() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [accentColor, setAccentColor] = useState("#E8317A");

  const themes = [
    { id: "light",  icon: Sun,     label: "Light"  },
    { id: "dark",   icon: Moon,    label: "Dark"   },
    { id: "system", icon: Monitor, label: "System" },
  ] as const;

  const accents = ["#E8317A", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"];

  return (
    <div>
      <Section title="Theme">
        <div className="grid grid-cols-3 gap-3">
          {themes.map(t => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-[1.5px] transition-all ${active ? "border-[#E8317A] bg-pink-50/50" : "border-gray-200 hover:border-gray-300"}`}>
                <Icon size={18} className={active ? "text-[#E8317A]" : "text-gray-400"} />
                <span className={`text-xs font-semibold ${active ? "text-[#E8317A]" : "text-gray-600"}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Reading Preferences" desc="These settings affect how legal content is displayed in the learn module.">
        <Field label="Font Size">
          <div className="flex gap-2">
            {(["small","medium","large"] as const).map(s => (
              <button key={s} onClick={() => setFontSize(s)}
                className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-xs font-semibold capitalize transition-all ${fontSize === s ? "border-[#E8317A] bg-pink-50/50 text-[#E8317A]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
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
          { label: "Reduce motion",       desc: "Minimise animations and transitions throughout the app.",          v: reducedMotion, s: setReducedMotion },
          { label: "High contrast mode",  desc: "Increase contrast for text and interactive elements.",             v: highContrast,  s: setHighContrast  },
          { label: "Dyslexia-friendly font", desc: "Use an OpenDyslexic-style font in the reading module.",        v: dyslexicFont,  s: setDyslexicFont  },
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

//  Legal Preferences tab 
function LegalSettings() {
  const [interests, setInterests] = useState<string[]>(["criminal", "employment", "tenancy"]);
  const [lang, setLang] = useState("en");
  const [jurisdiction, setJurisdiction] = useState("federal");

  const AREAS = [
    { id: "criminal",   label: "Police & Criminal Rights" },
    { id: "tenancy",    label: "Landlord & Tenancy"       },
    { id: "employment", label: "Employment & Labour"      },
    { id: "business",   label: "Business & Commerce"      },
    { id: "family",     label: "Family Law"               },
    { id: "consumer",   label: "Consumer Rights"          },
    { id: "road",       label: "Road Traffic"             },
    { id: "contract",   label: "Contracts"                },
  ];

  const toggle = (id: string) => setInterests(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <div>
      <Section title="Areas of Interest" desc="We use these to personalise your content feed, topic recommendations, and lawyer suggestions.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AREAS.map(a => {
            const on = interests.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggle(a.id)}
                className={`relative flex items-center gap-2 p-3 rounded-xl border-[1.5px] text-xs font-medium transition-all text-left ${on ? "border-[#E8317A] bg-pink-50/60 text-[#E8317A]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {on && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E8317A] flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>}
                {a.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Content Language" desc="Language used for legal summaries and educational content.">
        <Field label="Preferred Language">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] transition-colors bg-white">
            <option value="en">English</option>
            <option value="yo">Yoruba (coming soon)</option>
            <option value="ig">Igbo (coming soon)</option>
            <option value="ha">Hausa (coming soon)</option>
            <option value="pcm">Nigerian Pidgin (coming soon)</option>
          </select>
        </Field>
        <Field label="Primary Jurisdiction" desc="Used to surface the most relevant state laws in the library">
          <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#E8317A] transition-colors bg-white">
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

//  Main Settings Page 
export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("profile");

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "profile",       label: "Profile",        icon: User          },
    { id: "notifications", label: "Notifications",  icon: Bell          },
    { id: "privacy",       label: "Privacy & Data", icon: Shield        },
    { id: "security",      label: "Security",       icon: Lock          },
    { id: "appearance",    label: "Appearance",     icon: Palette       },
    { id: "legal",         label: "Legal Prefs",    icon: Scale         },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F2EE]">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#F5F2EE]/90 backdrop-blur-sm border-b border-gray-200/60 px-5 xl:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-semibold text-gray-800">Settings</span>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-5 xl:px-8 py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account, preferences, and privacy.</p>
        </div>

        <div className="grid xl:grid-cols-[220px_1fr] gap-6">

          {/*  Sidebar nav  */}
          <div className="hidden xl:flex flex-col gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 self-start sticky top-24">
            {tabs.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all ${active ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <Icon size={15} className={active ? "text-white" : "text-gray-400"} />
                  {t.label}
                </button>
              );
            })}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-all w-full text-left">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile tab scroll */}
          <div className="xl:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
            {tabs.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap transition-all border ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                  <Icon size={12} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/*  Content  */}
          <div>
            {tab === "profile"       && <ProfileSettings />}
            {tab === "notifications" && <NotificationSettings />}
            {tab === "privacy"       && <PrivacySettings />}
            {tab === "security"      && <SecuritySettings />}
            {tab === "appearance"    && <AppearanceSettings />}
            {tab === "legal"         && <LegalSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
