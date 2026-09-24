import { db } from "@/index";
import { customersTable, ordersTable } from "@/db";
import { eq, sql } from "drizzle-orm";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Number</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Items</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.orderId}>
            <TableCell>{order.orderId}</TableCell>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{order.firstName}</TableCell>
            <TableCell>{order.lastName}</TableCell>
            <TableCell>{order.items}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
