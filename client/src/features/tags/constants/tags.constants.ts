export const TAG_CONFIG: Record<
  string,
  { bg: string; text: string; hex: string }
> = {
  Tech: { bg: 'bg-blue-100', text: 'text-blue-700', hex: '#3b82f6' },
  Art: { bg: 'bg-pink-100', text: 'text-pink-700', hex: '#ec4899' },
  Business: { bg: 'bg-amber-100', text: 'text-amber-700', hex: '#f59e0b' },
  Music: { bg: 'bg-purple-100', text: 'text-purple-700', hex: '#a855f7' },
  Design: { bg: 'bg-indigo-100', text: 'text-indigo-700', hex: '#6366f1' },
  Science: { bg: 'bg-teal-100', text: 'text-teal-700', hex: '#14b8a6' },
  Networking: { bg: 'bg-green-100', text: 'text-green-700', hex: '#22c55e' },
  Health: { bg: 'bg-red-100', text: 'text-red-700', hex: '#ef4444' },
  Education: { bg: 'bg-cyan-100', text: 'text-cyan-700', hex: '#06b6d4' },
  Sports: { bg: 'bg-orange-100', text: 'text-orange-700', hex: '#f97316' },
};

export const DEFAULT_TAG_HEX = '#6366f1';

export const SELECTED_RING = 'ring-2 ring-offset-1 ring-accent-500 shadow-sm';
