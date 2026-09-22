import { ShopOwner } from '../types';

export interface ThemeConfig {
  id: string;
  name: string;
  hex: string;
  hexLight: string;
  hexDark: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  lightBg: string;
  lightBorder: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  gradientFrom: string;
  gradientTo: string;
}

export const THEME_PALETTES: Record<string, ThemeConfig> = {
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    hex: '#2563eb',
    hexLight: '#93c5fd',
    hexDark: '#1e40af',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    lightBg: 'bg-blue-50/70',
    lightBorder: 'border-blue-200',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    ring: 'focus:ring-blue-500',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-700'
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    hex: '#9333ea',
    hexLight: '#d8b4fe',
    hexDark: '#6b21a8',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600',
    lightBg: 'bg-purple-50/70',
    lightBorder: 'border-purple-200',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    ring: 'focus:ring-purple-500',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600'
  },
  green: {
    id: 'green',
    name: 'Emerald Green',
    hex: '#059669',
    hexLight: '#6ee7b7',
    hexDark: '#065f46',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    lightBg: 'bg-emerald-50/70',
    lightBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    ring: 'focus:ring-emerald-500',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-700'
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    hex: '#ea580c',
    hexLight: '#fdba74',
    hexDark: '#9a3412',
    primaryBg: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryText: 'text-orange-600',
    lightBg: 'bg-orange-50/70',
    lightBorder: 'border-orange-200',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    ring: 'focus:ring-orange-500',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-amber-600'
  },
  teal: {
    id: 'teal',
    name: 'Nordic Teal',
    hex: '#0d9488',
    hexLight: '#5eead4',
    hexDark: '#115e59',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600',
    lightBg: 'bg-teal-50/70',
    lightBorder: 'border-teal-200',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    ring: 'focus:ring-teal-500',
    gradientFrom: 'from-teal-600',
    gradientTo: 'to-cyan-700'
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    hex: '#e11d48',
    hexLight: '#fda4af',
    hexDark: '#9f1239',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    lightBg: 'bg-rose-50/70',
    lightBorder: 'border-rose-200',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    ring: 'focus:ring-rose-500',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-red-700'
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    hex: '#4f46e5',
    hexLight: '#a5b4fc',
    hexDark: '#3730a3',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-600',
    lightBg: 'bg-indigo-50/70',
    lightBorder: 'border-indigo-200',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    ring: 'focus:ring-indigo-500',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-blue-700'
  }
};

export function getShopTheme(shop?: ShopOwner | string | null, overrideColor?: string): ThemeConfig {
  if (overrideColor && THEME_PALETTES[overrideColor]) {
    return THEME_PALETTES[overrideColor];
  }
  if (!shop) return THEME_PALETTES.blue;

  if (typeof shop === 'string') {
    if (THEME_PALETTES[shop]) return THEME_PALETTES[shop];
    const subStr = shop.toLowerCase();
    if (subStr.includes('balaji')) return THEME_PALETTES.blue;
    if (subStr.includes('sharma')) return THEME_PALETTES.purple;
    if (subStr.includes('gupta') || subStr.includes('pharma') || subStr.includes('royal')) return THEME_PALETTES.green;
    if (subStr.includes('raj') || subStr.includes('apex') || subStr.includes('electronic')) return THEME_PALETTES.orange;
    if (subStr.includes('metro') || subStr.includes('garment') || subStr.includes('textile')) return THEME_PALETTES.rose;
    if (subStr.includes('super') || subStr.includes('mart')) return THEME_PALETTES.teal;
    return THEME_PALETTES.blue;
  }

  const sub = (shop.subdomain || shop.shopName || '').toLowerCase();
  
  if (sub.includes('balaji')) return THEME_PALETTES.blue;
  if (sub.includes('sharma')) return THEME_PALETTES.purple;
  if (sub.includes('gupta') || sub.includes('pharma') || sub.includes('royal')) return THEME_PALETTES.green;
  if (sub.includes('raj') || sub.includes('apex') || sub.includes('electronic')) return THEME_PALETTES.orange;
  if (sub.includes('metro') || sub.includes('garment') || sub.includes('textile')) return THEME_PALETTES.rose;
  if (sub.includes('super') || sub.includes('mart')) return THEME_PALETTES.teal;

  // Stable hash based on shop id
  const keys = Object.keys(THEME_PALETTES);
  let hash = 0;
  for (let i = 0; i < sub.length; i++) {
    hash = sub.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % keys.length;
  return THEME_PALETTES[keys[index]];
}
