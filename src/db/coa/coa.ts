import {
  pgTable,
  pgEnum,
  integer,
  uuid,
  text,
  date,
} from "drizzle-orm/pg-core";
import { batch } from "../batch";
import { labTable } from "../lab";
import { generatePublicId } from "./publicId";

export const coaTestType = pgEnum("coa_test_type", [
  "mass_purity",
  "endotoxin",
  "lcms",
  "sterility",
]);

export const coaCategoryType = pgEnum("coa_category_type", [
  "GLP-1",
  "MITO",
  "Nootropic",
  "Bioregulator",
]);

export const coa = pgTable("coa", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 100000 }),
  public_id: text("public_id").notNull().unique().$defaultFn(generatePublicId),
  batch_id: integer("batch_id").references(() => batch.id, {
    onDelete: "cascade",
  }),
  lab_id: uuid("lab_id").references(() => labTable.id),
  title: text("title").notNull(),
  file_key: text("file_key").notNull().unique(),
  test_type: coaTestType(),
  tested_at: date("tested_at"),
  image: text(),
  result_url: text(),
});
