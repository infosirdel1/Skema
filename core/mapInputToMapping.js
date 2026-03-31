import { createEmptyMapping } from "./createEmptyMapping";

export function mapInputToMapping(input) {
  const mapping = createEmptyMapping();

  // --- NETWORK ---
  mapping.network.voltage = input.network?.voltage || null;
  mapping.network.hasNeutral = input.network?.hasNeutral || null;

  mapping.network.meter.type = input.network?.meter?.type || null;
  mapping.network.meter.number = input.network?.meter?.number || null;

  mapping.network.meter.cable.section = input.network?.meter?.cable?.section || null;
  mapping.network.meter.cable.type = input.network?.meter?.cable?.type || null;
  mapping.network.meter.cable.installationMode = input.network?.meter?.cable?.installationMode || null;
  mapping.network.meter.cable.conductors = input.network?.meter?.cable?.conductors || null;

  // --- PROTECTIONS ---
  mapping.protections.mainDifferential = input.protections?.mainDifferential || null;
  mapping.protections.breakers = input.protections?.breakers || [];
  mapping.protections.secondaryDifferentials = input.protections?.secondaryDifferentials || [];

  // --- EQUIPMENTS ---
  mapping.equipments.type = input.equipments?.type || null;

  if (mapping.equipments.type === "pv") {
    mapping.equipments.pv = input.equipments?.pv || mapping.equipments.pv;
  }

  if (mapping.equipments.type === "borne") {
    mapping.equipments.borne = input.equipments?.borne || mapping.equipments.borne;
  }

  // --- WIRING ---
  mapping.wiring = input.wiring || [];

  // --- RELATIONS ---
  mapping.relations = input.relations || [];

  return mapping;
}
