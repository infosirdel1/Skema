/**
 * iOS / Android — react-native-signature-canvas (WebView).
 */
import { useRef, useCallback, type ComponentRef } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import SignatureScreen from "react-native-signature-canvas";

import type { SignaturePadProps } from "./signaturePadTypes";

const signatureWebStyle = `
.m-signature-pad { box-shadow: none; border: none; }
.m-signature-pad--body { border: none; }
.m-signature-pad--footer { display: none !important; }
body, html { height: 100%; margin: 0; }
`;

export default function SignaturePadNative({
  value,
  onChange,
  onClear: onClearProp,
  height = 180,
}: SignaturePadProps) {
  const ref = useRef<ComponentRef<typeof SignatureScreen> | null>(null);

  const handleClear = useCallback(() => {
    ref.current?.clearSignature();
    onChange(null);
    onClearProp?.();
  }, [onChange, onClearProp]);

  return (
    <View style={{ width: "100%" }}>
      <View style={[styles.padWrap, { height }]}>
        <SignatureScreen
          ref={ref}
          nestedScrollEnabled
          dataURL={value ?? undefined}
          imageType="image/png"
          penColor="#000000"
          backgroundColor="white"
          descriptionText=""
          webStyle={signatureWebStyle}
          style={styles.pad}
          webviewContainerStyle={styles.webview}
          onOK={(data) => onChange(data)}
          onClear={() => {
            onChange(null);
            onClearProp?.();
          }}
        />
      </View>
      <Pressable onPress={handleClear} style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.85 }]}>
        <Text style={styles.clearText}>Effacer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  padWrap: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  pad: { flex: 1, backgroundColor: "#ffffff" },
  webview: { flex: 1, backgroundColor: "#ffffff" },
  clearBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  clearText: { color: "#A1A1AA", fontSize: 14 },
});
