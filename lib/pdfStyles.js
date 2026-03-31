/**
 * Styles debug pour visualiser zones PDF (page / header / body / footer).
 * Importer `pdfDebugStyles` et l’ajouter au <style> du HTML, ou commenter ce fichier.
 */
export const pdfDebugStyles = `
/* =========================
   DEBUG VISUEL PDF (COMPAT ACTUEL + FUTUR)
   ========================= */

/* Pages */
.page,
.pdf-page {
  border: 2px dashed red;
}

/* Header (si ajouté plus tard) */
.pdf-header {
  background: rgba(0, 0, 255, 0.05);
  outline: 1px solid blue;
}

/* Body */
.page-body,
.pdf-body {
  background: rgba(0, 255, 0, 0.05);
  outline: 1px solid green;
}

/* Footer */
.page-footer,
.pdf-footer {
  background: rgba(255, 0, 0, 0.05);
  outline: 1px solid red;
}

/* =========================
   DEBUG TABLE
   ========================= */

table {
  outline: 1px solid orange;
}

tr {
  outline: 1px dashed purple;
}

td, th {
  outline: 1px dotted rgba(0,0,0,0.3);
}

/* =========================
   DEBUG OVERFLOW
   ========================= */

.page-body *,
.pdf-body * {
  box-sizing: border-box;
}

/* =========================
   OPTION OFF
   ========================= */
/*
Décommenter pour désactiver :
.page,
.pdf-page,
.page-body,
.pdf-body,
.page-footer,
.pdf-footer,
table,
tr,
td,
th {
  outline: none !important;
  border: none !important;
}
*/
`;

export default pdfDebugStyles;
