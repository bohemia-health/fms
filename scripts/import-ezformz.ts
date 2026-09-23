import "dotenv/config";
import { importEzformzOrders } from "../src/integrations/ezformz/import";

async function main() {
  const formIds = (process.env.EZFORMZ_FORM_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  for (const formId of formIds) {
    const result = await importEzformzOrders(formId);
    console.log(`form ${formId}:`, result);
  }
}

main();
