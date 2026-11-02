import { NextResponse } from "next/server";

// City and state for a postal code, so the address form can offer "City,
// State" the way Apple's does instead of making people type both. Backed by
// Zippopotam (free, no key). Proxied here so the browser never talks to a
// third party and so one lookup per code is cached for everyone.
//
// Partial-code countries: a UK postcode's outward half (B98) and a Canadian
// forward sortation area (M5V) are what the service indexes.

type Place = { city: string; state: string };

const TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; places: Place[] }>();

function lookupKey(country: string, postal: string): string | null {
  const p = postal.toUpperCase().replace(/\s+/g, " ").trim();
  switch (country) {
    case "US": {
      const m = /^(\d{5})/.exec(p);
      return m ? m[1] : null;
    }
    case "GB": {
      const m = /^([A-Z]{1,2}\d[A-Z\d]?)/.exec(p);
      return m ? m[1] : null;
    }
    case "CA": {
      const m = /^([A-Z]\d[A-Z])/.exec(p);
      return m ? m[1] : null;
    }
    default:
      return /^[A-Z0-9][A-Z0-9 -]{1,9}$/.test(p) ? p : null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") ?? "US").toUpperCase();
  const key = lookupKey(country, url.searchParams.get("postal") ?? "");
  if (!/^[A-Z]{2}$/.test(country) || !key) {
    return NextResponse.json({ places: [] });
  }

  const cacheKey = `${country}/${key}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json({ places: hit.places });
  }

  let places: Place[] = [];
  try {
    const res = await fetch(
      `https://api.zippopotam.us/${country.toLowerCase()}/${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(4000) },
    );
    if (res.ok) {
      const body = (await res.json()) as {
        places?: {
          "place name": string;
          "state abbreviation"?: string;
          state?: string;
        }[];
      };
      const seen = new Set<string>();
      for (const p of body.places ?? []) {
        const place = {
          city: p["place name"],
          state: p["state abbreviation"] || p.state || "",
        };
        const id = `${place.city}|${place.state}`;
        if (!seen.has(id)) {
          seen.add(id);
          places.push(place);
        }
      }
    }
  } catch (e) {
    // The form falls back to typed city and state; nothing to surface.
    console.error("places lookup failed", e);
    places = [];
  }

  cache.set(cacheKey, { at: Date.now(), places });
  return NextResponse.json({ places });
}
