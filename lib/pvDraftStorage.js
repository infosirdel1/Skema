import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pv_schema_draft_v1";

export const emptyPvDraft = {
  client: {
    name: "",
    phone: "",
    email: "",
    reference: "",
  },
  address: {
    query: "",
    street: "",
    postalCode: "",
    city: "",
  },
  organisme: {
    name: "",
    address: "",
    vat: "",
    phone: "",
    email: "",
    value: "",
  },
  network: {
    type: "",
  },
  meter: {
    ean: "",
    number: "",
    nominalCurrent: null,
  },
  pv: {
    powerKwc: null,
    inverterType: "",
    inverterModel: "",
    inverterSerial: ""
  },
  panels: {
    count: null,
    powerWp: null,
    totalPower: null
  },
  userProfile: {
    companyName: "",
    companyVat: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    defaultOrganism: {
      name: "",
      address: "",
      vat: "",
      phone: "",
      email: "",
      value: "",
    },
    signature: "",
  },
  meta: {
    version: "",
    updatedAt: null,
  },
  signatures: {
    client: null,
    installer: null,
  },
};

function buildVersion(previousVersion) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePart = `${y}${m}${d}`;

  if (!previousVersion || !previousVersion.startsWith(datePart)) {
    return `${datePart}-V1`;
  }

  const match = previousVersion.match(/-V(\d+)$/);
  const current = match ? Number(match[1]) : 1;
  return `${datePart}-V${current + 1}`;
}

export async function loadPvDraft() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyPvDraft };
    const parsed = JSON.parse(raw);
    return {
      ...emptyPvDraft,
      ...parsed,
      client: { ...emptyPvDraft.client, ...(parsed.client || {}) },
      address: { ...emptyPvDraft.address, ...(parsed.address || {}) },
      organisme: { ...emptyPvDraft.organisme, ...(parsed.organisme || {}) },
      network: { ...emptyPvDraft.network, ...(parsed.network || {}) },
      meter: { ...emptyPvDraft.meter, ...(parsed.meter || {}) },
      pv: { ...emptyPvDraft.pv, ...(parsed.pv || {}) },
      panels: { ...emptyPvDraft.panels, ...(parsed.panels || {}) },
      userProfile: {
        ...emptyPvDraft.userProfile,
        ...(parsed.userProfile || {}),
        defaultOrganism: {
          ...emptyPvDraft.userProfile.defaultOrganism,
          ...((parsed.userProfile || {}).defaultOrganism || {}),
        },
      },
      meta: { ...emptyPvDraft.meta, ...(parsed.meta || {}) },
      signatures: { ...emptyPvDraft.signatures, ...(parsed.signatures || {}) },
    };
  } catch {
    return { ...emptyPvDraft };
  }
}

export async function savePvDraft(draft, options = {}) {
  const previousVersion = draft?.meta?.version || "";
  const version = options.bumpVersion
    ? buildVersion(previousVersion)
    : previousVersion || buildVersion("");

  const payload = {
    ...draft,
    meta: {
      ...draft.meta,
      version,
      updatedAt: new Date().toISOString(),
    },
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export async function clearPvDraft() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function resetPvDraft() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
