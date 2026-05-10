import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

//  Types 

export type PostType = "discussion" | "argument" | "poll" | "announcement" | "case_study";
export type PostStatus = "active" | "promoted" | "pending" | "removed";
export type UserRole = "citizen" | "lawyer" | "admin";
export type ReactionType = "like" | "insightful" | "helpful";

export interface Author {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: UserRole;
  verified: boolean;
  state?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Reaction {
  userId: string;
  type: ReactionType;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  likes: number;
  isLiked: boolean;
  reactions: Reaction[];
  createdAt: string;
  flagged: boolean;
  flagReason?: string;
  removed: boolean;
  removedReason?: string;
  removedAt?: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  title: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  views: number;
  commentCount: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  // Admin controls
  promoted: boolean;
  promotedAt?: string;
  promotedBy?: string;
  pinned: boolean;
  pinnedAt?: string;
  pinnedBy?: string;
  removed: boolean;
  removedAt?: string;
  removedReason?: string;
  removedBy?: string;
  adminNote?: string;
  // Poll specific
  pollOptions?: PollOption[];
  pollEndsAt?: string;
  userVotedOption?: string;
  allowMultipleVotes?: boolean;
  // Engagement
  shares: number;
  bookmarks: number;
  isBookmarked: boolean;
  reportCount: number;
  reports: PostReport[];
}

export interface PostReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
}

export interface CreatePostPayload {
  type: PostType;
  title: string;
  content: string;
  category: string;
  tags: string[];
  pollOptions?: string[];
  pollEndsAt?: string;
  pinned?: boolean;
  promoted?: boolean;
}

export interface CommunityFilters {
  type: PostType | "all";
  status: PostStatus | "all";
  category: string;
  search: string;
  sortBy: "latest" | "popular" | "trending" | "most_commented";
}

export interface CommunityStats {
  totalPosts: number;
  activePosts: number;
  promotedPosts: number;
  pendingPosts: number;
  removedPosts: number;
  totalMembers: number;
  postsToday: number;
  commentsToday: number;
  flaggedContent: number;
}

export interface CommunityState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  filters: CommunityFilters;
  stats: CommunityStats;
  activeModal: "create" | "view" | "moderate" | null;
  createPostStep: 1 | 2;
}

//  Mock Initial Data 

const MOCK_AUTHORS: Author[] = [
  { id: "u001", name: "Chidinma Okafor",    initials: "CO", color: "#3B82F6", role: "citizen",  verified: false, state: "Enugu" },
  { id: "u002", name: "Babatunde Lawal",    initials: "BL", color: "#10B981", role: "citizen",  verified: false, state: "Lagos" },
  { id: "u003", name: "Adaeze Okonkwo",     initials: "AO", color: "#1E3A5F", role: "lawyer",   verified: true,  state: "Lagos" },
  { id: "u004", name: "Emeka Nwosu",        initials: "EN", color: "#1A3B2E", role: "lawyer",   verified: true,  state: "Abuja" },
  { id: "u005", name: "Amina Garba",        initials: "AG", color: "#8B5CF6", role: "citizen",  verified: false, state: "Kano"  },
  { id: "u006", name: "Ikechukwu Eze",      initials: "IE", color: "#F59E0B", role: "citizen",  verified: false, state: "Rivers"},
  { id: "u007", name: "Super Admin",        initials: "SA", color: "#E8317A", role: "admin",    verified: true              },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "p001",
    type: "discussion",
    status: "promoted",
    title: "What exactly happens if police detain you beyond 24 hours without charge?",
    content: "I was detained for almost 36 hours last month without any charge being filed. The officers kept saying they were 'investigating'. I was finally released but I want to understand,  was that lawful? What are my remedies?\n\nFrom what I've read in the module, Section 35(4) of the Constitution limits detention to 24 hours for bailable offences, or 48 hours if a court of competent jurisdiction makes an order. But nobody told me about any court order.",
    author: MOCK_AUTHORS[0],
    category: "Police Rights",
    tags: ["Section 35", "Detention", "Arrest Rights", "Police"],
    likes: 47,
    isLiked: false,
    views: 1243,
    commentCount: 18,
    comments: [
      {
        id: "c001",
        postId: "p001",
        author: MOCK_AUTHORS[2],
        content: "You are absolutely right. Section 35(4) of the 1999 Constitution (as amended) limits detention without charge to 24 hours for ordinary offences. The officers cannot simply say 'we are investigating',  that does not extend the constitutional limit. Your remedy is a fundamental rights enforcement application under Order II of the Fundamental Rights (Enforcement Procedure) Rules 2009.",
        likes: 34,
        isLiked: false,
        reactions: [],
        createdAt: "2025-04-20T10:30:00Z",
        flagged: false,
        removed: false,
      },
      {
        id: "c002",
        postId: "p001",
        author: MOCK_AUTHORS[1],
        content: "This happened to my cousin in Lagos too. The lawyer they called said they could file for habeas corpus. Is that the same as what you mentioned?",
        likes: 8,
        isLiked: false,
        reactions: [],
        createdAt: "2025-04-20T11:05:00Z",
        flagged: false,
        removed: false,
      },
    ],
    createdAt: "2025-04-20T09:00:00Z",
    updatedAt: "2025-04-20T11:05:00Z",
    promoted: true,
    promotedAt: "2025-04-20T12:00:00Z",
    promotedBy: "Super Admin",
    pinned: false,
    removed: false,
    shares: 12,
    bookmarks: 29,
    isBookmarked: false,
    reportCount: 0,
    reports: [],
  },
  {
    id: "p002",
    type: "argument",
    status: "active",
    title: "Should verbal rental agreements be enforceable in Nigerian courts?",
    content: "Many Nigerians enter into verbal tenancy agreements, especially in informal settlements. The Tenancy Law of Lagos State (2011) and similar statutes across Nigeria generally require written agreements for certain periods. But in practice, millions of tenants have no written contract.\n\nI argue that verbal agreements should carry full legal weight if supported by evidence of rent payment history,  bank transfers, receipts, or witness statements. The law as written disadvantages the most vulnerable tenants.",
    author: MOCK_AUTHORS[3],
    category: "Tenancy Law",
    tags: ["Verbal Contracts", "Tenancy", "Access to Justice", "Lagos"],
    likes: 63,
    isLiked: false,
    views: 892,
    commentCount: 24,
    comments: [
      {
        id: "c003",
        postId: "p002",
        author: MOCK_AUTHORS[4],
        content: "Counterpoint: The requirement for written contracts protects tenants too. Without a written agreement, landlords can also manipulate verbal terms. The solution isn't to remove the writing requirement,  it's to make it easier for low-income tenants to create simple written agreements.",
        likes: 19,
        isLiked: false,
        reactions: [],
        createdAt: "2025-04-19T14:20:00Z",
        flagged: false,
        removed: false,
      },
    ],
    createdAt: "2025-04-19T13:00:00Z",
    updatedAt: "2025-04-19T14:20:00Z",
    promoted: false,
    pinned: false,
    removed: false,
    shares: 8,
    bookmarks: 15,
    isBookmarked: false,
    reportCount: 0,
    reports: [],
  },
  {
    id: "p003",
    type: "poll",
    status: "promoted",
    title: "Which area of Nigerian law do you feel most unprotected in?",
    content: "We're building our next batch of content and want to prioritise what matters most to citizens. Vote for the area where you feel most vulnerable or least informed.",
    author: MOCK_AUTHORS[6],
    category: "General",
    tags: ["Poll", "Content", "Community Input"],
    likes: 21,
    isLiked: false,
    views: 3102,
    commentCount: 9,
    comments: [],
    createdAt: "2025-04-18T09:00:00Z",
    updatedAt: "2025-04-21T09:00:00Z",
    promoted: true,
    promotedAt: "2025-04-18T09:00:00Z",
    promotedBy: "Super Admin",
    pinned: true,
    pinnedAt: "2025-04-18T09:00:00Z",
    pinnedBy: "Super Admin",
    removed: false,
    pollOptions: [
      { id: "po1", text: "Police & Criminal Rights",   votes: 412 },
      { id: "po2", text: "Employment & Labour Rights", votes: 289 },
      { id: "po3", text: "Tenancy & Landlord Disputes",votes: 334 },
      { id: "po4", text: "Family & Domestic Law",      votes: 178 },
      { id: "po5", text: "Business & Contracts",       votes: 143 },
    ],
    pollEndsAt: "2025-05-18T09:00:00Z",
    userVotedOption: undefined,
    shares: 45,
    bookmarks: 8,
    isBookmarked: false,
    reportCount: 0,
    reports: [],
  },
  {
    id: "p004",
    type: "announcement",
    status: "promoted",
    title: "New Module Live: 24-Hour Detention Rule,  Know Your Rights Before They're Violated",
    content: "We've just published a comprehensive new module on detention rights under Section 35 of the 1999 Constitution. This covers:\n\n• The exact 24-hour and 48-hour limits\n• What 'bailable' vs 'capital' offences mean\n• How to count the detention period\n• Habeas corpus,  when to apply and how\n• Your rights at a police station\n\nThis module was requested by over 200 community members. Thank you for shaping what we build.",
    author: MOCK_AUTHORS[6],
    category: "Platform Update",
    tags: ["New Module", "Detention", "Section 35", "Learning"],
    likes: 89,
    isLiked: false,
    views: 2841,
    commentCount: 15,
    comments: [
      {
        id: "c004",
        postId: "p004",
        author: MOCK_AUTHORS[1],
        content: "I've been waiting for this! Started it immediately. The section on counting the 24-hour period is especially clear.",
        likes: 22,
        isLiked: false,
        reactions: [],
        createdAt: "2025-04-17T10:00:00Z",
        flagged: false,
        removed: false,
      },
    ],
    createdAt: "2025-04-17T08:00:00Z",
    updatedAt: "2025-04-17T10:00:00Z",
    promoted: true,
    promotedAt: "2025-04-17T08:00:00Z",
    promotedBy: "Super Admin",
    pinned: false,
    removed: false,
    shares: 67,
    bookmarks: 41,
    isBookmarked: false,
    reportCount: 0,
    reports: [],
  },
  {
    id: "p005",
    type: "case_study",
    status: "active",
    title: "How I successfully challenged an illegal lockout,  Lagos, April 2025",
    content: "I want to share my experience for anyone facing the same situation. My landlord locked me out on a Saturday with no court order and no notice, claiming I owed rent (which I had paid and have receipts for).\n\n**What I did:**\n1. Photographed the locked door and recorded the landlord refusing entry\n2. Contacted a lawyer through LawTicha that same day\n3. Sent a formal demand letter within 48 hours\n4. Filed a complaint with the Lagos Tenancy Tribunal\n\nThe landlord backed down within 3 days of receiving the letter. The tribunal ordered him to pay my legal costs.\n\nKey lesson: The Lagos Tenancy Law 2011, Section 21 prohibits 'self-help eviction' entirely. The landlord's solicitor knew this and advised him to settle.",
    author: MOCK_AUTHORS[5],
    category: "Tenancy Law",
    tags: ["Case Study", "Lockout", "Lagos", "Success Story", "Tenancy Tribunal"],
    likes: 134,
    isLiked: false,
    views: 2109,
    commentCount: 31,
    comments: [],
    createdAt: "2025-04-16T18:00:00Z",
    updatedAt: "2025-04-17T09:00:00Z",
    promoted: false,
    pinned: false,
    removed: false,
    shares: 89,
    bookmarks: 76,
    isBookmarked: false,
    reportCount: 0,
    reports: [],
  },
  {
    id: "p006",
    type: "discussion",
    status: "pending",
    title: "Are there any loopholes to avoid paying taxes as a freelancer?",
    content: "I do graphic design freelance work and wondering if there are any legal ways to avoid paying taxes. My friends say Nigeria doesn't really collect from individuals anyway.",
    author: MOCK_AUTHORS[4],
    category: "Business & Tax",
    tags: ["Tax", "Freelance"],
    likes: 3,
    isLiked: false,
    views: 45,
    commentCount: 2,
    comments: [],
    createdAt: "2025-04-21T15:00:00Z",
    updatedAt: "2025-04-21T15:00:00Z",
    promoted: false,
    pinned: false,
    removed: false,
    shares: 0,
    bookmarks: 0,
    isBookmarked: false,
    reportCount: 2,
    reports: [
      {
        id: "r001",
        reporterId: "u002",
        reporterName: "Babatunde Lawal",
        reason: "Asking for tax evasion advice, not legal education",
        createdAt: "2025-04-21T15:30:00Z",
        resolved: false,
      },
    ],
    adminNote: "Flagged for review,  may be asking for illegal tax evasion advice rather than legal tax planning.",
  },
  {
    id: "p007",
    type: "discussion",
    status: "removed",
    title: "How to fake employment documents to get a loan",
    content: "[removed content]",
    author: MOCK_AUTHORS[1],
    category: "Employment",
    tags: [],
    likes: 0,
    isLiked: false,
    views: 12,
    commentCount: 0,
    comments: [],
    createdAt: "2025-04-21T08:00:00Z",
    updatedAt: "2025-04-21T08:30:00Z",
    promoted: false,
    pinned: false,
    removed: true,
    removedAt: "2025-04-21T08:30:00Z",
    removedReason: "Facilitating document fraud,  directly violates platform community standards.",
    removedBy: "Super Admin",
    shares: 0,
    bookmarks: 0,
    isBookmarked: false,
    reportCount: 5,
    reports: [],
  },
];

const INITIAL_STATS: CommunityStats = {
  totalPosts: INITIAL_POSTS.length,
  activePosts: INITIAL_POSTS.filter(p => p.status === "active").length,
  promotedPosts: INITIAL_POSTS.filter(p => p.promoted).length,
  pendingPosts: INITIAL_POSTS.filter(p => p.status === "pending").length,
  removedPosts: INITIAL_POSTS.filter(p => p.removed).length,
  totalMembers: 3842,
  postsToday: 4,
  commentsToday: 23,
  flaggedContent: 3,
};

//  Initial State 

const initialState: CommunityState = {
  posts: INITIAL_POSTS,
  selectedPost: null,
  loading: false,
  submitting: false,
  error: null,
  filters: {
    type: "all",
    status: "all",
    category: "all",
    search: "",
    sortBy: "latest",
  },
  stats: INITIAL_STATS,
  activeModal: null,
  createPostStep: 1,
};

//  Async Thunks (API integration stubs) 

export const fetchPosts = createAsyncThunk(
  "community/fetchPosts",
  async (params: Partial<CommunityFilters>, { rejectWithValue }) => {
    try {
      // Replace with actual API call:
      // const response = await fetch(`/api/community/posts?${new URLSearchParams(params as any)}`);
      // return await response.json();
      return INITIAL_POSTS;
    } catch (err) {
      return rejectWithValue("Failed to fetch posts");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "community/fetchPostById",
  async (postId: string, { rejectWithValue }) => {
    try {
      // Replace: const response = await fetch(`/api/community/posts/${postId}`);
      const post = INITIAL_POSTS.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");
      return post;
    } catch (err) {
      return rejectWithValue("Failed to fetch post");
    }
  }
);

export const createPost = createAsyncThunk(
  "community/createPost",
  async (payload: CreatePostPayload & { author: Author }, { rejectWithValue }) => {
    try {
      // Replace with: const response = await fetch('/api/community/posts', { method: 'POST', body: JSON.stringify(payload) });
      const newPost: Post = {
        id: `p${Date.now()}`,
        type: payload.type,
        status: payload.author.role === "admin" ? "active" : "pending",
        title: payload.title,
        content: payload.content,
        author: payload.author,
        category: payload.category,
        tags: payload.tags,
        likes: 0,
        isLiked: false,
        views: 0,
        commentCount: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        promoted: payload.promoted ?? false,
        pinned: payload.pinned ?? false,
        removed: false,
        shares: 0,
        bookmarks: 0,
        isBookmarked: false,
        reportCount: 0,
        reports: [],
        pollOptions: payload.pollOptions?.map((text, i) => ({
          id: `po${i}`,
          text,
          votes: 0,
        })),
        pollEndsAt: payload.pollEndsAt,
      };
      return newPost;
    } catch (err) {
      return rejectWithValue("Failed to create post");
    }
  }
);

export const addComment = createAsyncThunk(
  "community/addComment",
  async ({ postId, content, author }: { postId: string; content: string; author: Author }, { rejectWithValue }) => {
    try {
      // Replace with: const response = await fetch(`/api/community/posts/${postId}/comments`, { ... });
      const newComment: Comment = {
        id: `c${Date.now()}`,
        postId,
        author,
        content,
        likes: 0,
        isLiked: false,
        reactions: [],
        createdAt: new Date().toISOString(),
        flagged: false,
        removed: false,
      };
      return { postId, comment: newComment };
    } catch (err) {
      return rejectWithValue("Failed to add comment");
    }
  }
);

//  Slice 

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {

    //  Filters 
    setTypeFilter(state, action: PayloadAction<PostType | "all">) {
      state.filters.type = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<PostStatus | "all">) {
      state.filters.status = action.payload;
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setSortBy(state, action: PayloadAction<CommunityFilters["sortBy"]>) {
      state.filters.sortBy = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },

    //  Modal 
    setActiveModal(state, action: PayloadAction<CommunityState["activeModal"]>) {
      state.activeModal = action.payload;
    },
    setCreatePostStep(state, action: PayloadAction<1 | 2>) {
      state.createPostStep = action.payload;
    },
    setSelectedPost(state, action: PayloadAction<Post | null>) {
      state.selectedPost = action.payload;
    },

    //  Post Actions (Admin) 

    promotePost(state, action: PayloadAction<{ postId: string; adminName: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.promoted = true;
        post.promotedAt = new Date().toISOString();
        post.promotedBy = action.payload.adminName;
        post.status = "promoted";
        post.updatedAt = new Date().toISOString();
        state.stats.promotedPosts += 1;
      }
    },

    demotePost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.promoted = false;
        post.promotedAt = undefined;
        post.promotedBy = undefined;
        post.status = "active";
        post.updatedAt = new Date().toISOString();
        state.stats.promotedPosts = Math.max(0, state.stats.promotedPosts - 1);
      }
    },

    pinPost(state, action: PayloadAction<{ postId: string; adminName: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.pinned = true;
        post.pinnedAt = new Date().toISOString();
        post.pinnedBy = action.payload.adminName;
        post.updatedAt = new Date().toISOString();
      }
    },

    unpinPost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.pinned = false;
        post.pinnedAt = undefined;
        post.pinnedBy = undefined;
        post.updatedAt = new Date().toISOString();
      }
    },

    removePost(state, action: PayloadAction<{ postId: string; reason: string; adminName: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        if (post.status === "active") state.stats.activePosts = Math.max(0, state.stats.activePosts - 1);
        post.removed = true;
        post.removedAt = new Date().toISOString();
        post.removedReason = action.payload.reason;
        post.removedBy = action.payload.adminName;
        post.status = "removed";
        post.updatedAt = new Date().toISOString();
        state.stats.removedPosts += 1;
        if (post.promoted) state.stats.promotedPosts = Math.max(0, state.stats.promotedPosts - 1);
      }
    },

    restorePost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.removed = false;
        post.removedAt = undefined;
        post.removedReason = undefined;
        post.removedBy = undefined;
        post.status = "active";
        post.updatedAt = new Date().toISOString();
        state.stats.removedPosts = Math.max(0, state.stats.removedPosts - 1);
        state.stats.activePosts += 1;
      }
    },

    approvePost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post && post.status === "pending") {
        post.status = "active";
        post.updatedAt = new Date().toISOString();
        state.stats.pendingPosts = Math.max(0, state.stats.pendingPosts - 1);
        state.stats.activePosts += 1;
      }
    },

    setAdminNote(state, action: PayloadAction<{ postId: string; note: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.adminNote = action.payload.note;
      }
    },

    //  Comment Moderation (Admin) 

    removeComment(state, action: PayloadAction<{ postId: string; commentId: string; reason: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.removed = true;
          comment.removedReason = action.payload.reason;
          comment.removedAt = new Date().toISOString();
          post.commentCount = Math.max(0, post.commentCount - 1);
        }
      }
    },

    restoreComment(state, action: PayloadAction<{ postId: string; commentId: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.removed = false;
          comment.removedReason = undefined;
          comment.removedAt = undefined;
          post.commentCount += 1;
        }
      }
    },

    flagComment(state, action: PayloadAction<{ postId: string; commentId: string; reason: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.flagged = true;
          comment.flagReason = action.payload.reason;
        }
      }
    },

    //  User Actions 

    toggleLikePost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },

    toggleBookmarkPost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
        post.bookmarks += post.isBookmarked ? 1 : -1;
      }
    },

    incrementPostView(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.views += 1;
      }
    },

    sharePost(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.shares += 1;
      }
    },

    voteOnPoll(state, action: PayloadAction<{ postId: string; optionId: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post && post.pollOptions && !post.userVotedOption) {
        const option = post.pollOptions.find(o => o.id === action.payload.optionId);
        if (option) {
          option.votes += 1;
          post.userVotedOption = action.payload.optionId;
        }
      }
    },

    toggleLikeComment(state, action: PayloadAction<{ postId: string; commentId: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes += comment.isLiked ? 1 : -1;
        }
      }
    },

    reportPost(state, action: PayloadAction<{ postId: string; reporterId: string; reporterName: string; reason: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.reportCount += 1;
        post.reports.push({
          id: `r${Date.now()}`,
          reporterId: action.payload.reporterId,
          reporterName: action.payload.reporterName,
          reason: action.payload.reason,
          createdAt: new Date().toISOString(),
          resolved: false,
        });
        state.stats.flaggedContent += 1;
      }
    },

    resolveReport(state, action: PayloadAction<{ postId: string; reportId: string }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const report = post.reports.find(r => r.id === action.payload.reportId);
        if (report) {
          report.resolved = true;
          state.stats.flaggedContent = Math.max(0, state.stats.flaggedContent - 1);
        }
      }
    },

    //  Optimistic local post creation (before API confirms) 
    addPostLocally(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
      state.stats.totalPosts += 1;
      if (action.payload.status === "active") state.stats.activePosts += 1;
      if (action.payload.status === "pending") state.stats.pendingPosts += 1;
    },

    addCommentLocally(state, action: PayloadAction<{ postId: string; comment: Comment }>) {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
        post.commentCount += 1;
        post.updatedAt = new Date().toISOString();
        state.stats.commentsToday += 1;
      }
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // fetchPosts
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchPostById
    builder.addCase(fetchPostById.fulfilled, (state, action) => {
      state.selectedPost = action.payload;
    });

    // createPost
    builder.addCase(createPost.pending, (state) => {
      state.submitting = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.submitting = false;
      state.posts.unshift(action.payload);
      state.stats.totalPosts += 1;
      if (action.payload.status === "active") state.stats.activePosts += 1;
      if (action.payload.status === "pending") state.stats.pendingPosts += 1;
      state.activeModal = null;
      state.createPostStep = 1;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // addComment
    builder.addCase(addComment.pending, (state) => {
      state.submitting = true;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.submitting = false;
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
        post.commentCount += 1;
        post.updatedAt = new Date().toISOString();
        state.stats.commentsToday += 1;
      }
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });
  },
});

//  Selectors 

export const selectAllPosts = (state: { community: CommunityState }) => state.community.posts;

export const selectFilteredPosts = (state: { community: CommunityState }) => {
  const { posts, filters } = state.community;
  return posts.filter(post => {
    if (filters.type !== "all" && post.type !== filters.type) return false;
    if (filters.status !== "all" && post.status !== filters.status) return false;
    if (filters.category !== "all" && post.category !== filters.category) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "popular":   return b.likes - a.likes;
      case "trending":  return b.views - a.views;
      case "most_commented": return b.commentCount - a.commentCount;
      default:          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
};

export const selectPublicPosts = (state: { community: CommunityState }) =>
  state.community.posts.filter(p => !p.removed && p.status !== "pending");

export const selectPinnedPosts = (state: { community: CommunityState }) =>
  state.community.posts.filter(p => p.pinned && !p.removed);

export const selectPromotedPosts = (state: { community: CommunityState }) =>
  state.community.posts.filter(p => p.promoted && !p.removed);

export const selectStats = (state: { community: CommunityState }) => state.community.stats;
export const selectFilters = (state: { community: CommunityState }) => state.community.filters;
export const selectLoading = (state: { community: CommunityState }) => state.community.loading;
export const selectSubmitting = (state: { community: CommunityState }) => state.community.submitting;
export const selectSelectedPost = (state: { community: CommunityState }) => state.community.selectedPost;
export const selectActiveModal = (state: { community: CommunityState }) => state.community.activeModal;

export const {
  setTypeFilter, setStatusFilter, setCategoryFilter, setSearchFilter,
  setSortBy, resetFilters,
  setActiveModal, setCreatePostStep, setSelectedPost,
  promotePost, demotePost, pinPost, unpinPost,
  removePost, restorePost, approvePost, setAdminNote,
  removeComment, restoreComment, flagComment,
  toggleLikePost, toggleBookmarkPost, incrementPostView, sharePost,
  voteOnPoll, toggleLikeComment, reportPost, resolveReport,
  addPostLocally, addCommentLocally, clearError,
} = communitySlice.actions;

export default communitySlice.reducer;

//  Category Constants 

export const COMMUNITY_CATEGORIES = [
  "General",
  "Police Rights",
  "Tenancy Law",
  "Employment & Labour",
  "Business & Tax",
  "Family Law",
  "Consumer Rights",
  "Contracts",
  "Road Traffic",
  "Platform Update",
] as const;

export const POST_TYPE_CONFIG: Record<PostType, {
  label: string;
  color: string;
  bg: string;
  dot: string;
  description: string;
}> = {
  discussion:   { label: "Discussion",   color: "#3B82F6", bg: "#EFF6FF", dot: "#3B82F6", description: "Open-ended question or topic for community input" },
  argument:     { label: "Argument",     color: "#F59E0B", bg: "#FFFBEB", dot: "#F59E0B", description: "Present and debate a legal position or policy stance" },
  poll:         { label: "Poll",         color: "#8B5CF6", bg: "#F5F3FF", dot: "#8B5CF6", description: "Gather community opinions with voting options" },
  announcement: { label: "Announcement", color: "#E8317A", bg: "#FFF0F5", dot: "#E8317A", description: "Official platform news and updates (admin only)" },
  case_study:   { label: "Case Study",   color: "#10B981", bg: "#ECFDF5", dot: "#10B981", description: "Share a real legal experience or outcome" },
};

export const POST_STATUS_CONFIG: Record<PostStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  active:   { label: "Active",         color: "#065F46", bg: "#ECFDF5", border: "#6EE7B7" },
  promoted: { label: "Promoted",       color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
  pending:  { label: "Pending Review", color: "#1E3A8A", bg: "#EFF6FF", border: "#93C5FD" },
  removed:  { label: "Removed",        color: "#991B1B", bg: "#FEF2F2", border: "#FCA5A5" },
};