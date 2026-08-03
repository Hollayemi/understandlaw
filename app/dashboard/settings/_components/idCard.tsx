"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Download, Loader2, Star, QrCode, BadgeCheck, Copy, Check,
  Sparkles,
} from "lucide-react";
import { toPng } from "html-to-image";
import QRCodeLib from "qrcode";
import { showError, showSuccess } from "@/app/components/ui/sonner";
import { Section } from "./index";
import Image from "next/image";

interface CardConfig {
  showRating: boolean;
  showTitle: boolean;
  showNbaNumber: boolean;
  showYearOfCall: boolean;
  showState: boolean;
  showQr: boolean;
  cardType: "front" | "back";
}

const DEFAULT_CONFIG: CardConfig = {
  showRating: true,
  showTitle: true,
  showNbaNumber: true,
  showYearOfCall: true,
  showState: true,
  showQr: true,
  cardType: "front",
};

function CardToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors text-left"
    >
      <span className="text-[12.5px] font-medium text-gray-700">{label}</span>
      <span
        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${checked ? "bg-[#E8317A]" : "bg-gray-200"
          }`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"
            }`}
        />
      </span>
    </button>
  );
}

export function LawyerIdCard({ user, profile }: { user: any; profile: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullName = user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const avatarUrl = user?.avatarUrl || "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join("") || "L";

  const colorA = profile?.colorA || "#1E3A5F";
  const colorB = profile?.colorB || "#E8317A";
  const nbaNumber: string = profile?.nbaNumber || "—";
  const yearOfCall = profile?.yearOfCall || profile?.calledAt || "—";
  const title = profile?.title || "";
  const state = profile?.state || "";
  const ratingAvg: number = profile?.ratingAvg || 0;
  const reviewCount: number = profile?.reviewCount || 0;
  const isVerified = profile?.verificationStatus === "approved";
  const phoneNumber = user?.phoneNumber || "+234 812 222 0683";

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/dashboard/marketplace/${encodeURIComponent(nbaNumber)}`;
  }, [nbaNumber]);

  useEffect(() => {
    if (!profileUrl) return;
    QRCodeLib.toDataURL(profileUrl, {
      margin: 1,
      width: 240,
      color: { dark: "#1E3A5F", light: "#FFFFFF" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [profileUrl]);

  const toggle = (key: keyof CardConfig) => (v: boolean) =>
    setConfig(prev => ({ ...prev, [key]: v }));

  const setCardType = (type: "front" | "back") =>
    setConfig(prev => ({ ...prev, cardType: type }));

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        skipFonts: true,
      });
      const link = document.createElement("a");
      link.download = `lawticha-id-${nbaNumber !== "—" ? nbaNumber.replace(/\W+/g, "-") : "card"}-${config.cardType}.png`;
      link.href = dataUrl;
      link.click();
      showSuccess("ID card downloaded", "Ready to post — or just screenshot the preview above.");
    } catch (error) {
      console.error("Failed to export ID card:", error);
      showError("Couldn't generate the image", "Try taking a screenshot of the preview instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showError("Couldn't copy the link");
    }
  };

  return (
    <Section
      title="Your LawTicha ID Card"
      desc="A shareable digital ID — post it on your socials or use it anywhere clients need to verify you're a real, verified LawTicha lawyer."
    >
      <div className="p-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Live preview */}
          <div className="flex flex-col items-center">
            <div
              ref={cardRef}
              className="relative w-full max-w-[300px] aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl bg-white"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 p-[2px] bg-gradient-to-br from-[#E8317A] via-[#E8317A]/50 to-[#1E3A5F] rounded-[20px]">
                <div className="w-full h-full bg-white rounded-[19px] relative overflow-hidden">
                  {/* Subtle decorative stripe at top */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E8317A] via-[#E8317A]/70 to-[#E8317A]" />
                  
                  {/* Subtle decorative corner accents */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#E8317A]/10 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#E8317A]/10 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#E8317A]/10 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#E8317A]/10 rounded-br-lg" />

                  <div className="relative h-full flex flex-col p-6">
                    {/* Header with logo */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="relative w-[80px] h-[32px]">
                        <Image
                          src="/images/logo.png"
                          alt="LawTicha"
                          fill
                          className="object-contain"
                        />
                      </div>
                      {isVerified && (
                        <span className="flex items-center gap-1 text-[8px] font-bold tracking-wider uppercase bg-[#E8317A]/10 text-[#E8317A] px-2.5 py-1 rounded-full border border-[#E8317A]/20">
                          <BadgeCheck size={10} className="text-[#E8317A]" /> Verified
                        </span>
                      )}
                    </div>

                    {/* Front Card Content */}
                    {config.cardType === "front" ? (
                      <>
                        <div className="flex flex-col items-center flex-1 justify-center -mt-2">
                          {/* Avatar */}
                          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-[#E8317A]/20 shadow-lg flex items-center justify-center bg-gradient-to-br from-[#E8317A]/5 to-[#1E3A5F]/5">
                            {avatarUrl ? (
                              <img src={avatarUrl} crossOrigin="anonymous" alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-4xl font-bold text-[#1E3A5F]/60">{initials}</span>
                            )}
                          </div>

                          <div className="text-center w-full mt-4">
                            <p className="text-[20px] font-bold text-[#1E3A5F] leading-tight truncate px-2">{fullName || "—"}</p>
                            {config.showTitle && title && (
                              <p className="text-[13px] text-[#E8317A] font-medium truncate mt-0.5">{title}</p>
                            )}
                            {config.showState && state && (
                              <p className="text-[11px] text-gray-500 truncate mt-0.5">{state}</p>
                            )}
                            {config.showRating && ratingAvg > 0 && (
                              <div className="flex items-center justify-center gap-1.5 mt-3 bg-gradient-to-r from-[#E8317A]/5 to-[#1E3A5F]/5 px-3 py-1.5 rounded-full">
                                <Star size={14} className="fill-[#E8317A] text-[#E8317A]" />
                                <span className="text-[13px] font-bold text-[#1E3A5F]">{ratingAvg.toFixed(1)}</span>
                                <span className="text-[10px] text-gray-500">({reviewCount} reviews)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer with ID info */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div>
                            <p className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">ID Number</p>
                            <p className="text-[13px] font-mono font-bold text-[#1E3A5F]">{nbaNumber}</p>
                          </div>
                          {config.showYearOfCall && (
                            <div className="text-right">
                              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Called to Bar</p>
                              <p className="text-[12px] font-semibold text-[#1E3A5F]">{yearOfCall}</p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Back Card Content */
                      <>
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                          <div className="w-12 h-12 mb-4 relative opacity-30">
                            <Image
                              src="/images/logo.png"
                              alt="LawTicha"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h3 className="text-[14px] font-bold text-[#1E3A5F] mb-3">Terms & Conditions</h3>
                          <div className="text-[10px] text-gray-600 leading-3 space-y-1 max-w-[90%]">
                            <p>This ID card is the property of LawTicha Inc.</p>
                            <p>Member is subject to LawTicha's Code of Conduct.</p>
                            <p>This card must be presented upon request.</p>
                            <p>Valid only with a current LawTicha membership.</p>
                          </div>

                          <div className="mt-6 w-full max-w-[90%]">
                            <div className="flex justify-between text-[11px] bg-gray-50 rounded-xl px-4 py-3">
                              <div>
                                <p className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Phone</p>
                                <p className="font-mono font-semibold text-[#1E3A5F]">{phoneNumber}</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Response Time</p>
                                <p className="font-mono font-bold text-[#E8317A]">{profile.responseTime}</p>
                              </div>
                            </div>
                          </div>

                          {config.showQr && qrDataUrl && (
                            <div className="mt-5 bg-white p-2 rounded-xl shadow-md border border-gray-100">
                              <img src={qrDataUrl} alt="Scan to view profile" className="w-20 h-20" />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                          <p className="text-[8px] text-gray-400 tracking-widest font-semibold">LAWTICHA.COM</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-3 text-center max-w-[400px]">
              This updates live as you change the options — screenshot it directly, or use Download for a clean, high-resolution PNG.
            </p>
          </div>

          {/* Configuration panel */}
          <div>
            <div className="mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Card Side</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCardType("front")}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${config.cardType === "front"
                      ? "bg-[#E8317A] text-white shadow-lg shadow-[#E8317A]/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setCardType("back")}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${config.cardType === "back"
                      ? "bg-[#E8317A] text-white shadow-lg shadow-[#E8317A]/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Back
                </button>
              </div>
            </div>

            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">What to show</p>
            <div className="space-y-2 mb-5">
              <CardToggle label="Rating & review count" checked={config.showRating} onChange={toggle("showRating")} />
              <CardToggle label="Practice area" checked={config.showTitle} onChange={toggle("showTitle")} />
              <CardToggle label="State" checked={config.showState} onChange={toggle("showState")} />
              <CardToggle label="SCN / Bar number" checked={config.showNbaNumber} onChange={toggle("showNbaNumber")} />
              <CardToggle label="Year called to Bar" checked={config.showYearOfCall} onChange={toggle("showYearOfCall")} />
              <CardToggle label="QR code to full profile" checked={config.showQr} onChange={toggle("showQr")} />
            </div>

            <div className="bg-gradient-to-r from-[#E8317A]/5 to-[#1E3A5F]/5 rounded-xl p-3.5 mb-5 flex items-start gap-2 border border-[#E8317A]/10">
              <QrCode size={13} className="text-[#E8317A] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 leading-relaxed">
                The QR code links to your full LawTicha profile so anyone who scans it can see your reviews, specialisms and book you directly.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#E8317A] to-[#E8317A]/80 hover:shadow-lg hover:shadow-[#E8317A]/20 transition-all"
              >
                {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {downloading ? "Preparing image…" : "Download as PNG"}
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                {copied ? "Link copied" : "Copy profile link"}
              </button>
            </div>

            {!isVerified && (
              <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <Sparkles size={12} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Your account isn&apos;t verified yet, so the &quot;Verified Lawyer&quot; badge won&apos;t show. It&apos;ll appear automatically once your documents are approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}