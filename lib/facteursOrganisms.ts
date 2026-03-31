/** Liste locale facteurs — recherche / sélection (hors CONTROL_ORGANISMS profil / PV). */

export type FacteursOrganismePreset = {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  agrement: string;
};

export type FacteursSignaturePayload = {
  enabled: boolean;
  image: string | null;
  nom: string;
  date: string;
};

export const emptyFacteursOrganisme: FacteursOrganismePreset = {
  id: "",
  nom: "",
  adresse: "",
  telephone: "",
  email: "",
  agrement: "",
};

export const defaultSignatureClient: FacteursSignaturePayload = {
  enabled: false,
  image: null,
  nom: "",
  date: "",
};

export const FACTEURS_ORGANISMES_PRESETS: FacteursOrganismePreset[] = [
  {
    id: "atlas",
    nom: "Atlas Contrôle",
    adresse: "Boulevard du Lambermont 140\n1030 Schaerbeek\nBelgique",
    telephone: "02 245 37 37",
    email: "info@atlascontrole.be",
    agrement: "BEL-ATLAS-OC-2024",
  },
  {
    id: "vincotte",
    nom: "Vinçotte",
    adresse: "Rue du Nord 18, 1000 Bruxelles",
    telephone: "+32 2 674 71 11",
    email: "info@vincotte.be",
    agrement: "OC-VIN-AGR-BE-18",
  },
  {
    id: "btv",
    nom: "BTV",
    adresse: "Chaussée de Charleroi 112, 1060 Saint-Gilles",
    telephone: "+32 2 538 45 00",
    email: "contact@btv.be",
    agrement: "BTV-CONTRÔLE-BE-09",
  },
  {
    id: "socotec",
    nom: "Socotec Belgium",
    adresse: "Boulevard Industriel 55, 1070 Anderlecht",
    telephone: "+32 2 523 12 00",
    email: "belgique@socotec.com",
    agrement: "SOC-BE-OC-12",
  },
  {
    id: "dekra",
    nom: "DEKRA Certification",
    adresse: "Rue Colonel Bourg 79, 1030 Bruxelles",
    telephone: "+32 2 674 88 20",
    email: "info@dekra.be",
    agrement: "DEKRA-BE-AGR-08",
  },
  {
    id: "bureau_veritas",
    nom: "Bureau Veritas Belgium",
    adresse: "Avenue Arnaud Fraiteur 15-23, 1050 Ixelles",
    telephone: "+32 2 643 43 43",
    email: "belgium@bureauveritas.com",
    agrement: "BV-OC-BE-14",
  },
  {
    id: "sgs",
    nom: "SGS Belgium",
    adresse: "Passage du Nord 19, 1070 Anderlecht",
    telephone: "+32 2 559 06 11",
    email: "be@sgs.com",
    agrement: "SGS-BE-CONTRÔLE-11",
  },
  {
    id: "tuv",
    nom: "TÜV Rheinland Belgium",
    adresse: "Rue Général Lartigue 53, 1030 Bruxelles",
    telephone: "+32 2 340 15 55",
    email: "info@tuv.com.be",
    agrement: "TUV-BE-OC-07",
  },
  {
    id: "intertek",
    nom: "Intertek Belgium",
    adresse: "Avenue des Communautés 100, 1200 Woluwe",
    telephone: "+32 2 775 88 00",
    email: "belgium@intertek.com",
    agrement: "INT-BE-AGR-19",
  },
  {
    id: "apave",
    nom: "Apave Belgium",
    adresse: "Chaussée de Haecht 1200, 1130 Bruxelles",
    telephone: "+32 2 247 47 47",
    email: "contact@apave.be",
    agrement: "APAVE-BE-OC-05",
  },
  {
    id: "certifer",
    nom: "Certifer Wallonie",
    adresse: "Rue de la Station 45, 5000 Namur",
    telephone: "+32 81 12 34 56",
    email: "wallonie@certifer.be",
    agrement: "CERT-WAL-22",
  },
  {
    id: "certinorm",
    nom: "Certinorm Flandre",
    adresse: "Industrielaan 200, 9000 Gand",
    telephone: "+32 9 234 56 78",
    email: "vl@certinorm.be",
    agrement: "CN-FL-AGR-17",
  },
  {
    id: "qualicontrol",
    nom: "Qualicontrol SPRL",
    adresse: "Rue des Palais 48, 1020 Bruxelles",
    telephone: "+32 2 428 90 00",
    email: "hello@qualicontrol.be",
    agrement: "QC-BE-2023-04",
  },
  {
    id: "eurofins",
    nom: "Eurofins Expertises",
    adresse: "Parc scientifique Einstein, 1348 Louvain-la-Neuve",
    telephone: "+32 10 48 90 00",
    email: "be@eurofins.com",
    agrement: "EF-BE-OC-16",
  },
  {
    id: "ul",
    nom: "UL Solutions Belgium",
    adresse: "Avenue Einstein 12, 1300 Wavre",
    telephone: "+32 10 39 48 00",
    email: "benelux@ul.com",
    agrement: "UL-BE-AGR-21",
  },
  {
    id: "kiwa",
    nom: "Kiwa Belgium",
    adresse: "Nijverheidslaan 25, 1853 Grimbergen",
    telephone: "+32 2 270 11 00",
    email: "info@kiwa.be",
    agrement: "KIWA-BE-09",
  },
  {
    id: "dnv",
    nom: "DNV Belgium",
    adresse: "Avenue Louise 489, 1050 Bruxelles",
    telephone: "+32 2 674 96 11",
    email: "belgium@dnv.com",
    agrement: "DNV-OC-BE-13",
  },
  {
    id: "lci",
    nom: "LCIE Bureau Veritas",
    adresse: "Rue des Trois Arbres 29, 7500 Tournai",
    telephone: "+32 69 88 77 66",
    email: "lcie@bureauveritas.com",
    agrement: "LCIE-BE-18",
  },
  {
    id: "cstb",
    nom: "CSTB Europe (Belgique)",
    adresse: "Square de Meeûs 35, 1000 Bruxelles",
    telephone: "+32 2 502 35 00",
    email: "be@cstb.fr",
    agrement: "CSTB-EU-BE-06",
  },
  {
    id: "bemcert",
    nom: "BEM Cert",
    adresse: "Rue du Commerce 88, 4000 Liège",
    telephone: "+32 4 223 44 55",
    email: "info@bemcert.be",
    agrement: "BEM-LG-OC-24",
  },
  {
    id: "protec",
    nom: "Protec Inspection",
    adresse: "Zone industrielle 3, 6001 Charleroi",
    telephone: "+32 71 33 44 55",
    email: "contact@protec-inspection.be",
    agrement: "PROT-HAI-11",
  },
  {
    id: "safebuild",
    nom: "SafeBuild Contrôles",
    adresse: "Avenue Reine Astrid 220, 1310 La Hulpe",
    telephone: "+32 2 653 00 10",
    email: "contrôles@safebuild.be",
    agrement: "SB-BE-AGR-20",
  },
];

export function filterOrganismes(
  query: string,
  list: FacteursOrganismePreset[] = FACTEURS_ORGANISMES_PRESETS
): FacteursOrganismePreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (o) =>
      o.nom.toLowerCase().includes(q) ||
      o.adresse.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.agrement.toLowerCase().includes(q)
  );
}
