export const mappingSchema = {
  network: {
    voltage: null,
    hasNeutral: null,
    meter: {
      type: null,
      number: null,
      cable: {
        section: null,
        type: null,
        installationMode: null,
        conductors: null,
      },
    },
  },

  protections: {
    mainDifferential: {
      current: null,
      poles: null,
      type: null,
      breakingCapacity: null,
    },
    breakers: [],
    secondaryDifferentials: [],
  },

  equipments: {
    type: null,

    pv: {
      power: null,
      panelsCount: null,
      inverter: {
        brand: null,
        model: null,
        power: null,
        serialNumber: null,
        synergridId: null,
      },
      battery: {
        brand: null,
        model: null,
        capacity: null,
        bmsSerial: null,
        batterySerial: null,
      },
    },

    borne: {
      brand: null,
      model: null,
      power: null,
      serialNumber: null,
    },
  },

  wiring: [],
  relations: [],
};
