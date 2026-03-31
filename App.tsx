import React from 'react';
import { LandingScreen } from './src/screens/LandingScreen';

export default function App() {
  console.log("APP.TSX CHARGÉ");
  console.log("ROUTER ENTRY ACTIF");

  return (
    <LandingScreen
      onCreatePress={() => {
        // Navigation ou ouverture du flux de création
      }}
      versionLabel="Skedio · v0.1"
    />
  );
}
