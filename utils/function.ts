import { LawyerUser } from "@/redux/types/lawyer";

export function getInitial(name: string):string {
    return name ? name.charAt(0).toUpperCase() : '';
}

export function fullName(user: LawyerUser):string {
    return `${user.firstName} ${user?.lastName}`
}

type dateType = 'relative' | 'datetime' | "date" | "time" | "short"
export function formatTime(user: string, type: dateType = "relative"): string {
    if (!user) return 'N/A';
    
    let date: Date;
    
    if (user.match(/^\d{4}-\d{2}-\d{2}T/)) {
        date = new Date(user);
    } else {
        return user;
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