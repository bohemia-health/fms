import { pgTable, uuid, varchar, text, foreignKey } from "drizzle-orm/pg-core";

export const departmentsTable = pgTable(
  "departments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dept_name: text().notNull(),
    code: varchar("code", { length: 3 }).unique().notNull(),
    parentDepartmentId: uuid("parent_department_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.parentDepartmentId],
      foreignColumns: [table.id],
      name: "departments_parent_department_id_fkey",
    }),
  ],
);
