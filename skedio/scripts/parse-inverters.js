const fs = require("fs");
const xlsx = require("xlsx");

const filePath = "./data/inverter.xlsx";

const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(sheet, {
  defval: null,
  range: 1 // saute la première ligne (doc)
});
const solarKey = "__EMPTY_10";

const results = [];

rows.forEach((row) => {
  const rawValue = row[solarKey];

  const isSolar =
    rawValue && String(rawValue).trim().toUpperCase() === "X";

  if (!isSolar) return;

  const inverter = {
    brand: row["__EMPTY_1"] || null,
    series: row["__EMPTY_2"] || null,
    model: row["__EMPTY_3"] || null,
    power_w: row["__EMPTY_7"] || null,
    apparent_power_va: row["__EMPTY_8"] || null,
    phase: row["__EMPTY_9"] || null,
    synergrid_ref: row[" "] || null,
  };

  results.push(inverter);
});

console.log("FINAL COUNT:", results.length);

fs.writeFileSync(
  "inverters-pv.json",
  JSON.stringify(results, null, 2)
);

const inverters = results;
{
  const fs = require("fs");
  fs.writeFileSync(
    "./data/inverters.json",
    JSON.stringify(inverters, null, 2),
    "utf-8"
  );
}

console.log("EXPORT OK:", inverters.length);
