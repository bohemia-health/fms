"use client";

import { db } from "asclepius-api/src/db/client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <h1>{id}</h1>;
}
