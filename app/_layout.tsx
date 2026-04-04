import '../global.css';
import { useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from "firebase/auth";
import 'react-native-reanimated';

import { auth } from "../lib/firebase";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  console.log("LAYOUT ROOT APP CHARGÉ");
  console.log("FILE:", "_layout.tsx");

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      if (!u) {
        router.replace("/login");
      } else {
        router.replace("/");
      }
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
