function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const formatValue = (value) => {
  if (value == null || value === "") return "";
  return String(value).replaceAll(",", ", ");
};

const FACTOR_KEYS = [
  "AA",
  "AD",
  "AE",
  "AF",
  "AG",
  "AH",
  "AK",
  "AL",
  "AM",
  "AN",
  "BA",
  "BB",
  "BC",
  "BD",
  "BE",
  "CA",
  "CB",
];

const PAGE_HEIGHT = 190; // zone utile A4 paysage
const HEADER_HEIGHT = 0; // pas de .page-header dans le DOM — aligné sur le rendu réel
const FOOTER_HEIGHT = 35; // cartouche
const PAGE_PADDING = 10; // padding interne (haut + bas)
const BODY_GAP_BOTTOM = 4; // espace sous tableau

const TITLE_HEIGHT = 10; // h2
const TABLE_HEADER_HEIGHT = 8; // thead
const ROW_HEIGHT = 6.8; // ligne moyenne

function computeAvailableHeight() {
  const bodyHeight =
    PAGE_HEIGHT -
    HEADER_HEIGHT -
    FOOTER_HEIGHT -
    PAGE_PADDING * 2; // top + bottom

  return (
    bodyHeight -
    TITLE_HEIGHT -
    TABLE_HEADER_HEIGHT -
    BODY_GAP_BOTTOM
  );
}

function paginateRows(rows) {
  const maxHeight = computeAvailableHeight();

  const pages = [];
  let current = [];
  let height = 0;

  for (const row of rows) {
    const h = ROW_HEIGHT;

    if (height + h > maxHeight) {
      if (current.length) pages.push(current);
      current = [row];
      height = h;
    } else {
      current.push(row);
      height += h;
    }
  }

  if (current.length) pages.push(current);

  return pages;
}

/** Styles copiés à l’identique depuis skedio/app/pdf-preview.html (<style> interne). */
const PDF_PREVIEW_STYLES = `
@page {
  margin: 0;
}

body {
  margin: 0;
  background: #ccc;
  font-family: Arial, sans-serif;
}

.page {
  width: 277mm;
  height: 190mm;
  margin: 20px auto;
  padding: 10mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: white;
  border: none;
}

/* BODY */
.body {
  flex: 1;
}

/* TABLE */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

th, td {
  border: 1px solid black;
  padding: 2px;
}

.top-line {
  width: 100%;
  border-top: 2px solid #000;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.page-footer {
  flex-shrink: 0;
  margin-top: auto;
  page-break-inside: avoid;
}

/* === Cartouche PDF (copie stricte depuis factorsToHtml.js — generateCartoucheHtml + styles associés) === */

.cartouche-row {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  min-height: 90px;
  page-break-inside: avoid;
}

.cartouche-block {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
  border-right: 1px solid #000;
  padding: 7px 8px;
  box-sizing: border-box;
  font-size: 10px;
  line-height: 1.2;
  min-width: 0;
  overflow: hidden;
}

.cartouche-block:last-child {
  border-right: none;
}

.cartouche-block .title {
  font-weight: bold;
  margin-bottom: 4px;
}

.block-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  min-height: 0;
  height: 100%;
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.text-content > div {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo-block {
  flex: 0 0 12%;
  width: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.logo-block .block-content {
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.logo-block .text-content {
  display: none;
}

.logo-block .right-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  margin: 0;
  min-width: 0;
}

.organisme-block {
  flex: 0 0 20%;
  width: 20%;
}

.installateur-block {
  flex: 0 0 30%;
  width: 30%;
}

.client-block {
  flex: 0 0 25%;
  width: 25%;
}

.logo-skema {
  max-width: 100%;
  max-height: 70px;
  object-fit: contain;
  display: block;
}

.right-content {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex: 0 0 auto;
  min-width: 0;
}

.installateur-logo {
  max-height: 18px;
  max-width: 54px;
  object-fit: contain;
}

.signature-slot {
  width: 120px;
  height: 50px;
  border: 0px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #fff;
  overflow: hidden;
}

.signature-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

.versionning {
  flex: 0 0 9%;
  width: 9%;
  min-width: 0;
  font-size: 10px;
  line-height: 1.1;
  white-space: normal;
  padding: 7px 8px;
}

.versionning .text-content,
.versionning .block-content {
  overflow: hidden;
}

.versionning div + div {
  margin-top: 3px;
}

.installateur-cell {
  position: relative;
}

.installateur-fixed {
  position: absolute;
  inset: 0;
}

.installateur-logo-free,
.installateur-cell img.logo-installateur {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 100px;
  object-fit: contain;
}

.signature-installateur {
  position: absolute;
  bottom: 8px;
  right: 6px;
  width: 120px;
  height: 50px;
}

.installateur-block .text-content {
  max-width: calc(100% - 130px);
}

.installateur-block .text-content > div {
  overflow: visible;
  text-overflow: unset;
}

.installateur-logo {
  max-width: 80px;
  max-height: 40px;
  object-fit: contain;
  display: block;
  margin-bottom: 4px;
}

.installateur-text div:nth-last-child(2) {
  font-weight: normal;
  white-space: nowrap;
}

.client-fixed {
  position: absolute;
  top: 59px;
  right: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.client-block .text-content {
  padding-right: 120px;
}
`;

function buildTableRowHtml(r) {
  const cells = FACTOR_KEYS.map(
    (k) => `<td>${escapeHtml(formatValue(r[k]))}</td>`
  ).join("");
  const pub = typeof r.public === "boolean" && r.public ? "OUI" : "NON";
  return `
      <tr>
        <td>${escapeHtml(r.local)}</td>
        ${cells}
        <td>${escapeHtml(pub)}</td>
      </tr>`;
}

function generateTableHtml(pageRows) {
  const rowHtml = pageRows.map((r) => buildTableRowHtml(r)).join("");
  return `
    <table>
      <colgroup>
        <col class="col-local" />
        <col span="17" class="col-factor" />
        <col class="col-pub" />
      </colgroup>
      <thead>
        <tr>
          <th>LOCAL</th>
          <th>AA</th>
          <th>AD</th>
          <th>AE</th>
          <th>AF</th>
          <th>AG</th>
          <th>AH</th>
          <th>AK</th>
          <th>AL</th>
          <th>AM</th>
          <th>AN</th>
          <th>BA</th>
          <th>BB</th>
          <th>BC</th>
          <th>BD</th>
          <th>BE</th>
          <th>CA</th>
          <th>CB</th>
          <th>PUB</th>
        </tr>
      </thead>

      <tbody>
        ${rowHtml}
      </tbody>
    </table>`;
}

function generateCartoucheHtml(ctx) {
  const {
    pageNumber,
    totalPages,
    dateStr,
    logo,
    organismeInner,
    installateurTextInner,
    installateurLogo,
    installateurLogoUrl: logoUrl,
    signatureInstallateur,
    clientName,
    clientStreet,
    clientCity,
    clientDate,
    sig,
  } = ctx;

  const clientLines = [
    clientName,
    clientStreet,
    clientCity,
    sig && sig.nom ? escapeHtml(sig.nom) : "",
    clientDate,
  ].filter(Boolean);
  const clientTextHtml = clientLines.length
    ? `<div class="client-text">${clientLines.join("<br/>")}</div>`
    : "";

  return `
    <div class="cartouche-row">

      <div class="cartouche-block logo-block">
        <div class="block-content">
          <div class="text-content"></div>
          <div class="right-content">
            ${
              logo
                ? `<img src="${logo}" class="logo-skema" alt="" />`
                : ""
            }
          </div>
        </div>
      </div>

      <div class="cartouche-block organisme-block">
        <div class="block-content">
          <div class="text-content">
            <div class="title">Organisme de contrôle</div>
            ${organismeInner}
          </div>
          <div class="right-content"></div>
        </div>
      </div>

      <div class="cartouche-block installateur-block installateur-cell">
        <div class="block-content">
          <div class="text-content">
            <div class="title">Installateur</div>
            <img class="installateur-logo" src="${logoUrl || ""}" />
            ${
              installateurTextInner
                ? `<div class="installateur-text">${installateurTextInner}</div>`
                : ""
            }
          </div>
          <div class="right-content"></div>
        </div>
        ${
          installateurLogo
            ? `<img src="${installateurLogo}" class="logo-installateur" alt="" />`
            : ""
        }
        ${
          signatureInstallateur
            ? `<img src="${signatureInstallateur}" class="signature-img signature-installateur" alt="" />`
            : ""
        }
      </div>

      <div class="cartouche-block client-block">
        <div class="block-content">
          <div class="text-content">
            <div class="title">Client</div>
            ${clientTextHtml}
            <div class="client-fixed">
              <div class="signature-slot signature-client">
                ${
                  sig && sig.image
                    ? `<img src="${sig.image}" class="signature-img" alt="" />`
                    : ""
                }
              </div>
            </div>
          </div>
          <div class="right-content"></div>
        </div>
      </div>

      <div class="cartouche-block versionning">
        <div class="block-content">
          <div class="text-content">
            <div>Date : ${dateStr}</div>
            <div>Version : 1.0</div>
            <div>Page : ${pageNumber} / ${totalPages}</div>
          </div>
          <div class="right-content"></div>
        </div>
      </div>

    </div>`;
}

/**
 * @param {object | null | undefined} organisme { nom, adresse, telephone, email, agrement }
 * @param {object | null | undefined} signatureClient { enabled, image, nom, date }
 * @param {string[]|string|undefined} [installateurLines] lignes cartouche installateur
 * @param {string} [installateurLogo] data URL optionnelle
 * @param {string} [signatureInstallateur] data URL optionnelle
 * @param {string} [installateurLogoUrl] URL logo entreprise (ex. Firebase Storage)
 */
export const generateHtmlFromFactors = (
  rows,
  logo,
  client,
  organisme,
  signatureClient,
  installateurLines,
  installateurLogo,
  signatureInstallateur,
  installateurLogoUrl
) => {
  const org = organisme || {};
  const orgLines = [];
  if (org.nom) orgLines.push(escapeHtml(org.nom));
  if (org.adresse) {
    String(org.adresse)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => orgLines.push(escapeHtml(line)));
  }
  if (org.telephone) orgLines.push(`Tél. ${escapeHtml(org.telephone)}`);
  if (org.email) orgLines.push(escapeHtml(org.email));
  if (org.agrement) orgLines.push(`Agrément : ${escapeHtml(org.agrement)}`);
  const organismeBlock = orgLines.length ? orgLines.join("<br/>") : "";

  const organismeInner = organismeBlock
    ? organismeBlock
        .split("<br/>")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<div>${s}</div>`)
        .join("")
    : "";

  const sig = signatureClient && signatureClient.enabled ? signatureClient : null;

  const clientName =
    client && client.name ? escapeHtml(client.name) : "";
  const streetLine =
    client && `${client.street || ""} ${client.number || ""}`.trim();
  const clientStreet = streetLine ? escapeHtml(streetLine) : "";
  const cityLine =
    client && `${client.zip || ""} ${client.city || ""}`.trim();
  const clientCity = cityLine ? escapeHtml(cityLine) : "";
  const clientDate = sig && sig.date ? escapeHtml(sig.date) : "";

  const rawInstallateurLines = Array.isArray(installateurLines)
    ? installateurLines
    : typeof installateurLines === "string" && installateurLines.trim()
      ? [installateurLines.trim()]
      : [];
  const trimmedInstallateur = rawInstallateurLines.map((s) => String(s).trim());
  const installateurTextInner = trimmedInstallateur
    .map((line, idx) => ({ line, idx }))
    .filter((x) => x.line)
    .map(({ line, idx }) => {
      const isAddr = idx === 1 || idx === 2 || idx === 3;
      const cls = isAddr ? ' class="address"' : "";
      return `<div${cls}>${escapeHtml(line)}</div>`;
    })
    .join("");

  let pages = paginateRows(rows);
  if (pages.length === 0) pages = [[]];

  const dateStr = escapeHtml(new Date().toLocaleDateString("fr-FR"));

  const cartoucheCtxBase = {
    dateStr,
    logo,
    organismeInner,
    installateurTextInner,
    installateurLogo,
    installateurLogoUrl,
    signatureInstallateur,
    clientName,
    clientStreet,
    clientCity,
    clientDate,
    sig,
  };

  const htmlPages = pages
    .map((pageRows, index) => {
      return `
<div class="page">

  <div class="body">

    <div class="top-line"></div>
    <h2 class="section-title">Facteurs d'influence externes</h2>

    ${generateTableHtml(pageRows)}

  </div>

  <div class="page-footer">

    ${generateCartoucheHtml({
      ...cartoucheCtxBase,
      pageNumber: index + 1,
      totalPages: pages.length,
    })}

  </div>

</div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Facteurs d'influence externes</title>
  <style>
${PDF_PREVIEW_STYLES}
  </style>
</head>

<body>

${htmlPages}

</body>
</html>
`;
};
