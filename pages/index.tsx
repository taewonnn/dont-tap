import { createRoute } from '@granite-js/react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Share } from 'react-native';
import { COLORS, BUTTON_SIZE_MAP, INTERSTITIAL_AD_GROUP_ID, BANNER_AD_GROUP_ID } from '../src/constants';
import { _loadFullScreenAd, _showFullScreenAd, SafeInlineAd } from '../src/ads';
import { pickMission, createButtons, generatePhase1Mission } from '../src/missions';
import { getResultType } from '../src/game';
import { StatusItem } from '../src/components/StatusItem';
import { ReadyScreen } from '../src/components/ReadyScreen';
import { CountdownScreen } from '../src/components/CountdownScreen';
import { ResultScreen } from '../src/components/ResultScreen';
import type { GameState, ButtonDef, MissionDef, GameResult } from '../src/types';

export const Route = createRoute('/', {
  component: GamePage,
});

function GamePage() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentMission, setCurrentMission] = useState<MissionDef>(() => generatePhase1Mission());
  const [buttons, setButtons] = useState<ButtonDef[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [roundProgress, setRoundProgress] = useState(1);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

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

    if (_loadFullScreenAd?.isSupported()) {
      _loadFullScreenAd({
        options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
        onEvent: event => {
          if (event.type === 'loaded') setIsInterstitialLoaded(true);
        },
        onError: () => setIsInterstitialLoaded(false),
      });
    }
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

  const handleButtonClick = useCallback(
    (button: ButtonDef) => {
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
    },
    [endGame, startNewRound, showFeedback]
  );

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
    setIsInterstitialLoaded(false);
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
    if (_showFullScreenAd?.isSupported() && isInterstitialLoaded) {
      _showFullScreenAd({
        options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
        onEvent: event => {
          if (event.type === 'dismissed') startGame();
          if (event.type === 'failedToShow') startGame();
        },
        onError: () => startGame(),
      });
    } else {
      startGame();
    }
  }, [isInterstitialLoaded, startGame]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const rankMap: Record<string, string> = {
      '버튼 감별사': '상위 5%',
      '침착한 고수': '상위 15%',
      '신중한 생존자': '상위 30%',
      '빠른 급발진러': '하위 40%',
      '광고 배너 헌터': '하위 60%',
    };
    const rank = rankMap[result.resultType] ?? '';
    const summary = `낚시 버튼 저항력 ${rank} | ${result.resultType} | ${result.score}점`;

    try {
      let shareLink = '';
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getTossShareLink } = require('@apps-in-toss/native-modules') as {
          getTossShareLink: (scheme: string) => Promise<string>;
        };
        shareLink = await getTossShareLink('intoss://dont-tap');
      } catch {
        // 링크 생성 실패 시 텍스트만 공유
      }
      const message = shareLink ? `${summary}\n\n너도 도전해봐!\n${shareLink}` : summary;
      await Share.share({ message });
    } catch {
      // 공유 실패 무시
    }
  }, [result]);

  if (gameState === 'ready') {
    return <ReadyScreen onStart={startGame} />;
  }

  if (gameState === 'countdown') {
    return <CountdownScreen count={countdown} />;
  }

  if (gameState === 'finished' && result) {
    return <ResultScreen result={result} onRetry={handleRetry} onShare={handleShare} />;
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

      <View style={styles.bannerArea}>
        <SafeInlineAd
          adGroupId={BANNER_AD_GROUP_ID}
          theme="auto"
          tone="blackAndWhite"
          variant="expanded"
          impressFallbackOnMount={true}
        />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
  bannerArea: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
