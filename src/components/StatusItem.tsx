import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

type StatusItemProps = {
  label: string;
  value: string;
  highlight?: boolean;
  highlightColor?: string;
};

export function StatusItem({ label, value, highlight = false, highlightColor = COLORS.error }: StatusItemProps) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, highlight && { color: highlightColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
