import { useEffect, useState } from "react";
import { View, Alert, StyleSheet, TextInput, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvChoiceCard from "@/components/pv/PvChoiceCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";
import { CONTROL_ORGANISMS } from "@/lib/controlOrganisms";

export default function PvOrganismeScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState("");

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

  async function selectOrganisme(organism) {
    const nextDraft = {
      ...draft,
      organisme: {
        name: organism?.name || "",
        address: organism?.address || "",
        vat: organism?.vat || "",
        phone: organism?.phone || "",
        email: organism?.email || "",
        value: organism?.value || "",
      },
    };
    await persist(nextDraft);
  }

  async function setAsDefaultOrganism() {
    if (!draft?.organisme?.name) return;
    const nextDraft = {
      ...draft,
      userProfile: {
        ...draft.userProfile,
        defaultOrganism: {
          name: draft.organisme?.name || "",
          address: draft.organisme?.address || "",
          vat: draft.organisme?.vat || "",
          phone: draft.organisme?.phone || "",
          email: draft.organisme?.email || "",
          value: draft.organisme?.value || "",
        },
      },
    };
    await persist(nextDraft);
    Alert.alert("Profil mis à jour", "Organisme par défaut enregistré");
  }

  async function handleSave() {
    const saved = await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Brouillon enregistré (${saved.meta.version})`);
  }

  async function handleNext() {
    await persist(draft);
    router.push("/pv-create/reseau");
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  if (!draft) return null;

  const filteredOrganismes = CONTROL_ORGANISMS.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PvStepLayout
      step={3}
      totalSteps={5}
      title="Organisme agréé"
      subtitle="Choisis l’organisme lié au document. Cette étape doit rester ultra simple."
      onNext={handleNext}
      onBack={handleBack}
      onSave={handleSave}
      disableNext={!draft.organisme.name}
    >
      <View style={styles.stack}>
        {!!draft.userProfile?.defaultOrganism?.name && (
          <View style={styles.defaultWrap}>
            <Text style={styles.defaultLabel}>Organisme par défaut</Text>
            <PvChoiceCard
              label={draft.userProfile.defaultOrganism.name}
              selected={draft.organisme.name === draft.userProfile.defaultOrganism.name}
              onPress={() => selectOrganisme(draft.userProfile.defaultOrganism)}
            />
          </View>
        )}

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un organisme"
          placeholderTextColor="#A0A0A0"
          style={styles.searchInput}
        />

        {filteredOrganismes.map((item) => (
          <PvChoiceCard
            key={item.value}
            label={item.name}
            selected={draft.organisme.name === item.name}
            onPress={() => selectOrganisme(item)}
          />
        ))}

        {!!draft.organisme.name && (
          <Pressable style={styles.defaultButton} onPress={setAsDefaultOrganism}>
            <Text style={styles.defaultButtonText}>Définir comme organisme par défaut</Text>
          </Pressable>
        )}
      </View>
    </PvStepLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  defaultWrap: {
    gap: 8,
  },
  defaultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  defaultButton: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#E50914",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  defaultButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
