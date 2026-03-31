import { useEffect, useState } from "react";
import { View, Alert, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import PvChoiceCard from "@/components/pv/PvChoiceCard";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";

export default function PvPanneauxScreen() {
  console.log("FILE:", "(tabs)/pv-create/panneaux.js");

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

  async function updatePanelsField(key, value) {
    const nextPanels = {
      ...(draft?.panels || {}),
      [key]: value,
    };

    const count = Number(nextPanels.count);
    const powerWp = Number(nextPanels.powerWp);
    const totalPower =
      Number.isFinite(count) && count > 0 && Number.isFinite(powerWp) && powerWp > 0
        ? count * powerWp
        : null;

    const nextDraft = {
      ...draft,
      panels: {
        ...nextPanels,
        totalPower,
      },
    };

    await persist(nextDraft);
  }

  async function handleSave() {
    const saved = await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Version : ${saved.meta.version}`);
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  async function handleNext() {
    const panels = draft?.panels || {};
    if (!panels.count || !panels.powerWp) {
      Alert.alert("Veuillez compléter les panneaux");
      return;
    }
    await persist(draft);
    Alert.alert("OK", "Étape panneaux validée");
  }

  if (!draft) return null;

  const panels = draft.panels || {};
  const totalKwc =
    panels.totalPower !== null && panels.totalPower !== undefined
      ? (Number(panels.totalPower) / 1000).toFixed(2)
      : null;

  return (
    <PvStepLayout
      step={6}
      totalSteps={6}
      title="Panneaux photovoltaïques"
      subtitle="Renseigne les informations utiles des panneaux pour préparer le schéma."
      onNext={handleNext}
      onBack={handleBack}
      onSave={handleSave}
      nextLabel="Terminer"
    >
      <View style={styles.stack}>
        <PvFieldCard
          label="Nombre de panneaux"
          value={panels.count == null ? "" : String(panels.count)}
          onChangeText={(value) => {
            const n = Number(value);
            if (value === "" || !Number.isFinite(n) || n < 1) {
              updatePanelsField("count", null);
              return;
            }
            updatePanelsField("count", Math.floor(n));
          }}
          placeholder="ex: 12"
        />
        <View style={styles.choiceGroup}>
          {[8, 10, 12, 16].map((value) => (
            <PvChoiceCard
              key={`count-${value}`}
              label={`${value} panneaux`}
              selected={Number(panels.count) === value}
              onPress={() => updatePanelsField("count", value)}
            />
          ))}
        </View>

        <PvFieldCard
          label="Puissance panneau (Wc)"
          value={panels.powerWp == null ? "" : String(panels.powerWp)}
          onChangeText={(value) => {
            const n = Number(value);
            if (value === "" || !Number.isFinite(n)) {
              updatePanelsField("powerWp", null);
              return;
            }
            updatePanelsField("powerWp", n);
          }}
          placeholder="ex: 400"
        />
        <View style={styles.choiceGroup}>
          {[375, 400, 425, 450].map((value) => (
            <PvChoiceCard
              key={`power-${value}`}
              label={`${value} Wc`}
              selected={Number(panels.powerWp) === value}
              onPress={() => updatePanelsField("powerWp", value)}
            />
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Puissance totale : {totalKwc ? `${totalKwc} kWc` : "—"}
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
  totalCard: {
    borderRadius: 12,
    backgroundColor: "#151515",
    padding: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  choiceGroup: {
    gap: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
