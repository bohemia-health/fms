import { api } from "@/lib/api";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default async function orders() {
  const res = await api.orders.$get();
  if (!res.ok) throw new Error(`orders: API answered ${res.status}`);
  const orders = await res.json();

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
