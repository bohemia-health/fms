import "server-only";
import { headers } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
};

// Asks Asclepius who is behind the browser's cookie, from the server, so a
// page can decide before it renders. The flyout does the same on the client
// through the Better Auth hook; this is the server-side twin. no-store
// because a cached answer would outlive a sign-out.
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "https://api.bhmhlth.com";
  const res = await fetch(`${base}/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { user?: SessionUser } | null;
  return body?.user ?? null;
}
