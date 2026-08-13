"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck, Scale, BookOpen, ChevronRight, ChevronLeft, Check,
  AlertCircle, Loader2, CheckCircle, FileText, DollarSign
} from "lucide-react";

// Import from your slice
import {
  useSubmitVerificationMutation,
  NIGERIAN_STATES,
} from "@/redux/slices/lawyers.slice";

import { ProfessionalStep, SpecialismsStep, StoryStep, ConsultationStep, DocumentsStep, ReviewStep } from "./components"
import { UploadedDocument, FormData as LawyerFormData } from "@/redux/types/lawyer";
import { UploadedImage } from "@/app/components/ui/fileUploader";
import { REQUIRED_DOCUMENTS, STEPS } from "./components"
import { showSuccess } from "@/app/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useListSpecialismsQuery } from "@/redux/slices/others.slice";


export default function LawyerOnboardingPage() {
  const { data: getSpecialisms, isLoading } = useListSpecialismsQuery()
  console.log(getSpecialisms)
  const specialisms = getSpecialisms?.data || []

  console.log({ specialisms })

  const router = useRouter()
  const [image, setImage] = useState<any>([])
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<LawyerFormData>({
    scnNumber: "",
    yearOfCall: "",
    state: "",
    location: "",
    phone: "",
    specialisms: [],
    languages: ["English", "French"],
    bio: "",
    education: [],
    notableWork: [],
    fees: { message: 0, call: 0, video: 0 },
    responseTime: "",
    available: true,

    profilePicture: image[0]?.base64
  });

  const [documents, setDocuments] = useState<UploadedDocument[]>(
    REQUIRED_DOCUMENTS.map(doc => ({
      id: doc.id,
      label: doc.label,
      fileUrl: "",
      filename: "",
      sizeBytes: 0,
      uploaded: false,
      uploading: false,
      progress: 0,
    }))
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [submitVerification, { isLoading: isSubmitting }] = useSubmitVerificationMutation();

  const updateForm = (field: keyof LawyerFormData | string, value: any) => {
    if (field === "fees") {
      setForm(prev => ({ ...prev, fees: value }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) { // Professional
      if (!form.scnNumber) newErrors.scnNumber = "SCN number is required";
      else if (!/^SCN\d+$/i.test(form.scnNumber)) {
        newErrors.scnNumber = "Format: SCN12345 (SCN followed by at least 1 digit)";
      }
      if (!form.yearOfCall) newErrors.yearOfCall = "Year of call is required";
      else if (parseInt(form.yearOfCall) < 1960 || parseInt(form.yearOfCall) > new Date().getFullYear()) {
        newErrors.yearOfCall = "Enter a valid year";
      }
      if (!form.state) newErrors.state = "State is required";
      if (!form.phone) newErrors.phone = "Phone number is required";
      else if (!/^(\+234|0)[789][01]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Enter a valid Nigerian phone number";
      }
    } else if (step === 1) { // Specialisms
      if (form.specialisms.length === 0) newErrors.specialisms = "Select at least one practice area";
      if (form.languages.length === 0) newErrors.languages = "Select at least one language";
    } else if (step === 2) { // Story
      if (!form.bio.trim()) newErrors.bio = "Bio is required";
      else if (form.bio.trim().length < 100) newErrors.bio = "Bio must be at least 100 characters";
    } else if (step === 3) { // Consultation
      if (!form.fees.message || form.fees.message < 500) newErrors.fees = "Minimum NGN 500 for written consultations";
      if (!form.fees.call || form.fees.call < 2000) newErrors.fees = "Minimum NGN 2,000 for calls";
      if (!form.fees.video || form.fees.video < 3000) newErrors.fees = "Minimum NGN 3,000 for video sessions";
      if (!form.responseTime) newErrors.responseTime = "Select a response time";
    } else if (step === 4) {
      if (!form.profilePicture) newErrors.image = "Please select a profile pictured";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDocumentUpload = (docId: string, image: UploadedImage) => {
    setDocuments(prev => prev.map((doc) =>
      doc.id === docId ? {
        ...doc,
        fileUrl: image.preview,
        filename: image.name,
        sizeBytes: image.size,
        base64: image.base64,
        mimeType: image.type,
        uploaded: true,
        uploading: false,
        progress: 100,
        error: undefined,
      } : doc
    ));
  };

  const handleDocumentRemove = (docLabel: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.label === docLabel ? {
        ...doc,
        fileUrl: "",
        filename: "",
        sizeBytes: 0,
        uploaded: false,
        uploading: false,
        progress: 0,
        error: undefined,
      } : doc
    ));
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    // Final validation
    const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.required);
    const uploadedDocs = documents.filter(d => d.uploaded);
    const allDocsUploaded = requiredDocs.every(required =>
      uploadedDocs.some(uploaded => uploaded.label === required.label)
    );

    if (!allDocsUploaded) {
      setSubmitError("Please upload all required documents before submitting");
      setCurrentStep(4);
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append all form fields
    formData.append('scnNumber', form.scnNumber.trim().toUpperCase());
    formData.append('yearOfCall', form.yearOfCall.toString());
    formData.append('calledAt', form.yearOfCall.toString());
    formData.append('bio', form.bio.trim());
    formData.append('location', form.location.trim());
    formData.append('state', NIGERIAN_STATES.find(s => s.code === form.state)?.label || form.state);
    formData.append('stateCode', form.state);
    formData.append('languages', JSON.stringify(form.languages));
    formData.append('specialisms', JSON.stringify(form.specialisms));
    formData.append('fees', JSON.stringify(form.fees));

    // Append documents
    const uploadedDocsList = documents.filter(d => d.uploaded);
    formData.append('documents', JSON.stringify(uploadedDocsList.map(d => ({
      label: d.label,
      filename: d.filename,
      fileUrl: d.fileUrl,
      sizeBytes: d.sizeBytes,
      mimeType: d.mimeType,
    }))));

    // Append each document's base64 data as separate files
    uploadedDocsList.forEach((doc, index) => {
      if (doc.base64) {
        // Convert base64 to blob and append
        const byteCharacters = atob(doc.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: doc.mimeType || 'application/octet-stream' });
        formData.append(`document_${index}`, blob, doc.filename);
        formData.append(`document_${index}_label`, doc.label);
      }
    });

    try {
      const result = await submitVerification(formData).unwrap();
      if (result.success) {
        showSuccess("Profile submitted successfully!", "We'll review your application within 48 hours.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      setSubmitError(error.message || "Submission failed. Please try again.");
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EE] via-white to-[#F5F2EE]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8317A] to-[#ff6fa8] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="5" cy="8" r="1" fill="white" />
                <circle cx="19" cy="8" r="1" fill="white" />
                <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#111827]">
              Law<span className="text-[#E8317A]">Ticha</span>
            </span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">Complete Your Lawyer Profile</h1>
          <p className="text-[#6B7280] text-sm md:text-base max-w-md mx-auto">
            Join Nigeria's trusted legal marketplace and connect with clients seeking expert legal counsel.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#E8317A] uppercase tracking-wide">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-[11px] text-[#9CA3AF]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden md:flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                      ${isActive ? 'bg-[#E8317A] shadow-lg scale-110' :
                        isCompleted ? 'bg-[#10B981]' : 'bg-white border-2 border-[#E5E7EB]'}`}
                    >
                      {isCompleted ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <Icon size={20} className={isActive ? 'text-white' : 'text-[#9CA3AF]'} />
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E8317A]" />
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold text-center max-w-[80px]
                    ${isActive ? 'text-[#E8317A]' : isCompleted ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all
                    ${currentStep > idx ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#F3F4F6] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />

          <div className="p-6 md:p-8">
            {currentStep === 0 && <ProfessionalStep form={form} updateForm={updateForm} errors={errors} />}
            {currentStep === 1 && <SpecialismsStep specialisms={specialisms} form={form} updateForm={updateForm} errors={errors} />}
            {currentStep === 2 && <StoryStep form={form} updateForm={updateForm} errors={errors} />}
            {currentStep === 3 && <ConsultationStep form={form} updateForm={updateForm} errors={errors} />}
            {currentStep === 4 && (
              <DocumentsStep
                documents={documents}
                onUpload={handleDocumentUpload}
                onRemove={handleDocumentRemove}
                image={image}
                setImage={setImage}
              />
            )}
            {currentStep === 5 && <ReviewStep form={form} specialisms={specialisms} documents={documents} />}
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 md:px-8 pb-6 flex flex-col sm:flex-row items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:border-[#E8317A] hover:text-[#E8317A] transition-all"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}

            <div className="flex-1" />

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#111827] to-[#1E3A5F] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircle size={14} /> Submit for Verification</>
                )}
              </button>
            )}
          </div>

          {submitError && (
            <div className="mx-6 md:mx-8 mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[12px] text-red-600 flex items-center gap-2">
                <AlertCircle size={14} /> {submitError}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#9CA3AF] mt-6 leading-relaxed">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#E8317A] font-semibold hover:underline">
            Sign in
          </Link>
          {" "}· Need help?{" "}
          <Link href="/support" className="text-[#E8317A] font-semibold hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}