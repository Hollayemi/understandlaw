import { useState } from "react";
import {
    Star, Clock, Award, BadgeCheck, Sparkles,
    ArrowRight, Loader2, AlertCircle, X,
    MessageSquare, Calendar, MapPin, Globe,
    CheckCircle2, Users, Briefcase, Scale,
    ChevronRight, ChevronLeft, ExternalLink
} from "lucide-react";
import { RecommendedLawyerRef } from "@/redux/types/consultation";
import { LawyerFull } from "@/redux/types/lawyer";
import { useGetLawyerByScnNumberQuery } from "@/redux/slices/lawyers.slice";
import { useGetRequestSuggestedLawyerQuery } from "@/redux/slices/consultation.slice";


interface LawyerRecommendationsProps {
    matchRequestId: string;
    onSelect: (lawyerProfileId: string) => Promise<void>;
}

export function LawyerRecommendations({
    matchRequestId,
    onSelect,
}: LawyerRecommendationsProps) {

    const { data, isLoading } = useGetRequestSuggestedLawyerQuery({ matchRequestId })
    const [pickingId, setPickingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const lawyers = data?.data || []

    console.log(lawyers)

    const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSelect = async (scnNumber: string) => {
        setSelectedLawyerId(scnNumber);
        await onSelect(scnNumber);
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-pink-500" size={20} />
                        Recommended Lawyers
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Our team has reviewed your case and shortlisted these verified lawyers
                    </p>
                </div>
                <span className="text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                    {lawyers.length} available
                </span>
            </div>

            {/* Lawyer Cards Grid */}
            {lawyers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {lawyers.map((lawyer) => (
                        <LawyerCard
                            key={lawyer.id}
                            lawyer={lawyer}
                            onViewProfile={() => {
                                setSelectedLawyerId(lawyer.scnNumber);
                                setSidebarOpen(true);
                            }}
                            hideFee={true}
                            onSelect={() => handleSelect(lawyer.id)}
                            isSelecting={isLoading && selectedLawyerId === lawyer.scnNumber}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <AlertCircle className="text-gray-400 mx-auto mb-3" size={32} />
                    <p className="text-gray-600 font-medium">No lawyers available at the moment</p>
                    <p className="text-sm text-gray-400 mt-1">We'll notify you when new recommendations are ready</p>
                </div>
            )}

            {/* Error Message */}
            {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
            )}

            {/* Sidebar */}
            {sidebarOpen && selectedLawyerId && (
                <LawyerProfileSidebar
                    lawyerId={selectedLawyerId}
                    onClose={() => setSidebarOpen(false)}
                    onSelect={() => {
                        const lawyer = lawyers.find(l => l.scnNumber === selectedLawyerId);
                        if (lawyer) {
                            handleSelect(lawyer.scnNumber);
                        }
                    }}
                    isSelecting={isLoading}
                />
            )}
        </div>
    );
}

/* ── Lawyer Card ────────────────────────────────────────────────────── */

function LawyerCard({
    lawyer,
    onViewProfile,
    onSelect,
    isSelecting,
    hideFee=false
}: {
    lawyer: RecommendedLawyerRef;
    onViewProfile: () => void;
    onSelect: () => void;
    isSelecting: boolean;
    hideFee?: boolean
}) {
    // Generate star rating display
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < fullStars ? "text-yellow-400 fill-yellow-400" :
                            (i === fullStars && hasHalfStar ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
                    />
                ))}
                <span className="ml-1 text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 hover:border-pink-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Gradient accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${lawyer.color}, ${lawyer.color}80)` }} />

            <div className="p-5">
                {/* Header with avatar and name */}
                <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                        {lawyer.picture ? (
                            <img src={lawyer.picture} alt="" className="w-11 h-11 rounded-xl object-cover" />
                        ) : (
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                style={{ background: `linear-gradient(135deg, ${lawyer.color}, ${lawyer.color})` }}
                            >
                                {lawyer.initials}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-gray-900 truncate">{lawyer.name}</h4>
                            <BadgeCheck className="text-yellow-500 shrink-0" size={16} />
                        </div>
                        {lawyer.title && (
                            <p className="text-sm text-gray-500 truncate">{lawyer.title}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                            {renderStars(lawyer.ratingAvg)}
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                ~{lawyer.responseTimeLabel}hrs response
                            </span>
                        </div>
                    </div>
                </div>

                {/* SCN Number and Fee */}
                <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <Scale size={12} />
                        <span className="font-medium">{lawyer.scnNumber}</span>
                    </div>
                    {!hideFee ? <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <span className="font-bold text-pink-600">₦{lawyer.fee}</span>
                        <span className="text-gray-400">fee</span>
                    </div> : null}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={onViewProfile}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                        View Profile
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={onSelect}
                        disabled={isSelecting}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                    >
                        {isSelecting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <>
                                Choose
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Lawyer Profile Sidebar ────────────────────────────────────────── */

function LawyerProfileSidebar({
    lawyerId,
    onClose,
    onSelect,
    isSelecting
}: {
    lawyerId: string;
    onClose: () => void;
    onSelect: () => void;
    isSelecting: boolean;
}) {
    // Fetch full lawyer profile using their ID
    const { data: lawyerResponse, isLoading, error } = useGetLawyerByScnNumberQuery(lawyerId.replaceAll("/", "-"));
    const lawyer = lawyerResponse?.data as LawyerFull;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex justify-end">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-2xl bg-white h-full overflow-y-auto animate-slide-in-right">
                    <div className="flex items-center justify-center h-full">
                        <Loader2 size={32} className="animate-spin text-pink-500" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !lawyer) {
        return (
            <div className="fixed inset-0 z-50 flex justify-end">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-2xl bg-white h-full overflow-y-auto animate-slide-in-right p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Profile Not Found</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-gray-500">Could not load lawyer profile. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full overflow-y-auto animate-slide-in-right shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                <div className="p-6">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                        <div className="relative w-12 h-12 bg-white shadow mb-4 rounded-md mx-auto shrink-0">
                            {lawyer.picture ? (
                                <img src={lawyer.picture} alt="" className="w-11 h-11 rounded-xl object-cover" />
                            ) : (
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                    style={{ background: `linear-gradient(135deg, ${lawyer.colorA}, ${lawyer.colorB})` }}
                                >
                                    {lawyer.avatarInitials}
                                </div>
                            )}
                           
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">{lawyer.fullName || `${lawyer.firstName} ${lawyer.lastName}`}</h2>
                        {lawyer.title && <p className="text-gray-600 mt-1">{lawyer.title}</p>}

                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                                <span className="font-semibold">{lawyer.ratingAvg?.toFixed(1) || 'N/A'}</span>
                                <span className="text-gray-400 text-sm">({lawyer.reviewCount || 0} reviews)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users size={16} />
                                <span>{lawyer.consultationCount || 0} consultations</span>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                            {lawyer.verificationStatus === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                    <BadgeCheck size={14} />
                                    Verified
                                </span>
                            )}
                            {lawyer.isAvailable && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    <CheckCircle2 size={14} />
                                    Available Now
                                </span>
                            )}
                            {lawyer.subscriptionTier === 'premium' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                                    <Award size={14} />
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Response Time</p>
                            <p className="text-sm font-semibold text-gray-900">{lawyer.responseTimeLabel || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Fee</p>
                            {/* <p className="text-sm font-semibold text-pink-600">
                ₦{lawyer.fees?.amount || lawyer.fees?.min || 'N/A'}
                {lawyer.fees?.type === 'range' && ` - ₦${lawyer.fees.max}`}
              </p> */}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Year of Call</p>
                            <p className="text-sm font-semibold text-gray-900">{lawyer.yearOfCall || lawyer.calledAt || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {lawyer.bio || 'No bio provided'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialisms</h4>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.specialisms?.map((spec, index) => (
                                    <span key={index} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
                                        {spec.displayName}
                                    </span>
                                )) || <span className="text-sm text-gray-500">No specialisms listed</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={16} className="text-gray-400" />
                                    {lawyer.location || lawyer.state || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-1">
                                    {lawyer.languages?.map((lang, index) => (
                                        <span key={index} className="text-sm text-gray-600">
                                            {lang}{index < lawyer.languages.length - 1 ? ', ' : ''}
                                        </span>
                                    )) || <span className="text-sm text-gray-500">N/A</span>}
                                </div>
                            </div>
                        </div>

                        {lawyer.scnNumber && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SCN Number</h4>
                                <p className="text-sm text-gray-600">{lawyer.scnNumber}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onSelect}
                            disabled={isSelecting}
                            className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                        >
                            {isSelecting ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Select This Lawyer
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                // Implement chat or contact functionality
                            }}
                            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <MessageSquare size={16} />
                            Message
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            All lawyers on our platform are verified and vetted. Your consultation is protected by our quality guarantee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
