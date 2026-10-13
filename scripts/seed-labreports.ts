import "dotenv/config";
import { listLabReports } from "@/integrations/b2/client";
import { db } from "@/index";
import { coa } from "@/db";

export async function main() {
  const files = await listLabReports();
  for (const file of files) {
    await db
      .insert(coa)
      .values({
        file_key: file.key,
        title: file.name,
      })
      .onConflictDoNothing({ target: coa.file_key });
  }
  console.log(`seeded ${files.length} reports`);
}

main();
