import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/AppHeader";

export default function BorneCreateScreen() {
  console.log("FILE:", "(tabs)/borne-create.tsx");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <View style={styles.container}>
        <Text style={styles.placeholder}>Flux borne — contenu à venir</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" },
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 16 },
  placeholder: { fontSize: 16, color: "#A0A0A0", fontWeight: "400" },
});
