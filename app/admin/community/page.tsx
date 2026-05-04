"use client";
import React, { useState, useMemo } from "react";
import {
  MessageSquare, TrendingUp, Star, AlertTriangle, Plus,
  MoreHorizontal, Eye, Trash2, Pin, PinOff, Megaphone,
  CheckCircle, XCircle, BarChart3, Users, ChevronDown,
  ChevronUp, Edit2, Flag, RotateCcw, Filter, Search,
  Scale, Vote, BookOpen, Newspaper, FileText, Loader2,
  Check, X, Save, Info, Clock, Heart, Share2, Bookmark,
  RefreshCw, ShieldAlert, Send,
} from "lucide-react";
import {
  StatBar, FilterBar, PageHeader, Avatar, StatusBadge,
} from "../_components";
import {
  INITIAL_POSTS, POST_TYPE_CONFIG, POST_STATUS_CONFIG,
  COMMUNITY_CATEGORIES,
  type Post, type PostType, type PostStatus, type Comment,
} from "@/redux/slices/community.slice";

//  Helpers 

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PostTypeBadge({ type }: { type: PostType }) {
  const cfg = POST_TYPE_CONFIG[type];
  const icons: Record<PostType, React.ElementType> = {
    discussion: MessageSquare,
    argument: Scale,
    poll: BarChart3,
    announcement: Megaphone,
    case_study: BookOpen,
  };
  const Icon = icons[type];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function PostStatusChip({ status }: { status: PostStatus }) {
  const cfg = POST_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {status === "promoted" && <Star size={9} />}
      {status === "active" && <CheckCircle size={9} />}
      {status === "pending" && <Clock size={9} />}
      {status === "removed" && <XCircle size={9} />}
      {cfg.label}
    </span>
  );
}

//  Create Post Modal 

function CreatePostModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (post: Partial<Post>) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<PostType>("discussion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", ""]);
  const [pinned, setPinned] = useState(false);
  const [promoted, setPromoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const typeOptions: { id: PostType; icon: React.ElementType; desc: string }[] = [
    { id: "discussion",   icon: MessageSquare, desc: "Open discussion for community input" },
    { id: "argument",     icon: Scale,         desc: "Debate a legal position" },
    { id: "poll",         icon: BarChart3,     desc: "Gather opinions with voting" },
    { id: "announcement", icon: Megaphone,     desc: "Official platform update" },
    { id: "case_study",   icon: BookOpen,      desc: "Share a real legal scenario" },
  ];

  const addPollOption = () => setPollOptions(prev => [...prev, ""]);
  const removePollOption = (i: number) => setPollOptions(prev => prev.filter((_, idx) => idx !== i));
  const updatePollOption = (i: number, val: string) => setPollOptions(prev => prev.map((o, idx) => idx === i ? val : o));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    onSubmit({
      type,
      title,
      content,
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      pinned,
      promoted,
      pollOptions: type === "poll" ? pollOptions.filter(Boolean).map((text, i) => ({ id: `po${i}`, text, votes: 0 })) : undefined,
      status: "active",
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8]" />
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Create Community Post</h3>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Step {step} of 2 · Admin post,  published immediately</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1, 2].map(n => (
                <div key={n} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  step === n ? "bg-[#E8317A] text-white" : step > n ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}>
                  {step > n ? <Check size={11} /> : n}
                </div>
              ))}
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Post Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {typeOptions.map(t => {
                    const Icon = t.icon;
                    const cfg = POST_TYPE_CONFIG[t.id];
                    const active = type === t.id;
                    return (
                      <button key={t.id} onClick={() => setType(t.id)}
                        className={`flex flex-col items-start gap-2 p-3.5 rounded-xl border-[1.5px] text-left transition-all ${
                          active ? "border-[#E8317A] bg-pink-50/40" : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                        }`}>
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: active ? cfg.bg : "#F9FAFB" }}>
                            <Icon size={13} style={{ color: active ? cfg.color : "#9CA3AF" }} />
                          </div>
                          {active && <CheckCircle size={12} className="text-[#E8317A] ml-auto" />}
                        </div>
                        <div>
                          <p className={`text-[12px] font-bold ${active ? "text-[#E8317A]" : "text-[#111827]"}`}>{cfg.label}</p>
                          <p className="text-[10px] text-[#9CA3AF] leading-snug mt-0.5">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    type === "discussion" ? "e.g. What happens when police deny you access to a lawyer?"
                    : type === "argument" ? "e.g. Landlords should not require more than 1 year advance rent"
                    : type === "poll" ? "e.g. Which area of law do you need most help with?"
                    : type === "announcement" ? "e.g. New module live: Tenant Rights in Lagos State"
                    : "e.g. How I successfully challenged an illegal lockout in Abuja"
                  }
                  className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                />
              </div>

              {type !== "poll" && (
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Content</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write the post body,  use plain, accessible language. Reference specific laws and sections where relevant."
                    className="w-full h-36 px-4 py-3.5 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors leading-relaxed"
                  />
                  <p className="text-[10px] text-[#9CA3AF] mt-1">{content.length} characters</p>
                </div>
              )}

              {type === "poll" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Poll Options</label>
                    <button onClick={addPollOption}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#E8317A] hover:underline">
                      <Plus size={11} /> Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-6 h-11 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-[#9CA3AF]">{i + 1}</span>
                        </div>
                        <input
                          value={opt}
                          onChange={e => updatePollOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                        />
                        {pollOptions.length > 2 && (
                          <button onClick={() => removePollOption(i)}
                            className="w-9 h-11 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] bg-white transition-colors"
                  >
                    {COMMUNITY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                  <input
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="e.g. Section 35, Police, Arrest"
                    className="w-full h-11 px-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!title.trim() || (type !== "poll" && !content.trim())}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] disabled:opacity-40 transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[12px] text-[#9CA3AF] hover:text-[#111827] transition-colors mb-2">
                ← Back
              </button>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">Pin to top of feed</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Keeps this post at the top of the community feed</p>
                  </div>
                  <button
                    onClick={() => setPinned(!pinned)}
                    className={`relative w-11 h-6 rounded-full transition-all ${pinned ? "bg-[#E8317A]" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${pinned ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">Mark as Promoted</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Highlights this post with a star badge in the feed</p>
                  </div>
                  <button
                    onClick={() => setPromoted(!promoted)}
                    className={`relative w-11 h-6 rounded-full transition-all ${promoted ? "bg-[#E8317A]" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${promoted ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] p-4">
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Preview</p>
                <div className="flex items-center gap-2 mb-2">
                  <PostTypeBadge type={type} />
                  {pinned && <span className="text-[10px] text-[#6B7280] flex items-center gap-1"><Pin size={9} /> Pinned</span>}
                  {promoted && <span className="text-[10px] text-amber-600 flex items-center gap-1"><Star size={9} /> Promoted</span>}
                </div>
                <p className="text-[13px] font-bold text-[#111827] mb-1 line-clamp-2">{title || "—"}</p>
                <p className="text-[11px] text-[#9CA3AF]">{category} · Super Admin · Just now</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={13} className="animate-spin" /> Publishing…</> : <><Send size={13} /> Publish Post</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//  Remove / Moderate Modal 

function ModerateModal({
  post,
  action,
  onClose,
  onSubmit,
}: {
  post: Post;
  action: "remove" | "approve" | "restore";
  onClose: () => void;
  onSubmit: (reason?: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onSubmit(reason || undefined);
    setLoading(false);
  };

  const META = {
    remove:  { title: "Remove Post",     color: "#EF4444", icon: XCircle,      btn: "Remove Post",     btnCls: "bg-[#EF4444] hover:bg-[#DC2626]" },
    approve: { title: "Approve Post",    color: "#10B981", icon: CheckCircle,  btn: "Approve & Publish",btnCls: "bg-[#10B981] hover:bg-[#059669]" },
    restore: { title: "Restore Post",    color: "#3B82F6", icon: RotateCcw,    btn: "Restore Post",    btnCls: "bg-[#3B82F6] hover:bg-[#2563EB]" },
  }[action];

  const Icon = META.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full" style={{ background: META.color }} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${META.color}15` }}>
              <Icon size={18} style={{ color: META.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#111827] text-sm">{META.title}</h3>
              <p className="text-[11px] text-[#9CA3AF] truncate">{post.title}</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827]"><X size={16} /></button>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
              {action === "remove" ? "Reason for Removal *" : "Internal Note (optional)"}
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={
                action === "remove" ? "Explain why this post violates community standards…"
                : "Add a note for the audit log…"
              }
              className="w-full h-20 px-4 py-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] resize-none outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
            <button
              onClick={submit}
              disabled={loading || (action === "remove" && !reason.trim())}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${META.btnCls}`}
            >
              {loading ? <><Loader2 size={13} className="animate-spin" /> Processing…</> : META.btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//  Post Card 

function PostCard({
  post,
  onPromote,
  onDemote,
  onPin,
  onUnpin,
  onRemove,
  onRestore,
  onApprove,
}: {
  post: Post;
  onPromote: (p: Post) => void;
  onDemote: (p: Post) => void;
  onPin: (p: Post) => void;
  onUnpin: (p: Post) => void;
  onRemove: (p: Post) => void;
  onRestore: (p: Post) => void;
  onApprove: (p: Post) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalPollVotes = post.pollOptions?.reduce((s, o) => s + o.votes, 0) ?? 0;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      expanded ? "border-[#E5E7EB] shadow-md" : "border-[#F3F4F6] shadow-sm hover:shadow-md"
    }`}>
      <div className="h-0.5 w-full" style={{ background: POST_TYPE_CONFIG[post.type].color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar initials={post.author.initials} color={post.author.color} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[13px] font-bold text-[#111827]">{post.author.name}</span>
              {post.author.verified && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                post.author.role === "admin" ? "bg-pink-50 text-[#E8317A]"
                : post.author.role === "lawyer" ? "bg-blue-50 text-[#3B82F6]"
                : "bg-gray-100 text-[#6B7280]"
              }`}>
                {post.author.role}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PostTypeBadge type={post.type} />
              <PostStatusChip status={post.status} />
              {post.pinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                  <Pin size={9} /> Pinned
                </span>
              )}
              <span className="text-[11px] text-[#9CA3AF]">{formatRelative(post.createdAt)}</span>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative flex-shrink-0">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 overflow-hidden">
                  {post.status === "pending" && (
                    <button onClick={() => { onApprove(post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#10B981] text-left">
                      <CheckCircle size={13} /> Approve Post
                    </button>
                  )}
                  {!post.removed && post.status !== "pending" && (
                    post.promoted ? (
                      <button onClick={() => { onDemote(post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Star size={13} /> Remove Promotion
                      </button>
                    ) : (
                      <button onClick={() => { onPromote(post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Star size={13} /> Promote Post
                      </button>
                    )
                  )}
                  {!post.removed && (
                    post.pinned ? (
                      <button onClick={() => { onUnpin(post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <PinOff size={13} /> Unpin Post
                      </button>
                    ) : (
                      <button onClick={() => { onPin(post); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#111827] text-left">
                        <Pin size={13} /> Pin to Top
                      </button>
                    )
                  )}
                  {post.removed ? (
                    <button onClick={() => { onRestore(post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#3B82F6] text-left">
                      <RotateCcw size={13} /> Restore Post
                    </button>
                  ) : (
                    <button onClick={() => { onRemove(post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium hover:bg-[#F9FAFB] text-[#EF4444] text-left">
                      <Trash2 size={13} /> Remove Post
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-[14px] font-bold text-[#111827] mb-2 leading-snug">{post.title}</h3>

        {!post.removed && (
          <p className="text-[12px] text-[#6B7280] leading-relaxed line-clamp-2 mb-3">{post.content}</p>
        )}
        {post.removed && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl mb-3">
            <p className="text-[11px] font-bold text-[#991B1B] mb-1">Post Removed</p>
            <p className="text-[11px] text-[#9CA3AF]">{post.removedReason}</p>
            <p className="text-[10px] text-[#D1D5DB] mt-1">Removed by {post.removedBy} · {post.removedAt ? formatRelative(post.removedAt) : ""}</p>
          </div>
        )}

        {/* Poll preview */}
        {post.type === "poll" && post.pollOptions && (
          <div className="space-y-1.5 mb-3">
            {post.pollOptions.map(opt => {
              const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
              return (
                <div key={opt.id} className="bg-[#F9FAFB] rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#6B7280] font-medium">{opt.text}</span>
                    <span className="text-[#111827] font-bold">{pct}%</span>
                  </div>
                  <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-1 rounded-full bg-[#8B5CF6]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-[#9CA3AF] mt-1">{totalPollVotes.toLocaleString()} total votes</p>
          </div>
        )}

        {/* Admin note */}
        {post.adminNote && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-3">
            <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700">{post.adminNote}</p>
          </div>
        )}

        {/* Reports */}
        {post.reportCount > 0 && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-xl mb-3">
            <ShieldAlert size={12} className="text-[#EF4444] flex-shrink-0" />
            <p className="text-[11px] text-[#EF4444] font-semibold">{post.reportCount} report{post.reportCount > 1 ? "s" : ""} filed</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-[11px] text-[#EF4444] font-semibold hover:underline">
              Review →
            </button>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(t => (
              <span key={t} className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-md font-medium">{t}</span>
            ))}
          </div>
        )}

        {/* Engagement + category row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
            <span className="flex items-center gap-1"><Heart size={11} /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageSquare size={11} /> {post.commentCount}</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {post.views.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Share2 size={11} /> {post.shares}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] bg-[#F9FAFB] px-2 py-0.5 rounded-md">{post.category}</span>
            {post.commentCount > 0 && (
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] px-2.5 py-1 rounded-lg hover:border-[#9CA3AF] transition-all">
                <Eye size={11} />
                {expanded ? "Hide" : `${post.commentCount} Comments`}
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded: Comments + Reports */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-4">
            {/* Reports */}
            {post.reports.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Reports</p>
                <div className="space-y-2">
                  {post.reports.map(r => (
                    <div key={r.id} className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <ShieldAlert size={13} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[#EF4444]">{r.reporterName}</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">{r.reason}</p>
                        <p className="text-[10px] text-[#D1D5DB] mt-0.5">{formatRelative(r.createdAt)}</p>
                      </div>
                      {!r.resolved && (
                        <span className="text-[10px] font-bold bg-red-100 text-[#EF4444] px-2 py-0.5 rounded-full flex-shrink-0">Open</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            {post.comments.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Comments ({post.comments.length})</p>
                <div className="space-y-2">
                  {post.comments.map(comment => (
                    <div key={comment.id} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      comment.removed ? "bg-[#FEF2F2] border-[#FCA5A5]" : "bg-[#F9FAFB] border-[#F3F4F6]"
                    }`}>
                      <Avatar initials={comment.author.initials} color={comment.author.color} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[12px] font-semibold text-[#111827]">{comment.author.name}</span>
                          {comment.flagged && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">Flagged</span>}
                          {comment.removed && <span className="text-[10px] bg-red-50 text-[#EF4444] border border-red-200 px-1.5 py-0.5 rounded-full font-bold">Removed</span>}
                          <span className="text-[10px] text-[#9CA3AF]">{formatRelative(comment.createdAt)}</span>
                        </div>
                        {comment.removed ? (
                          <p className="text-[11px] text-[#9CA3AF] italic">[Comment removed: {comment.removedReason}]</p>
                        ) : (
                          <p className="text-[12px] text-[#374151] leading-relaxed">{comment.content}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1"><Heart size={10} /> {comment.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar for pending posts */}
      {post.status === "pending" && (
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={() => onApprove(post)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-colors">
            <Check size={12} /> Approve
          </button>
          <button onClick={() => onRemove(post)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold text-[#EF4444] border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
            <X size={12} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

//  Main Page 

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [tab, setTab] = useState<PostStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<PostType | "all">("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [moderateTarget, setModerateTarget] = useState<{ post: Post; action: "remove" | "approve" | "restore" } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const stats = [
    { label: "Total Posts",    value: posts.length,                                       icon: MessageSquare, color: "#E8317A", bg: "#FFF0F5" },
    { label: "Promoted",       value: posts.filter(p => p.promoted).length,               icon: Star,          color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Pending Review", value: posts.filter(p => p.status === "pending").length,   icon: Clock,         color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Removed",        value: posts.filter(p => p.removed).length,               icon: Trash2,        color: "#EF4444", bg: "#FEF2F2" },
  ];

  const filtered = useMemo(() => posts.filter(p => {
    if (tab !== "all" && p.status !== tab) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  }), [posts, tab, typeFilter, search]);

  //  Handlers 
  const handlePromote = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, promoted: true, status: "promoted", promotedAt: new Date().toISOString(), promotedBy: "Super Admin" } : p));
    showFeedback("Post promoted ✓");
  };
  const handleDemote = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, promoted: false, status: "active", promotedAt: undefined } : p));
    showFeedback("Promotion removed");
  };
  const handlePin = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned: true } : p));
    showFeedback("Post pinned ✓");
  };
  const handleUnpin = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned: false } : p));
    showFeedback("Post unpinned");
  };
  const handleApprove = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: "active" } : p));
    showFeedback("Post approved and published ✓");
  };
  const handleRemove = (post: Post, reason?: string) => {
    setPosts(prev => prev.map(p => p.id === post.id
      ? { ...p, removed: true, status: "removed", removedReason: reason, removedAt: new Date().toISOString(), removedBy: "Super Admin" }
      : p));
    setModerateTarget(null);
    showFeedback("Post removed");
  };
  const handleRestore = (post: Post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, removed: false, status: "active", removedAt: undefined, removedReason: undefined } : p));
    setModerateTarget(null);
    showFeedback("Post restored ✓");
  };
  const handleCreate = (partial: Partial<Post>) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      type: partial.type ?? "discussion",
      status: partial.promoted ? "promoted" : "active",
      title: partial.title ?? "",
      content: partial.content ?? "",
      author: { id: "admin", name: "Super Admin", initials: "SA", color: "#E8317A", role: "admin", verified: true },
      category: partial.category ?? "General",
      tags: partial.tags ?? [],
      likes: 0, isLiked: false, views: 0, commentCount: 0, comments: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      promoted: partial.promoted ?? false,
      pinned: partial.pinned ?? false,
      removed: false, shares: 0, bookmarks: 0, isBookmarked: false, reportCount: 0, reports: [],
      pollOptions: partial.pollOptions,
    };
    setPosts(prev => [newPost, ...prev]);
    setShowCreate(false);
    showFeedback("Post published ✓");
  };

  const typeOptions: { value: PostType | "all"; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "discussion", label: "Discussions" },
    { value: "argument", label: "Arguments" },
    { value: "poll", label: "Polls" },
    { value: "announcement", label: "Announcements" },
    { value: "case_study", label: "Case Studies" },
  ];

  return (
    <>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {moderateTarget && (
        <ModerateModal
          post={moderateTarget.post}
          action={moderateTarget.action}
          onClose={() => setModerateTarget(null)}
          onSubmit={reason => {
            if (moderateTarget.action === "remove") handleRemove(moderateTarget.post, reason);
            else if (moderateTarget.action === "restore") handleRestore(moderateTarget.post);
            else handleApprove(moderateTarget.post);
          }}
        />
      )}

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-[13px] font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-up">
          <Check size={14} className="text-[#10B981]" /> {feedback}
        </div>
      )}

      <div className="p-6 xl:p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Community"
          subtitle="Moderate posts, manage discussions, and shape community standards."
          action={
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#E8317A] hover:bg-[#d01f68] transition-colors">
              <Plus size={13} /> Create Post
            </button>
          }
        />

        <StatBar items={stats} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts, authors, tags…"
              className="w-full h-9 pl-9 pr-4 rounded-xl border-[1.5px] border-[#E5E7EB] text-[13px] text-[#111827] outline-none focus:border-[#E8317A] placeholder:text-[#D1D5DB] transition-colors"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-1">
            {(["all", "active", "promoted", "pending", "removed"] as const).map(s => {
              const count = s === "all" ? posts.length : posts.filter(p => p.status === s).length;
              return (
                <button key={s} onClick={() => setTab(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                    tab === s ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
                  }`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    tab === s ? "bg-[#E8317A] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as PostType | "all")}
            className="h-9 px-3 rounded-xl border-[1.5px] border-[#E5E7EB] text-[12px] text-[#6B7280] bg-white outline-none focus:border-[#E8317A] transition-colors ml-auto"
          >
            {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Post list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-16 text-center">
            <MessageSquare size={36} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#9CA3AF] mb-1">No posts found</p>
            <p className="text-[12px] text-[#D1D5DB]">Try adjusting your filters or create a new post.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPromote={handlePromote}
                onDemote={handleDemote}
                onPin={handlePin}
                onUnpin={handleUnpin}
                onApprove={p => setModerateTarget({ post: p, action: "approve" })}
                onRemove={p => setModerateTarget({ post: p, action: "remove" })}
                onRestore={p => setModerateTarget({ post: p, action: "restore" })}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 text-[12px] text-[#9CA3AF]">
          <span>Showing {filtered.length} of {posts.length} posts</span>
        </div>
      </div>
    </>
  );
}