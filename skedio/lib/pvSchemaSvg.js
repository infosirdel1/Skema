export function generatePvSvg(schema) {
  const inverterLabel = (schema?.inverter?.model || "Onduleur").slice(0, 18);
  const inverterPower =
    schema?.inverter?.powerKwc !== null && schema?.inverter?.powerKwc !== undefined
      ? `${schema.inverter.powerKwc} kW`
      : "";

  const eanLabel = schema?.source?.ean
    ? `${String(schema.source.ean).slice(0, 6)}...`
    : "";

  const svg = `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">

  <!-- Source -->
  <rect id="source" x="20" y="80" width="100" height="60" stroke="black" fill="none" stroke-width="2"/>
  <text x="30" y="100">Réseau</text>
  <text x="30" y="118">${eanLabel}</text>

  <!-- Sectionneur -->
  <rect id="sectionneur" x="110" y="95" width="20" height="30" stroke="black" fill="none" stroke-width="2"/>
  <text x="120" y="110" text-anchor="middle" dominant-baseline="middle">S</text>
  <text x="120" y="135" text-anchor="middle">Sectionneur</text>

  <!-- Disjoncteur -->
  <rect id="disjoncteur" x="135" y="95" width="20" height="30" stroke="black" fill="none" stroke-width="2"/>
  <text x="145" y="110" text-anchor="middle" dominant-baseline="middle">DJ</text>
  <text x="145" y="135" text-anchor="middle">Disjoncteur</text>

  <!-- Coffret -->
  <text x="190" y="65" text-anchor="middle">Coffret</text>
  <rect id="coffret" x="150" y="70" width="80" height="70" stroke="black" fill="none" stroke-width="2"/>

  <text x="190" y="95" text-anchor="middle">
    <tspan x="190" dy="0">Différentiel</tspan>
    <tspan x="190" dy="15">300 mA</tspan>
  </text>

  <!-- Lignes -->
  <line x1="120" y1="110" x2="110" y2="110" stroke="black" stroke-width="2"/>
  <line x1="130" y1="110" x2="135" y2="110" stroke="black" stroke-width="2"/>
  <line x1="155" y1="110" x2="150" y2="110" stroke="black" stroke-width="2"/>
  <line x1="230" y1="110" x2="250" y2="110" stroke="black" stroke-width="2"/>

  <!-- Onduleur -->
  <rect id="inverter" x="250" y="60" width="120" height="80" stroke="black" fill="none" stroke-width="2"/>
  <text x="260" y="80">
    <tspan x="260" dy="0">${inverterLabel}</tspan>
    <tspan x="260" dy="15">${inverterPower}</tspan>
  </text>

</svg>
`;

  return svg.trim();
}
