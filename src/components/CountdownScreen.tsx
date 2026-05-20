import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

type CountdownScreenProps = {
  count: number;
};

export function CountdownScreen({ count }: CountdownScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count > 0 ? count : '시작!'}</Text>
    </View>
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
