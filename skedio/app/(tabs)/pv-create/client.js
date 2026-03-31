import { useEffect, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";

export default function PvClientScreen() {
  console.log("FILE:", "(tabs)/pv-create/client.js");

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

  async function updateField(key, value) {
    const nextDraft = {
      ...draft,
      client: {
        ...draft.client,
        [key]: value,
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
    router.push("/pv-create/adresse");
  }

  if (!draft) return null;

  const canContinue = draft.client.name.trim().length > 0;

  return (
    <PvStepLayout
      step={1}
      totalSteps={4}
      title="Client"
      subtitle="Renseigne les informations principales du client. On garde ça simple et rapide."
      onNext={handleNext}
      onSave={handleSave}
      disableNext={!canContinue}
      backLabel="Accueil"
      onBack={() => router.replace("/")}
    >
      <View style={styles.stack}>
        <PvFieldCard
          label="Nom du client"
          value={draft.client.name}
          onChangeText={(value) => updateField("name", value)}
          placeholder="Nom et prénom"
        />

        <PvFieldCard
          label="Téléphone"
          value={draft.client.phone}
          onChangeText={(value) => updateField("phone", value)}
          placeholder="Ex. 0470 00 00 00"
          optional
        />

        <PvFieldCard
          label="Email"
          value={draft.client.email}
          onChangeText={(value) => updateField("email", value)}
          placeholder="Ex. client@email.com"
          optional
        />

        <PvFieldCard
          label="Référence chantier"
          value={draft.client.reference}
          onChangeText={(value) => updateField("reference", value)}
          placeholder="Ex. toiture sud"
          optional
        />
      </View>
    </PvStepLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
});
