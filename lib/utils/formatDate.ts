export function formatDate(dateString: string | Date, locale: string = 'en-US'): string {
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(timeString: string | Date, format24h: boolean = false): string {
  const d = typeof timeString === 'string' ? new Date(timeString) : timeString;
  if (format24h) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function getDayName(dateString: string | Date, short: boolean = true): string {
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return d.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
}

export function relativeTimeString(dateInput: string | Date | number): string {
  const date = typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : typeof dateInput === 'string' 
      ? new Date(dateInput) 
      : dateInput;
      
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}
