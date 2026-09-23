import "dotenv/config";
import * as schema from "./schema";
import { seed } from "drizzle-seed";
import { db } from "../index";

async function main() {
  await seed(db, schema, { count: 20 });
}

main();
