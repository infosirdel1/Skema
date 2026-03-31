export function normalizeMapping(mapping) {
  const normalized = JSON.parse(JSON.stringify(mapping));

  // --- NETWORK ---
  if (normalized.network) {
    // force types simples
    if (normalized.network.voltage !== 230 && normalized.network.voltage !== 400) {
      normalized.network.voltage = null;
    }

    if (typeof normalized.network.hasNeutral !== "boolean") {
      normalized.network.hasNeutral = null;
    }
  }

  // --- PROTECTIONS ---
  if (normalized.protections?.breakers) {
    normalized.protections.breakers = normalized.protections.breakers.map((b, index) => ({
      id: `breaker_${index}`,
      current: b?.current ?? null,
      poles: b?.poles ?? null,
      curve: b?.curve ?? null,
      role: b?.role ?? null,
    }));
  }

  // --- EQUIPMENTS ---
  if (normalized.equipments?.type !== "pv" && normalized.equipments?.type !== "borne") {
    normalized.equipments.type = null;
  }

  // PV nettoyage minimal
  if (normalized.equipments?.pv) {
    if (typeof normalized.equipments.pv.power !== "number") {
      normalized.equipments.pv.power = null;
    }
  }

  // BORNE nettoyage minimal
  if (normalized.equipments?.borne) {
    if (typeof normalized.equipments.borne.power !== "number") {
      normalized.equipments.borne.power = null;
    }
  }

  // --- WIRING ---
  if (!Array.isArray(normalized.wiring)) {
    normalized.wiring = [];
  }

  // --- RELATIONS ---
  if (!Array.isArray(normalized.relations)) {
    normalized.relations = [];
  }

  return normalized;
}
