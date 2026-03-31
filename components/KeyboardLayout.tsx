import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export const KEYBOARD_VERTICAL_OFFSET_IOS = 80;

/** Props communes à `KeyboardAvoidingView` (écrans type wizard : scroll + footer fixe). */
export function getKeyboardAvoidingScreenProps() {
  return {
    style: styles.flex,
    behavior: (Platform.OS === "ios" ? "padding" : "height") as "padding" | "height",
    keyboardVerticalOffset: Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET_IOS : 0,
  };
}

type KeyboardLayoutProps = {
  children: React.ReactNode;
  /** Fusionné avec `contentContainerStyle` du `ScrollView` (ex. `justifyContent: 'space-between'`). */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Zone plein écran : clavier → contenu remonte, tap hors champ → dismiss.
 * À utiliser pour les écrans dont tout le contenu est dans un scroll (ex. profil).
 */
export default function KeyboardLayout({ children, contentContainerStyle }: KeyboardLayoutProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET_IOS : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.flex}>{children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#0B0B0B" },
  scrollContent: { flexGrow: 1, backgroundColor: "#0B0B0B" },
});
