import { useCallback, useRef, useState, type ComponentRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import SignatureScreen from "react-native-signature-canvas";

import AppHeader from "@/components/AppHeader";
import KeyboardLayout from "@/components/KeyboardLayout";
import { loadPvDraft, savePvDraft } from "@/lib/pvDraftStorage";
import { CONTROL_ORGANISMS } from "@/lib/controlOrganisms";

const inputBase = {
  height: 48,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#2A2A2A",
  paddingHorizontal: 12,
  fontSize: 16,
  color: "#FFFFFF",
};

const signatureWebStyle = `
.m-signature-pad { box-shadow: none; border: none; }
.m-signature-pad--body { border: none; }
.m-signature-pad--footer { display: none !important; }
body, html { height: 100%; margin: 0; padding: 0; }
`;

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#A0A0A0"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const signatureRef = useRef<ComponentRef<typeof SignatureScreen> | null>(null);
  const [signature, setSignature] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyVat, setCompanyVat] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [organismLabel, setOrganismLabel] = useState("");
  const [organismModal, setOrganismModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveUserProfile = useCallback(
    async (patch: Record<string, unknown>) => {
      const draft = await loadPvDraft();
      await savePvDraft(
        {
          ...draft,
          userProfile: {
            ...draft.userProfile,
            ...patch,
          },
        },
        { bumpVersion: false }
      );
    },
    []
  );

  const applyDraft = useCallback((d: Awaited<ReturnType<typeof loadPvDraft>>) => {
    const u = d.userProfile || {};
    setCompanyName(u.companyName ?? "");
    setCompanyVat(u.companyVat ?? "");
    setFirstName(u.firstName ?? "");
    setLastName(u.lastName ?? "");
    setPhone(u.phone ?? "");
    setEmail(u.email ?? "");
    setStreet(u.street ?? "");
    setCity(u.city ?? "");
    setPostalCode(u.postalCode ?? "");
    setOrganismLabel(u.defaultOrganism?.name?.trim() ? u.defaultOrganism.name : "");
    setSignature(typeof u.signature === "string" ? u.signature : "");
  }, []);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const d = await loadPvDraft();
        applyDraft(d);
      })();
    }, [applyDraft])
  );

  async function handleSave() {
    setSaving(true);
    try {
      const draft = await loadPvDraft();
      const selected = CONTROL_ORGANISMS.find((o) => o.name === organismLabel);
      const nextOrganism = selected
        ? {
            name: selected.name,
            address: selected.address,
            vat: selected.vat,
            phone: selected.phone,
            email: selected.email,
            value: selected.value,
          }
        : draft.userProfile?.defaultOrganism || {
            name: "",
            address: "",
            vat: "",
            phone: "",
            email: "",
            value: "",
          };

      await savePvDraft(
        {
          ...draft,
          userProfile: {
            ...draft.userProfile,
            companyName: companyName.trim(),
            companyVat: companyVat.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            street: street.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            defaultOrganism: nextOrganism,
            signature,
          },
        },
        { bumpVersion: false }
      );
      Alert.alert("Enregistré", "Votre profil a été sauvegardé localement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <KeyboardLayout>
        <View style={styles.keyboardInner}>
          <View style={styles.scroll}>
            <Text style={styles.header}>Profil</Text>

            <SectionCard title="Informations entreprise">
              <Field
                label="Nom entreprise"
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Nom de l'entreprise"
              />
              <Field
                label="TVA"
                value={companyVat}
                onChangeText={setCompanyVat}
                placeholder="BE0..."
                autoCapitalize="characters"
              />
            </SectionCard>

            <SectionCard title="Informations personnelles">
              <Field label="Nom" value={lastName} onChangeText={setLastName} placeholder="Nom" />
              <Field label="Prénom" value={firstName} onChangeText={setFirstName} placeholder="Prénom" />
              <Field
                label="GSM"
                value={phone}
                onChangeText={setPhone}
                placeholder="+32 ..."
                keyboardType="phone-pad"
              />
              <Field
                label="Mail"
                value={email}
                onChangeText={setEmail}
                placeholder="email@exemple.be"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </SectionCard>

            <SectionCard title="Adresse">
              <Field label="Rue" value={street} onChangeText={setStreet} placeholder="Rue et numéro" />
              <Field label="Ville" value={city} onChangeText={setCity} placeholder="Ville" />
              <Field
                label="Code postal"
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="1000"
                keyboardType="numbers-and-punctuation"
              />
            </SectionCard>

            <SectionCard title="Organisme">
              <Text style={styles.fieldLabel}>Organisme par défaut</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setOrganismModal(true)}
                activeOpacity={0.85}
              >
                <Text style={organismLabel ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {organismLabel || "Sélectionner un organisme"}
                </Text>
                <Feather name="chevron-down" size={20} color="#A0A0A0" />
              </TouchableOpacity>
            </SectionCard>

            <SectionCard title="Signature">
              <View style={styles.signaturePadWrap}>
                <SignatureScreen
                  ref={signatureRef}
                  nestedScrollEnabled
                  dataURL={signature}
                  imageType="image/png"
                  penColor="#111111"
                  descriptionText=""
                  webStyle={signatureWebStyle}
                  style={styles.signaturePad}
                  webviewContainerStyle={styles.signatureWebview}
                  onOK={(data) => {
                    setSignature(data);
                    void saveUserProfile({ signature: data });
                  }}
                  onEmpty={() => {
                    setSignature("");
                    void saveUserProfile({ signature: "" });
                  }}
                  onClear={() => {
                    setSignature("");
                    void saveUserProfile({ signature: "" });
                  }}
                  onEnd={() => {
                    signatureRef.current?.readSignature();
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.clearSignatureBtn}
                onPress={() => signatureRef.current?.clearSignature()}
                activeOpacity={0.85}
              >
                <Text style={styles.clearSignatureBtnText}>Effacer</Text>
              </TouchableOpacity>
            </SectionCard>
          </View>

          <View style={styles.saveBtnWrap}>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.9}
            >
              <Text style={styles.saveBtnText}>{saving ? "…" : "Sauvegarder"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardLayout>

      <Modal visible={organismModal} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setOrganismModal(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Organisme de contrôle</Text>
            <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
              {CONTROL_ORGANISMS.map((o) => (
                <TouchableOpacity
                  key={o.value}
                  style={styles.modalRow}
                  onPress={() => {
                    setOrganismLabel(o.name);
                    setOrganismModal(false);
                  }}
                >
                  <Text style={styles.modalRowText}>{o.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setOrganismModal(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" },
  keyboardInner: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 10,
  },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  saveBtnWrap: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  fieldBlock: { marginBottom: 8 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A0A0A0",
    marginBottom: 6,
  },
  input: {
    ...inputBase,
    backgroundColor: "#111111",
  },
  dropdown: {
    ...inputBase,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111111",
  },
  dropdownText: { flex: 1, fontSize: 16, color: "#FFFFFF" },
  dropdownPlaceholder: { flex: 1, fontSize: 16, color: "#A0A0A0" },
  signaturePadWrap: {
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    overflow: "hidden",
    backgroundColor: "#111111",
  },
  signaturePad: { flex: 1, backgroundColor: "#111111" },
  signatureWebview: { flex: 1, backgroundColor: "#111111" },
  clearSignatureBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#151515",
  },
  clearSignatureBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  saveBtn: {
    backgroundColor: "#E50914",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: "#2A2A2A",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  modalList: { maxHeight: 360 },
  modalRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2A2A2A",
  },
  modalRowText: { fontSize: 16, color: "#FFFFFF" },
  modalClose: { padding: 16, alignItems: "center" },
  modalCloseText: { fontSize: 16, color: "#E50914", fontWeight: "600" },
});
