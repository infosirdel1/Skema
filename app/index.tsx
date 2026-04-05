import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const splashStyle = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  backgroundColor: "#0B0B0B",
};

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <View style={splashStyle}>
      <ActivityIndicator size="large" color="#E53935" />
    </View>
  );
}
