import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';

type CountdownScreenProps = {
  count: number;
};

export function CountdownScreen({ count }: CountdownScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.number}>{count > 0 ? count : '시작!'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});
