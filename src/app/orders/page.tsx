import { db } from "@/index";
import { customersTable, ordersTable } from "@/db";
import { eq, sql } from "drizzle-orm";

export default async function orders() {
  const orders = await db
    .select({
      orderId: ordersTable.id,
      orderNumber: ordersTable.order_number,
      firstName: customersTable.first_name,
      lastName: customersTable.last_name,
      items: sql<string>`(
        select string_agg(concat(oi.quantity, ' × ', oi.name_at_purchase), ', ')
        from order_items oi
        where oi.order_id = ${ordersTable.id}
        )`,
    })
    .from(ordersTable)
    .leftJoin(customersTable, eq(ordersTable.customer_id, customersTable.id));

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Order Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Items</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.orderId}>
            <td>{order.orderId}</td>
            <td>{order.orderNumber}</td>
            <td>{order.firstName}</td>
            <td>{order.lastName}</td>
            <td>{order.items}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
