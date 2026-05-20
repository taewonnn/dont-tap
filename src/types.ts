export type GameState = 'ready' | 'countdown' | 'playing' | 'finished';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonDef = {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  isCorrect: boolean;
  size: ButtonSize;
};

export type MissionDef = {
  description: string;
  phase: 1 | 2 | 3;
  buttons: Omit<ButtonDef, 'id'>[];
};

export type GameResult = {
  score: number;
  correctCount: number;
  wrongCount: number;
  averageReactionMs: number;
  maxCombo: number;
  resultType: string;
};

export type InlineAdProps = {
  adGroupId: string;
  theme?: 'auto' | 'light' | 'dark';
  tone?: 'blackAndWhite' | 'grey';
  variant?: 'expanded' | 'card';
  impressFallbackOnMount?: boolean;
};

export type AdEvent =
  | { type: 'loaded' }
  | { type: 'requested' }
  | { type: 'show' }
  | { type: 'impression' }
  | { type: 'clicked' }
  | { type: 'dismissed' }
  | { type: 'failedToShow' }
  | { type: 'userEarnedReward'; data: { unitType: string; unitAmount: number } };

export type FullScreenAdFn = ((params: {
  options: { adGroupId: string };
  onEvent: (e: AdEvent) => void;
  onError: (e: unknown) => void;
}) => void) & { isSupported: () => boolean };
