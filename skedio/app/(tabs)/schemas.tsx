import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AppHeader from "@/components/AppHeader";
import { loadPvDraft } from "@/lib/pvDraftStorage";

const C = {
  bg: "#0B0B0B",
  ink: "#FFFFFF",
  inkMuted: "#A0A0A0",
  borderSoft: "#2A2A2A",
  accent: "#E50914",
};

export default function SchemasListScreen() {
  const router = useRouter();
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const d = await loadPvDraft();
    const name = d?.client?.name?.trim();
    const ref = d?.client?.reference?.trim();
    const version = d?.meta?.version;
    if (name || ref || version) {
      const parts = [name || "Sans nom", ref ? `Réf. ${ref}` : null, version ? `v${version}` : null].filter(
        Boolean
      );
      setDraftLabel(parts.join(" · "));
    } else {
      setDraftLabel(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" colors={["#E50914"]} />
        }
      >
        <Text style={styles.title}>Mes schémas</Text>
        <Text style={styles.subtitle}>Photovoltaïque — brouillon en cours</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.92}
          onPress={() => router.push("/pv-create/client")}
        >
          <View style={styles.cardRow}>
            <Feather name="sun" size={22} color="#FFFFFF" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Photovoltaïque</Text>
              <Text style={styles.cardMeta}>{draftLabel ?? "Aucune donnée saisie — ouvrir pour continuer"}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={C.inkMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.92}
          onPress={() => router.push("/pv-create/client")}
        >
          <Feather name="plus-circle" size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>Nouveau schéma</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 10 },
  title: { fontSize: 20, fontWeight: "600", color: C.ink, marginBottom: 8, letterSpacing: 0.5 },
  subtitle: { fontSize: 16, color: C.inkMuted, marginBottom: 16, fontWeight: "400" },
  card: {
    borderWidth: 1,
    borderColor: C.borderSoft,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#151515",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: C.ink, letterSpacing: 0.5 },
  cardMeta: { fontSize: 14, color: C.inkMuted, marginTop: 4, fontWeight: "400" },
  cta: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.accent,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
});
