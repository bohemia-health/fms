import "dotenv/config";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { batch, coa, itemCodes } from "@/db";

// One row of the sheet, keyed by the header names.
type Row = {
  product: string;
  product_code: string;
  batch_number: string;
  coa_test_type:
    | "mass_purity"
    | "endotoxin"
    | "lcms"
    | "sterility"
    | "benzyl_alcohol_content";
  lab_id: string;
  vendor_id: string;
  tested_at: string;
  file_key: string;
};

const rows: Row[] = parse(readFileSync("scripts/data/coa.csv"), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

// "https://f005.backblazeb2.com/file/repository-coa/bhm-oct-26/X.pdf" -> "bhm-oct-26/X.pdf"
const keyOf = (url: string) =>
  url.replace(/^https?:\/\/[^/]+\/file\/[^/]+\//, "");

async function main() {
  let inserted = 0;

  for (const row of rows) {
    // Fail loudly on a code the table doesn't know, e.g. CJIP.
    const [code] = await db
      .select()
      .from(itemCodes)
      .where(eq(itemCodes.code, row.product_code));
    if (!code)
      throw new Error(
        `unknown code ${row.product_code} on ${row.batch_number}`,
      );

    // Find the batch, or create it. Retests share one batch row.
    let [b] = await db
      .select()
      .from(batch)
      .where(eq(batch.batch_number, row.batch_number));
    if (!b) {
      [b] = await db
        .insert(batch)
        .values({
          batch_number: row.batch_number,
          manufacturer_id: Number(row.vendor_id),
          item_code_id: code.id,
        })
        .returning();
    }

    // Insert the report. Re-running skips rows already present.
    const result = await db
      .insert(coa)
      .values({
        file_key: keyOf(row.file_key),
        title: `${row.product} ${row.batch_number}`,
        batch_id: b.id,
        lab_id: row.lab_id,
        test_type: row.coa_test_type,
        tested_at: row.tested_at,
      })
      .onConflictDoNothing({ target: coa.file_key })
      .returning();
    inserted += result.length;
  }

  console.log(`seeded ${inserted} of ${rows.length} reports`);
}

main();
