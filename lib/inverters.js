export const INVERTERS = [
  {
    id: "SMA_SB_5_0",
    label: "SMA Sunny Boy 5.0",
    brand: "SMA",
    type: "central", // central | micro
    powerKw: 5.0,
    phases: "mono", // mono | tri
    mppt: 2,
    synergridId: null // futur mapping officiel
  },
  {
    id: "HUAWEI_5K",
    label: "Huawei SUN2000-5K",
    brand: "Huawei",
    type: "central",
    powerKw: 5.0,
    phases: "tri",
    mppt: 2,
    synergridId: null
  },
  {
    id: "ENPHASE_IQ7",
    label: "Enphase IQ7",
    brand: "Enphase",
    type: "micro",
    powerKw: 0.35,
    phases: "mono",
    mppt: 1,
    synergridId: null
  }
];
