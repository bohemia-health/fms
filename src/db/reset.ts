import { reset } from "drizzle-seed";
import { db } from "../index";
import * as schema from "./index";

async function main() {
  await reset(db, schema);
}

main();
