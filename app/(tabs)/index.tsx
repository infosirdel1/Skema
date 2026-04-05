import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Svg, { Rect } from 'react-native-svg';

const T = {
  bg: '#0A0A0A',
  card: '#151515',
  cardActive: '#181818',
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderMedium: 'rgba(255,255,255,0.12)',
  textPrimary: '#F5F5F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  accent: '#C8102E',
  accentPressed: '#A60D25',
  accentBorder: 'rgba(200,16,46,0.45)',
  divider: 'rgba(255,255,255,0.06)',
};

type SelectedSchemaType = 'pv' | 'borne' | 'facteurs' | 'circuits';

function BackgroundWaves() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice">
      <Rect x="0" y="0" width="375" height="812" fill={T.bg} />
    </Svg>
  );
}

const ICON_SIZE = 22;
const ICON_COLOR = T.textPrimary;

function ChoiceCard({
  label,
  icon,
  selected,
  onPress,
  variant: _variant,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  variant?: 'default' | 'grid' | 'compact';
}) {
  return (
    <View
      style={[
        styles.moduleOuter,
        selected && styles.moduleOuterSelected,
        {
          shadowColor: '#000000',
          shadowOpacity: 0.22,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.modulePress, pressed && styles.modulePressFeedback]}
      >
        {selected ? <View style={styles.moduleBar} /> : null}
        <View style={styles.moduleRow}>
          <View style={styles.moduleIconWrap}>{icon}</View>
          <View style={styles.moduleIconTextGap} />
          <Text style={styles.moduleTitle} numberOfLines={2}>
            {label}
          </Text>
          <View style={styles.moduleChevronWrap}>
            <Feather name="chevron-right" size={16} color={T.textMuted} style={styles.moduleChevronIcon} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SelectedSchemaType | null>(null);

  useEffect(() => {
    console.log("ECRAN TABS/INDEX CHARGÉ");
  }, []);

  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const horizontalPad = 24;
  const gridMaxWidth = Math.min(width - horizontalPad * 2, 980);
  const cardGap = 12;
  const cardCellWidth = Math.min(420, Math.max(120, (gridMaxWidth - cardGap) / 2));
  const buttonMaxWidth = Math.min(Math.min(width - horizontalPad * 2, 980), 420);

  function navigateFromSelection() {
    if (!selectedType) return;
    if (selectedType === 'pv') {
      router.push('/pv-create/client');
      return;
    }
    if (selectedType === 'borne') {
      router.push('/borne-create');
      return;
    }
    if (selectedType === 'facteurs') {
      router.push('/facteurs/adresse');
      return;
    }
    if (selectedType === 'circuits') {
      router.push('/circuits');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {Platform.OS !== "web" && <BackgroundWaves />}
        </View>

        <ScrollView
          style={styles.scroll}
          scrollEnabled={!isMobile}
          contentContainerStyle={[
            styles.scrollContent,
            isMobile && styles.scrollContentMobile,
            { paddingHorizontal: horizontalPad, paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo Skedio"
            />
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>Vos schémas électriques</Text>
            <Text style={styles.subtitle}>PV ou borne, en quelques minutes</Text>
          </View>

          <View style={styles.techLine} />

          <View
            style={[
              styles.cardsContainer,
              isMobile && styles.cardsContainerMobile,
              { maxWidth: gridMaxWidth, gap: cardGap },
            ]}
          >
            <View style={[styles.cardCell, isMobile ? styles.cardCellMobile : { width: cardCellWidth }]}>
              <ChoiceCard
                variant={isMobile ? 'compact' : 'grid'}
                label="Photovoltaïque"
                icon={<Feather name="sun" size={ICON_SIZE} color={ICON_COLOR} />}
                selected={selectedType === 'pv'}
                onPress={() => setSelectedType('pv')}
              />
            </View>
            <View style={[styles.cardCell, isMobile ? styles.cardCellMobile : { width: cardCellWidth }]}>
              <ChoiceCard
                variant={isMobile ? 'compact' : 'grid'}
                label="Borne"
                icon={<Feather name="battery-charging" size={ICON_SIZE} color={ICON_COLOR} />}
                selected={selectedType === 'borne'}
                onPress={() => setSelectedType('borne')}
              />
            </View>
            <View style={[styles.cardCell, isMobile ? styles.cardCellMobile : { width: cardCellWidth }]}>
              <ChoiceCard
                variant={isMobile ? 'compact' : 'grid'}
                label={"Facteurs d'influences externes"}
                icon={<Feather name="wind" size={ICON_SIZE} color={ICON_COLOR} />}
                selected={selectedType === 'facteurs'}
                onPress={() => setSelectedType('facteurs')}
              />
            </View>
            <View style={[styles.cardCell, isMobile ? styles.cardCellMobile : { width: cardCellWidth }]}>
              <ChoiceCard
                variant={isMobile ? 'compact' : 'grid'}
                label="Circuits sécurité / critiques"
                icon={<Feather name="shield" size={ICON_SIZE} color={ICON_COLOR} />}
                selected={selectedType === 'circuits'}
                onPress={() => setSelectedType('circuits')}
              />
            </View>
          </View>

          <View style={[styles.buttonSection, isMobile && styles.createButton]}>
            <Pressable
              disabled={!selectedType}
              onPress={navigateFromSelection}
              style={({ pressed }) => [
                styles.ctaButton,
                { maxWidth: buttonMaxWidth, width: '100%' },
                !selectedType && styles.ctaButtonDisabled,
                pressed && selectedType && styles.ctaButtonPressed,
              ]}
            >
              <Text style={styles.ctaText}>Créer un schéma</Text>
              <Feather name="chevron-right" size={14} color="#FFFFFF" style={styles.ctaChevron} />
            </Pressable>
          </View>

          {!isMobile ? <View style={{ height: 24 }} /> : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  logo: {
    width: 132,
    height: 36,
    alignSelf: 'center',
    opacity: 0.96,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  scrollContentMobile: {
    justifyContent: 'flex-start',
  },

  textSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    width: '82%',
    alignSelf: 'center',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: T.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    width: '78%',
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0,
    color: T.textSecondary,
    textAlign: 'center',
    marginBottom: 0,
  },
  techLine: {
    width: 56,
    height: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: 24,
  },

  cardsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'center',
  },
  cardsContainerMobile: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
  },
  cardCell: {
    alignSelf: 'stretch',
  },
  cardCellMobile: {
    width: '100%',
    alignSelf: 'center',
  },

  moduleOuter: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    backgroundColor: T.card,
    overflow: 'hidden',
  },
  moduleOuterSelected: {
    borderColor: T.accentBorder,
    backgroundColor: T.cardActive,
  },
  modulePress: {
    position: 'relative',
    minHeight: 84,
    justifyContent: 'center',
  },
  modulePressFeedback: {
    opacity: 0.98,
  },
  moduleBar: {
    position: 'absolute',
    left: 12,
    top: 26,
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: T.accent,
    zIndex: 1,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 84,
    paddingHorizontal: 18,
    paddingVertical: 0,
    zIndex: 2,
  },
  moduleIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconTextGap: {
    width: 14,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: T.textPrimary,
    textAlign: 'left',
  },
  moduleChevronWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleChevronIcon: {
    opacity: 0.9,
  },

  buttonSection: { width: '100%', alignItems: 'center', marginTop: 18 },
  createButton: {
    marginBottom: 0,
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: T.accent,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.45,
  },
  ctaButtonPressed: {
    backgroundColor: T.accentPressed,
    transform: [{ scale: 0.995 }],
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaChevron: {
    marginLeft: 8,
  },
});
