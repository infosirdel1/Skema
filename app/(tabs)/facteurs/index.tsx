import { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Print from "expo-print";
import { Asset } from "expo-asset";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { doc, getDoc } from "firebase/firestore";

import AppHeader from "@/components/AppHeader";
import { auth, db } from "@/lib/firebase";
import { LOCAL_CATEGORIES } from "@/lib/localsConfig";
import {
  DEFAULT_FACTORS,
  getFactorsForLocalLabel,
  LABEL_TO_LOCAL_KEY,
  LOCALS,
} from "@/lib/factorsDatabase";
import { generateHtmlFromFactors } from "@/lib/factorsToHtml";
import {
  emptyFacteursOrganisme,
  defaultSignatureClient,
  type FacteursOrganismePreset,
  type FacteursSignaturePayload,
} from "@/lib/facteursOrganisms";

const T = {
  bg: "#0A0A0A",
  card: "#151515",
  borderSubtle: "rgba(255,255,255,0.08)",
  textPrimary: "#F5F5F5",
  textMuted: "#71717A",
  textSecondary: "#A1A1AA",
};

type LocalSelection = { label: string; public: boolean };

export type FacteursClientPayload = {
  name: string;
  street: string;
  number: string;
  zip: string;
  city: string;
};

const LOGO_ASSET = require("../../../assets/images/logo.png");

const LOGO_DATA_PREFIX = "data:image/png;base64,";

/** Web : évite URL géante (signature base64) → 431 Request Header Fields Too Large */
const FACTEURS_WEB_STORAGE_KEY = "skedio_facteurs_flow_v1";

async function getLogoDataUri(): Promise<string | undefined> {
  try {
    const asset = Asset.fromModule(LOGO_ASSET);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (!uri) return undefined;

    if (uri.startsWith(LOGO_DATA_PREFIX)) {
      return uri;
    }

    try {
      const base64 = await readAsStringAsync(uri, {
        encoding: EncodingType.Base64,
      });
      const out = `${LOGO_DATA_PREFIX}${base64}`;
      if (out.startsWith(LOGO_DATA_PREFIX)) return out;
    } catch {
      /* fallback fetch (ex. web) */
    }

    const res = await fetch(uri);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const r = reader.result;
        if (typeof r === "string") resolve(r);
        else reject(new Error("FileReader"));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    if (dataUrl.startsWith(LOGO_DATA_PREFIX)) return dataUrl;
    return undefined;
  } catch {
    return undefined;
  }
}

function parseJsonParam<T>(raw: string | undefined): T | null {
  if (raw == null || raw === "") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function parseClientParam(raw: string | undefined): FacteursClientPayload | null {
  return parseJsonParam<FacteursClientPayload>(raw);
}

function profileStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Lignes cartouche « Installateur » depuis users/{uid} (Firestore). Société uniquement (pas prénom/nom). */
function buildInstallateurLinesFromProfile(data: Record<string, unknown>): string[] {
  const societe = profileStr(data.company);
  const rueNumero = [profileStr(data.street), profileStr(data.number)].filter(Boolean).join(" ");
  const cpVillePart = [profileStr(data.postalCode), profileStr(data.city)].filter(Boolean).join(" ");
  const commune = profileStr(data.commune);
  const cpVille = [cpVillePart, commune].filter(Boolean).join(cpVillePart && commune ? " — " : "");

  const telephone = profileStr(data.phone);
  const email = profileStr(data.email);
  const tva = profileStr(data.companyVat);

  return [societe, rueNumero, cpVille, telephone, email, tva].filter(Boolean);
}

export default function FacteursScreen() {
  console.log("FILE:", "(tabs)/facteurs/index.tsx");

  const router = useRouter();
  const params = useLocalSearchParams<{
    client?: string | string[];
    organisme?: string | string[];
    signatureClient?: string | string[];
  }>();

  const [webBootstrapDone, setWebBootstrapDone] = useState(Platform.OS !== "web");
  const [webFlowStrings, setWebFlowStrings] = useState<{
    client: string;
    organisme: string;
    signatureClient: string;
  } | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof sessionStorage === "undefined") return;
    try {
      const raw = sessionStorage.getItem(FACTEURS_WEB_STORAGE_KEY);
      if (raw) {
        sessionStorage.removeItem(FACTEURS_WEB_STORAGE_KEY);
        const p = JSON.parse(raw) as {
          client: unknown;
          organisme: unknown;
          signatureClient: unknown;
        };
        setWebFlowStrings({
          client: JSON.stringify(p.client),
          organisme: JSON.stringify(p.organisme),
          signatureClient: JSON.stringify(p.signatureClient),
        });
      }
    } catch (e) {
      console.error("Facteurs lecture sessionStorage", e);
    }
    if (typeof window !== "undefined") {
      try {
        const u = new URL(window.location.href);
        if (u.search.length > 256) {
          u.search = "";
          window.history.replaceState({}, document.title, u.pathname + u.hash);
        }
      } catch {
        /* ignore */
      }
    }
    setWebBootstrapDone(true);
  }, []);

  const clientRaw =
    webFlowStrings?.client ??
    (Array.isArray(params.client) ? params.client[0] : params.client);
  const orgRaw =
    webFlowStrings?.organisme ??
    (Array.isArray(params.organisme) ? params.organisme[0] : params.organisme);
  const sigRaw =
    webFlowStrings?.signatureClient ??
    (Array.isArray(params.signatureClient)
      ? params.signatureClient[0]
      : params.signatureClient);

  const parsedClient = useMemo(
    () => parseClientParam(clientRaw),
    [clientRaw]
  );

  const parsedOrganisme = useMemo((): FacteursOrganismePreset => {
    const o = parseJsonParam<FacteursOrganismePreset>(orgRaw);
    if (o && typeof o === "object") return { ...emptyFacteursOrganisme, ...o };
    return emptyFacteursOrganisme;
  }, [orgRaw]);

  const parsedSignature = useMemo((): FacteursSignaturePayload => {
    const s = parseJsonParam<FacteursSignaturePayload>(sigRaw);
    if (s && typeof s === "object") {
      return {
        ...defaultSignatureClient,
        ...s,
        image: typeof s.image === "string" ? s.image : null,
      };
    }
    return defaultSignatureClient;
  }, [sigRaw]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web" && !webBootstrapDone) return;
      if (!clientRaw || !parsedClient) {
        router.replace("/facteurs/adresse");
      }
    }, [clientRaw, parsedClient, router, webBootstrapDone])
  );

  useEffect(() => {
    const localsList = LOCAL_CATEGORIES.flatMap((c) => c.items);
    console.log("LISTE LOCAUX LABELS:", Object.keys(LABEL_TO_LOCAL_KEY));
    console.log("LISTE LOCAUX CONFIG:", Object.keys(LOCALS));
    console.log("LISTE UI:", localsList);
  }, []);

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedLocals, setSelectedLocals] = useState<
    Record<string, LocalSelection[]>
  >({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ category: string; label: string }[]>(
    []
  );

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const results: { category: string; label: string }[] = [];

    LOCAL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.toLowerCase().includes(search.toLowerCase())) {
          results.push({
            category: cat.title,
            label: item,
          });
        }
      });
    });

    setSearchResults(results);
  }, [search]);

  const updatePublic = useCallback((label: string, value: boolean) => {
    setSelectedLocals((prev) => {
      const updated: Record<string, LocalSelection[]> = { ...prev };
      Object.keys(updated).forEach((cat) => {
        updated[cat] = updated[cat].map((entry) =>
          entry.label === label ? { ...entry, public: value } : entry
        );
      });
      return updated;
    });
  }, []);

  /** Recherche : sélectionner ou mettre à jour en gardant toujours `{ label, public }`. */
  const setLocalPublicForCategory = useCallback(
    (category: string, label: string, value: boolean) => {
      setSelectedLocals((prev) => {
        const current = prev[category] ?? [];
        const exists = current.find((i) => i.label === label);
        if (exists) {
          return {
            ...prev,
            [category]: current.map((e) =>
              e.label === label ? { label, public: value } : e
            ),
          };
        }
        return {
          ...prev,
          [category]: [...current, { label, public: value }],
        };
      });
    },
    []
  );

  const hasSelection = useMemo(
    () => Object.values(selectedLocals).some((arr) => (arr?.length ?? 0) > 0),
    [selectedLocals]
  );

  const buildTableFromSelection = useCallback(() => {
    const flat = Object.values(selectedLocals).flat();
    const rows = flat.map((item) => {
      const values = {
        ...DEFAULT_FACTORS,
        ...getFactorsForLocalLabel(item.label),
      };
      console.log("local:", item.label, "values:", values);
      return {
        local: item.label,
        ...values,
        public: item.public,
      };
    });
    return { rows, client: parsedClient };
  }, [selectedLocals, parsedClient]);

  const handleExport = async () => {
    const { rows, client: clientForPdf } = buildTableFromSelection();
    if (rows.length === 0) return;

    const logoDataUri = await getLogoDataUri();
    console.log("LOGO DEBUG:", logoDataUri);

    let installateurLines: string[] | undefined;
    let signatureInstallateur: string | undefined;
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const u = snap.data() as Record<string, unknown>;
          const lines = buildInstallateurLinesFromProfile(u);
          installateurLines = lines.length > 0 ? lines : undefined;
          const sig = profileStr(u.signatureDataUrl);
          signatureInstallateur = sig.startsWith("data:image") ? sig : undefined;
        }
      } catch (e) {
        console.error("Profil installateur (PDF)", e);
      }
    }

    const html = generateHtmlFromFactors(
      rows,
      logoDataUri,
      clientForPdf,
      parsedOrganisme,
      parsedSignature,
      installateurLines,
      undefined,
      signatureInstallateur
    );

    if (Platform.OS === "web") {
      const newWindow = window.open("", "_blank");

      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(html);
        newWindow.document.close();
      } else {
        console.error("Impossible d'ouvrir la fenêtre PDF");
      }
      return;
    }

    try {
      await Print.printAsync({
        html,
      });
    } catch (e) {
      console.error("PDF export error", e);
    }
  };

  if (!parsedClient) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <View style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Locaux</Text>

          {LOCAL_CATEGORIES.map((cat) => {
            const selectedCount = selectedLocals[cat.title]?.length ?? 0;

            return (
              <View key={cat.title} style={styles.categoryWrap}>
                <Pressable
                  onPress={() =>
                    setOpenCategory(openCategory === cat.title ? null : cat.title)
                  }
                  style={({ pressed }) => [
                    styles.categoryCard,
                    pressed && styles.categoryCardPressed,
                  ]}
                >
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <Text style={styles.categoryCount}>
                    {selectedCount} sélectionné(s)
                  </Text>
                </Pressable>

                {openCategory === cat.title ? (
                  <View style={styles.dropdownPanel}>
                    {cat.items
                      .filter((item) =>
                        item.toLowerCase().includes(search.trim().toLowerCase())
                      )
                      .map((item) => {
                        const isSelected =
                          selectedLocals[cat.title]?.some((i) => i.label === item) ?? false;

                        return (
                          <View key={item} style={styles.dropdownItemWrap}>
                            <Pressable
                              onPress={() => {
                                const current = selectedLocals[cat.title] ?? [];
                                const exists = current.find((i) => i.label === item);
                                setSelectedLocals({
                                  ...selectedLocals,
                                  [cat.title]: exists
                                    ? current.filter((i) => i.label !== item)
                                    : [...current, { label: item, public: false }],
                                });
                              }}
                              style={({ pressed }) => [
                                styles.dropdownRow,
                                pressed && styles.dropdownRowPressed,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dropdownRowText,
                                  isSelected && styles.dropdownRowTextSelected,
                                ]}
                              >
                                {item}
                              </Text>
                            </Pressable>
                            {isSelected ? (
                              <View style={styles.localPubRow}>
                                <Pressable
                                  onPress={() => updatePublic(item, false)}
                                  style={[
                                    styles.localPubBtn,
                                    selectedLocals[cat.title]?.find((e) => e.label === item)
                                      ?.public === false && styles.localPubBtnActive,
                                  ]}
                                >
                                  <Text style={styles.localPubBtnText}>Privé</Text>
                                </Pressable>
                                <Pressable
                                  onPress={() => updatePublic(item, true)}
                                  style={[
                                    styles.localPubBtn,
                                    selectedLocals[cat.title]?.find((e) => e.label === item)
                                      ?.public === true && styles.localPubBtnActive,
                                  ]}
                                >
                                  <Text style={styles.localPubBtnText}>Public</Text>
                                </Pressable>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                  </View>
                ) : null}
              </View>
            );
          })}

          <TextInput
            placeholder="Rechercher..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {searchResults.length > 0 ? (
            <View style={styles.suggestionsPanel}>
              {searchResults.map((hit) => {
                const isSelected =
                  selectedLocals[hit.category]?.some((i) => i.label === hit.label) ?? false;
                const hitKey = `${hit.category}-${hit.label}`;
                const entry = selectedLocals[hit.category]?.find((e) => e.label === hit.label);

                return (
                  <View key={hitKey} style={styles.dropdownItemWrap}>
                    <Pressable
                      onPress={() => {
                        const current = selectedLocals[hit.category] ?? [];
                        const exists = current.find((i) => i.label === hit.label);
                        setSelectedLocals({
                          ...selectedLocals,
                          [hit.category]: exists
                            ? current.filter((i) => i.label !== hit.label)
                            : [...current, { label: hit.label, public: false }],
                        });
                      }}
                      style={({ pressed }) => [
                        styles.dropdownRow,
                        pressed && styles.dropdownRowPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownRowText,
                          isSelected && styles.dropdownRowTextSelected,
                        ]}
                      >
                        {hit.label}
                      </Text>
                      <Text style={styles.suggestionCategory}>{hit.category}</Text>
                    </Pressable>
                    <View style={styles.localPubRow}>
                      <Pressable
                        onPress={() =>
                          setLocalPublicForCategory(hit.category, hit.label, false)
                        }
                        style={[
                          styles.localPubBtn,
                          entry?.public === false && styles.localPubBtnActive,
                        ]}
                      >
                        <Text style={styles.localPubBtnText}>Privé</Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          setLocalPublicForCategory(hit.category, hit.label, true)
                        }
                        style={[
                          styles.localPubBtn,
                          entry?.public === true && styles.localPubBtnActive,
                        ]}
                      >
                        <Text style={styles.localPubBtnText}>Public</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {hasSelection ? (
            <Pressable
              onPress={handleExport}
              style={({ pressed }) => [
                styles.exportButton,
                pressed && styles.exportButtonPressed,
              ]}
            >
              <Text style={styles.exportButtonLabel}>Exporter PDF</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: T.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: T.borderSubtle,
  },
  suggestionsPanel: {
    backgroundColor: "#111",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  suggestionCategory: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  categoryWrap: {
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: T.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  categoryCardPressed: {
    opacity: 0.92,
  },
  categoryTitle: {
    color: T.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  categoryCount: {
    color: T.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  dropdownPanel: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#111",
  },
  dropdownItemWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  dropdownRow: {
    padding: 10,
  },
  dropdownRowPressed: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dropdownRowText: {
    color: "#fff",
    fontSize: 15,
  },
  dropdownRowTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  localPubRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  localPubBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
  },
  localPubBtnActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  localPubBtnText: {
    color: "#fff",
    fontSize: 13,
  },
  exportButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  exportButtonPressed: {
    backgroundColor: "#D93228",
  },
  exportButtonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
