"use client";
import React, { useState, useEffect } from "react";
import {
  BadgeCheck,
  Scale,
  MapPin,
  BookOpen,
  Check,
  X,
  Save,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Phone,
  Video,
  GraduationCap,
  Star,
  Trash2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Section, Field } from "./index";
import {
  useGetMyLawyerProfileQuery,
  useUpdateMyLawyerProfileMutation,
  NIGERIAN_STATES,
  LANGUAGES,
} from "@/redux/slices/lawyers.slice";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";
import { showSuccess, showError } from "@/app/components/ui/sonner";

const RESPONSE_TIMES = [
  { label: "Under 1 hour", value: 1 },
  { label: "Under 2 hours", value: 2 },
  { label: "Under 3 hours", value: 3 },
  { label: "Under 6 hours", value: 6 },
  { label: "Under 12 hours", value: 12 },
  { label: "Under 24 hours", value: 24 },
];

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface LawyerProfileForm {
  scnNumber: string;
  yearOfCall: string;
  state: string;
  stateCode: string;
  location: string;
  phone: string;
  specialisms: string[];
  languages: string[];
  bio: string;
  education: EducationEntry[];
  notableWork: string[];
  fees: {
    message: number;
    call: number;
    video: number;
  };
  responseTime: number;
  available: boolean;
}

export function LawyerProfileUpdate() {
  const { data: profileData, refetch, isLoading: isLoadingProfile } = useGetMyLawyerProfileQuery(undefined, {
    skip: false,
  });
  const { data: getSpecialisms, isLoading: isLoadingSpecialisms } = useListSpecialismsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyLawyerProfileMutation();

  const specialisms = getSpecialisms?.data || [];
  const profile = profileData?.data?.profile;

  const [form, setForm] = useState<LawyerProfileForm>({
    scnNumber: "",
    yearOfCall: "",
    state: "",
    stateCode: "",
    location: "",
    phone: "",
    specialisms: [],
    languages: ["English"],
    bio: "",
    education: [],
    notableWork: [],
    fees: { message: 0, call: 0, video: 0 },
    responseTime: 0,
    available: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setForm({
        scnNumber: profile.scnNumber || "",
        yearOfCall: profile.yearOfCall?.toString() || "",
        state: profile.state || "",
        stateCode: profile.stateCode || "",
        location: profile.location || "",
        phone: profile.phone || "",
        specialisms: profile.specialisms?.map((s: any) => s._id || s) || [],
        languages: profile.languages || ["English"],
        bio: profile.bio || "",
        education: profile.education || [],
        notableWork: profile.notableWork || [],
        fees: profile.fees || { message: 0, call: 0, video: 0 },
        responseTime: profile.responseTime || 0,
        available: profile.isAvailable !== undefined ? profile.isAvailable : true,
      });
    }
  }, [profile]);

  const updateForm = (field: keyof LawyerProfileForm | string, value: any) => {
    if (field === "fees") {
      setForm((prev) => ({ ...prev, fees: value }));
    } else if (field === "education") {
      setForm((prev) => ({ ...prev, education: value }));
    } else if (field === "notableWork") {
      setForm((prev) => ({ ...prev, notableWork: value }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleSpecialism = (id: string) => {
    const newList = form.specialisms.includes(id)
      ? form.specialisms.filter((s) => s !== id)
      : [...form.specialisms, id];
    updateForm("specialisms", newList);
  };

  const toggleLanguage = (lang: string) => {
    const newList = form.languages.includes(lang)
      ? form.languages.filter((l) => l !== lang)
      : [...form.languages, lang];
    updateForm("languages", newList);
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      year: "",
    };
    updateForm("education", [...form.education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    updateForm(
      "education",
      form.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    updateForm(
      "education",
      form.education.filter((edu) => edu.id !== id)
    );
  };

  const addWork = () => {
    updateForm("notableWork", [...form.notableWork, ""]);
  };

  const updateWork = (index: number, value: string) => {
    const newWork = [...form.notableWork];
    newWork[index] = value;
    updateForm("notableWork", newWork);
  };

  const removeWork = (index: number) => {
    updateForm(
      "notableWork",
      form.notableWork.filter((_, i) => i !== index)
    );
  };

  const copySCN = () => {
    navigator.clipboard.writeText(form.scnNumber);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.scnNumber) newErrors.scnNumber = "SCN number is required";
    if (!form.yearOfCall) newErrors.yearOfCall = "Year of call is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (form.specialisms.length === 0)
      newErrors.specialisms = "Select at least one practice area";
    if (form.languages.length === 0)
      newErrors.languages = "Select at least one language";
    if (!form.bio.trim()) newErrors.bio = "Bio is required";
    else if (form.bio.trim().length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    if (!form.fees.message || form.fees.message < 500)
      newErrors.fees = "Minimum NGN 500 for written consultations";
    if (!form.fees.call || form.fees.call < 2000)
      newErrors.fees = "Minimum NGN 2,000 for calls";
    if (!form.fees.video || form.fees.video < 3000)
      newErrors.fees = "Minimum NGN 3,000 for video sessions";
    if (!form.responseTime) newErrors.responseTime = "Select a response time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Build payload matching UpdateLawyerProfilePayload
    const payload: any = {
      bio: form.bio.trim(),
      location: form.location.trim(),
      state: NIGERIAN_STATES.find((s) => s.code === form.state)?.label || form.state,
      stateCode: form.state,
      languages: form.languages,
      specialisms: form.specialisms,
      fees: form.fees,
    };

    try {
      const result = await updateProfile(payload).unwrap();
      if (result.success) {
        await refetch();
        setSaved(true);
        showSuccess("Profile updated successfully!");
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error: any) {
      showError(error?.data?.message || error?.message || "Failed to update profile");
    }
  };

  const isLoading = isLoadingProfile || isUpdating;

  const inputCls =
    "w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#F97316] placeholder:text-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500";

  const feeTypes = [
    { key: "message", label: "Written Consultation", icon: MessageSquare, desc: "Async written advice" },
    { key: "call", label: "Phone Consultation", icon: Phone, desc: "Audio call session" },
    { key: "video", label: "Video Consultation", icon: Video, desc: "Face-to-face video call" },
  ];

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Lawyer Profile</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Update your professional information visible to clients.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
        >
          {isUpdating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          {isUpdating ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Professional Identity */}
      <Section title="Professional Identity" desc="Your SCN credentials and practice details.">
        <Field label="SCN Bar Number" desc="This cannot be changed. Contact support for corrections.">
          <div className="relative">
            <input
              value={form.scnNumber}
              disabled
              className={`${inputCls} pr-24`}
            />
            <button
              onClick={copySCN}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#F97316] hover:bg-pink-50 transition-colors"
            >
              {copySuccess ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
              {copySuccess ? "Copied!" : "Copy"}
            </button>
          </div>
        </Field>

        <Field label="Year of Call">
          <input
            type="number"
            value={form.yearOfCall}
            onChange={(e) => updateForm("yearOfCall", e.target.value)}
            className={inputCls}
            min="1960"
            max={new Date().getFullYear()}
            placeholder="e.g. 2014"
          />
          {errors.yearOfCall && (
            <p className="text-[11px] text-red-500 mt-1">{errors.yearOfCall}</p>
          )}
        </Field>

        <Field label="State of Practice">
          <select
            value={form.state}
            onChange={(e) => updateForm("state", e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none focus:border-[#F97316] transition-colors bg-white"
          >
            <option value="">Select state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>
          )}
        </Field>

        <Field label="District / Area">
          <input
            value={form.location}
            onChange={(e) => updateForm("location", e.target.value)}
            placeholder="e.g. Victoria Island, Lagos"
            className={inputCls}
          />
        </Field>

        <Field label="Phone Number">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            placeholder="e.g. 08012345678"
            className={inputCls}
          />
          {errors.phone && (
            <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
          )}
        </Field>
      </Section>

      {/* Practice Areas */}
      <Section title="Practice Areas" desc="Select all areas you actively practise in.">
        <Field label="Areas of Specialisation">
          <div className="grid grid-cols-2 gap-2">
            {isLoadingSpecialisms ? (
              <div className="col-span-2 flex items-center gap-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Loading specialisms...
              </div>
            ) : (
              specialisms.map((spec: any) => {
                const isSelected = form.specialisms.includes(spec._id);
                return (
                  <button
                    key={spec._id}
                    type="button"
                    onClick={() => toggleSpecialism(spec._id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-[1.5px] text-left transition-all group
                      ${
                        isSelected
                          ? "border-[#F97316] bg-pink-50 shadow-sm"
                          : "border-[#E5E7EB] bg-white hover:border-[#F97316]/50 hover:bg-pink-50/30"
                      }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isSelected ? "bg-[#F97316]" : "bg-[#D1D5DB]"
                      }`}
                    />
                    <span
                      className={`text-[13px] font-medium flex-1 ${
                        isSelected ? "text-[#F97316]" : "text-[#374151]"
                      }`}
                    >
                      {spec.displayName || spec.name}
                    </span>
                    {isSelected && <Check size={14} className="text-[#F97316]" />}
                  </button>
                );
              })
            )}
          </div>
          {errors.specialisms && (
            <p className="text-[11px] text-red-500 mt-2">{errors.specialisms}</p>
          )}
          <p className="text-[11px] text-[#9CA3AF] mt-3">
            Selected: {form.specialisms.length} area
            {form.specialisms.length !== 1 ? "s" : ""}
          </p>
        </Field>

        <Field label="Languages Spoken">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = form.languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-all
                    ${
                      isSelected
                        ? "border-[#F97316] bg-pink-50 text-[#F97316]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316]/50 hover:text-[#F97316]"
                    }`}
                >
                  {isSelected && <Check size={12} />}
                  {lang}
                </button>
              );
            })}
          </div>
          {errors.languages && (
            <p className="text-[11px] text-red-500 mt-2">{errors.languages}</p>
          )}
        </Field>
      </Section>

      {/* Professional Story */}
      <Section title="Professional Story" desc="Help clients understand your background and experience.">
        <Field label="Professional Bio">
          <textarea
            value={form.bio}
            onChange={(e) => updateForm("bio", e.target.value)}
            placeholder={`Called to the Nigerian Bar in ${form.yearOfCall || "20XX"}, I specialise in...`}
            className="w-full h-32 px-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-900 resize-none outline-none focus:border-[#F97316] placeholder:text-gray-400 transition-colors"
          />
          {errors.bio && (
            <p className="text-[11px] text-red-500 mt-1">{errors.bio}</p>
          )}
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            {form.bio.length} / 1000 characters
          </p>
        </Field>

        <Field label="Education & Qualifications">
          <div className="space-y-3">
            {form.education.map((edu) => (
              <div
                key={edu.id}
                className="relative bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6]"
              >
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    placeholder="Institution"
                    className="h-10 px-3 rounded-lg border border-[#E5E7EB] text-[13px] outline-none focus:border-[#F97316] transition-colors"
                  />
                  <input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    placeholder="Degree"
                    className="h-10 px-3 rounded-lg border border-[#E5E7EB] text-[13px] outline-none focus:border-[#F97316] transition-colors"
                  />
                  <input
                    value={edu.year}
                    onChange={(e) =>
                      updateEducation(edu.id, "year", e.target.value)
                    }
                    placeholder="Year"
                    className="h-10 px-3 rounded-lg border border-[#E5E7EB] text-[13px] outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium text-[#F97316] hover:bg-pink-50 transition-colors"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>
        </Field>

        <Field label="Notable Work & Achievements">
          <div className="space-y-2">
            {form.notableWork.map((work, index) => (
              <div key={index} className="flex items-center gap-2">
                <Star size={14} className="text-[#F97316] flex-shrink-0" />
                <input
                  value={work}
                  onChange={(e) => updateWork(index, e.target.value)}
                  placeholder="e.g. Represented clients in landmark constitutional case (2022)"
                  className="flex-1 h-10 px-3 rounded-lg border border-[#E5E7EB] text-[13px] outline-none focus:border-[#F97316] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeWork(index)}
                  className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWork}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium text-[#F97316] hover:bg-pink-50 transition-colors"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>
        </Field>
      </Section>

      {/* Consultation Setup */}
      <Section title="Consultation Setup" desc="Set your consultation fees and availability.">
        <Field label="Consultation Fees (NGN)">
          <div className="space-y-3">
            {feeTypes.map((fee) => {
              const Icon = fee.icon;
              return (
                <div
                  key={fee.key}
                  className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EFF6FF]">
                    <Icon size={18} className="text-[#3B82F6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {fee.label}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">{fee.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#9CA3AF]">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={form.fees[fee.key as keyof typeof form.fees]}
                      onChange={(e) =>
                        updateForm("fees", {
                          ...form.fees,
                          [fee.key]: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      className="w-32 h-10 px-3 rounded-xl border border-[#E5E7EB] text-[14px] text-right font-semibold outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {errors.fees && (
            <p className="text-[11px] text-red-500 mt-2">{errors.fees}</p>
          )}
        </Field>

        <Field label="Typical Response Time">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {RESPONSE_TIMES.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => updateForm("responseTime", rt.value)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all
                  ${
                    form.responseTime === rt.value
                      ? "border-[#F97316] bg-pink-50 text-[#F97316]"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316]/50"
                  }`}
              >
                <Clock size={14} />
                {rt.label}
              </button>
            ))}
          </div>
          {errors.responseTime && (
            <p className="text-[11px] text-red-500 mt-2">{errors.responseTime}</p>
          )}
        </Field>

        <Field label="Availability">
          <div className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl">
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">
                Available for New Clients
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Toggle off when your schedule is full
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateForm("available", !form.available)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.available ? "bg-[#10B981]" : "bg-[#D1D5DB]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  form.available ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </Field>
      </Section>

      {/* Status Info */}
      <div className={`rounded-xl p-4 border ${
        profile?.verificationStatus === "verified" || profile?.verificationStatus === "approved"
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          : profile?.verificationStatus === "rejected"
          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
          : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
      }`}>
        <div className="flex items-start gap-3">
          {profile?.verificationStatus === "verified" || profile?.verificationStatus === "approved" ? (
            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          ) : profile?.verificationStatus === "rejected" ? (
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <BadgeCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-[13px] font-semibold ${
              profile?.verificationStatus === "verified" || profile?.verificationStatus === "approved"
                ? "text-green-800"
                : profile?.verificationStatus === "rejected"
                ? "text-red-800"
                : "text-amber-800"
            } mb-1`}>
              Profile Status: {profile?.verificationStatus?.toUpperCase() || "PENDING"}
            </p>
            <p className={`text-[12px] leading-relaxed ${
              profile?.verificationStatus === "verified" || profile?.verificationStatus === "approved"
                ? "text-green-700"
                : profile?.verificationStatus === "rejected"
                ? "text-red-700"
                : "text-amber-700"
            }`}>
              {profile?.verificationStatus === "verified" || profile?.verificationStatus === "approved"
                ? "Your profile is verified and visible to clients. They can find and book consultations with you."
                : profile?.verificationStatus === "rejected"
                ? "Your profile was rejected. Please contact support for more information."
                : "Your profile is pending verification. Once verified, your profile will be visible to clients."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-[11px] text-gray-500">Rating</p>
            <p className="text-lg font-bold text-gray-900">
              {profile.ratingAvg?.toFixed(1) || "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-[11px] text-gray-500">Reviews</p>
            <p className="text-lg font-bold text-gray-900">
              {profile.reviewCount || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-[11px] text-gray-500">Consultations</p>
            <p className="text-lg font-bold text-gray-900">
              {profile.consultationCount || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-[11px] text-gray-500">Response Time</p>
            <p className="text-lg font-bold text-gray-900">
              {profile.responseTimeLabel || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}