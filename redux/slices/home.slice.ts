import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosBaseQuery } from "../shared/axiosBaseQuery";
import { ApiResponse } from "../types";

export interface CardItem {
  id: string;
  type: 'stat' | 'person';
  gradient?: string;
  bg?: string;
  label?: string;
  number?: string;
  image: string;
  publication?: string;
  category?: string;
  name?: string;
  initials?: string;
}

export interface FeatureItem {
  num: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  stepColor: string;
}

export interface TopicItem {
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  count: number;
  topics: string[];
  gradientFrom?: string;
  accent?: string;
}

export interface MarketplaceLawyer {
  name: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  responseTime: string;
  badges: string[];
  initials: string;
  color: string;
  consults?: number;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  topic: string;
}

export interface TierItem {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  badge?: string;
}

export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    stats: {
      rating: string;
      users: string;
    };
    features: string[];
  };
  cards: CardItem[];
  features: FeatureItem[];
  topics: TopicItem[];
  marketplace: MarketplaceLawyer[];
  testimonials: TestimonialItem[];
  tiers: TierItem[];
  cta: {
    title: string;
    subtitle: string;
    primaryCta: {
      text: string;
      link: string;
    };
    secondaryCta?: {
      text: string;
      link: string;
    };
  };
  press: string[];
  verificationSteps: string[];
}

export interface HomeState {
  data: HomePageData | null;
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: HomeState = {
  data: null,
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: "",
};

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Home", "Marketplace", "Topics", "Testimonials"],
  endpoints: (builder) => ({
    // Get complete home page data
    getHomeData: builder.query<ApiResponse<HomePageData>, void>({
      query: () => ({
        url: "/home",
        method: "GET",
      }),
      providesTags: [{ type: "Home" }],
    }),

    // Get marketplace lawyers with filters
    getMarketplaceLawyers: builder.query<
      ApiResponse<MarketplaceLawyer[]>,
      { category?: string; search?: string; minRating?: number; location?: string }
    >({
      query: (params) => ({
        url: "/home/marketplace",
        method: "GET",
        params,
      }),
      providesTags: (result, error, params) => [
        { type: "Marketplace" },
        ...(params?.category ? [{ type: "Marketplace", id: `category-${params.category}` }] : []),
      ],
    }),

    // Get topics
    getTopics: builder.query<ApiResponse<TopicItem[]>, { limit?: number; category?: string }>({
      query: (params) => ({
        url: "/home/topics",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Topics" }],
    }),

    // Get testimonials
    getTestimonials: builder.query<ApiResponse<TestimonialItem[]>, { limit?: number }>({
      query: (params) => ({
        url: "/home/testimonials",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Testimonials" }],
    }),

    // Get pricing tiers
    getTiers: builder.query<ApiResponse<TierItem[]>, void>({
      query: () => ({
        url: "/home/tiers",
        method: "GET",
      }),
      providesTags: [{ type: "Home", id: "tiers" }],
    }),

    // Get featured cards and features
    getFeaturedItems: builder.query<ApiResponse<{ cards: CardItem[]; features: FeatureItem[] }>, void>({
      query: () => ({
        url: "/home/featured",
        method: "GET",
      }),
      providesTags: [{ type: "Home", id: "featured" }],
    }),
  }),
});

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeData: (state, action: PayloadAction<HomePageData>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetHomeState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// ============================================
// EXPORT ACTIONS
// ============================================

export const {
  setHomeData,
  setLoading,
  setError,
  setSelectedCategory,
  setSearchQuery,
  resetHomeState,
} = homeSlice.actions;

// ============================================
// EXPORT API HOOKS
// ============================================

export const {
  useGetHomeDataQuery,
  useGetMarketplaceLawyersQuery,
  useGetTopicsQuery,
  useGetTestimonialsQuery,
  useGetTiersQuery,
  useGetFeaturedItemsQuery,
} = homeApi;

// ============================================
// SELECTORS
// ============================================

export const selectHomeData = (state: { home: HomeState }) => state.home.data;
export const selectHomeLoading = (state: { home: HomeState }) => state.home.isLoading;
export const selectHomeError = (state: { home: HomeState }) => state.home.error;
export const selectSelectedCategory = (state: { home: HomeState }) => state.home.selectedCategory;
export const selectSearchQuery = (state: { home: HomeState }) => state.home.searchQuery;

// Section selectors
export const selectHero = (state: { home: HomeState }) => state.home.data?.hero;
export const selectCards = (state: { home: HomeState }) => state.home.data?.cards || [];
export const selectFeatures = (state: { home: HomeState }) => state.home.data?.features || [];
export const selectTopics = (state: { home: HomeState }) => state.home.data?.topics || [];
export const selectMarketplace = (state: { home: HomeState }) => state.home.data?.marketplace || [];
export const selectTestimonials = (state: { home: HomeState }) => state.home.data?.testimonials || [];
export const selectTiers = (state: { home: HomeState }) => state.home.data?.tiers || [];
export const selectCTA = (state: { home: HomeState }) => state.home.data?.cta;
export const selectPress = (state: { home: HomeState }) => state.home.data?.press || [];
export const selectVerificationSteps = (state: { home: HomeState }) => state.home.data?.verificationSteps || [];

// ============================================
// COMPUTED SELECTORS
// ============================================

// Filtered marketplace lawyers based on UI state
export const selectFilteredMarketplace = (state: { home: HomeState }) => {
  const marketplace = state.home.data?.marketplace || [];
  const { selectedCategory, searchQuery } = state.home;

  return marketplace.filter((lawyer) => {
    const matchesCategory = !selectedCategory || 
      lawyer.role.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSearch = !searchQuery ||
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

// Top rated lawyers
export const selectTopRatedLawyers = (state: { home: HomeState }) => {
  const marketplace = state.home.data?.marketplace || [];
  return [...marketplace]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
};

// Featured topics (first 3)
export const selectFeaturedTopics = (state: { home: HomeState }) => {
  const topics = state.home.data?.topics || [];
  return topics.slice(0, 3);
};

// Cards by type
export const selectStatCards = (state: { home: HomeState }) => {
  const cards = state.home.data?.cards || [];
  return cards.filter(card => card.type === 'stat');
};

export const selectPersonCards = (state: { home: HomeState }) => {
  const cards = state.home.data?.cards || [];
  return cards.filter(card => card.type === 'person');
};

// Check if data exists
export const selectHasData = (state: { home: HomeState }) => {
  return state.home.data !== null && !state.home.isLoading;
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default homeSlice.reducer;