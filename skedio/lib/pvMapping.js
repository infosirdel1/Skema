export function mapPvToSchema(draft) {
  if (!draft?.meter || !draft?.pv) {
    throw new Error("Draft incomplet");
  }

  const source = {
    type: "grid",
    ean: draft.meter.ean?.trim() || null,
    meterNumber: draft.meter.number?.trim() || null,
    nominalCurrent: draft.meter.nominalCurrent?.toString().trim() || null,
  };

  const inverter = {
    type: draft.pv.inverterType?.trim() || null, // central | micro
    model: draft.pv.inverterModel?.trim() || null,
    serial: draft.pv.inverterSerial?.trim() || null,
    powerKwc:
      draft.pv.powerKwc === 0 || draft.pv.powerKwc
        ? Number(draft.pv.powerKwc)
        : null,
  };

  const protection = {
    mainBreaker: null,
    differential: null,
  };

  const connections = [
    {
      from: "source",
      to: "inverter",
      type: "AC",
    },
  ];

  return {
    source,
    inverter,
    protection,
    connections,
  };
}
