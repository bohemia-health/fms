import { db } from "@/index";
import { ordersTable, customersTable, orderAddressesTable } from "@/db";
import { eq, sql, and } from "drizzle-orm";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const [order] = await db
    .select({
      orderNumber: ordersTable.order_number,
      firstName: customersTable.first_name,
      lastName: customersTable.last_name,
      street1: orderAddressesTable.line1,
      street2: orderAddressesTable.line2,
      street3: orderAddressesTable.line3,
      city: orderAddressesTable.city,
      state: orderAddressesTable.state,
      country: orderAddressesTable.country,
      zipcode: orderAddressesTable.postal_code,
      items: sql<string>`(
            select string_agg(concat(oi.quantity, ' x ', oi.name_at_purchase), ', ')
            from order_items oi
            where oi.order_id = ${ordersTable.id}
            )`,
    })
    .from(ordersTable)
    .leftJoin(customersTable, eq(ordersTable.customer_id, customersTable.id))
    .leftJoin(
      orderAddressesTable,
      eq(ordersTable.id, orderAddressesTable.order_id),
    )
    .where(eq(ordersTable.order_number, id));

  const addressLines = [
    order.street1,
    order.street2,
    order.street3,
    `${order.city}, ${order.state} ${order.zipcode}`,
    order.country,
  ].filter(Boolean);

  return (
    <main>
      <h1>Order Detail Page</h1>
      <h3>Date of Order:</h3>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Items</th>
          </tr>
        </thead>

        <tbody>
          {[order].map((oi) => (
            <tr key={order.orderNumber}>
              <td>{oi.orderNumber}</td>
              <td>
                {oi.firstName} {oi.lastName}
              </td>
              <td>
                {addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </td>
              <td>{oi.items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
