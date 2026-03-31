export type SignaturePadProps = {
  /** Data URL PNG (image/png;base64,...) ou null */
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  /** Appelé après effacement interne (optionnel) */
  onClear?: () => void;
  /** Hauteur de la zone de dessin */
  height?: number;
};
