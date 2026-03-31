import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AppHeader from "@/components/AppHeader";
import SignaturePad from "@/components/SignaturePad";
import {
  FACTEURS_ORGANISMES_PRESETS,
  emptyFacteursOrganisme,
  defaultSignatureClient,
  filterOrganismes,
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

export default function FacteursAdresseScreen() {
  console.log("FILE:", "(tabs)/facteurs/adresse.tsx");

  const router = useRouter();
  const [client, setClient] = useState({
    name: "",
    street: "",
    number: "",
    zip: "",
    city: "",
  });

  const [organismeSearch, setOrganismeSearch] = useState("");
  const [organisme, setOrganisme] = useState<FacteursOrganismePreset>(emptyFacteursOrganisme);
  const [organListOpen, setOrganListOpen] = useState(true);

  const [signatureClient, setSignatureClient] =
    useState<FacteursSignaturePayload>(defaultSignatureClient);

  const filteredOrganismes = useMemo(() => {
    if (!organismeSearch.trim()) return FACTEURS_ORGANISMES_PRESETS;
    return filterOrganismes(organismeSearch);
  }, [organismeSearch]);

  const setField = (key: keyof typeof client, value: string) => {
    setClient((prev) => ({ ...prev, [key]: value }));
  };

  const selectOrganisme = useCallback((o: FacteursOrganismePreset) => {
    setOrganisme({ ...o });
    setOrganListOpen(false);
    setOrganismeSearch("");
  }, []);

  const handleContinue = () => {
    router.push({
      pathname: "/facteurs",
      params: {
        client: JSON.stringify(client),
        organisme: JSON.stringify(organisme),
        signatureClient: JSON.stringify(signatureClient),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Informations chantier</Text>
        <Text style={styles.subtitle}>
          Adresse client, organisme de contrôle et signature optionnelle.
        </Text>

        <Text style={styles.sectionLabel}>Client</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            value={client.name}
            onChangeText={(v) => setField("name", v)}
            placeholder="Nom ou raison sociale"
            placeholderTextColor={T.textMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Rue</Text>
          <TextInput
            value={client.street}
            onChangeText={(v) => setField("street", v)}
            placeholder="Rue"
            placeholderTextColor={T.textMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Numéro</Text>
          <TextInput
            value={client.number}
            onChangeText={(v) => setField("number", v)}
            placeholder="N°"
            placeholderTextColor={T.textMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Code postal</Text>
          <TextInput
            value={client.zip}
            onChangeText={(v) => setField("zip", v)}
            placeholder="Code postal"
            placeholderTextColor={T.textMuted}
            style={styles.input}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Ville</Text>
          <TextInput
            value={client.city}
            onChangeText={(v) => setField("city", v)}
            placeholder="Ville"
            placeholderTextColor={T.textMuted}
            style={styles.input}
          />
        </View>

        <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Organisme de contrôle</Text>
        <Text style={styles.hint}>
          Faites défiler la liste ou filtrez par nom, adresse, e-mail ou agrément.
        </Text>
        <TextInput
          value={organismeSearch}
          onChangeText={(t) => {
            setOrganismeSearch(t);
            setOrganListOpen(true);
          }}
          onFocus={() => setOrganListOpen(true)}
          placeholder="Rechercher un organisme…"
          placeholderTextColor={T.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {organListOpen && !organisme.id ? (
          <View style={styles.orgListWrap}>
            <ScrollView
              style={styles.orgListScroll}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {filteredOrganismes.length === 0 ? (
                <Text style={styles.orgEmpty}>Aucun résultat</Text>
              ) : (
                filteredOrganismes.map((o) => (
                  <Pressable
                    key={o.id}
                    onPress={() => selectOrganisme(o)}
                    style={({ pressed }) => [
                      styles.orgRow,
                      pressed && styles.orgRowPressed,
                    ]}
                  >
                    <Text style={styles.orgRowTitle}>{o.nom}</Text>
                    <Text style={styles.orgRowSub} numberOfLines={1}>
                      {o.adresse}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        ) : null}

        {organisme.id ? (
          <View style={styles.orgCard}>
            <Text style={styles.orgCardTitle}>{organisme.nom}</Text>
            <Text style={styles.orgCardLine}>{organisme.adresse}</Text>
            <Text style={styles.orgCardLine}>Tél. {organisme.telephone}</Text>
            <Text style={styles.orgCardLine}>{organisme.email}</Text>
            <Text style={styles.orgCardLine}>Agrément : {organisme.agrement}</Text>
            <Pressable
              onPress={() => {
                setOrganisme(emptyFacteursOrganisme);
                setOrganListOpen(true);
              }}
              style={styles.orgChangeBtn}
            >
              <Text style={styles.orgChangeBtnText}>Changer d’organisme</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Signature</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Signer le document</Text>
          <Switch
            value={signatureClient.enabled}
            onValueChange={(v) =>
              setSignatureClient((s) => ({
                ...s,
                enabled: v,
                ...(v ? {} : { image: null }),
              }))
            }
            trackColor={{ false: "#333", true: "#3A3A3A" }}
            thumbColor={signatureClient.enabled ? "#C8102E" : "#888"}
          />
        </View>

        {signatureClient.enabled ? (
          <View style={styles.sigBlock}>
            <TextInput
              placeholder="Nom du signataire"
              placeholderTextColor={T.textMuted}
              value={signatureClient.nom}
              onChangeText={(nom) => setSignatureClient((s) => ({ ...s, nom }))}
              style={styles.sigInput}
            />
            <TextInput
              placeholder="Date (ex. 28/03/2026)"
              placeholderTextColor={T.textMuted}
              value={signatureClient.date}
              onChangeText={(date) => setSignatureClient((s) => ({ ...s, date }))}
              style={styles.sigInput}
            />
            <SignaturePad
              value={signatureClient.image}
              onChange={(img: string | null) =>
                setSignatureClient((s) => ({
                  ...s,
                  image: img,
                }))
              }
              height={180}
            />
            {signatureClient.image ? (
              <View style={styles.previewWrap}>
                <Text style={styles.previewLabel}>Aperçu</Text>
                <Image
                  source={{ uri: signatureClient.image }}
                  style={styles.previewImg}
                  resizeMode="contain"
                />
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
        >
          <Text style={styles.continueLabel}>Continuer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: T.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: T.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: T.textPrimary,
    marginBottom: 8,
  },
  sectionSpacing: { marginTop: 22 },
  hint: {
    fontSize: 12,
    color: T.textMuted,
    marginBottom: 8,
    lineHeight: 16,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 13,
    color: T.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: T.textPrimary,
  },
  orgListWrap: {
    maxHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    backgroundColor: "#111",
    marginTop: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  orgListScroll: { maxHeight: 220 },
  orgRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  orgRowPressed: { backgroundColor: "rgba(255,255,255,0.05)" },
  orgRowTitle: { color: T.textPrimary, fontSize: 15, fontWeight: "600" },
  orgRowSub: { color: T.textMuted, fontSize: 12, marginTop: 4 },
  orgEmpty: { color: T.textMuted, padding: 16, fontSize: 14 },
  orgCard: {
    backgroundColor: T.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    padding: 12,
    marginTop: 8,
  },
  orgCardTitle: { color: T.textPrimary, fontWeight: "700", fontSize: 15, marginBottom: 6 },
  orgCardLine: { color: T.textSecondary, fontSize: 13, marginBottom: 4 },
  orgChangeBtn: { marginTop: 10, alignSelf: "flex-start" },
  orgChangeBtnText: { color: "#5AC8FA", fontSize: 14, fontWeight: "600" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  switchLabel: { color: T.textPrimary, fontSize: 15, flex: 1 },
  sigBlock: { marginBottom: 8 },
  sigInput: {
    backgroundColor: "#111",
    color: T.textPrimary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.borderSubtle,
    fontSize: 15,
  },
  previewWrap: { marginTop: 14 },
  previewLabel: { color: T.textMuted, fontSize: 12, marginBottom: 6 },
  previewImg: {
    width: "100%",
    height: 100,
    backgroundColor: "#0A0A0A",
    borderRadius: 8,
    ...Platform.select({ web: { maxWidth: 320 } as object, default: {} }),
  },
  continueBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  continueBtnPressed: { backgroundColor: "#D93228" },
  continueLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
