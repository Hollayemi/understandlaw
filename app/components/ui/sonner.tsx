"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps, toast } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "bg-white text-black border border-gray-200 shadow-lg",
          title: "font-semibold",
          description: "text-sm",
        },
      }}
      {...props}
    />
  )
}

// SUCCESS (GREEN)
export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    icon: <CircleCheckIcon className="size-4 text-green-600" />,
    position: "top-right",
    className: "!bg-green-50 !border !border-green-500 !text-green-700",
    classNames: {
      toast: "!bg-green-50 !border !border-green-500 !text-green-700",
      title: "!text-green-700",
      description: "!text-green-600",
    },
  });
};

// ERROR (RED)
export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    icon: <OctagonXIcon className="size-4 text-red-600" />,
    position: "top-right",
    className: "!bg-red-50 !border !border-red-500 !text-red-700",
    classNames: {
      toast: "!bg-red-50 !border !border-red-500 !text-red-700",
      title: "!text-red-700",
      description: "!text-red-600",
    },
  });
};

export { Toaster }