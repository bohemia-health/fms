import { randomInt } from "node:crypto";

// Customer-facing id for a lab report: six random digits, 100000–999999.
// The unique constraint on coa.public_id catches the rare collision.
export function generatePublicId(): string {
  return String(randomInt(100000, 1000000));
}
