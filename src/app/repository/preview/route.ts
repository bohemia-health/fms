import { labReportUrl } from "@/integrations/b2/client";

// B2's public bucket does not send CORS headers. Serve PDF bytes from the
// same origin; callers can select a bucket key, never an arbitrary host.
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (!key || key.length > 1024 || !key.toLowerCase().endsWith(".pdf")) {
    return new Response("Invalid report", { status: 400 });
  }

  try {
    const response = await fetch(labReportUrl(key), {
      signal: AbortSignal.timeout(20_000),
      redirect: "error",
    });
    if (!response.ok) {
      return new Response("Report unavailable", { status: response.status === 404 ? 404 : 502 });
    }
    if (!response.headers.get("content-type")?.toLowerCase().includes("application/pdf")) {
      return new Response("Invalid report format", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Report unavailable", { status: 502 });
  }
}
