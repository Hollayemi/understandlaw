"use client";
import {
  BadgeCheck, Scale, MapPin,
  Shield, BookOpen,
  Check, Plus, X, Upload,
  MessageSquare, Phone, Video,
  CheckCircle, FileText, DollarSign, Clock,
  GraduationCap, Star, Trash2,
  ExternalLink, HelpCircle
} from "lucide-react";

import { Input, TextArea, Select } from "@/app/components/ui/form";
import { EducationEntry } from "@/redux/types/lawyer";
import ThumbnailUpload, { UploadedImage } from "@/app/components/ui/fileUploader";
import { formatFileSize } from "@/utils/function";

import {
  NIGERIAN_STATES,
  LANGUAGES,
} from "@/redux/slices/lawyers.slice";

export const RESPONSE_TIMES = [
  { label: "Under 1 hour", value: 1, }, { label: "Under 2 hours", value: 2 }, { label: "Under 3 hours", value: 3 },
  { label: "Under 6 hours", value: 6 }, { label: "Under 12 hours", value: 12 }, { label: "Under 24 hours", value: 24 },
];

export const REQUIRED_DOCUMENTS = [
  { id: "callToBar", label: "Call to Bar Certificate", hint: "Your official certificate from the Nigerian Law School", required: false },
  { id: "lawSchool", label: "Law School Certificate", hint: "Degree certificate from an accredited law faculty", required: false },
  { id: "practicingLicense", label: "Practicing License", hint: "Current Supreme Court practicing certificate", required: false },
  { id: "governmentId", label: "Government-Issued ID", hint: "National ID, International Passport, or Voter's Card", required: false },
];

export const STEPS = [
  { id: "professional", label: "Professional ID", icon: BadgeCheck, description: "SCN credentials & details" },
  { id: "specialisms", label: "Specialisms", icon: Scale, description: "Practice areas & languages" },
  { id: "story", label: "Your Story", icon: BookOpen, description: "Bio & achievements" },
  { id: "consultation", label: "Consultation", icon: DollarSign, description: "Fees & availability" },
  { id: "documents", label: "Documents", icon: FileText, description: "Verification documents" },
  { id: "review", label: "Review", icon: CheckCircle, description: "Final review" },
];

export function ProfessionalStep({ form, updateForm, errors }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Professional Identity</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Your SCN credentials and primary practice details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="SCN Bar Number"
          value={form.scnNumber}
          onChange={(e: any) => updateForm("scnNumber", e.target.value)}
          placeholder="e.g. SCN018472342"
          required
          error={errors.scnNumber}
          icon={BadgeCheck}
        />

        <Input
          label="Year of Call"
          type="number"
          value={form.yearOfCall}
          onChange={(e: any) => updateForm("yearOfCall", e.target.value)}
          placeholder="e.g. 2014"
          min="1960"
          max={new Date().getFullYear()}
          required
          error={errors.yearOfCall}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="State of Practice"
          value={form.state}
          onChange={(e: any) => updateForm("state", e.target.value)}
          options={NIGERIAN_STATES.map(s => ({ value: s.code, label: s.label }))}
          required
          error={errors.state}
        />

        <Input
          label="District / Area"
          value={form.location}
          onChange={(e: any) => updateForm("location", e.target.value)}
          placeholder="e.g. Victoria Island, Lagos"
          icon={MapPin}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(e: any) => updateForm("phone", e.target.value)}
        placeholder="e.g. 08012345678"
        required
        error={errors.phone}
      />

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800 mb-1">Verification Process</p>
            <p className="text-[12px] text-amber-700 leading-relaxed">
              LawTicha will verify your SCN number and credentials within 48 hours.
              You'll be notified via email once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpecialismsStep({ form, specialisms, updateForm, errors }: any) {
  const toggleSpecialism = (id: string) => {
    const newList = form.specialisms.includes(id)
      ? form.specialisms.filter((s: string) => s !== id)
      : [...form.specialisms, id];
    updateForm("specialisms", newList);
  };

  const toggleLanguage = (lang: string) => {
    const newList = form.languages.includes(lang)
      ? form.languages.filter((l: string) => l !== lang)
      : [...form.languages, lang];
    updateForm("languages", newList);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Practice Areas</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Select all areas you actively practise in.</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-3">
          Areas of Specialisation <span className="text-maroon-500">*</span>
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {specialisms.map((spec: any) => {
            const isSelected = form.specialisms.includes(spec.id);
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => toggleSpecialism(spec._id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-[1.5px] text-left transition-all group
                  ${isSelected
                    ? 'border-maroon-500 bg-pink-50 shadow-sm'
                    : 'border-[#E5E7EB] bg-white hover:border-maroon-500/50 hover:bg-pink-50/30'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${isSelected ? 'bg-maroon-500' : 'bg-[#D1D5DB]'}`} />
                <span className={`text-[13px] font-medium flex-1 ${isSelected ? 'text-maroon-500' : 'text-[#374151]'}`}>
                  {spec.displayName}
                </span>
                {isSelected && <Check size={14} className="text-maroon-500" />}
              </button>
            );
          })}
        </div>
        {errors.specialisms && (
          <p className="text-[11px] text-red-500 mt-2">{errors.specialisms}</p>
        )}
        <p className="text-[11px] text-[#9CA3AF] mt-3">
          Selected: {form.specialisms.length} area{form.specialisms.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-3">
          Languages Spoken <span className="text-maroon-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => {
            const isSelected = form.languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-all
                  ${isSelected
                    ? 'border-maroon-500 bg-pink-50 text-maroon-500'
                    : 'border-[#E5E7EB] text-[#6B7280] hover:border-maroon-500/50 hover:text-maroon-500'
                  }`}
              >
                {isSelected && <Check size={12} />}
                {lang}
              </button>
            );
          })}
        </div>
        {errors.languages && <p className="text-[11px] text-red-500 mt-2">{errors.languages}</p>}
      </div>
    </div>
  );
}

export function StoryStep({ form, updateForm, errors }: any) {
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
    updateForm("education", form.education.map((edu: EducationEntry) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    updateForm("education", form.education.filter((edu: EducationEntry) => edu.id !== id));
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
    updateForm("notableWork", form.notableWork.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Your Professional Story</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Help clients understand your background and experience.</p>
      </div>

      <TextArea
        label="Professional Bio (This will show on your page)"
        value={form.bio}
        onChange={(e: any) => updateForm("bio", e.target.value)}
        placeholder={`Called to the Nigerian Bar in ${form.yearOfCall || '20XX'}, I specialise in...`}
        required
        error={errors.bio}
      />
      <p className="text-[11px] text-[#9CA3AF] -mt-3">{form.bio.length} / 1000 characters</p>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[12px] font-semibold text-[#374151]">Education & Qualifications</label>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-maroon-500 hover:bg-pink-50 transition-colors"
          >
            <Plus size={14} /> Add Entry
          </button>
        </div>
        <div className="space-y-3">
          {form.education.map((edu: EducationEntry) => (
            <div key={edu.id} className="relative bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="absolute top-3 right-3 p-1 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={edu.institution}
                  onChange={(e: any) => updateEducation(edu.id, "institution", e.target.value)}
                  placeholder="Institution"
                />
                <Input
                  value={edu.degree}
                  onChange={(e: any) => updateEducation(edu.id, "degree", e.target.value)}
                  placeholder="Degree"
                />
                <Input
                  value={edu.year}
                  onChange={(e: any) => updateEducation(edu.id, "year", e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>
          ))}
          {form.education.length === 0 && (
            <button
              type="button"
              onClick={addEducation}
              className="w-full py-8 rounded-xl border-2 border-dashed border-[#E5E7EB] text-[13px] text-[#9CA3AF] hover:border-maroon-500 hover:text-maroon-500 transition-all"
            >
              <GraduationCap size={20} className="mx-auto mb-2" />
              Add Education
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[12px] font-semibold text-[#374151]">Notable Work & Achievements / Experience</label>
          <button
            type="button"
            onClick={addWork}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-maroon-500 hover:bg-pink-50 transition-colors"
          >
            <Plus size={14} /> Add Achievement
          </button>
        </div>
        <div className="space-y-2">
          {form.notableWork.map((work: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Star size={14} className="text-maroon-500 flex-shrink-0" />
              <input
                value={work}
                onChange={(e) => updateWork(index, e.target.value)}
                placeholder="e.g. Represented clients in landmark constitutional case (2022)"
                className="flex-1 h-10! px-3 rounded-lg border border-[#E5E7EB] text-[13px] outline-none focus:border-maroon-500 transition-colors"
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
        </div>
      </div>
    </div>
  );
}

export function ConsultationStep({ form, updateForm, errors }: any) {
  const feeTypes = [
    { key: 'message', label: 'In-app Chat', icon: MessageSquare, color: '#3B82F6', bg: '#EFF6FF', desc: 'Async written advice' },
    { key: 'call', label: 'Phone Consultation', icon: Phone, color: '#10B981', bg: '#ECFDF5', desc: 'Audio call session' },
    { key: 'video', label: 'Video Consultation', icon: Video, color: '#8B5CF6', bg: '#F5F3FF', desc: 'Face-to-face video call' },
    { key: 'probono', label: 'Offer Probono Service', icon: HelpCircle, color: '#8B5CF6', bg: '#F5F3FF', desc: 'Provide free legal service' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Minimum Consultation Fee Setup</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Set your consultation fees and availability.</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-3">
          Consultation Fees (NGN) <span className="text-maroon-500">*</span>
        </label>
        <div className="space-y-3">
          {feeTypes.map(fee => {
            const Icon = fee.icon;
            const isProbono = fee.key === 'probono';

            return (
              <div key={fee.key} className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: fee.bg }}>
                  <Icon size={18} style={{ color: fee.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#111827]">{fee.label}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{fee.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isProbono ? (
                    <button
                      type="button"
                      onClick={() => updateForm("fees", { ...form.fees, probono: !form.fees.probono })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${form.fees.probono
                          ? 'border-maroon-500 bg-pink-50 text-maroon-500'
                          : 'border-[#E5E7EB] text-[#6B7280] hover:border-maroon-500/50'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form.fees.probono ? 'bg-maroon-500 border-maroon-500' : 'border-[#D1D5DB]'
                        }`}>
                        {form.fees.probono && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[13px] font-medium">(Tick if Interested) </span>
                    </button>
                  ) : (
                    <>
                      <span className="text-[12px] font-medium text-[#9CA3AF]">₦</span>
                      <input
                        type="number"
                        value={form.fees[fee.key]}
                        onChange={(e) => updateForm("fees", { ...form.fees, [fee.key]: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="w-32 h-10 px-3 rounded-xl border border-[#E5E7EB] text-[14px] text-right font-semibold outline-none focus:border-maroon-500 transition-colors"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {errors.fees && <p className="text-[11px] text-red-500 mt-2">{errors.fees}</p>}
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-3">
          Typical Response Time <span className="text-maroon-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {RESPONSE_TIMES.map(rt => (
            <button
              key={rt.value}
              type="button"
              onClick={() => updateForm("responseTime", rt.value)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all
                ${form.responseTime === rt.value
                  ? 'border-maroon-500 bg-pink-50 text-maroon-500'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:border-maroon-500/50'
                }`}
            >
              <Clock size={14} />
              {rt.label}
            </button>
          ))}
        </div>
        {errors.responseTime && <p className="text-[11px] text-red-500 mt-2">{errors.responseTime}</p>}
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-xl">
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">Available for New Clients</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">Toggle off when your schedule is full</p>
        </div>
        <button
          type="button"
          onClick={() => updateForm("available", !form.available)}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.available ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}

export function DocumentsStep({ documents, onUpload, onRemove, image, setImage }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Verification Documents</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Upload required documents for verification. PDF, Word doc, or image files are all accepted.</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Profile picture</p>
          <p className="text-xs text-gray-500 mb-3">JPG or PNG, max 2MB.</p>
          <ThumbnailUpload images={image} title=" " setImages={setImage} maxImages={1}>
            <div className="flex gap-2 -mt-2">
              <div className="px-4 py-2 rounded-lg border-[1.5px] border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
                Upload photo
              </div>
            </div>
          </ThumbnailUpload>

        </div>
        {REQUIRED_DOCUMENTS.map((doc) => {
          const uploadedDoc = documents.find((d: any) => d.label === doc.label);
          const isUploaded = uploadedDoc?.uploaded;
          const isUploading = uploadedDoc?.uploading;
          const progress = uploadedDoc?.progress || 0;
          const error = uploadedDoc?.error;

          // Profile photo is genuinely an image; every other verification
          // document can be a PDF, a Word doc, or a scanned/photographed image.
          const uploadType = doc.id === "profilePhoto" ? "image" : "document";

          // ThumbnailUpload works off a local `images` array — since each of
          // these is a single-file slot, we bridge its setImages callback
          // straight into the parent's onUpload(docId, image) handler.
          const handleNewImages = (
            next: UploadedImage[] | ((prev: UploadedImage[]) => UploadedImage[])
          ) => {
            const resolved = typeof next === "function" ? (next as any)([]) : next;
            const picked = resolved[resolved.length - 1];
            if (picked) onUpload(doc.id, picked);
          };

          return (
            <div key={doc.id} className="border border-[#E5E7EB] rounded-xl p-4 hover:border-maroon-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#111827]">{doc.label}</p>
                    {doc.required && (
                      <span className="text-[10px] font-semibold text-maroon-500 bg-pink-50 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1">{doc.hint}</p>
                </div>
                {isUploaded && (
                  <CheckCircle size={20} className="text-[#10B981] flex-shrink-0" />
                )}
              </div>

              {isUploaded && uploadedDoc ? (
                <div className="flex items-center justify-between gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-[#6B7280]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#111827] truncate">{uploadedDoc.filename}</p>
                      <p className="text-[10px] text-[#9CA3AF]">
                        {formatFileSize(uploadedDoc.sizeBytes)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {uploadedDoc.fileUrl && (
                      <a
                        href={uploadedDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-maroon-500 hover:bg-pink-50 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(doc.label)}
                      className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <ThumbnailUpload
                  images={[]}
                  setImages={handleNewImages}
                  maxImages={1}
                  maxSizeMB={5}
                  type={uploadType}
                  title=" "
                >
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                    ${error ? 'border-red-300 bg-red-50/30' : 'border-[#E5E7EB] hover:border-maroon-500 hover:bg-pink-50/20'}`}
                  >
                    <Upload size={24} className={`mx-auto mb-2 transition-colors ${error ? 'text-red-400' : 'text-[#D1D5DB]'}`} />
                    <p className={`text-[12px] font-medium transition-colors ${error ? 'text-red-500' : 'text-[#9CA3AF]'}`}>
                      {error || 'Click or drag to upload'}
                    </p>
                    <p className="text-[10px] text-[#D1D5DB] mt-1">
                      {uploadType === "image" ? "JPG or PNG (max 5MB)" : "PDF, Word doc, or image (max 5MB)"}
                    </p>
                  </div>
                </ThumbnailUpload>
              )}

              {isUploading && (
                <div className="mt-3">
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-maroon-500 to-maroon-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-1 text-center">{progress}% uploaded</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewStep({ form, documents, specialisms }: any) {
  const getSpecialismLabels = () => {
    return form.specialisms
      .map((id: any) => specialisms.find((s: any) => s._id === id)?.displayName)
      .filter(Boolean)
      .join(", ");
  };

  const getStateLabel = () => {
    const state = NIGERIAN_STATES.find(s => s.code === form.state);
    return state?.label || form.state;
  };

  const uploadedCount = documents.filter((d: any) => d.uploaded).length;
  const totalRequired = REQUIRED_DOCUMENTS.filter(d => d.required).length;
  const allDocumentsUploaded = uploadedCount >= totalRequired;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-[#F3F4F6] pb-4">
        <h2 className="text-xl font-bold text-[#111827]">Review Your Profile</h2>
        <p className="text-[13px] text-[#6B7280] mt-1">Verify all information before submission.</p>
      </div>

      <div className="space-y-4">
        {/* Professional Info */}
        <div className="bg-white rounded-xl border border-[#F3F4F6] overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-transparent border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-maroon-500" />
              <h3 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Professional Information</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <span className="text-[#6B7280]">SCN Number:</span>
              <span className="font-medium text-[#111827]">{form.scnNumber || "—"}</span>
              <span className="text-[#6B7280]">Year of Call:</span>
              <span className="font-medium text-[#111827]">{form.yearOfCall || "—"}</span>
              <span className="text-[#6B7280]">Location:</span>
              <span className="font-medium text-[#111827]">{form.location ? `${form.location}, ` : ""}{getStateLabel() || "—"}</span>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="bg-white rounded-xl border border-[#F3F4F6] overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-transparent border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-maroon-500" />
              <h3 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Practice & Languages</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-[13px]">
              <span className="text-[#6B7280] block mb-1">Practice Areas:</span>
              <span className="font-medium text-[#111827]">{getSpecialismLabels() || "—"}</span>
            </div>
            <div className="text-[13px]">
              <span className="text-[#6B7280] block mb-1">Languages:</span>
              <div className="flex flex-wrap gap-1.5">
                {form.languages.map((lang: string) => (
                  <span key={lang} className="text-[12px] bg-pink-50 text-maroon-500 px-2 py-0.5 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Fees */}
        <div className="bg-white rounded-xl border border-[#F3F4F6] overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-transparent border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2">
              <span className="text-maroon-500">₦</span>
              <h3 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Consultation Setup</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <span className="text-[#6B7280]">Written Consultation:</span>
              <span className="font-medium text-[#111827]">₦{form.fees.message.toLocaleString()}</span>
              <span className="text-[#6B7280]">Phone Call:</span>
              <span className="font-medium text-[#111827]">₦{form.fees.call.toLocaleString()}</span>
              <span className="text-[#6B7280]">Video Session:</span>
              <span className="font-medium text-[#111827]">₦{form.fees.video.toLocaleString()}</span>
              <span className="text-[#6B7280]">Response Time:</span>
              <span className="font-medium text-[#111827]">{form.responseTime}</span>
              <span className="text-[#6B7280]">Availability:</span>
              <span className={`font-medium ${form.available ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                {form.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Documents Status */}
        <div className={`rounded-xl border overflow-hidden ${allDocumentsUploaded ? 'bg-[#F0FDF4] border-[#6EE7B7]' : 'bg-amber-50 border-amber-200'}`}>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className={allDocumentsUploaded ? 'text-[#10B981]' : 'text-amber-600'} />
                <h3 className="text-[13px] font-bold uppercase tracking-wide">Document Status</h3>
              </div>
              <span className={`text-[12px] font-semibold ${allDocumentsUploaded ? 'text-[#10B981]' : 'text-amber-600'}`}>
                {uploadedCount}/{totalRequired} Required
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280]">
              {allDocumentsUploaded
                ? "All required documents have been uploaded. Ready for verification!"
                : "Please upload all required documents before submission."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
