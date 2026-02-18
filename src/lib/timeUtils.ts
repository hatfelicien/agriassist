export function formatTimeAgo(timestamp: number, language: string = 'en'): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (language === 'rw') {
    if (minutes < 1) return 'Ubu';
    if (minutes < 60) return `Iminota ${minutes} ishize`;
    if (hours < 24) return `Amasaha ${hours} ashize`;
    return `Iminsi ${days} ishize`;
  }
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} days ago`;
}
