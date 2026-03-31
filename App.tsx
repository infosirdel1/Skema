import React from 'react';
import { LandingScreen } from './src/screens/LandingScreen';

export default function App() {
  return (
    <LandingScreen
      onCreatePress={() => {
        // Navigation ou ouverture du flux de création
      }}
      versionLabel="Skedio · v0.1"
    />
  );
}
