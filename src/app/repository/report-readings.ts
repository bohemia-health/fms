import readings from "./report-readings.json";

type Reading = { label: string; value: string };
type Certificate = { batch: string; readings: Reading[] };

// These readings come from the linked certificates. Match by full file key
// and batch so another test for the same batch cannot inherit the readings.
const certificates = new Map<string, Certificate>(Object.entries(readings));

export function readingsFor(fileKey: string, batchNumber: string): Reading[] {
  const certificate = certificates.get(fileKey);
  return certificate?.batch === batchNumber ? certificate.readings : [];
}
