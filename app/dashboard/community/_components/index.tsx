// components/community/CreatePostModal.tsx
"use client";
import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, XCircle, Hash, Send, AlertCircle } from "lucide-react";
import { useCreateCommunityPostMutation } from "@/redux/slices/community.slice";;
import { CommunityRoomType, ReferenceProp, ReferenceType } from "@/redux/types/community";
import ReferenceSelector from "./ReferenceSelector";
import { generateSlug } from "@/utils/function";
import ThumbnailUpload, { UploadedImage } from "@/app/components/ui/fileUploader";

const rooms: { id: CommunityRoomType; name: string; description: string; icon: string }[] = [
  { id: "general", name: "General Discussion", description: "General legal discussions", icon: "💬" },
  { id: "legal-advice", name: "Legal Advice", description: "Seek legal advice from professionals", icon: "⚖️" },
  { id: "case-study", name: "Case Studies", description: "Share and discuss legal cases", icon: "📋" },
  { id: "law-students", name: "Law Students", description: "For law students and aspiring lawyers", icon: "📚" },
  { id: "lawyers-lounge", name: "Lawyers Lounge", description: "Professional discussions for lawyers", icon: "👔" },
  { id: "ask-lawyer", name: "Ask a Lawyer", description: "Direct questions to verified lawyers", icon: "🎓" },
];

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialRoom?: CommunityRoomType;
  initialReference?: {
    type: ReferenceType;
    id: string;
    title: string;
    moduleId?: string;
    moduleTitle?: string;
    topicId?: string;
    topicTitle?: string;
  };
}

export default function CreatePostModal({
  onClose,
  onSuccess,
  initialRoom = "general",
  initialReference
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [room, setRoom] = useState<CommunityRoomType>(initialRoom);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [reference, setReference] = useState<ReferenceProp | null>(initialReference || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPost] = useCreateCommunityPostMutation();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

 

  const validateForm = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return false;
    }
    if (title.length < 10) {
      setError("Title must be at least 10 characters");
      return false;
    }
    if (!content.trim()) {
      setError("Please enter content");
      return false;
    }
    if (content.length < 20) {
      setError("Content must be at least 20 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      title,
      content,
      room,
      tags,
      ...(reference && {
        reference: {
          type: reference.type,
          id: reference.id,
          title: reference.title,
          ...(reference.moduleId && { moduleId: reference.moduleId }),
          ...(reference.moduleTitle && { moduleTitle: reference.moduleTitle }),
          ...(reference.topicId && { topicId: reference.topicId }),
          ...(reference.topicTitle && { topicTitle: reference.topicTitle }),
        },
      }),
      images: images.map((e: UploadedImage) => e.base64),
    };
    try {
      await createPost(payload as any).unwrap();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to create post:", err);
      setError(err?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedReferencePreview = () => {
    if (!reference) return null;

    let path = "";
    if (reference.type === 'module') {
      path = `/dashboard/learn/${generateSlug(reference.moduleTitle)}`;
    } else if (reference.type === 'topic') {
      path = `/dashboard/learn/${generateSlug(reference.moduleTitle)}/${generateSlug(reference.topicTitle)}`;
    } else {
      path = `/dashboard/learn/${generateSlug(reference.moduleTitle)}/${generateSlug(reference.topicTitle)}/${reference.id}`;
    }

    return (
      <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs">
        <span className="text-gray-500">Will link to:</span>
        <a href={path} target="_blank" className="text-maroon-500 ml-2 hover:underline">
          {reference.type}: {reference.title}
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Start a Discussion</h2>
            <p className="text-xs text-gray-500 mt-0.5">Share your legal questions or insights with the community</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoom(r.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${room === r.id
                    ? "border-maroon-500 bg-maroon-500/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* <span className="text-lg">{r.icon}</span> */}
                    <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-2">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Reference Selector */}
          <ReferenceSelector value={reference} onChange={setReference} />
          {getSelectedReferencePreview()}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="What's your question or discussion about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon-500"
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {title.length}/200
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your situation or discussion in detail. Include relevant facts, your question, and what kind of help you're looking for..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon-500 resize-none"
              maxLength={5000}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {content.length}/5000
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  <Hash size={10} />
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g., landlord-tenant, employment, human-rights (max 5 tags)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-maroon-500"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Add up to 5 tags to help others find your post
            </p>
          </div>

          {/* Image Upload */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach Images (Optional)
            </label>
            <ThumbnailUpload preview images={images} title=" " setImages={setImages} maxImages={3}>
              <div className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
              >
                <ImageIcon size={14} /> Add image
              </div>
            </ThumbnailUpload>
            <p className="text-[10px] text-gray-400">
              Upload up to 3 images (JPG, PNG, GIF). Max 5MB each.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-gradient-to-r from-maroon-500 to-maroon-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send size={14} />
                Post Discussion
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}