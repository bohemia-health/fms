// Public links into the two B2 buckets. The site never lists or writes the
// buckets; seeding the coa table from the bucket listing lives with the API
// (asclepius-api/scripts/seed-labreports.ts).

// Public link for a file in the lab reports bucket. Encoding is what keeps
// names with "#", "+", or spaces working; "#" would otherwise start a fragment.
export function labReportUrl(key: string): string {
  return `${process.env.B2_PUBLIC_URL}/${encodeURIComponent(key)}`;
}

// Retrieve item images
export function itemImageUrl(key: string): string {
  return `${process.env.B2_ITEMS_PUBLIC_URL}/${encodeURIComponent(key)}`;
}
