import { hc } from "hono/client";
import type { AppType } from "asclepius-api/src/app";

// Asclepius is the only thing that talks to the database; the site asks it
// for everything. The client is typed from the API's own route definitions,
// so what a handler returns there is what `.json()` gives here, with no
// second copy of the shapes to keep in step. Server side only: the service
// key must never reach the browser.
const base =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.bhmhlth.com";

export const api = hc<AppType>(base, {
  headers: { "x-service-key": process.env.ASCLEPIUS_SERVICE_KEY ?? "" },
});

/** Header that names the visitor's bag on bag calls. */
export const bagHeaders = (
  token: string | undefined,
): Record<string, string> => (token ? { "x-bag-token": token } : {});
