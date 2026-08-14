// components/community/AskQuestionButton.tsx
"use client";
import React, { useState } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import CreatePostModal from ".";
import { ReferenceType } from  "@/redux/types/community";

interface AskQuestionButtonProps {
  referenceType?: 'module' | 'topic' | 'subtopic';
  referenceId?: string;
  referenceTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  topicId?: string;
  topicTitle?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AskQuestionButton({ 
  referenceType,
  referenceId,
  referenceTitle,
  moduleId,
  moduleTitle,
  topicId,
  topicTitle,
  variant = 'primary',
  size = 'md',
  className = ''
}: AskQuestionButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const getInitialReference = () => {
    if (!referenceType || !referenceId || !referenceTitle) return undefined;
    
    return {
      type: referenceType,
      id: referenceId,
      title: referenceTitle,
      moduleId,
      moduleTitle,
      topicId,
      topicTitle,
    };
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center gap-2 rounded-xl font-semibold transition-all hover:-translate-y-0.5";
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };
    
    const variantStyles = {
      primary: "bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md hover:shadow-lg",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      outline: "border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5",
    };
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={getButtonStyles()}
      >
        {variant === 'primary' ? (
          <HelpCircle size={size === 'sm' ? 14 : 16} />
        ) : (
          <MessageCircle size={size === 'sm' ? 14 : 16} />
        )}
        Ask a Question
      </button>
      
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {}}
          initialRoom="legal-advice"
          initialReference={getInitialReference()}
        />
      )}
    </>
  );
}