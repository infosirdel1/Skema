import { useCallback, useEffect, useRef, useState } from "react";
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
  Animated,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import AppHeader from "@/components/AppHeader";
import KeyboardLayout from "@/components/KeyboardLayout";
import ProfileSignaturePad, {
  type ProfileSignaturePadRef,
} from "@/components/ProfileSignaturePad";
import { auth, db, storage } from "@/lib/firebase";
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
    <View style={styles.fieldBlock} pointerEvents="box-none">
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#A0A0A0"
        style={styles.input}
        editable={true}
        {...props}
      />
    </View>
  );
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export default function ProfileScreen() {
  const signatureRef = useRef<ProfileSignaturePadRef | null>(null);
  const saveSuccessOpacity = useRef(new Animated.Value(0)).current;

  const [signature, setSignature] = useState("");
  const [company, setCompany] = useState("");
  const [companyVat, setCompanyVat] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [commune, setCommune] = useState("");
  const [organismLabel, setOrganismLabel] = useState("");
  const [organismModal, setOrganismModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const applyFirestoreUser = useCallback((data: Record<string, unknown>, authEmail: string | null) => {
    setCompany(str(data.company ?? data.companyName));
    setCompanyVat(str(data.companyVat));
    setFirstName(str(data.firstName));
    setLastName(str(data.lastName));
    setPhone(str(data.phone));
    const docEmail = str(data.email);
    setEmail(docEmail.length > 0 ? docEmail : authEmail ?? "");
    setStreet(str(data.street));
    setStreetNumber(str(data.number));
    setPostalCode(str(data.postalCode));
    setCity(str(data.city));
    setCommune(str(data.commune));

    const org = data.defaultOrganism;
    if (typeof org === "string") {
      setOrganismLabel(org);
    } else if (org && typeof org === "object" && org !== null && "name" in org) {
      setOrganismLabel(str((org as { name: unknown }).name));
    } else {
      setOrganismLabel("");
    }

    setSignature(str(data.signatureDataUrl ?? data.signature));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCompany("");
        setCompanyVat("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setStreet("");
        setStreetNumber("");
        setCity("");
        setPostalCode("");
        setCommune("");
        setOrganismLabel("");
        setSignature("");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          applyFirestoreUser(data, typeof user.email === "string" ? user.email : null);
        } else {
          setCompany("");
          setCompanyVat("");
          setFirstName("");
          setLastName("");
          setPhone("");
          setEmail(typeof user.email === "string" ? user.email : "");
          setStreet("");
          setStreetNumber("");
          setCity("");
          setPostalCode("");
          setCommune("");
          setOrganismLabel("");
          setSignature("");
        }
      } catch (e) {
        console.error("Profile Firestore load error", e);
        setCompany("");
        setCompanyVat("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail(typeof user.email === "string" ? user.email : "");
        setStreet("");
        setStreetNumber("");
        setCity("");
        setPostalCode("");
        setCommune("");
        setOrganismLabel("");
        setSignature("");
      }
    });
    return unsubscribe;
  }, [applyFirestoreUser]);

  async function handleSave() {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Non connecté", "Connectez-vous pour enregistrer votre profil.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          company: company.trim(),
          companyVat: companyVat.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          street: street.trim(),
          number: streetNumber.trim(),
          postalCode: postalCode.trim(),
          city: city.trim(),
          commune: commune.trim(),
          defaultOrganism: organismLabel.trim(),
          signatureDataUrl: signature.trim(),
        },
        { merge: true }
      );
      setSaveSuccess(true);
      saveSuccessOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(saveSuccessOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.delay(1200),
        Animated.timing(saveSuccessOpacity, {
          toValue: 0,
          duration: 380,
          useNativeDriver: false,
        }),
      ]).start();
      setTimeout(() => setSaveSuccess(false), 2000);
      Alert.alert("Enregistré", "Votre profil a été mis à jour.");
    } catch (e) {
      console.error("Profile save error", e);
      Alert.alert("Erreur", "Impossible d'enregistrer le profil.");
    } finally {
      setSaving(false);
    }
  }

  const handleLogoPick = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Non connecté", "Connectez-vous pour ajouter un logo.");
      return;
    }

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Autorisation requise",
        "Autorisez l’accès à la photothèque pour choisir un logo."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;

      const response = await fetch(uri);
      const blob = await response.blob();

      const fileRef = ref(storage, `logos/${user.uid}.jpg`);

      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      await updateDoc(doc(db, "users", user.uid), {
        logoUrl: downloadURL,
      });
    } catch (e) {
      console.error("Logo upload error", e);
      Alert.alert("Erreur", "Impossible d’enregistrer le logo.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("LOGOUT OK");

      router.replace("/login");
    } catch (e) {
      console.error("LOGOUT ERROR", e);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AppHeader />
      <KeyboardLayout>
        <View style={styles.keyboardInner}>
          {saveSuccess && (
            <Animated.View
              style={[styles.successBox, { opacity: saveSuccessOpacity }]}
              pointerEvents="none"
            >
              <Text style={styles.successText}>Enregistré ✓</Text>
            </Animated.View>
          )}
          <View style={styles.scroll}>
            <Text style={styles.header}>Profil</Text>

            <SectionCard title="Informations entreprise">
              <Field
                label="Nom entreprise"
                value={company}
                onChangeText={setCompany}
                placeholder="Nom de l'entreprise"
              />
              <Field
                label="TVA"
                value={companyVat}
                onChangeText={setCompanyVat}
                placeholder="BE0..."
                autoCapitalize="characters"
              />
              <Button title="Ajouter logo entreprise" onPress={handleLogoPick} />
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
              <Field label="Rue" value={street} onChangeText={setStreet} placeholder="Rue" />
              <Field label="Numéro" value={streetNumber} onChangeText={setStreetNumber} placeholder="N°" />
              <Field
                label="Code postal"
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="1000"
                keyboardType="numbers-and-punctuation"
              />
              <Field label="Ville" value={city} onChangeText={setCity} placeholder="Ville" />
              <Field label="Commune" value={commune} onChangeText={setCommune} placeholder="Commune" />
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
                <ProfileSignaturePad
                  ref={signatureRef}
                  value={signature}
                  onChange={setSignature}
                  style={styles.signaturePad}
                  containerStyle={styles.signatureInner}
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
            <Button title="Se déconnecter" onPress={handleLogout} />
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
    position: "relative",
  },
  successBox: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 20,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  successText: {
    color: "#fff",
    fontWeight: "600",
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
  signaturePad: { flex: 1 },
  signatureInner: { flex: 1 },
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
