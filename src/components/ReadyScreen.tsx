import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, BANNER_AD_GROUP_ID } from '../constants';
import { SafeInlineAd } from '../ads';

type ReadyScreenProps = {
  onStart: () => void;
};

export function ReadyScreen({ onStart }: ReadyScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>가짜 버튼 피하기</Text>
        <Text style={styles.subtitle}>
          진짜 버튼만 빠르게 눌러보세요.{'\n'}낚시 버튼을 누르면 점수가 깎입니다.
        </Text>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>게임 규칙</Text>
          <Text style={styles.rulesItem}>정답 버튼 +100점</Text>
          <Text style={styles.rulesItem}>오답 버튼 -80점, -2초</Text>
          <Text style={styles.rulesItem}>5콤보마다 +50점 보너스</Text>
          <Text style={styles.rulesItem}>제한 시간 30초</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>30초 안에 당신의 낚시 버튼 저항력을 측정해요.</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  bannerArea: {
    width: '100%',
  },
});
