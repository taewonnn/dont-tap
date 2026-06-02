import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, BANNER_AD_GROUP_ID } from '../constants';
import { SafeInlineAd } from '../ads';
import type { GameResult } from '../types';

type ResultScreenProps = {
  result: GameResult;
  onRetry: () => void;
  onShare: () => void;
};

export function ResultScreen({ result, onRetry, onShare }: ResultScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content}>
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

      <View style={styles.bannerArea}>
        <SafeInlineAd
          adGroupId={BANNER_AD_GROUP_ID}
          theme="auto"
          tone="blackAndWhite"
          variant="expanded"
          impressFallbackOnMount={true}
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>광고 보고 다시하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>결과 공유하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
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
  bannerArea: {
    width: '100%',
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
