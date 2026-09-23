import { eq } from "drizzle-orm";
import { db } from "../../index";
import {
  customersTable,
  productsTable,
  ordersTable,
  orderItemsTable,
  orderAddressesTable,
} from "../../db";
import { generateOrderNumber } from "../../db/orders/orderNumber";
import { listAllOrders } from "./client";
import type { EzformzOrder, EzformzOrderItem } from "./types";

// Find a customer by email, or create one from the Ezformz order.
async function getOrCreateCustomer(order: EzformzOrder) {
  const email = order.customer_email.toLowerCase();
  const [existing] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.email, email));
  if (existing) return existing;

  const [first_name, ...rest] = order.customer_name.trim().split(" ");
  const [created] = await db
    .insert(customersTable)
    .values({ first_name, last_name: rest.join(" "), email })
    .returning();
  return created;
}

// Find a product by its Ezformz id, or create one from the line item.
async function getOrCreateProduct(item: EzformzOrderItem) {
  const [existing] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.ezformz_id, item.product_id));
  if (existing) return existing;

  const [created] = await db
    .insert(productsTable)
    .values({ ezformz_id: item.product_id, title: item.productName })
    .returning();
  return created;
}

// Import one Ezformz order: customer -> products -> order -> items + address.
async function importOrder(order: EzformzOrder) {
  const customer = await getOrCreateCustomer(order);

  const [created] = await db
    .insert(ordersTable)
    .values({
      ezformz_id: order.id,
      order_number: generateOrderNumber(),
      customer_id: customer.id,
    })
    .returning();

  for (const item of order.order_items.items) {
    const product = await getOrCreateProduct(item);
    await db.insert(orderItemsTable).values({
      order_id: created.id,
      product_id: product.id,
      quantity: item.quantity,
      priceAtPurchase: String(item.price),
      nameAtPurchase: item.optionLabel
        ? `${item.productName} — ${item.optionLabel}`
        : item.productName,
    });
  }

  const addr = order.shipping_address;
  await db.insert(orderAddressesTable).values({
    order_id: created.id,
    type: "shipping",
    name: order.customer_name,
    line1: addr.street,
    line2: addr.street2 || null,
    city: addr.city || null,
    state: addr.state_province || null,
    postal_code: addr.postal_code || null,
    country: addr.country_code || "US",
  });

  return created;
}

// Pull every order for a form and insert the ones Neon hasn't seen yet.
export async function importEzformzOrders(formId: string) {
  const orders = await listAllOrders(formId);
  let imported = 0;
  let skipped = 0;

  for (const order of orders) {
    const [existing] = await db
      .select({ id: ordersTable.id })
      .from(ordersTable)
      .where(eq(ordersTable.ezformz_id, order.id));
    if (existing) {
      skipped++;
      continue;
    }
    await importOrder(order);
    imported++;
  }

  return { found: orders.length, imported, skipped };
}
