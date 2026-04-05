import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  PanResponder,
  StyleSheet,
  Image,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const PEN = "#F5F5F5";
const BG = "#111111";

export type ProfileSignaturePadProps = {
  value: string;
  onChange: (dataUrl: string) => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

export type ProfileSignaturePadRef = {
  clearSignature: () => void;
  readSignature: () => void;
};

type Pt = { x: number; y: number };

function ptsToD(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  }
  return d;
}

function buildSvgDataUrl(pathDs: string[], w: number, h: number): string {
  const paths = pathDs
    .filter(Boolean)
    .map(
      (d) =>
        `<path d="${d.replace(/"/g, "&quot;")}" stroke="${PEN}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${BG}"/>${paths}</svg>`;
  try {
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${b64}`;
  } catch {
    return "";
  }
}

function parseSvgPathsFromDataUrl(dataUrl: string): string[] {
  if (!dataUrl || !dataUrl.includes("svg")) return [];
  try {
    const base64 = dataUrl.split(",")[1];
    if (!base64 || typeof atob !== "function") return [];
    const raw = decodeURIComponent(escape(atob(base64)));
    const out: string[] = [];
    const re = /d="([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
      out.push(m[1].replace(/&quot;/g, '"'));
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Signature sans WebView : Svg + PanResponder (web + iOS + Android).
 * Les anciennes signatures PNG (WebView) restent affichées en fond jusqu’à Effacer.
 */
const ProfileSignaturePad = forwardRef<ProfileSignaturePadRef, ProfileSignaturePadProps>(
  function ProfileSignaturePad({ value, onChange, style, containerStyle }, ref) {
    const [layout, setLayout] = useState({ w: 300, h: 180 });
    const [strokes, setStrokes] = useState<string[]>([]);
    const [draftPts, setDraftPts] = useState<Pt[]>([]);
    const draftRef = useRef<Pt[]>([]);
    const strokesRef = useRef<string[]>([]);
    const layoutRef = useRef(layout);

    useEffect(() => {
      layoutRef.current = layout;
    }, [layout]);

    useEffect(() => {
      strokesRef.current = strokes;
    }, [strokes]);

    const isPng = value.startsWith("data:image/png");

    useEffect(() => {
      if (isPng) {
        setStrokes([]);
        return;
      }
      setStrokes(parseSvgPathsFromDataUrl(value));
    }, [value, isPng]);

    const commitDraft = useCallback(
      (pts: Pt[]) => {
        const { w, h } = layoutRef.current;
        const d = ptsToD(pts);
        if (!d) return;
        const next = [...strokesRef.current, d];
        setStrokes(next);
        strokesRef.current = next;
        draftRef.current = [];
        setDraftPts([]);
        onChange(buildSvgDataUrl(next, w, h));
      },
      [onChange]
    );

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: (e) => {
            const { w, h } = layoutRef.current;
            const x = e.nativeEvent.locationX;
            const y = e.nativeEvent.locationY;
            if (x < 0 || y < 0 || x > w || y > h) return;
            const pts = [{ x, y }];
            draftRef.current = pts;
            setDraftPts(pts);
          },
          onPanResponderMove: (e) => {
            const { w, h } = layoutRef.current;
            const x = Math.max(0, Math.min(w, e.nativeEvent.locationX));
            const y = Math.max(0, Math.min(h, e.nativeEvent.locationY));
            draftRef.current = [...draftRef.current, { x, y }];
            setDraftPts([...draftRef.current]);
          },
          onPanResponderRelease: () => {
            commitDraft(draftRef.current);
          },
          onPanResponderTerminate: () => {
            if (draftRef.current.length > 0) {
              commitDraft(draftRef.current);
            }
          },
        }),
      [commitDraft]
    );

    useImperativeHandle(ref, () => ({
      clearSignature: () => {
        draftRef.current = [];
        setDraftPts([]);
        setStrokes([]);
        strokesRef.current = [];
        onChange("");
      },
      readSignature: () => {
        const { w, h } = layoutRef.current;
        if (draftRef.current.length > 0) {
          commitDraft(draftRef.current);
        } else if (strokesRef.current.length > 0) {
          onChange(buildSvgDataUrl(strokesRef.current, w, h));
        } else if (!value) {
          onChange("");
        }
      },
    }));

    const onLayout = (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setLayout({ w: width, h: height });
      }
    };

    const draftD = ptsToD(draftPts);

    return (
      <View style={[styles.wrap, containerStyle, style]} onLayout={onLayout}>
        {isPng && value ? (
          <Image
            source={{ uri: value }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            accessibilityLabel="Signature enregistrée"
          />
        ) : null}
        <Svg width={layout.w} height={layout.h} style={StyleSheet.absoluteFill}>
          {strokes.map((d, i) => (
            <Path
              key={`s-${i}`}
              d={d}
              stroke={PEN}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {draftD ? (
            <Path
              d={draftD}
              stroke={PEN}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </Svg>
        <View style={styles.touch} {...panResponder.panHandlers} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 160,
    backgroundColor: BG,
    borderRadius: 10,
    overflow: "hidden",
  },
  touch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});

export default ProfileSignaturePad;
