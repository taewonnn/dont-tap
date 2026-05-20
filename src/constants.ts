import type { ButtonSize } from './types';

export const COLORS = {
  bg: '#F5F6F8',
  card: '#FFFFFF',
  textPrimary: '#191F28',
  textBody: '#4E5968',
  textSub: '#8B95A1',
  success: '#00C853',
  error: '#F04452',
  warning: '#FFB020',
  btnPrimary: '#191F28',
  btnSecondary: '#E5E8EB',
  border: '#E5E8EB',
  blue: '#0064FF',
};

export const BUTTON_SIZE_MAP: Record<ButtonSize, { height: number; paddingH: number; fontSize: number }> = {
  small: { height: 36, paddingH: 12, fontSize: 12 },
  medium: { height: 48, paddingH: 20, fontSize: 15 },
  large: { height: 60, paddingH: 28, fontSize: 17 },
};

export const BANNER_AD_GROUP_ID = 'ait.v2.live.c089bba08fcc4a3a';
export const INTERSTITIAL_AD_GROUP_ID = 'ait.v2.live.e0be2d955c8148dc';
