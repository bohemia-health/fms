// Origin of the auth site (bhm-authOS). Sign-in and sign-up live there, not
// in the store. Local dev points it at the authOS dev server via .env.
export const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.bhmhlth.com";

/** This site's own origin, so the auth site can send people back here. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bhmhlth.com";

/** Login URL that returns the person to `path` on this site afterwards. */
export const loginUrl = (path: string) =>
  `${AUTH_URL}/login?redirect=${encodeURIComponent(`${SITE_URL}${path}`)}`;
