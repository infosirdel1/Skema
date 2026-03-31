export function buildMappingRelations(mapping) {
  const relations = [];

  const hasMainDifferential =
    mapping?.protections?.mainDifferential &&
    typeof mapping.protections.mainDifferential === "object";

  const hasBreakers =
    Array.isArray(mapping?.protections?.breakers) &&
    mapping.protections.breakers.length > 0;

  const equipmentType = mapping?.equipments?.type || null;

  if (hasMainDifferential) {
    relations.push({
      from: "meter",
      to: "mainDifferential",
    });
  }

  if (hasMainDifferential && hasBreakers) {
    mapping.protections.breakers.forEach((breaker, index) => {
      relations.push({
        from: "mainDifferential",
        to: `breaker_${index}`,
      });
    });
  }

  if (hasBreakers && equipmentType === "pv") {
    relations.push({
      from: "breaker_0",
      to: "pv_inverter",
    });

    if (mapping?.equipments?.pv?.battery?.model) {
      relations.push({
        from: "pv_inverter",
        to: "pv_battery",
      });
    }
  }

  if (hasBreakers && equipmentType === "borne") {
    relations.push({
      from: "breaker_0",
      to: "borne",
    });
  }

  return {
    ...mapping,
    relations,
  };
}
