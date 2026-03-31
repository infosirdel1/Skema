import { useEffect, useRef, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import { resetPvDraft, loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";
import { validateEAN, validateIN } from "@/lib/pvValidation";

export default function PvCompteurScreen() {
  console.log("FILE:", "(tabs)/pv-create/compteur.js");

  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [eanSuffix, setEanSuffix] = useState("");
  const [errors, setErrors] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const data = await loadPvDraft();
      setDraft(data);
      const suffix = (data?.meter?.ean || "").startsWith("541") ? data.meter.ean.slice(3) : "";
      setEanSuffix(suffix);
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
      meter: {
        ...draft.meter,
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
    const fullEan = `541${eanSuffix}`;
    const eanError = validateEAN(fullEan);
    const inError = validateIN(String(draft.meter.nominalCurrent || ""));

    if (eanError || inError) {
      setErrors({
        ean: eanError,
        in: inError
      });
      return;
    }

    await persist(draft);
    router.push("/pv-create/pv");
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  const handleReset = async () => {
    await resetPvDraft();

    const fresh = await loadPvDraft();
    setDraft(fresh);

    // reset états locaux si présents
    setEanSuffix("");
    
    Alert.alert("Données réinitialisées");
  };

  if (!draft) return null;

  const canContinue =
    !errors.ean &&
    !errors.in &&
    draft.meter.ean.trim().length === 18 &&
    draft.meter.number.trim().length > 0 &&
    String(draft.meter.nominalCurrent || "").trim().length > 0;

  const computedEanSuffix = (draft.meter.ean || "").startsWith("541")
    ? draft.meter.ean.slice(3)
    : "";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <PvStepLayout
          step={4}
          totalSteps={5}
          title="Compteur"
          subtitle="Renseigne les informations de compteur : EAN, numéro compteur et intensité nominale (IN)."
          onNext={handleNext}
          onBack={handleBack}
          onSave={handleSave}
          disableNext={!canContinue}
          nextLabel="Continuer"
        >
          <View style={styles.stack}>
            <PvFieldCard
              label="Numéro compteur"
              value={draft.meter.number}
              onChangeText={(value) => updateField("number", value)}
              placeholder="Ex. 12A34B5678"
            />

            <View style={styles.card}>
              <Text style={styles.label}>Code EAN</Text>
              <View style={styles.eanRow}>
                <View style={styles.eanPrefix}>
                  <Text style={styles.eanPrefixText}>541</Text>
                </View>
                <TextInput
                  value={computedEanSuffix}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/\D/g, "").slice(0, 15);
                    setEanSuffix(cleaned);
                    updateField("ean", `541${cleaned}`);
                    const error = validateEAN(`541${cleaned}`);
                    setErrors(prev => ({ ...prev, ean: error }));
                  }}
                  placeholder="15 chiffres restants"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="number-pad"
                  maxLength={15}
                  style={styles.eanInput}
                />
              </View>
              {errors.ean && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {errors.ean}
                </Text>
              )}
            </View>

            <PvFieldCard
              label="Courant nominal (IN)"
              value={String(draft.meter.nominalCurrent || "")}
              onChangeText={(value) => {
                updateField("nominalCurrent", value);
                const error = validateIN(value);
                setErrors(prev => ({ ...prev, in: error }));
              }}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollTo({
                    y: 300,
                    animated: true
                  });
                }, 150);
              }}
              error={errors.in}
              placeholder="ex: 40A, 63A..."
            />

            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset données</Text>
            </Pressable>
          </View>
        </PvStepLayout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  card: {
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  eanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eanPrefix: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  eanPrefixText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  eanInput: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#E50914",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
