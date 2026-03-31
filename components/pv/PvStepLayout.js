import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";

import { getKeyboardAvoidingScreenProps } from "@/components/KeyboardLayout";
import AppHeader from "@/components/AppHeader";

export default function PvStepLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onSave,
  nextLabel = "Continuer",
  backLabel = "Retour",
  disableNext = false,
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <KeyboardAvoidingView {...getKeyboardAvoidingScreenProps()}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.root}>
            <View style={styles.top}>
              <Text style={styles.eyebrow}>Photovoltaïque</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  Étape {step} sur {totalSteps}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.footerRow}>
                <Pressable style={styles.secondaryButton} onPress={onSave}>
                  <Text style={styles.secondaryButtonText}>Sauvegarder</Text>
                </Pressable>

                {onBack ? (
                  <Pressable style={styles.ghostButton} onPress={onBack}>
                    <Text style={styles.ghostButtonText}>{backLabel}</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.ghostButton} onPress={() => router.back()}>
                    <Text style={styles.ghostButtonText}>{backLabel}</Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                style={[styles.primaryButton, disableNext && styles.primaryButtonDisabled]}
                onPress={onNext}
                disabled={disableNext}
              >
                <Text style={styles.primaryButtonText}>{nextLabel}</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  top: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#A0A0A0",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: "#A0A0A0",
    fontWeight: "400",
  },
  progressWrap: {
    marginTop: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#111111",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#E50914",
    borderRadius: 999,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: "#A0A0A0",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  footerRow: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#E50914",
    borderRadius: 10,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  ghostButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  ghostButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
