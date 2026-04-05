import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Stack, useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("LOGIN OK:", userCredential.user.uid);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("LOGIN ERROR", error);
    }
  };

  const handleRegister = async () => {
    try {
      if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      if (password.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: email.trim(),
        role: "user",
        createdAt: new Date(),
      });

      alert("Compte créé avec succès");
      router.replace("/(tabs)");
    } catch (error) {
      console.log("FIREBASE REGISTER ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé");
      } else if (error.code === "auth/invalid-email") {
        alert("Email invalide");
      } else if (error.code === "auth/weak-password") {
        alert("Mot de passe trop faible");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button title="Se connecter" onPress={handleLogin} />

          <Pressable
            style={styles.secondaryButton}
            onPress={handleRegister}
            android_ripple={{ color: "#ffffff22" }}
          >
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#151515",
    borderRadius: 16,
    padding: 20,
    zIndex: 10,
    elevation: 10,
  },
  logoImage: {
    width: 120,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 12,
    color: "#FFF",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#AAA",
    fontWeight: "500",
  },
});
