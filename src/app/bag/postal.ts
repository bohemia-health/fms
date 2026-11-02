// What the customer typed into the ship-to field, and where it is for.
//
// There is no country picker, so the country is normally whatever was
// detected from the IP. Some postcode formats are unmistakable, though, and
// a customer in Birmingham on a US-guessed connection must still be able to
// type B98 7YD. Those override the guess; anything else keeps it, since a
// five-digit code could be Tennessee or Berlin.
const UK = /^([A-Z]{1,2}\d[A-Z\d]?) ?(\d[A-Z]{2})$/;
const CANADA = /^([A-Z]\d[A-Z]) ?(\d[A-Z]\d)$/;
const US_ZIP = /^\d{5}(-\d{4})?$/;
const LOOSE = /^[A-Z0-9][A-Z0-9 -]{1,9}$/;

export function parsePostal(
  raw: string,
  guessedCountry: string,
): { country: string; postal: string } | null {
  const postal = raw.trim().toUpperCase().replace(/\s+/g, " ");
  if (!postal) return null;

  const uk = UK.exec(postal);
  if (uk) return { country: "GB", postal: `${uk[1]} ${uk[2]}` };
  const ca = CANADA.exec(postal);
  if (ca) return { country: "CA", postal: `${ca[1]} ${ca[2]}` };

  const country = guessedCountry.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return null;
  const valid = country === "US" ? US_ZIP.test(postal) : LOOSE.test(postal);
  return valid ? { country, postal } : null;
}
