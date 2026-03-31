import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <AppHeader />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This is a modal</ThemedText>
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0B0B' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#0B0B0B',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
