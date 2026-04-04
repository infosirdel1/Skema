import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Connecté");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        role: "user",
        createdAt: new Date(),
      });

      Alert.alert("Compte créé");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Mot de passe</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <Button title="Se connecter" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="Créer un compte" onPress={handleRegister} />
    </View>
  );
}
