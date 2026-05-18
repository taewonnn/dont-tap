import { createRoute } from '@granite-js/react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';

export const Route = createRoute('/', {
  component: GamePage,
});

type GameState = 'ready' | 'countdown' | 'playing' | 'finished';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonDef = {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  isCorrect: boolean;
  size: ButtonSize;
};

type MissionDef = {
  description: string;
  phase: 1 | 2 | 3;
  buttons: Omit<ButtonDef, 'id'>[];
};

type GameResult = {
  score: number;
  correctCount: number;
  wrongCount: number;
  averageReactionMs: number;
  maxCombo: number;
  resultType: string;
};

const COLORS = {
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

const MISSION_POOL: MissionDef[] = [
  // phase 1: 모든 버튼이 같은 스타일, 텍스트로만 구분
  {
    description: '"누르세요" 버튼을 누르세요',
    phase: 1,
    buttons: [
      { label: '누르세요', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'medium' },
      { label: '누르지 마세요', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '누르면 손해', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '"정답" 버튼을 누르세요',
    phase: 1,
    buttons: [
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'medium' },
      { label: '오답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '정답같은 오답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '"클릭" 버튼을 누르세요',
    phase: 1,
    buttons: [
      { label: '클릭', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'medium' },
      { label: '클릭하기', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '클릭!', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '클릭하세요', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '"확인" 버튼을 누르세요',
    phase: 1,
    buttons: [
      { label: '확인', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'medium' },
      { label: '확인하기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '확인했어요', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
  // phase 2: 같은 텍스트 + 색/크기로 구분, 함정이 더 그럴듯해 보임
  {
    description: '파란색 배경 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '누르세요', bgColor: COLORS.blue, textColor: '#fff', isCorrect: true, size: 'medium' },
      { label: '누르세요', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '누르세요', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '누르세요', bgColor: COLORS.success, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '빨간색 배경 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '이거', bgColor: COLORS.error, textColor: '#fff', isCorrect: true, size: 'medium' },
      { label: '이거', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '이거', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '이거', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '초록색 배경 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '눌러봐', bgColor: COLORS.success, textColor: '#fff', isCorrect: true, size: 'medium' },
      { label: '눌러봐', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '눌러봐', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '눌러봐', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '가장 큰 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'large' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'small' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '가장 작은 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'large' },
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '글자 색이 파란 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '눌러', bgColor: COLORS.btnSecondary, textColor: COLORS.blue, isCorrect: true, size: 'medium' },
      { label: '눌러', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '눌러', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '눌러', bgColor: COLORS.btnSecondary, textColor: COLORS.textSub, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '글자 색이 빨간 버튼을 누르세요',
    phase: 2,
    buttons: [
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.error, isCorrect: true, size: 'medium' },
      { label: '클릭', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textSub, isCorrect: false, size: 'medium' },
    ],
  },
  // phase 3: 텍스트+색+크기 복합 함정
  {
    description: '"이거" 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '이거', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
      { label: '이거 아님', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '이거?', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '확실히 이거', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '진짜 이거', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '광고 아닌 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '닫기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
      { label: '광고 아님 100%', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '× 광고 닫기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '무료 혜택 받기', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '급하면 누름', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '숫자가 없는 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
      { label: '정답1', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '정답2', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '정답3', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '테두리 없는 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '이게 정답', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'small' },
      { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'large' },
      { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '글자가 흰색인 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '여기', bgColor: COLORS.btnSecondary, textColor: '#fff', isCorrect: true, size: 'small' },
      { label: '여기', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
      { label: '여기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      { label: '여기', bgColor: COLORS.btnSecondary, textColor: COLORS.textSub, isCorrect: false, size: 'medium' },
    ],
  },
  {
    description: '검은 배경 버튼을 누르세요',
    phase: 3,
    buttons: [
      { label: '클릭', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'small' },
      { label: '클릭', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'large' },
      { label: '클릭', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '클릭', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
    ],
  },
];

function getResultType(wrongCount: number, avgReactionMs: number): string {
  if (wrongCount <= 2 && avgReactionMs < 450) return '버튼 감별사';
  if (wrongCount >= 8 && avgReactionMs < 350) return '빠른 급발진러';
  if (wrongCount <= 2 && avgReactionMs >= 500) return '신중한 생존자';
  if (wrongCount >= 10) return '광고 배너 헌터';
  return '침착한 고수';
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickMission(timeRemaining: number, lastMission: MissionDef | null): MissionDef {
  const pool = MISSION_POOL.filter(m => {
    if (timeRemaining > 20) return m.phase === 1;
    if (timeRemaining > 10) return m.phase <= 2;
    return true;
  }).filter(m => m !== lastMission);

  const candidates = pool.length > 0 ? pool : MISSION_POOL.filter(m => m !== lastMission);
  if (candidates.length === 0) return MISSION_POOL[0]!;
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}

function createButtons(mission: MissionDef): ButtonDef[] {
  return shuffleArray(
    mission.buttons.map((b, i) => ({ ...b, id: `btn-${i}-${Date.now()}` }))
  );
}

const BUTTON_SIZE_MAP: Record<ButtonSize, { height: number; paddingH: number; fontSize: number }> = {
  small: { height: 36, paddingH: 12, fontSize: 12 },
  medium: { height: 48, paddingH: 20, fontSize: 15 },
  large: { height: 60, paddingH: 28, fontSize: 17 },
};

function GamePage() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentMission, setCurrentMission] = useState<MissionDef>(() => MISSION_POOL[0]!);
  const [buttons, setButtons] = useState<ButtonDef[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [roundProgress, setRoundProgress] = useState(1);

  const gameVars = useRef({
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    combo: 0,
    maxCombo: 0,
    reactionTimes: [] as number[],
    time: 30,
  });

  const roundStartedAtRef = useRef(Date.now());
  const lastMissionRef = useRef<MissionDef | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundProgressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStateRef = useRef<GameState>('ready');
  const roundTimeLimitRef = useRef(3000);
  const onRoundTimeoutRef = useRef<() => void>(() => {});

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (roundProgressTimerRef.current) clearInterval(roundProgressTimerRef.current);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const showFeedback = useCallback((text: string, color: string) => {
    setFeedback({ text, color });
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 700);
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    const vars = gameVars.current;
    const avgReaction =
      vars.reactionTimes.length > 0
        ? Math.round(vars.reactionTimes.reduce((a, b) => a + b, 0) / vars.reactionTimes.length)
        : 0;
    setResult({
      score: Math.max(0, vars.score),
      correctCount: vars.correctCount,
      wrongCount: vars.wrongCount,
      averageReactionMs: avgReaction,
      maxCombo: vars.maxCombo,
      resultType: getResultType(vars.wrongCount, avgReaction),
    });
    setGameState('finished');
  }, [clearTimers]);

  const startNewRound = useCallback((currentTime: number) => {
    const mission = pickMission(currentTime, lastMissionRef.current);
    lastMissionRef.current = mission;
    setCurrentMission(mission);
    setButtons(createButtons(mission));
    roundStartedAtRef.current = Date.now();
    roundTimeLimitRef.current = currentTime > 20 ? 3000 : currentTime > 10 ? 2000 : 1500;
    setRoundProgress(1);
  }, []);

  onRoundTimeoutRef.current = () => {
    if (gameStateRef.current !== 'playing') return;
    const vars = gameVars.current;
    vars.combo = 0;
    vars.wrongCount += 1;
    vars.score -= 80;
    vars.time = Math.max(0, vars.time - 2);
    setScore(vars.score);
    setCombo(0);
    setTimeRemaining(vars.time);
    showFeedback('시간 초과!', COLORS.error);
    if (vars.time <= 0) {
      endGame();
      return;
    }
    startNewRound(vars.time);
  };

  const handleButtonClick = useCallback((button: ButtonDef) => {
    if (gameStateRef.current !== 'playing') return;
    const reactionMs = Date.now() - roundStartedAtRef.current;
    const vars = gameVars.current;

    if (button.isCorrect) {
      vars.combo += 1;
      vars.correctCount += 1;
      if (vars.combo > vars.maxCombo) vars.maxCombo = vars.combo;
      const comboBonus = vars.combo % 5 === 0 ? 50 : 0;
      vars.score += 100 + comboBonus;
      vars.reactionTimes.push(reactionMs);
      setScore(vars.score);
      setCombo(vars.combo);
      showFeedback('+100', COLORS.success);
    } else {
      vars.combo = 0;
      vars.wrongCount += 1;
      vars.score -= 80;
      vars.time = Math.max(0, vars.time - 2);
      setScore(vars.score);
      setCombo(0);
      setTimeRemaining(vars.time);
      showFeedback('-80', COLORS.error);

      if (vars.time <= 0) {
        endGame();
        return;
      }
    }

    startNewRound(vars.time);
  }, [endGame, startNewRound, showFeedback]);

  const startGame = useCallback(() => {
    gameVars.current = {
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      combo: 0,
      maxCombo: 0,
      reactionTimes: [],
      time: 30,
    };
    lastMissionRef.current = null;
    setScore(0);
    setCombo(0);
    setTimeRemaining(30);
    setResult(null);
    setFeedback(null);
    setCountdown(3);
    setGameState('countdown');
  }, []);

  useEffect(() => {
    if (gameState !== 'countdown') return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameVars.current.time = 30;
    setTimeRemaining(30);
    startNewRound(30);

    timerRef.current = setInterval(() => {
      gameVars.current.time -= 1;
      const t = gameVars.current.time;
      setTimeRemaining(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        endGame();
      }
    }, 1000);

    roundProgressTimerRef.current = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;
      const elapsed = Date.now() - roundStartedAtRef.current;
      const limit = roundTimeLimitRef.current;
      const progress = Math.max(0, 1 - elapsed / limit);
      setRoundProgress(progress);
      if (elapsed >= limit) {
        onRoundTimeoutRef.current();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (roundProgressTimerRef.current) clearInterval(roundProgressTimerRef.current);
    };
  }, [gameState, startNewRound, endGame]);

  const handleRetry = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const rankMap: Record<string, string> = {
      '버튼 감별사': '상위 5%',
      '침착한 고수': '상위 15%',
      '신중한 생존자': '상위 30%',
      '빠른 급발진러': '하위 40%',
      '광고 배너 헌터': '하위 60%',
    };
    await Share.share({
      message: `낚시 버튼 저항력 ${rankMap[result.resultType] ?? ''} | ${result.resultType} | ${result.score}점`,
    });
  }, [result]);

  if (gameState === 'ready') {
    return <ReadyScreen onStart={startGame} />;
  }

  if (gameState === 'countdown') {
    return <CountdownScreen count={countdown} />;
  }

  if (gameState === 'finished' && result) {
    return (
      <ResultScreen
        result={result}
        onRetry={handleRetry}
        onShare={handleShare}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <StatusItem label="남은 시간" value={`${timeRemaining}초`} highlight={timeRemaining <= 5} />
        <StatusItem label="점수" value={score.toLocaleString()} />
        <StatusItem label="콤보" value={`x${combo}`} highlight={combo >= 5} highlightColor={COLORS.warning} />
      </View>

      <View style={styles.missionBox}>
        <Text style={styles.missionText}>{currentMission.description}</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${roundProgress * 100}%`,
                backgroundColor:
                  roundProgress > 0.5 ? COLORS.success : roundProgress > 0.25 ? COLORS.warning : COLORS.error,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.buttonsGrid}>
          {buttons.map(button => {
            const sz = BUTTON_SIZE_MAP[button.size];
            return (
              <TouchableOpacity
                key={button.id}
                style={[
                  styles.gameButton,
                  {
                    backgroundColor: button.bgColor,
                    height: sz.height,
                    paddingHorizontal: sz.paddingH,
                    borderWidth: button.bgColor === '#fff' || button.bgColor === '#FFFFFF' ? 1 : 0,
                    borderColor: COLORS.border,
                  },
                ]}
                onPress={() => handleButtonClick(button)}
                activeOpacity={0.75}
              >
                <Text style={[styles.gameButtonText, { color: button.textColor, fontSize: sz.fontSize }]}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {feedback && (
          <View style={[styles.feedbackBadge, { backgroundColor: feedback.color }]}>
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function StatusItem({
  label,
  value,
  highlight = false,
  highlightColor = COLORS.error,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  highlightColor?: string;
}) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, highlight && { color: highlightColor }]}>{value}</Text>
    </View>
  );
}

function ReadyScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.mainTitle}>가짜 버튼 피하기</Text>
      <Text style={styles.subtitle}>
        진짜 버튼만 빠르게 눌러보세요.{'\n'}낚시 버튼을 누르면 점수가 깎입니다.
      </Text>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>게임 규칙</Text>
        <Text style={styles.rulesItem}>정답 버튼 +100점</Text>
        <Text style={styles.rulesItem}>오답 버튼 -50점, -1초</Text>
        <Text style={styles.rulesItem}>5콤보마다 +50점 보너스</Text>
        <Text style={styles.rulesItem}>제한 시간 30초</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
        <Text style={styles.startButtonText}>게임 시작</Text>
      </TouchableOpacity>

      <Text style={styles.hintText}>30초 안에 당신의 낚시 버튼 저항력을 측정해요.</Text>
    </View>
  );
}

function CountdownScreen({ count }: { count: number }) {
  return (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.countdownNumber}>{count > 0 ? count : '시작!'}</Text>
    </View>
  );
}

function ResultScreen({
  result,
  onRetry,
  onShare,
}: {
  result: GameResult;
  onRetry: () => void;
  onShare: () => void;
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
      <View style={styles.resultCard}>
        <Text style={styles.resultSubtitle}>당신의 낚시 버튼 저항력</Text>
        <Text style={styles.resultScore}>{result.score}점</Text>
        <Text style={styles.resultType}>{result.resultType}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <StatItem label="정답" value={`${result.correctCount}개`} color={COLORS.success} />
          <StatItem label="오답" value={`${result.wrongCount}개`} color={COLORS.error} />
        </View>
        <View style={styles.statsRow}>
          <StatItem label="평균 반응속도" value={`${result.averageReactionMs}ms`} />
          <StatItem label="최대 콤보" value={`${result.maxCombo}회`} color={COLORS.warning} />
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>다시하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>결과 공유하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : undefined]}>{value}</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.textSub,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  missionBox: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  missionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  gameArea: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: width - 32,
  },
  gameButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gameButtonText: {
    fontWeight: '600',
  },
  feedbackBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  feedbackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textBody,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  rulesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    width: '100%',
    marginBottom: 28,
    gap: 8,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSub,
    marginBottom: 4,
  },
  rulesItem: {
    fontSize: 14,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: COLORS.btnPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textSub,
    textAlign: 'center',
  },
  countdownNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  resultContent: {
    padding: 20,
    gap: 16,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  resultSubtitle: {
    fontSize: 13,
    color: COLORS.textSub,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  resultType: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textBody,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  actionButtons: {
    gap: 10,
  },
  retryButton: {
    backgroundColor: COLORS.btnPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: COLORS.btnSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
