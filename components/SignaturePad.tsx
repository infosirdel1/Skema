import { Platform } from "react-native";

import type { SignaturePadProps } from "./signaturePadTypes";
import SignaturePadNative from "./SignaturePad.native";
import SignaturePadWeb from "./SignaturePad.web";

export type { SignaturePadProps };

/** Web : canvas HTML5. iOS/Android : react-native-signature-canvas. */
export default function SignaturePad(props: SignaturePadProps) {
  if (Platform.OS === "web") {
    return <SignaturePadWeb {...props} />;
  }
  return <SignaturePadNative {...props} />;
}
