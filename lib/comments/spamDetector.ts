export interface SpamCheckResult {
  isSpam: boolean;
  hasLinks: boolean;
  detectedLinks: string[];
  reason?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|io|co|biz|info|xyz|me|app|ai|site|online|store)\b[^\s]*)/gi;

const SPAM_KEYWORDS = [
  'casino', 'viagra', 'crypto gain', 'whatsapp me', 'telegram', 'buy cheap',
  'bit.ly', 'tinyurl', 'free money', 'poker', 'jackpot', 'investment scheme'
];

export function detectSpam(text: string): SpamCheckResult {
  const matches = text.match(URL_REGEX) || [];
  const detectedLinks = Array.from(new Set(matches));
  const hasLinks = detectedLinks.length > 0;

  let isSpam = false;
  let reason: string | undefined;

  if (hasLinks) {
    isSpam = true;
    reason = `Contains ${detectedLinks.length} external URL(s)`;
  } else {
    const lower = text.toLowerCase();
    for (const keyword of SPAM_KEYWORDS) {
      if (lower.includes(keyword)) {
        isSpam = true;
        reason = `Contains suspicious keyword "${keyword}"`;
        break;
      }
    }
  }

  return {
    isSpam,
    hasLinks,
    detectedLinks,
    reason,
  };
}
