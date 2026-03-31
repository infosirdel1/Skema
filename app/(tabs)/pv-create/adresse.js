import { useEffect, useState } from "react";
import { View, Alert, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";

export default function PvAdresseScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await loadPvDraft();
      setDraft(data);
    })();
  }, []);

  async function persist(nextDraft, options = {}) {
    setDraft(nextDraft);
    const saved = await savePvDraft(nextDraft, options);
    setDraft(saved);
    return saved;
  }

  async function updateQuery(value) {
    const nextDraft = {
      ...draft,
      address: {
        ...draft.address,
        query: value,
      },
    };
    setDraft(nextDraft);
  }

  async function fakeSearch() {
    const nextDraft = {
      ...draft,
      address: {
        ...draft.address,
        street: "Rue de l’Exemple 12",
        postalCode: "1000",
        city: "Bruxelles",
      },
    };
    await persist(nextDraft);
  }

  async function handleSave() {
    const saved = await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Version : ${saved.meta.version}`);
  }

  async function handleNext() {
    await persist(draft);
    router.push("/pv-create/organisme");
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  if (!draft) return null;

  const canContinue =
    draft.address.street &&
    draft.address.postalCode &&
    draft.address.city;

  return (
    <PvStepLayout
      step={2}
      totalSteps={4}
      title="Adresse du chantier"
      subtitle="Recherche l’adresse pour garantir des données propres."
      onNext={handleNext}
      onBack={handleBack}
      onSave={handleSave}
      disableNext={!canContinue}
    >
      <View style={styles.stack}>
        <PvFieldCard
          label="Recherche adresse"
          value={draft.address.query}
          onChangeText={updateQuery}
          placeholder="Rue, numéro, code postal, ville"
        />

        <Pressable style={styles.searchButton} onPress={fakeSearch}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </Pressable>

        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Adresse sélectionnée</Text>
          <Text style={styles.previewLine}>{draft.address.street || "—"}</Text>
          <Text style={styles.previewLine}>
            {draft.address.postalCode || "—"} {draft.address.city || ""}
          </Text>
        </View>
      </View>
    </PvStepLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  searchButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#E50914",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  preview: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#151515",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  previewTitle: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  previewLine: {
    fontSize: 15,
    color: "#A0A0A0",
    fontWeight: "400",
  },
});
