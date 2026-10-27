import { notFound } from "next/navigation";
import { api } from "@/lib/api";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const res = await api.orders[":number"].$get({ param: { number: id } });
  if (!res.ok) notFound();
  const order = await res.json();

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
