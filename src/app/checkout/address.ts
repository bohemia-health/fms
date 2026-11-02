// The shipping address typed at checkout step 2. Kept in an httpOnly cookie
// until the order is placed; nothing here touches the database yet.
export const ADDRESS_COOKIE = "checkout_address";

export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string; // apartment, suite, building
  address3: string; // area or district, international only
  postalCode: string;
  city: string;
  state: string;
  country: string; // ISO 3166-1 alpha-2
  business: boolean;
  company: string; // only asked for a business address
  email: string;
  phone: string; // optional
};

// ISO 3166-1 alpha-2. Names come from Intl.DisplayNames at render time, so
// this is just the codes. Order does not matter; the form sorts by name.
export const COUNTRY_CODES = (
  "AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
  "NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW " +
  "SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ " +
  "UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW"
).split(" ");

const clean = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();

// FormData -> Address, or the names of the fields that are missing. The
// browser already blocks an empty required field; this is the server's own
// check, since an action is a public endpoint.
export function parseAddress(
  form: FormData,
): { address: Address } | { missing: string[] } {
  const country = clean(form.get("country")).toUpperCase();
  // "City, State" picked from the lookup arrives as one field; "other" or
  // no lookup means the two typed fields carry it.
  const place = clean(form.get("place"));
  const [pickedCity, pickedState] =
    place && place !== "other" ? place.split("|") : ["", ""];

  const address: Address = {
    firstName: clean(form.get("firstName")),
    lastName: clean(form.get("lastName")),
    address1: clean(form.get("address1")),
    address2: clean(form.get("address2")),
    address3: clean(form.get("address3")),
    postalCode: clean(form.get("postalCode")).toUpperCase(),
    city: pickedCity || clean(form.get("city")),
    state: pickedState || clean(form.get("state")),
    country,
    business: form.get("business") !== null,
    company: form.get("business") !== null ? clean(form.get("company")) : "",
    email: clean(form.get("email")).toLowerCase(),
    phone: clean(form.get("phone")),
  };

  const missing: string[] = (
    [
      "firstName",
      "lastName",
      "address1",
      "postalCode",
      "city",
      "state",
      "email",
    ] as const
  ).filter((k) => address[k] === "");
  if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    missing.push("email");
  }
  // Carriers need a phone number to clear an international parcel.
  if (country !== "US" && address.phone === "") missing.push("phone");
  if (!COUNTRY_CODES.includes(country)) missing.push("country");
  return missing.length ? { missing } : { address };
}

export function readAddress(raw: string | undefined): Address | null {
  if (!raw) return null;
  try {
    const a = JSON.parse(raw) as Partial<Address>;
    if (typeof a.firstName !== "string" || typeof a.country !== "string")
      return null;
    return {
      firstName: a.firstName,
      lastName: a.lastName ?? "",
      address1: a.address1 ?? "",
      address2: a.address2 ?? "",
      address3: a.address3 ?? "",
      postalCode: a.postalCode ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      country: a.country,
      business: a.business === true,
      company: a.company ?? "",
      email: a.email ?? "",
      phone: a.phone ?? "",
    };
  } catch {
    return null;
  }
}

// Country names for the select, built once on the server. The browser's
// Intl data can differ from Node's for a few names (the Falklands, for
// one), and a client-side list would then fail hydration.
const regionName = new Intl.DisplayNames("en", { type: "region" });
export function countryOptions(): { code: string; name: string }[] {
  return COUNTRY_CODES.map((code) => ({
    code,
    name: regionName.of(code) ?? code,
  })).sort((x, y) => x.name.localeCompare(y.name));
}
