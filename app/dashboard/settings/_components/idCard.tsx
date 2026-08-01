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

interface CardConfig {
  showRating: boolean;
  showTitle: boolean;
  showNbaNumber: boolean;
  showYearOfCall: boolean;
  showState: boolean;
  showQr: boolean;
}

const DEFAULT_CONFIG: CardConfig = {
  showRating: true,
  showTitle: true,
  showNbaNumber: true,
  showYearOfCall: true,
  showState: true,
  showQr: true,
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

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/dashboard/marketplace/${encodeURIComponent(nbaNumber)}`;
  }, [nbaNumber]);

  useEffect(() => {
    if (!profileUrl) return;
    QRCodeLib.toDataURL(profileUrl, {
      margin: 1,
      width: 240,
      color: { dark: "#111827", light: "#FFFFFF" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [profileUrl]);

  const toggle = (key: keyof CardConfig) => (v: boolean) =>
    setConfig(prev => ({ ...prev, [key]: v }));

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
      link.download = `lawticha-id-${nbaNumber !== "—" ? nbaNumber.replace(/\W+/g, "-") : "card"}.png`;
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
              className="relative w-full max-w-[400px] aspect-[1.6/1] rounded-[22px] overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
            >
              {/* subtle dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1.2px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              />
              {/* soft glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative h-full flex flex-col p-5 text-white">
                {/* header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                      <line x1="12" y1="3" x2="12" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <line x1="5" y1="8" x2="19" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="5" cy="8" r="1.2" fill="white" />
                      <circle cx="19" cy="8" r="1.2" fill="white" />
                      <path d="M3 11 Q5 15 7 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <path d="M17 11 Q19 15 21 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    </svg>
                    <span className="text-[13px] font-bold tracking-tight">LawTicha</span>
                  </div>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 text-[8.5px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <BadgeCheck size={10} /> Verified Lawyer
                    </span>
                  )}
                </div>

                {/* body */}
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-[62px] h-[62px] rounded-2xl overflow-hidden bg-white/15 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} crossOrigin="anonymous" alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold leading-tight truncate">{fullName || "—"}</p>
                    {config.showTitle && title && (
                      <p className="text-[11px] text-white/85 truncate mt-0.5">{title}</p>
                    )}
                    {config.showState && state && (
                      <p className="text-[10px] text-white/70 truncate mt-0.5">{state}, Nigeria</p>
                    )}
                    {config.showRating && ratingAvg > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={10} className="fill-white text-white" />
                        <span className="text-[10.5px] font-bold">{ratingAvg.toFixed(1)}</span>
                        <span className="text-[9.5px] text-white/70">({reviewCount} review{reviewCount === 1 ? "" : "s"})</span>
                      </div>
                    )}
                  </div>

                  {config.showQr && qrDataUrl && (
                    <div className="flex-shrink-0 bg-white p-1 rounded-lg">
                      <img src={qrDataUrl} alt="Scan to view profile" className="w-14 h-14" />
                    </div>
                  )}
                </div>

                {/* footer */}
                <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-white/20">
                  <div className="text-[9px] text-white/80 leading-relaxed">
                    {config.showNbaNumber && <p className="font-mono font-semibold">{nbaNumber}</p>}
                    {config.showYearOfCall && <p className="text-white/65">Called to Bar · {yearOfCall}</p>}
                  </div>
                  <p className="text-[8.5px] text-white/50">lawticha.com</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-3 text-center max-w-[400px]">
              This updates live as you change the options — screenshot it directly, or use Download for a clean, high-resolution PNG.
            </p>
          </div>

          {/* Configuration panel */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">What to show</p>
            <div className="space-y-2 mb-5">
              <CardToggle label="Rating & review count" checked={config.showRating} onChange={toggle("showRating")} />
              <CardToggle label="Practice area" checked={config.showTitle} onChange={toggle("showTitle")} />
              <CardToggle label="State" checked={config.showState} onChange={toggle("showState")} />
              <CardToggle label="SCN / Bar number" checked={config.showNbaNumber} onChange={toggle("showNbaNumber")} />
              <CardToggle label="Year called to Bar" checked={config.showYearOfCall} onChange={toggle("showYearOfCall")} />
              <CardToggle label="QR code to full profile" checked={config.showQr} onChange={toggle("showQr")} />
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 mb-5 flex items-start gap-2">
              <QrCode size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                The QR code links to your full LawTicha profile so anyone who scans it can see your reviews, specialisms and book you directly.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60 transition-colors"
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
