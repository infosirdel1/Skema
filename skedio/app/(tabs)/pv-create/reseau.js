import { useEffect, useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvChoiceCard from "@/components/pv/PvChoiceCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";

const networkTypes = [
  "Monophasé 230V",
  "Triphasé 3 x 230V",
  "Triphasé 400V + N",
];

export default function PvReseauScreen() {
  console.log("FILE:", "(tabs)/pv-create/reseau.js");

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

  async function selectNetwork(type) {
    const nextDraft = {
      ...draft,
      network: {
        ...draft.network,
        type,
      },
    };
    await persist(nextDraft);
  }

  async function handleSave() {
    const saved = await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Brouillon enregistré (${saved.meta.version})`);
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  async function handleNext() {
    await persist(draft);
    router.push("/pv-create/compteur");
  }

  if (!draft) return null;

  return (
    <PvStepLayout
      step={4}
      totalSteps={5}
      title="Type de réseau"
      subtitle="Choisis le réseau électrique. On garde le choix visuel, rapide et sans jargon inutile."
      onNext={handleNext}
      onBack={handleBack}
      onSave={handleSave}
      nextLabel="Continuer"
      disableNext={!draft.network.type}
    >
      <View style={styles.stack}>
        {networkTypes.map((item) => (
          <PvChoiceCard
            key={item}
            label={item}
            selected={draft.network.type === item}
            onPress={() => selectNetwork(item)}
          />
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé provisoire</Text>
          <Text style={styles.summaryText}>Client : {draft.client.name || "—"}</Text>
          <Text style={styles.summaryText}>
            Adresse : {draft.address.street || "—"} {draft.address.postalCode || ""} {draft.address.city || ""}
          </Text>
          <Text style={styles.summaryText}>Organisme : {draft.organisme.name || "—"}</Text>
          <Text style={styles.summaryText}>Réseau : {draft.network.type || "—"}</Text>
          <Text style={styles.summaryVersion}>Version : {draft.meta.version || "—"}</Text>
        </View>
      </View>
    </PvStepLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  summaryCard: {
    marginTop: 4,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#A0A0A0",
    fontWeight: "400",
  },
  summaryVersion: {
    marginTop: 8,
    fontSize: 14,
    color: "#A0A0A0",
    fontWeight: "600",
  },
});
