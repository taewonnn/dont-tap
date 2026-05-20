import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AdEvent, FullScreenAdFn, InlineAdProps } from './types';
import { COLORS } from './constants';

export let _InlineAd: React.ComponentType<InlineAdProps> | null = null;
export let _loadFullScreenAd: FullScreenAdFn | null = null;
export let _showFullScreenAd: FullScreenAdFn | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fw = require('@apps-in-toss/framework');
  _InlineAd = fw.InlineAd ?? null;
  _loadFullScreenAd = fw.loadFullScreenAd ?? null;
  _showFullScreenAd = fw.showFullScreenAd ?? null;
} catch {
  // granite dev 환경 — 광고 없이 동작
}

export function SafeInlineAd(props: InlineAdProps) {
  if (!_InlineAd) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>AD</Text>
      </View>
    );
  }
  const InlineAd = _InlineAd;
  return <InlineAd {...props} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 96,
    backgroundColor: COLORS.btnSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSub,
    letterSpacing: 1.5,
  },
});

export type { AdEvent, FullScreenAdFn, InlineAdProps };
