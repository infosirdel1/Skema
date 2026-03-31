import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const ORANGE = '#FF7A00';

type SkedioLogoProps = {
  /** Remplacez par `Image` + `require('./assets/logo.png')` si vous ajoutez le fichier logo. */
  size?: 'md' | 'lg';
};

export function SkedioLogo({ size = 'md' }: SkedioLogoProps) {
  const fontSize = size === 'lg' ? 26 : 20;
  const barHeight = size === 'lg' ? 22 : 18;

  return (
    <View style={styles.row}>
      <View style={[styles.accentBar, { height: barHeight }]} />
      <Text
        style={[styles.wordmark, { fontSize, marginLeft: 10 }]}
        accessibilityRole="header"
      >
        <Text style={styles.wordDark}>Sked</Text>
        <Text style={[styles.wordOrange, { fontSize }]}>io</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: 3,
    borderRadius: 1.5,
    backgroundColor: ORANGE,
  },
  wordmark: {
    fontWeight: '700',
    letterSpacing: -0.8,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif-medium' },
      default: {},
    }),
  },
  wordDark: {
    color: '#0A0A0A',
  },
  wordOrange: {
    color: ORANGE,
    fontWeight: '700',
  },
});
