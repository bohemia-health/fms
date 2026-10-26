import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// The store reads the Bohemia session from Asclepius. The session cookie is
// set for .bhmhlth.com by the auth site, so www.bhmhlth.com sends it along.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api.bhmhlth.com",
  basePath: "/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
        birthDate: { type: "date", required: true },
        marketingOptIn: { type: "boolean", required: false },
      },
    }),
  ],
});
