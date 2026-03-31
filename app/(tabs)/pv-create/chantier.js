import { useEffect, useState } from "react";
import { View, Alert, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";

export default function PvChantierScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await loadPvDraft();
      setDraft(data);
      setLoading(false);
    })();
  }, []);

  async function persist(nextDraft, options = {}) {
    setDraft(nextDraft);
    const saved = await savePvDraft(nextDraft, options);
    setDraft(saved);
    return saved;
  }

  async function updateField(section, key, value) {
    const nextDraft = {
      ...draft,
      [section]: {
        ...draft[section],
        [key]: value,
      },
    };
    await persist(nextDraft);
  }

  async function handleAddressSearchFake() {
    const nextDraft = {
      ...draft,
      address: {
        ...draft.address,
        query: draft.address.query,
        street: "Rue de l’Exemple 12",
        postalCode: "1000",
        city: "Bruxelles",
      },
    };
    await persist(nextDraft);
  }

  async function handleSave() {
    await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Brouillon enregistré (${draft?.meta?.version || "version mise à jour"})`);
  }

  async function handleNext() {
    await persist(draft);
    router.push("/pv-create/organisme");
  }

  if (loading || !draft) return null;

  const canContinue =
    draft.client.name.trim().length > 0 &&
    draft.address.street.trim().length > 0 &&
    draft.address.postalCode.trim().length > 0 &&
    draft.address.city.trim().length > 0;

  return (
    <PvStepLayout
      step={1}
      totalSteps={3}
      title="Informations chantier"
      subtitle="Commence par les données du client et l’adresse du chantier. On garde ça simple, propre et rapide."
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
          onChangeText={(value) => updateField("client", "name", value)}
          placeholder="Nom et prénom"
        />

        <PvFieldCard
          label="Téléphone"
          value={draft.client.phone}
          onChangeText={(value) => updateField("client", "phone", value)}
          placeholder="Ex. 0470 00 00 00"
          optional
        />

        <PvFieldCard
          label="Email"
          value={draft.client.email}
          onChangeText={(value) => updateField("client", "email", value)}
          placeholder="Ex. client@email.com"
          optional
        />

        <PvFieldCard
          label="Référence chantier"
          value={draft.client.reference}
          onChangeText={(value) => updateField("client", "reference", value)}
          placeholder="Ex. Maison arrière / toiture sud"
          optional
        />

        <View style={styles.addressCard}>
          <Text style={styles.addressTitle}>Adresse du chantier</Text>
          <Text style={styles.addressText}>
            Recherche obligatoire. Pour l’instant, on prépare une base propre avec un bouton de recherche simulé.
          </Text>

          <PvFieldCard
            label="Recherche adresse"
            value={draft.address.query}
            onChangeText={(value) => {
              setDraft((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  query: value,
                },
              }));
            }}
            placeholder="Rue, numéro, code postal, ville"
          />

          <Pressable style={styles.searchButton} onPress={handleAddressSearchFake}>
            <Text style={styles.searchButtonText}>Rechercher l’adresse</Text>
          </Pressable>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Adresse sélectionnée</Text>
            <Text style={styles.previewValue}>{draft.address.street || "—"}</Text>
            <Text style={styles.previewValue}>
              {draft.address.postalCode || "—"} {draft.address.city || ""}
            </Text>
          </View>
        </View>

        <View style={styles.signatureBox}>
          <Text style={styles.signatureTitle}>Signature client</Text>
          <Text style={styles.signatureText}>
            Elle sera proposée ici plus tard, sans bloquer l’avancement. Si elle n’est pas faite maintenant, on la reproposera à la fin.
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
  addressCard: {
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#A0A0A0",
    fontWeight: "400",
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
  previewBox: {
    borderRadius: 12,
    backgroundColor: "#111111",
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  previewLabel: {
    fontSize: 14,
    color: "#A0A0A0",
    fontWeight: "400",
  },
  previewValue: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  signatureBox: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 8,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  signatureText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#A0A0A0",
    fontWeight: "400",
  },
});
