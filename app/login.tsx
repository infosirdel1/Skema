import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { auth } from "../lib/firebase";
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
      await createUserWithEmailAndPassword(auth, email, password);
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
