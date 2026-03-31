import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const LINE = '#141414';
const MUTED = '#7A7A7A';

/**
 * Schéma unifilaire stylisé (lignes fines, alignées) — uniquement des Views, sans SVG externe.
 */
export function UnifilarIllustration() {
  return (
    <View style={styles.wrap} accessibilityLabel="Schéma unifilaire stylisé">
      <View style={styles.bus} />

      <View style={styles.branchesRow}>
        <Branch />
        <Branch />
        <Branch />
      </View>

      <View style={styles.symbolsRow}>
        <DiffSymbol />
        <InverterSymbol />
        <EvseSymbol />
      </View>

      <View style={styles.labelsRow}>
        <Label text="Diff." />
        <Label text="Ond." />
        <Label text="Borne" />
      </View>
    </View>
  );
}

function Branch() {
  return (
    <View style={styles.branchCol}>
      <View style={styles.drop} />
    </View>
  );
}

function DiffSymbol() {
  return (
    <View style={styles.symBox}>
      <View style={[styles.hLine, { width: 22 }]} />
      <View style={styles.sp4} />
      <View style={styles.diffCore}>
        <View style={styles.diffRect} />
        <View style={styles.diffMid} />
        <View style={styles.diffRect} />
      </View>
    </View>
  );
}

function InverterSymbol() {
  return (
    <View style={styles.symBox}>
      <View style={[styles.hLine, { width: 22 }]} />
      <View style={styles.sp4} />
      <View style={styles.invBox}>
        <View style={styles.invWave}>
          <View style={styles.waveSeg} />
          <View style={[styles.waveSeg, styles.waveSeg2]} />
          <View style={styles.waveSeg} />
        </View>
      </View>
    </View>
  );
}

function EvseSymbol() {
  return (
    <View style={styles.symBox}>
      <View style={[styles.hLine, { width: 22 }]} />
      <View style={styles.sp4} />
      <View style={styles.evse}>
        <View style={styles.evseCircle} />
        <View style={styles.evseStem} />
      </View>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return (
    <View style={styles.labelCol}>
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    paddingVertical: 8,
  },
  bus: {
    height: 2,
    backgroundColor: LINE,
    borderRadius: 1,
    marginHorizontal: 28,
  },
  branchesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 52,
    marginTop: -1,
  },
  branchCol: {
    alignItems: 'center',
    width: 56,
  },
  drop: {
    width: 2,
    height: 28,
    backgroundColor: LINE,
    borderRadius: 1,
  },
  symbolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    marginTop: 4,
  },
  symBox: {
    width: 72,
    alignItems: 'center',
  },
  hLine: {
    height: 2,
    backgroundColor: LINE,
    borderRadius: 1,
  },
  sp4: { height: 4 },
  diffCore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diffRect: {
    width: 10,
    height: 14,
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  diffMid: {
    width: 6,
    height: 2,
    backgroundColor: LINE,
  },
  invBox: {
    width: 40,
    height: 28,
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
  },
  waveSeg: {
    width: 4,
    height: 6,
    backgroundColor: LINE,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  waveSeg2: {
    height: 12,
  },
  evse: {
    alignItems: 'center',
  },
  evseCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: LINE,
  },
  evseStem: {
    width: 2,
    height: 10,
    backgroundColor: LINE,
    marginTop: -1,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    marginTop: 12,
  },
  labelCol: {
    width: 72,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 0.3,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
});
