import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { SkedioLogo } from '../components/SkedioLogo';
import { UnifilarIllustration } from '../components/UnifilarIllustration';

const ORANGE = '#FF7A00';
const BLACK = '#0A0A0A';
const SUB = '#5C5C5C';
const FOOTER = '#A3A3A3';

export type LandingScreenProps = {
  onCreatePress?: () => void;
  versionLabel?: string;
};

export function LandingScreen({
  onCreatePress,
  versionLabel = 'Skedio · v0.1',
}: LandingScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <SkedioLogo size="md" />
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>
            Créez vos schémas électriques en quelques minutes
          </Text>
          <Text style={styles.subtitle}>
            PV ou borne, unifilaire et position générés automatiquement
          </Text>
          <Pressable
            onPress={onCreatePress}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            accessibilityRole="button"
            accessibilityLabel="Créer un schéma"
          >
            <Text style={styles.ctaLabel}>Créer un schéma</Text>
          </Pressable>
        </View>

        <View style={styles.illustrationBlock}>
          <UnifilarIllustration />
        </View>

        <View style={styles.features}>
          <FeatureRow
            icon={<IconFast />}
            title="Rapide"
            description="Flux guidé, peu de saisies, rendu immédiat."
          />
          <View style={styles.featureDivider} />
          <FeatureRow
            icon={<IconReliable />}
            title="Fiable"
            description="Symboles et liaisons cohérents, structure lisible."
          />
          <View style={styles.featureDivider} />
          <FeatureRow
            icon={<IconRgie />}
            title="Conforme RGIE"
            description="Repères et conventions adaptés au terrain belge."
          />
        </View>

        <Text style={styles.footer}>{versionLabel}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.featureTextCol}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

function IconFast() {
  return (
    <View style={iconStyles.fastCol}>
      <View style={[iconStyles.hStroke, { width: 18 }]} />
      <View style={[iconStyles.hStroke, { width: 14, marginTop: 5, marginLeft: 4 }]} />
      <View style={[iconStyles.hStroke, { width: 10, marginTop: 5, marginLeft: 8 }]} />
    </View>
  );
}

function IconReliable() {
  return (
    <View style={iconStyles.reliableWrap}>
      <View style={iconStyles.reliableRing}>
        <Text style={iconStyles.reliableMark}>✓</Text>
      </View>
    </View>
  );
}

function IconRgie() {
  return (
    <View style={iconStyles.rgieWrap}>
      <View style={iconStyles.rgieFrame}>
        <View style={iconStyles.rgieLine} />
        <View style={[iconStyles.rgieLine, { width: 10, marginTop: 3 }]} />
        <View style={[iconStyles.rgieLine, { width: 8, marginTop: 3 }]} />
      </View>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  fastCol: {
    width: 28,
    height: 28,
    justifyContent: 'center',
  },
  hStroke: {
    height: 2,
    backgroundColor: BLACK,
    borderRadius: 1,
    alignSelf: 'flex-start',
  },
  reliableWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reliableRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reliableMark: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '600',
    marginTop: -1,
  },
  rgieWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rgieFrame: {
    width: 15,
    height: 19,
    borderWidth: 1.5,
    borderColor: BLACK,
    borderRadius: 2,
    paddingTop: 5,
    paddingHorizontal: 3,
  },
  rgieLine: {
    height: 1.5,
    width: 7,
    backgroundColor: BLACK,
    borderRadius: 1,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  hero: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: BLACK,
    letterSpacing: -0.6,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  subtitle: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: SUB,
    letterSpacing: -0.1,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  cta: {
    marginTop: 28,
    alignSelf: 'flex-start',
    backgroundColor: ORANGE,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  illustrationBlock: {
    marginTop: 36,
    marginBottom: 8,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
  },
  features: {
    marginTop: 36,
    paddingTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  iconSlot: {
    width: 36,
    paddingTop: 2,
  },
  featureTextCol: {
    flex: 1,
    paddingLeft: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BLACK,
    letterSpacing: -0.2,
  },
  featureDesc: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: SUB,
  },
  featureDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5E5',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: FOOTER,
    letterSpacing: 0.2,
  },
});
