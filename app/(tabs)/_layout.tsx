import { useEffect } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { SvgXml } from "react-native-svg";

const homeSvg = `
<svg viewBox="0 0 24 24">
  <path d="M3 10L12 3L21 10V21H3Z" fill="#000"/>
</svg>
`;

const schemaSvg = `
<svg viewBox="0 0 24 24">
  <path d="M4 4H10V10H4Z M14 4H20V10H14Z M4 14H10V20H4Z M14 14H20V20H14Z" fill="#000"/>
</svg>
`;

const profileSvg = `
<svg viewBox="0 0 24 24">
  <path d="M12 12C14.2 12 16 10.2 16 8C16 5.8 14.2 4 12 4C9.8 4 8 5.8 8 8C8 10.2 9.8 12 12 12ZM4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20Z" fill="#000"/>
</svg>
`;

const TAB_ACTIVE = "#F5F5F5";
const TAB_INACTIVE = "#71717A";
const ACCENT_BAR = "#C8102E";

export default function TabLayout() {
  console.log("FILE:", "(tabs)/_layout.tsx");
  console.log("LAYOUT TABS CHARGÉ");

  useEffect(() => {
    console.log("LAYOUT TABS USEEFFECT");
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: "#0D0D0D",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 14,
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => {
            const color = focused ? TAB_ACTIVE : TAB_INACTIVE;
            const xml = homeSvg.replace(/#000/g, color);
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 18,
                    height: 8,
                    marginBottom: 6,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {focused ? (
                    <View
                      style={{
                        width: 18,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: ACCENT_BAR,
                      }}
                    />
                  ) : null}
                </View>
                <SvgXml xml={xml} width={20} height={20} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="schema"
        options={{
          title: "Schéma",
          tabBarLabel: "Schéma",
          tabBarIcon: ({ focused }) => {
            const color = focused ? TAB_ACTIVE : TAB_INACTIVE;
            const xml = schemaSvg.replace(/#000/g, color);
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 18,
                    height: 8,
                    marginBottom: 6,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {focused ? (
                    <View
                      style={{
                        width: 18,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: ACCENT_BAR,
                      }}
                    />
                  ) : null}
                </View>
                <SvgXml xml={xml} width={20} height={20} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const color = focused ? TAB_ACTIVE : TAB_INACTIVE;
            const xml = profileSvg.replace(/#000/g, color);
            return (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 18,
                    height: 8,
                    marginBottom: 6,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {focused ? (
                    <View
                      style={{
                        width: 18,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: ACCENT_BAR,
                      }}
                    />
                  ) : null}
                </View>
                <SvgXml xml={xml} width={20} height={20} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen name="schemas" options={{ href: null }} />
      <Tabs.Screen name="pv-create" options={{ href: null }} />
      <Tabs.Screen name="facteurs" options={{ href: null }} />
      <Tabs.Screen name="circuits" options={{ href: null }} />
      <Tabs.Screen name="borne-create" options={{ href: null }} />
    </Tabs>
  );
}
