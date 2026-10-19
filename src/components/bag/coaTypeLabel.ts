// The report types in the order they should appear under a batch, each with
// the name as printed on the report. Mass Purity leads, then LC-MS, then
// Endotoxin, then Sterility (TAMC/TYMC), then Benzyl Alcohol Content.
const order = [
  ["mass_purity", "Mass Purity"],
  ["lcms", "LC-MS"],
  ["endotoxin", "Endotoxin"],
  ["sterility", "Sterility"],
  ["benzyl_alcohol_content", "Benzyl Alcohol Content"],
] as const;

const labels = new Map<string, string>(order);
const ranks = new Map<string, number>(order.map(([key], i) => [key, i]));

// A report with no type set falls back to its title so it still has a name.
export function coaTypeLabel(testType: string | null, title: string): string {
  return (testType && labels.get(testType)) || title;
}

// Untyped reports sort after every known type.
export function coaTypeRank(testType: string | null): number {
  if (!testType) return order.length;
  return ranks.get(testType) ?? order.length;
}
