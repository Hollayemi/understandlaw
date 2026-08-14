"use client";
import React, { useState } from "react";
import {
  BookOpen, Download, ShoppingCart, Star, TrendingUp,
  Plus, Upload, Search, Filter, MoreHorizontal, Eye,
  Edit2, Trash2, Check, X, FileText, Package, Truck,
  CheckCircle, XCircle, Clock, AlertCircle, Save,
  Loader2, ChevronDown, ChevronUp, Image as ImageIcon,
  Tag, Hash, BookMarked, Globe, ShieldCheck, Layers,
  RefreshCw, Download as DownloadIcon, ExternalLink,
  DollarSign, Archive, Flame, Info,
} from "lucide-react";
import { Book, BookCategory, BookFormat, BookOrder, BookStatus, OrderStatus } from "./types";



//  Config 
export const CATEGORY_CONFIG: Record<BookCategory, { label: string; color: string; bg: string }> = {
  criminal:      { label: "Criminal",      color: "#3B82F6", bg: "#EFF6FF" },
  tenancy:       { label: "Tenancy",       color: "#10B981", bg: "#ECFDF5" },
  employment:    { label: "Employment",    color: "#8B5CF6", bg: "#F5F3FF" },
  contracts:     { label: "Contracts",     color: "#F59E0B", bg: "#FFFBEB" },
  business:      { label: "Business",      color: "#06B6D4", bg: "#ECFEFF" },
  family:        { label: "Family",        color: "#EF4444", bg: "#FEF2F2" },
  consumer:      { label: "Consumer",      color: "#F97316", bg: "#FFF0F5" },
  road:          { label: "Road Traffic",  color: "#F97316", bg: "#FFF7ED" },
  constitutional:{ label: "Constitutional",color: "#7C3AED", bg: "#F5F3FF" },
};

export const FORMAT_CONFIG: Record<BookFormat, { label: string; color: string; bg: string }> = {
  pdf:      { label: "PDF Only",   color: "#3B82F6", bg: "#EFF6FF" },
  physical: { label: "Physical",   color: "#F59E0B", bg: "#FFFBEB" },
  both:     { label: "PDF + Book", color: "#10B981", bg: "#ECFDF5" },
};

export const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", icon: Clock },
  processing: { label: "Processing", bg: "#EFF6FF", text: "#1E3A8A", dot: "#3B82F6", icon: RefreshCw },
  shipped:    { label: "Shipped",    bg: "#F5F3FF", text: "#4C1D95", dot: "#8B5CF6", icon: Truck },
  delivered:  { label: "Delivered",  bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: CheckCircle },
  cancelled:  { label: "Cancelled",  bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: XCircle },
};

export const BOOK_STATUS_CFG: Record<BookStatus, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: "Active",   bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  inactive: { label: "Inactive", bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
  draft:    { label: "Draft",    bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
};
