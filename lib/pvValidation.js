export function validateEAN(ean) {
  if (!ean) return "EAN requis";
  if (!/^\d{18}$/.test(ean)) return "EAN invalide (18 chiffres)";
  return null;
}

export function validateIN(value) {
  if (!value) return "IN requis";
  const clean = value.replace(/\s/g, "").toUpperCase();
  if (!/^\d{1,3}A?$/.test(clean)) return "IN invalide";
  return null;
}

export function validateSerial(value) {
  if (!value || !value.trim()) return "Numéro requis";
  return null;
}
