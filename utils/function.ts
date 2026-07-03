import { LawyerUser } from "@/redux/types/lawyer";

export function getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
}

export function fullName(user: LawyerUser): string {
    return `${user.firstName} ${user?.lastName}`
}

type dateType = 'relative' | 'datetime' | "date" | "time" | "short"
export function formatTime(time: string, type: dateType = "relative"): string {
    if (!time) return 'N/A';

    let date: Date;

    if (time.match(/^\d{4}-\d{2}-\d{2}T/)) {
        date = new Date(time);
    } else {
        return time;
    }

    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    switch (type) {
        case 'relative':
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
            if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            return date.toLocaleDateString();

        case 'time':
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        case 'date':
            return date.toLocaleDateString();

        case 'datetime':
            return date.toLocaleString();

        case 'short':
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;

        default:
            return date.toISOString();
    }
}


export function generateSlug(title?: string): string {
    if(!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};



export function getUrgencyDeadline(maxDays: number | null) {
  if (maxDays === null) return null;

  const deadline = new Date();
  return new Date(deadline.setDate(deadline.getDate() + maxDays)).toISOString()
}