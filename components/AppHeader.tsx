import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const LOGO = require("@/assets/images/logo.png");

export type AppHeaderProps = {
  /** Si `false`, jamais de flèche (ex. onglet Accueil). Sinon : retour seulement si `router.canGoBack()`. */
  showBack?: boolean;
};

export default function AppHeader({ showBack }: AppHeaderProps) {
  const router = useRouter();
  const canBack = router.canGoBack();
  const displayBack = showBack !== false && canBack;

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {displayBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>

      <View style={styles.logoCenter} pointerEvents="none">
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.side}>
        <View style={styles.sideSpacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2A2A2A",
    backgroundColor: "#0B0B0B",
  },
  side: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideSpacer: {
    width: 40,
    height: 40,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logoCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
});
