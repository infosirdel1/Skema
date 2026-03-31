export function buildRenderTree(mapping) {
  const nodes = [];
  const edges = [];

  // --- NODES FIXES ---
  nodes.push({
    id: "meter",
    type: "meter",
    label: "Compteur",
  });

  if (mapping?.protections?.mainDifferential) {
    nodes.push({
      id: "mainDifferential",
      type: "differential",
      label: "Différentiel",
    });
  }

  if (Array.isArray(mapping?.protections?.breakers)) {
    mapping.protections.breakers.forEach((breaker) => {
      nodes.push({
        id: breaker.id,
        type: "breaker",
        label: `Disj ${breaker.current || ""}A`,
      });
    });
  }

  if (mapping?.equipments?.type === "pv") {
    nodes.push({
      id: "pv_inverter",
      type: "inverter",
      label: "Onduleur",
    });

    if (mapping?.equipments?.pv?.battery?.model) {
      nodes.push({
        id: "pv_battery",
        type: "battery",
        label: "Batterie",
      });
    }
  }

  if (mapping?.equipments?.type === "borne") {
    nodes.push({
      id: "borne",
      type: "ev_charger",
      label: "Borne",
    });
  }

  // --- EDGES (relations) ---
  if (Array.isArray(mapping?.relations)) {
    mapping.relations.forEach((rel) => {
      edges.push({
        from: rel.from,
        to: rel.to,
      });
    });
  }

  return {
    nodes,
    edges,
  };
}
