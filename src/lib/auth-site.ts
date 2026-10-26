// Origin of the auth site (bhm-authOS). Sign-in and sign-up live there, not
// in the store. Local dev points it at the authOS dev server via .env.
export const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.bhmhlth.com";
