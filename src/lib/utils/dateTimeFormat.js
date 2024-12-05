export function dateTimeFormat(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function dateFormat(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export function timeAgo(date) {
    if (!date) {
        return ""; 
    }

    const now = new Date();
    const givenDate = new Date(date);

    
    if (isNaN(givenDate)) {
        return "invalid date";
    }

    const diffInSeconds = Math.floor((now - givenDate) / 1000);

    const intervals = {
        year: 31536000, // 60 * 60 * 24 * 365
        month: 2592000, // 60 * 60 * 24 * 30
        week: 604800, // 60 * 60 * 24 * 7
        day: 86400, // 60 * 60 * 24
        hour: 3600, // 60 * 60
        minute: 60,
        second: 1,
    };

    for (const [key, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval > 1) {
            return `${interval} ${key}s ago`;
        } else if (interval === 1) {
            return `1 ${key} ago`;
        }
    }

    return "just now";
}


