import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import PvStepLayout from "@/components/pv/PvStepLayout";
import PvFieldCard from "@/components/pv/PvFieldCard";
import PvChoiceCard from "@/components/pv/PvChoiceCard";
import { loadPvDraft, resetPvDraft, savePvDraft } from "@/lib/pvDraftStorage";
import { validateSerial } from "@/lib/pvValidation";
import inverters from "@/data/inverters.json";

const inverterTypes = [
  { label: "Onduleur central", value: "central" },
  { label: "Micro-onduleurs", value: "micro" },
];

export default function PvInstallationScreen() {
  console.log("PV SCREEN RENDER");
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedInverter, setSelectedInverter] = useState(null);
  const [errors, setErrors] = useState({});
  const scrollRef = useRef(null);

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

  async function updatePvField(key, value) {
    const nextDraft = {
      ...draft,
      pv: {
        ...draft.pv,
        [key]: value,
      },
    };
    await persist(nextDraft);
  }

  async function updatePv(nextPv) {
    const nextDraft = {
      ...draft,
      pv: nextPv,
    };
    await persist(nextDraft);
  }

  async function handleSave() {
    const saved = await persist(draft, { bumpVersion: true });
    Alert.alert("Sauvegardé", `Version : ${saved.meta.version}`);
  }

  async function handleNext() {
    const pv = draft?.pv || {};
    if (validateSerial(pv.inverterSerial)) {
      setErrors((prev) => ({
        ...prev,
        serial: "Numéro requis",
      }));
      return;
    }

    if (!pv.powerKwc || !pv.inverterType || !pv.inverterModel || !pv.inverterSerial) {
      return;
    }

    await persist(draft);
    console.log("NAVIGATION ->", "/pv-create/panneaux");
    router.push("/pv-create/panneaux");
  }

  async function handleBack() {
    await persist(draft);
    router.back();
  }

  async function handleReset() {
    await resetPvDraft();
    const data = await loadPvDraft();
    setDraft(data);
    setBrandQuery("");
    setIsOpen(false);
    setSelectedModel(null);
    Alert.alert("Reset", "Draft réinitialisé");
  }

  if (!draft) return null;
  const pv = draft.pv || {};

  const normalizedInverters = useMemo(() => {
    return (inverters || []).map((inv) => ({
      ...inv,
      brand: String(inv?.brand ?? "").trim(),
      model: String(inv?.model ?? inv?.name ?? "").trim(),
      power: inv?.power ?? inv?.power_kw ?? "",
      phases: inv?.phases ?? inv?.phase ?? "",
      mppt: inv?.mppt ?? inv?.nb_mppt ?? "",
    }));
  }, []);

  const data = inverters;
  const brands = Array.from(
    new Set(data.map((i) => i.brand?.trim().toUpperCase()).filter(Boolean))
  );

  const matchingBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    if (!q) return [];

    return brands.filter((brand) => brand.toLowerCase().includes(q)).slice(0, 10);
  }, [brandQuery, brands]);

  const availableModels = useMemo(() => {
    const exactBrand = matchingBrands.find((b) => b.toLowerCase() === brandQuery.trim().toLowerCase());

    if (!exactBrand) return [];

    return normalizedInverters
      .filter(
        (inv) => inv.brand?.trim().toUpperCase() === exactBrand && inv.model
      )
      .sort((a, b) => a.model.localeCompare(b.model));
  }, [brandQuery, matchingBrands, normalizedInverters]);

  const models = useMemo(() => {
    return availableModels.map((inv, idx) => ({
      ...inv,
      id: `${inv.brand}-${inv.model}-${idx}`,
      name: inv.model,
    }));
  }, [availableModels]);

  const selectedInverterFromSearch = useMemo(() => {
    const exactBrand = matchingBrands.find((b) => b.toLowerCase() === brandQuery.trim().toLowerCase());

    if (!exactBrand || !selectedModel?.name) return null;

    return availableModels.find((inv) => inv.model === selectedModel.name) || null;
  }, [brandQuery, matchingBrands, selectedModel, availableModels]);

  console.log("STATE:", { query: brandQuery, results: matchingBrands, selectedInverter });

  return (
    <>
      {(() => {
        console.log("RENDER JSX");
        return null;
      })()}
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
          step={5}
          totalSteps={6}
          title="Onduleur"
          subtitle="Renseigne les informations de base de l'installation PV."
          onNext={handleNext}
          onBack={handleBack}
          onSave={handleSave}
          nextLabel="Terminer"
        >
          <View style={styles.stack}>
            <View style={styles.choiceGroup}>
              {inverterTypes.map((item) => (
                <PvChoiceCard
                  key={item.value}
                  label={item.label}
                  selected={pv.inverterType === item.value}
                  onPress={() => {
                    updatePv({
                      ...pv,
                      inverterType: item.value,
                      inverterModel: "",
                      inverterSerial: "",
                    });
                    setBrandQuery("");
                    setIsOpen(false);
                    setSelectedModel(null);
                    setSelectedInverter(null);
                    setErrors((prev) => ({ ...prev, serial: null }));
                  }}
                />
              ))}
            </View>

            <View style={{ gap: 12 }}>
              <Text style={styles.text}>Marque</Text>

              <TextInput
                value={brandQuery}
                onChangeText={(value) => {
                  setBrandQuery(value);
                  setSelectedModel(null);
                  setSelectedInverter(null);
                  setIsOpen(false);
                }}
                placeholder="Écrire la marque..."
                autoCapitalize="words"
                style={{
                  borderWidth: 1,
                  borderColor: "#2A2A2A",
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                }}
              />

              {!!brandQuery && matchingBrands.length > 0 && (
                <View style={{ gap: 8 }}>
                  {matchingBrands.map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      onPress={() => {
                        setBrandQuery(brand);
                        setIsOpen(false);
                        setSelectedModel(null);
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: "#2A2A2A",
                        borderRadius: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        backgroundColor: "#151515",
                      }}
                    >
                      <Text style={styles.text}>{brand}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.text}>Modèle</Text>

              {availableModels.length === 0 ? (
                <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                  <Text style={{ color: "#A0A0A0" }}>
                    Sélectionnez d’abord une marque valide
                  </Text>
                </View>
              ) : (
                <Pressable onPress={() => setIsOpen(false)}>
                  <>
                    <Pressable
                      onPress={() => setIsOpen(!isOpen)}
                      style={styles.pvInput}
                    >
                      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                        {selectedModel ? String(selectedModel.name) : "Choisir un modèle"}
                      </Text>
                    </Pressable>
                    {isOpen && (
                      <View
                        onStartShouldSetResponder={() => true}
                        style={styles.pvDropdown}
                      >
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          style={styles.pvDropdownScroll}
                        >
                          {models.map((m) => (
                            <Pressable
                              key={m.id}
                              style={styles.pvDropdownItem}
                              onPress={() => {
                                setIsOpen(false);

                                const fullInverter = availableModels.find(
                                  inv => inv.model === m.name
                                );

                                setSelectedInverter(fullInverter || null);
                                setSelectedModel(m);
                                updatePv({
                                  ...pv,
                                  inverterModel: m.name,
                                });
                              }}
                            >
                              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                                {m.name}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </>
                </Pressable>
              )}
            </View>

            {selectedInverter
              ? (() => {
                  const inverter = selectedInverter;

                  let finalPower = null;

                  if (inverter.power_w != null && inverter.power_w !== "") {
                    finalPower = inverter.power_w / 1000;
                  } else if (
                    inverter.apparent_power_va != null &&
                    inverter.apparent_power_va !== ""
                  ) {
                    finalPower = inverter.apparent_power_va / 1000;
                  } else if (inverter.model) {
                    const normalizedModel = String(inverter.model).replace(/,/g, ".");
                    const match = normalizedModel.match(/(\d+(\.\d+)?)/);
                    if (match) {
                      finalPower = parseFloat(match[1]);
                    }
                  }
                  return (
                    <View style={styles.infoCard}>
                      <Text style={styles.infoTitle}>Onduleur sélectionné</Text>
                      <Text style={styles.infoText}>
                        Nom :{" "}
                        {selectedInverterFromSearch?.model ||
                          selectedInverter.label ||
                          selectedInverter.model}
                      </Text>
                      <Text style={styles.infoText}>Marque : {selectedInverter.brand}</Text>
                      <Text style={styles.infoText}>
                        Puissance : {finalPower ? `${finalPower} kW` : "-"}
                      </Text>
                    </View>
                  );
                })()
              : null}

            {selectedInverter !== null ? (
              <PvFieldCard
                label="Numéro de série onduleur"
                value={pv.inverterSerial}
                onChangeText={(value) => {
                  updatePvField("inverterSerial", value);
                  setErrors((prev) => ({
                    ...prev,
                    serial: validateSerial(value),
                  }));
                }}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollTo({
                      y: 300,
                      animated: true,
                    });
                  }, 150);
                }}
                error={errors.serial}
                placeholder="ex: SN123456789"
              />
            ) : null}

            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset données</Text>
            </Pressable>
            <TouchableOpacity
              onPress={() => {
                console.log("NAVIGATION ->", "/profile");
                router.push("/profile");
              }}
            >
              <Text style={styles.linkText}>Accéder au profil</Text>
            </TouchableOpacity>
          </View>
        </PvStepLayout>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
  },
  linkText: {
    color: "#E50914",
    fontSize: 16,
    fontWeight: "600",
  },
  stack: {
    gap: 16,
  },
  choiceGroup: {
    gap: 12,
  },
  disabledGroup: {
    opacity: 0.5,
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
  disabledInput: {
    opacity: 0.5,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: "#151515",
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  infoTitle: {
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  infoText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "400",
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
    letterSpacing: 0.5,
  },
  pvInput: {
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#111111",
  },
  pvDropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    backgroundColor: "#151515",
    overflow: "hidden",
  },
  pvDropdownScroll: {
    maxHeight: 220,
  },
  pvDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
});
