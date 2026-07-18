"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ChevronRight, Check, Loader2, FileText, Award,
  ChevronLeft, Bookmark, Share2, List, 
  Zap, Menu, X, 
  Calendar, MessageCircle, Heart,
  Flag, Link as LinkIcon,
  Send, Clock, Users, 
  Trash2, Move
} from "lucide-react";
import {
  useGetLearnModuleBySlugQuery,
  useGetLearnTopicBySlugQuery,
  useMarkTopicCompleteMutation,
  useToggleLikeSubtopicMutation,
  useToggleCompleteSubtopicMutation,
  useGetSubtopicStateQuery,
  useCreateBookmarkMutation,
  useListBookmarksForSubtopicQuery,
  useDeleteBookmarkMutation,
} from "@/redux/slices/learn.slice";
import AskQuestionButton from "@/app/dashboard/community/_components/AskQuestionButton";
import { Bookmark as BookmarkType } from "@/redux/slices/learn.slice";
import ReadAloudButton from "@/app/components/ui/ReadAloudButton";

// ============================================
// TYPES
// ============================================

interface Subtopic {
  _id: string;
  title: string;
  notes: string;
  duration: string;
  durationSeconds: number;
  order: number;
  completed: boolean;
  completedBy: number;
  resources?: { name: string; url: string }[];
  likesCount?: number;
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

// ============================================
// BOOKMARK COMPONENTS
// ============================================

interface BookmarkHighlightProps {
  bookmark: BookmarkType;
  onHover: (bookmark: BookmarkType | null) => void;
  onClick: (bookmark: BookmarkType) => void;
  children: React.ReactNode;
}

const BookmarkHighlight: React.FC<BookmarkHighlightProps> = ({
  bookmark,
  onHover,
  onClick,
  children
}) => {
  return (
    <span
      className="bookmark-highlight cursor-pointer relative"
      style={{
        backgroundColor: 'rgba(232, 49, 122, 0.15)',
        borderBottom: '2px solid #E8317A',
        padding: '2px 0',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={() => onHover(bookmark)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(bookmark)}
      data-bookmark-id={bookmark.id}
    >
      {children}
    </span>
  );
};

interface BookmarkTooltipProps {
  bookmark: BookmarkType | null;
  position: { x: number; y: number };
}

const BookmarkTooltip: React.FC<BookmarkTooltipProps> = ({ bookmark, position }) => {
  if (!bookmark) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm pointer-events-none"
      style={{
        left: position.x,
        top: position.y + 8,
        transform: 'translateX(-50%)',
        minWidth: '200px',
        maxWidth: '300px'
      }}
    >
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
        <Calendar size={12} />
        {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      {bookmark.comment && (
        <p className="text-sm text-gray-700 font-medium">{bookmark.comment}</p>
      )}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 italic">"{bookmark.highlightedText}"</p>
      </div>
    </div>
  );
};

interface BookmarkSelectionPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onSave: (comment: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const BookmarkSelectionPopup: React.FC<BookmarkSelectionPopupProps> = ({
  selectedText,
  position,
  onSave,
  onCancel,
  isSaving
}) => {
  const [comment, setComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translateX(-50%) translateY(-100%)',
        width: '320px',
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Selected Text</p>
        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg max-h-16 overflow-y-auto">
          "{selectedText}"
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Add a Note (Optional)</p>
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What do you want to remember about this text?"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8317A] resize-none"
          rows={3}
          disabled={isSaving}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(comment)}
          className="px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #E8317A, #ff6fa8)' }}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Bookmark'
          )}
        </button>
      </div>
    </div>
  );
};

interface BookmarkListProps {
  bookmarks: BookmarkType[];
  onDelete: (id: string) => void;
  onJump: (bookmark: BookmarkType) => void;
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  onDelete,
  onJump,
  isOpen,
  onClose,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />

      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-0 lg:w-80
        flex flex-col
      `}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Bookmark size={18} className="text-[#E8317A]" />
            Bookmarks ({bookmarks.length})
          </h3>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No bookmarks yet</p>
              <p className="text-xs text-gray-400 mt-1">Highlight text in the article to save it</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-all group"
              >
                <p className="text-sm text-gray-800 font-medium line-clamp-2">
                  "{bookmark.highlightedText}"
                </p>
                {bookmark.comment && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {bookmark.comment}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onJump(bookmark)}
                      className="p-1.5 text-gray-400 hover:text-[#E8317A] transition-colors rounded-lg hover:bg-[#E8317A]/10"
                      title="Jump to bookmark"
                    >
                      <Move size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(bookmark.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete bookmark"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// SUBTOPIC NAV ITEM COMPONENT
// ============================================

const SubtopicNavItem = ({
  subtopic,
  index,
  isActive,
  isCompleted,
  onClick
}: {
  subtopic: Subtopic;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${isActive
        ? "bg-gradient-to-r from-[#E8317A]/10 to-transparent border-l-4 border-[#E8317A]"
        : "hover:bg-gray-50"
        }`}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={12} className="text-green-600" />
          </div>
        ) : isActive ? (
          <div className="w-6 h-6 rounded-full bg-[#E8317A]/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#E8317A]" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] font-medium text-gray-500">{index + 1}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          {subtopic.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock size={10} /> {subtopic.duration}
          </span>
          {subtopic.completedBy > 0 && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Users size={10} /> {subtopic.completedBy} completed
            </span>
          )}
        </div>
      </div>

      {isActive && (
        <ChevronRight size={14} className="text-[#E8317A] flex-shrink-0" />
      )}
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SubtopicContentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const topicSlug = params?.topicSlug as string;
  const subtopicId = params?.subtopicId as string;

  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [saved, setSaved] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [topicProgress, setTopicProgress] = useState<{
    totalSubtopics: number;
    completedSubtopics: number;
    progressPercent: number;
    completedSubtopicIds: string[];
  }>({
    totalSubtopics: 0,
    completedSubtopics: 0,
    progressPercent: 0,
    completedSubtopicIds: [],
  });

  // Bookmark state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [showBookmarkList, setShowBookmarkList] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [hoveredBookmark, setHoveredBookmark] = useState<BookmarkType | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isBookmarkAction, setIsBookmarkAction] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState<React.ReactNode[]>([]);

  const pageUrl = usePathname()

  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // Fetch module and topic data
  const { data: moduleData, isLoading: moduleLoading } = useGetLearnModuleBySlugQuery(slug, {
    skip: !slug,
  });

  const { data: topicData, isLoading: topicLoading, refetch: refetchTopic } = useGetLearnTopicBySlugQuery(
    { moduleSlug: slug, topicSlug: topicSlug },
    { skip: !slug || !topicSlug }
  );

  const [markTopicComplete] = useMarkTopicCompleteMutation();

  // Subtopic interaction hooks
  const [toggleLike] = useToggleLikeSubtopicMutation();
  const [toggleComplete] = useToggleCompleteSubtopicMutation();

  // Bookmark hooks
  const [createBookmark, { isLoading: isCreatingBookmark }] = useCreateBookmarkMutation();
  const [deleteBookmark, { isLoading: isDeletingBookmark }] = useDeleteBookmarkMutation();

  // Fetch bookmarks for current subtopic
  const {
    data: bookmarksData,
    isLoading: bookmarksLoading,
    refetch: refetchBookmarks
  } = useListBookmarksForSubtopicQuery(subtopicId, {
    skip: !subtopicId,
  });

  // Fetch comprehensive subtopic state
  const {
    data: subtopicStateData,
    isLoading: subtopicStateLoading,
    refetch: refetchSubtopicState
  } = useGetSubtopicStateQuery(subtopicId, {
    skip: !subtopicId,
  });

  const module = moduleData?.data;
  const topic = topicData?.data;
  const topics = module?.topics || [];

  // Process subtopic state data
  useEffect(() => {
    if (subtopicStateData?.data) {
      const state = subtopicStateData.data;

      // Update current subtopic state
      setLiked(state.currentSubtopic.liked);
      setLikesCount(state.currentSubtopic.likesCount);

      // Update topic progress
      setTopicProgress({
        totalSubtopics: state.topic.totalSubtopics,
        completedSubtopics: state.topic.completedSubtopics,
        progressPercent: state.topic.progressPercent,
        completedSubtopicIds: state.topic.completedSubtopicIds,
      });

      // Update completed subtopics set
      const completedIds = new Set(state.topic.completedSubtopicIds);
      setCompletedSubtopics(completedIds);

      // Update subtopics list with completion status
      if (state.topic.subtopics && state.topic.subtopics.length > 0) {
        const updatedSubtopics = state.topic.subtopics.map((st: any) => ({
          _id: st.id,
          title: st.title,
          notes: st.notes || "",
          duration: st.duration,
          durationSeconds: st.durationSeconds ?? 0,
          order: st.order,
          completed: st.completed,
          completedBy: st.completedBy || 0,
        }));

        // Only update if we have subtopics from the API
        if (updatedSubtopics.length > 0) {
          setSubtopics(updatedSubtopics);

          // Set active subtopic if not already set
          if (!activeSubtopic) {
            const current = updatedSubtopics.find((st: any) => st._id === subtopicId);
            if (current) {
              setActiveSubtopic(current);
            } else if (updatedSubtopics.length > 0) {
              setActiveSubtopic(updatedSubtopics[0]);
            }
          }
        }
      }
    }
  }, [subtopicStateData, subtopicId, activeSubtopic]);

  // Initialize subtopics from fetched data (fallback)
  useEffect(() => {
    if (topic?.subtopics && subtopics.length === 0) {
      const formattedSubtopics = topic.subtopics.map((st: any) => ({
        ...st,
        completed: completedSubtopics.has(st._id)
      }));
      setSubtopics(formattedSubtopics);

      if (subtopicId) {
        const found = formattedSubtopics.find((st: any) => st._id === subtopicId);
        if (found) setActiveSubtopic(found);
      } else if (formattedSubtopics.length > 0) {
        setActiveSubtopic(formattedSubtopics[0]);
      }
    }
  }, [topic, subtopicId, completedSubtopics, subtopics.length]);

  // Load bookmarks from API
  useEffect(() => {
    if (bookmarksData?.data) {
      setBookmarks(bookmarksData.data);
    }
  }, [bookmarksData]);

  // Process content with highlights
  useEffect(() => {
    if (!activeSubtopic?.notes) {
      setHighlightedContent([]);
      return;
    }

    const content = activeSubtopic.notes;

    if (bookmarks.length === 0) {
      setHighlightedContent([content]);
      return;
    }

    const sortedBookmarks = [...bookmarks].sort((a, b) => (b.startOffset || 0) - (a.startOffset || 0));

    let segments: React.ReactNode[] = [];
    let lastEnd = content.length;

    for (const bookmark of sortedBookmarks) {
      const start = bookmark.startOffset || 0;
      const end = bookmark.endOffset || 0;

      if (start < 0 || end > content.length || start >= end) {
        continue;
      }

      if (end < lastEnd) {
        segments.unshift(content.substring(end, lastEnd));
      }

      segments.unshift(
        <BookmarkHighlight
          key={bookmark.id}
          bookmark={bookmark}
          onHover={(b) => {
            if (b) {
              const rect = (document.querySelector(`[data-bookmark-id="${b.id}"]`) as HTMLElement)?.getBoundingClientRect();
              if (rect) {
                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.bottom });
              }
              setHoveredBookmark(b);
            } else {
              setHoveredBookmark(null);
            }
          }}
          onClick={(b) => handleJumpToBookmark(b)}
        >
          {content.substring(start, end)}
        </BookmarkHighlight>
      );

      lastEnd = start;
    }

    if (lastEnd > 0) {
      segments.unshift(content.substring(0, lastEnd));
    }

    setHighlightedContent(segments);
  }, [activeSubtopic?.notes, bookmarks]);

  const currentIndex = topics.findIndex((t: any) => t.slug === topicSlug);
  const prevTopic = topics[currentIndex - 1];
  const nextTopic = topics[currentIndex + 1];
  const completedCount = topics.filter((t: any) => t.completed).length;
  const moduleProgressPercent = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  // Use topic progress from API response
  const subtopicProgress = topicProgress.progressPercent || 0;

  // ============================================
  // BOOKMARK FUNCTIONS
  // ============================================

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowSelectionPopup(false);
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setShowSelectionPopup(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const articleElement = articleRef.current;
    if (!articleElement || !articleElement.contains(range.commonAncestorContainer)) {
      setShowSelectionPopup(false);
      return;
    }

    const ancestor = range.commonAncestorContainer;
    const parentElement = ancestor.nodeType === Node.ELEMENT_NODE
      ? ancestor as Element
      : (ancestor as Node).parentElement;

    if (parentElement?.closest('.bookmark-highlight')) {
      setShowSelectionPopup(false);
      return;
    }

    const container = articleElement;
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    let startPosition = 0;
    let endPosition = 0;

    const textContent = container.textContent || '';
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null as any
    );

    let currentOffset = 0;
    let node = walker.nextNode();
    let startNodeFound = false;
    let endNodeFound = false;

    while (node) {
      const nodeText = node.textContent || '';
      const nodeLength = nodeText.length;

      if (node === startContainer) {
        startPosition = currentOffset + startOffset;
        startNodeFound = true;
      }

      if (node === endContainer) {
        endPosition = currentOffset + endOffset;
        endNodeFound = true;
      }

      if (startNodeFound && endNodeFound) {
        break;
      }

      currentOffset += nodeLength;
      node = walker.nextNode();
    }

    if (!startNodeFound || !endNodeFound) {
      const text = selection.toString();
      const content = container.textContent || '';
      const index = content.indexOf(text);
      if (index !== -1) {
        startPosition = index;
        endPosition = index + text.length;
      } else {
        setShowSelectionPopup(false);
        return;
      }
    }

    const rect = range.getBoundingClientRect();
    setSelectedText(selectedText);
    setSelectionPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setShowSelectionPopup(true);

    (window as any).__bookmarkSelectionInfo = {
      startOffset: startPosition,
      endOffset: endPosition,
      text: selectedText
    };

    selection.removeAllRanges();
  }, []);

  const handleSaveBookmark = async (comment: string) => {
    if (!selectedText || !subtopicId || !activeSubtopic) return;

    const selectionInfo = (window as any).__bookmarkSelectionInfo;
    if (!selectionInfo) {
      const content = activeSubtopic.notes || '';
      const index = content.indexOf(selectedText);
      if (index === -1) {
        console.error('Could not locate selected text in content');
        return;
      }
      (window as any).__bookmarkSelectionInfo = {
        startOffset: index,
        endOffset: index + selectedText.length,
        text: selectedText
      };
    }

    const info = (window as any).__bookmarkSelectionInfo;
 

    try {
      const result = await createBookmark({
        subtopicId,
        data: {
          highlightedText: selectedText,
          comment: comment.trim() || '',
          url: pageUrl,
          startOffset: info.startOffset,
          endOffset: info.endOffset,
        }
      }).unwrap();

      if (result.data) {
        setBookmarks(prev => [...prev, result.data]);
        setShowSelectionPopup(false);
        setShowBookmarkList(true);
        refetchBookmarks();
      }
    } catch (error) {
      console.error('Failed to create bookmark:', error);
    }

    delete (window as any).__bookmarkSelectionInfo;
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id).unwrap();
      setBookmarks(prev => prev.filter(b => b.id !== id));
      refetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  const handleJumpToBookmark = (bookmark: BookmarkType) => {
    const elements = document.querySelectorAll('.bookmark-highlight');
    for (const el of elements) {
      if (el.getAttribute('data-bookmark-id') === bookmark.id) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const originalStyle = el.getAttribute('style') || '';
        el.setAttribute('style',
          'background-color: rgba(232, 49, 122, 0.3); border-bottom: 3px solid #E8317A; padding: 2px 0; cursor: pointer; transition: background-color 0.5s;'
        );
        setTimeout(() => {
          el.setAttribute('style', originalStyle ||
            'background-color: rgba(232, 49, 122, 0.15); border-bottom: 2px solid #E8317A; padding: 2px 0; cursor: pointer; transition: background-color 0.2s;'
          );
        }, 1000);
        break;
      }
    }
  };

  // ============================================
  // SUBTOPIC INTERACTION FUNCTIONS
  // ============================================

  const handleLikeToggle = async () => {
    if (!subtopicId) return;

    try {
      const result = await toggleLike(subtopicId).unwrap();
      if (result.data) {
        setLiked(result.data.liked);
        setLikesCount(result.data.likesCount);
        refetchSubtopicState(); // Refresh state to get updated counts
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubtopicComplete = async (subtopic: Subtopic) => {
    if (completedSubtopics.has(subtopic._id)) return;

    try {
      const result = await toggleComplete(subtopic._id).unwrap();
      if (result.data) {
        // Update local state
        setCompletedSubtopics(prev => new Set([...prev, subtopic._id]));
        setSubtopics(prev => prev.map(st =>
          st._id === subtopic._id ? { ...st, completed: result.data.completed } : st
        ));
        // Refresh state to get updated progress
        refetchSubtopicState();
      }
    } catch (error) {
      console.error('Failed to toggle complete:', error);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (isBookmarkAction) return;
      setTimeout(() => handleTextSelection(), 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('.bookmark-highlight')) {
        setIsBookmarkAction(true);
      } else {
        setIsBookmarkAction(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleTextSelection, isBookmarkAction]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSelectionPopup(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);


  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  const handleTopicComplete = async () => {
    if (!module || !topic) return;

    try {
      await markTopicComplete({
        moduleId: module._id,
        topicId: topic._id,
      }).unwrap();

      refetchTopic();

      if (nextTopic) {
        router.push(`/dashboard/learn/${slug}/${nextTopic.slug}`);
      }
    } catch (error) {
      console.error("Failed to mark topic complete:", error);
    }
  };

  const navigateToSubtopic = (subtopic: Subtopic) => {
    setActiveSubtopic(subtopic);
    router.push(`/dashboard/learn/${slug}/${topicSlug}/${subtopic._id}`, { scroll: false });

    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const allSubtopicsCompleted = completedSubtopics.size === subtopics.length && subtopics.length > 0;

  if (moduleLoading || topicLoading || subtopicStateLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8317A]" />
      </div>
    );
  }

  if (!module || !topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">Content not found</p>
        <Link href={`/dashboard/learn/${slug}`} className="text-[#E8317A] font-semibold">
          Back to Module
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto">
            <Link href="/dashboard/learn" className="hover:text-gray-900 whitespace-nowrap">Learn</Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href={`/dashboard/learn/${slug}`} className="hover:text-gray-900 truncate max-w-[120px] md:max-w-[200px] whitespace-nowrap">
              {module.title}
            </Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href={`/dashboard/learn/${slug}/${topicSlug}`} className="hover:text-gray-900 truncate max-w-[100px] md:max-w-[150px] whitespace-nowrap">
              {topic.title}
            </Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-[120px] whitespace-nowrap">
              {activeSubtopic?.title || "Reading"}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookmarkList(!showBookmarkList)}
              className="w-8 h-8 rounded-full bg-[#E8317A]/10 flex items-center justify-center hover:bg-[#E8317A]/20 transition-colors relative"
            >
              <Bookmark size={14} className="text-[#E8317A]" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8317A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>

    
            <div className="relative">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Share2 size={14} className="text-gray-600" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                  <button onClick={copyLink} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LinkIcon size={14} /> Copy Link
                  </button>
                </div>
              )}
            </div>

            {/* <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN - Main Content */}
          <div className={`flex-1 ${sidebarOpen ? 'lg:pr-4' : ''}`}>
            <div ref={contentRef}>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Section {activeSubtopic?.order || 1} of {subtopics.length}
                        </span>
                        {completedSubtopics.has(activeSubtopic?._id || "") && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {activeSubtopic?.title || "Loading..."}
                      </h1>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {activeSubtopic?.duration || "0:00"} read
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {activeSubtopic?.completedBy || 0} completed
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${liked
                          ? "bg-[#E8317A]/10 text-[#E8317A]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <Heart size={14} className={liked ? "fill-[#E8317A]" : ""} />
                        <span>{likesCount}</span>
                      </button>
                        
                        <ReadAloudButton
                                      text={`
                                          ${activeSubtopic?.title || " "}.
                                          ${activeSubtopic?.notes || " "}.
                                      `}
                                    />

                      {!completedSubtopics.has(activeSubtopic?._id || "") && (
                        <button
                          onClick={() => activeSubtopic && handleSubtopicComplete(activeSubtopic)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                        >
                          <Check size={14} /> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="prose prose-lg max-w-none">
                    <div
                      ref={articleRef}
                      className="whitespace-pre-wrap text-gray-700 leading-relaxed select-text"
                      style={{ userSelect: 'text' }}
                    >
                      {activeSubtopic?.notes ? (
                        <>{highlightedContent}</>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <FileText size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No content available for this section.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {activeSubtopic?.resources && activeSubtopic.resources.length > 0 && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <FileText size={14} className="text-blue-600" />
                        Additional Resources
                      </h3>
                      <div className="space-y-2">
                        {activeSubtopic.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <LinkIcon size={12} /> {resource.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      {subtopics.findIndex(s => s._id === activeSubtopic?._id) > 0 && (
                        <button
                          onClick={() => {
                            const currentIdx = subtopics.findIndex(s => s._id === activeSubtopic?._id);
                            navigateToSubtopic(subtopics[currentIdx - 1]);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#E8317A] transition-colors"
                        >
                          <ChevronLeft size={16} /> Previous Section
                        </button>
                      )}
                    </div>

                    <div>
                      {subtopics.findIndex(s => s._id === activeSubtopic?._id) < subtopics.length - 1 && (
                        <button
                          onClick={() => {
                            const currentIdx = subtopics.findIndex(s => s._id === activeSubtopic?._id);
                            navigateToSubtopic(subtopics[currentIdx + 1]);
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-[#E8317A] transition-colors"
                        >
                          Next Section <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {allSubtopicsCompleted && !topic.completed && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Award size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Congratulations!</h3>
                        <p className="text-sm text-gray-600">You've completed all sections in this lesson.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleTopicComplete}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #E8317A, #ff6fa8)" }}
                    >
                      Complete Lesson & Continue
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${liked
                          ? "bg-[#E8317A]/10 text-[#E8317A]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <Heart size={16} className={liked ? "fill-[#E8317A]" : ""} />
                        Like ({likesCount})
                      </button>

                      <button
                        onClick={() => setShowDiscussion(!showDiscussion)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <MessageCircle size={16} />
                        Discussion ({comments.length})
                      </button>

                      <AskQuestionButton
                        referenceType="subtopic"
                        referenceId={subtopicId}
                        referenceTitle={activeSubtopic?.title}
                        moduleTitle={module.title}
                        topicTitle={topic.title}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                        <Flag size={12} /> Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                {prevTopic && (
                  <Link
                    href={`/dashboard/learn/${slug}/${prevTopic.slug}`}
                    className="flex-1 flex items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all group"
                  >
                    <ChevronLeft size={16} className="text-gray-400 group-hover:text-gray-600" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Previous Lesson</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{prevTopic.title}</p>
                    </div>
                  </Link>
                )}

                {nextTopic && (
                  <Link
                    href={`/dashboard/learn/${slug}/${nextTopic.slug}`}
                    className={`flex-1 flex items-center justify-end gap-2 p-4 rounded-xl transition-all group ${allSubtopicsCompleted
                      ? "bg-gradient-to-r from-[#E8317A]/10 to-[#ff6fa8]/10 border border-[#E8317A]/20"
                      : "bg-white border border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Next Lesson</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{nextTopic.title}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Subtopics Navigation */}
          {sidebarOpen && (
            <div className="lg:w-80 flex-shrink-0 sticky top-28">
              <div className="sticky top-28 space-y-5">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Lesson Progress</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-[#E8317A]">
                        {topicProgress.progressPercent}%
                      </div>
                      <p className="text-xs text-gray-500">
                        {topicProgress.completedSubtopics} of {topicProgress.totalSubtopics} sections completed
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${topicProgress.progressPercent}%`,
                          background: "linear-gradient(90deg, #E8317A, #ff6fa8)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <List size={14} className="text-[#E8317A]" />
                      Lesson Sections
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {subtopics.map((subtopic, idx) => (
                      <SubtopicNavItem
                        key={subtopic._id}
                        subtopic={subtopic}
                        index={idx}
                        isActive={activeSubtopic?._id === subtopic._id}
                        isCompleted={completedSubtopics.has(subtopic._id)}
                        onClick={() => navigateToSubtopic(subtopic)}
                      />
                    ))}
                  </div>
                </div>

                <BookmarkList
                  bookmarks={bookmarks}
                  onDelete={handleDeleteBookmark}
                  onJump={handleJumpToBookmark}
                  isOpen={showBookmarkList}
                  onClose={() => setShowBookmarkList(false)}
                  isDeleting={isDeletingBookmark}
                />

                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] text-white hover:shadow-lg transition-all"
                >
                  <MessageCircle size={18} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">Ask AI Assistant</p>
                    <p className="text-[10px] opacity-80">Get help understanding this topic</p>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* BOOKMARK FEATURE COMPONENTS */}
      {/* ============================================ */}

      {showSelectionPopup && (
        <BookmarkSelectionPopup
          selectedText={selectedText}
          position={selectionPosition}
          onSave={handleSaveBookmark}
          onCancel={() => setShowSelectionPopup(false)}
          isSaving={isCreatingBookmark}
        />
      )}

      {hoveredBookmark && (
        <BookmarkTooltip
          bookmark={hoveredBookmark}
          position={tooltipPosition}
        />
      )}


      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E8317A] to-[#ff6fa8] flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Learning Assistant</h3>
            </div>
            <button onClick={() => setShowAIChat(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600">Hi! I can help explain concepts in this lesson. What would you like to know?</p>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8317A]"
              />
              <button className="px-3 py-2 bg-[#E8317A] text-white rounded-lg">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}