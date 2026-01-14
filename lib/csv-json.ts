import Papa from "papaparse";

export function parseCsvToJson(csv: string) {
  return Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
}

export function parseJsonToCsv(jsonText: string) {
  const json = JSON.parse(jsonText);
  return Papa.unparse(json);
}
