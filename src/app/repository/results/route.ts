import { api } from "@/lib/api";

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !uuid.test(id)) {
    return Response.json({ error: "Invalid report ID" }, { status: 400 });
  }

  // Resolve against the same server-side origin as the repository list.
  // The detail route is public and requires no service credential.
  const url = api.coa.$url();
  url.pathname = `${url.pathname.replace(/\/$/, "")}/${id}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 404) return Response.json({ samples: [] });
    if (!response.ok) {
      return Response.json({ error: "Results unavailable" }, { status: 502 });
    }
    const payload: { samples?: unknown } = await response.json();
    return Response.json({ samples: Array.isArray(payload.samples) ? payload.samples : [] });
  } catch {
    return Response.json({ error: "Results unavailable" }, { status: 502 });
  }
}
