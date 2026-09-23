import type { EzformzListResponse, EzformzOrder } from "./types";

export async function listOrders(
  formId: string,
  page: number,
): Promise<EzformzListResponse> {
  const response = await fetch(
    `https://ezformz.net/api/v1/forms/${formId}/orders?page=${page}&per_page=100`,
    {
      headers: { Authorization: `Bearer ${process.env.EZFORMZ_API_KEY}` },
    },
  );
  if (!response.ok)
    throw new Error(`Ezformz ${response.status} on ${response.url}`);
  const data = await response.json();
  return data;
}

export async function listAllOrders(formId: string): Promise<EzformzOrder[]> {
  const orders: EzformzOrder[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await listOrders(formId, page);
    orders.push(...result.data);
    hasMore = result.pagination.has_more;
    page++;
  }

  return orders;
}
