"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox, FloatingInput, HelpTip, Label } from "@asclepius/ui";
import BagButton from "@/components/bag/BagButton";
import { saveShippingAddress } from "@/app/checkout/actions";
import RecommendedAddressDialog from "./RecommendedAddressDialog";
import type { Address } from "@/app/checkout/address";

type Place = { city: string; state: string };

// Same box as FloatingInput, for the two selects. The caption sits at the
// top from the start: a select always shows a value, so it never needs to
// float up from the middle.
const selectBox =
  "peer h-14 w-full appearance-none rounded-xl border border-neutral-400 bg-transparent px-4 pt-5 pb-1 text-base text-foreground " +
  "focus:border-foreground focus:outline-none dark:border-neutral-600 dark:focus:border-foreground";
const selectCaption =
  "pointer-events-none absolute left-4 top-2 text-xs text-muted-foreground";

function FloatingSelect({
  id,
  label,
  children,
  ...rest
}: React.ComponentProps<"select"> & { id: string; label: string }) {
  return (
    <div className="relative w-full">
      <select id={id} className={selectBox} {...rest}>
        {children}
      </select>
      <label htmlFor={id} className={selectCaption}>
        {label}
      </label>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

// How a postal code reads per country, and when it is complete enough to
// look up. US: five digits as typed. UK and Canada: once the first half is
// in. Elsewhere: on leaving the field.
function postalLabel(country: string) {
  return country === "US" ? "Zip Code" : "Postal Code";
}
function stateLabel(country: string) {
  return country === "US" ? "State" : "State / Province";
}
function readyToLookUp(country: string, postal: string) {
  const p = postal.toUpperCase();
  if (country === "US") return /^\d{5}/.test(p);
  if (country === "GB") return /^[A-Z]{1,2}\d[A-Z\d]?( |$)/.test(p);
  if (country === "CA") return /^[A-Z]\d[A-Z]/.test(p);
  return false;
}

export default function AddressForm({
  defaults,
  country: detectedCountry,
  postalCode: detectedPostal,
  email,
  countries,
}: {
  defaults: Address | null;
  country: string; // from the ship-to cookie or the IP
  postalCode: string | null;
  email?: string; // a signed-in customer's, when nothing is saved yet
  countries: { code: string; name: string }[]; // named on the server
}) {
  const [business, setBusiness] = useState(defaults?.business ?? false);
  // null until the carrier suggests a cleaner address; then the dialog.
  const [review, submit] = useActionState(saveShippingAddress, null);
  const [dismissed, setDismissed] = useState<typeof review>(null);
  const uid = useId();
  const [country, setCountry] = useState(defaults?.country ?? detectedCountry);
  const [postal, setPostal] = useState(
    defaults?.postalCode ?? detectedPostal ?? "",
  );
  // The last lookup's answer, tagged with the code it was for, so a stale
  // answer never shows under a different code.
  const [result, setResult] = useState<{ key: string; places: Place[] } | null>(
    null,
  );
  // What they picked in the City, State list, tagged the same way.
  const [picked, setPicked] = useState<{ key: string; value: string } | null>(
    null,
  );
  const us = country === "US";

  // Look the code up when it is complete enough. The answer lands in state
  // from the fetch callback, never synchronously inside the effect.
  const lookupKey = readyToLookUp(country, postal)
    ? `${country}/${postal}`
    : null;
  useEffect(() => {
    if (!lookupKey) return;
    const controller = new AbortController();
    fetch(
      `/api/places?country=${country}&postal=${encodeURIComponent(postal)}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((body: { places: Place[] }) =>
        setResult({ key: lookupKey, places: body.places }),
      )
      .catch(() => setResult({ key: lookupKey, places: [] }));
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lookupKey stands in for country+postal
  }, [lookupKey]);

  const places = result && result.key === lookupKey ? result.places : [];
  const id = (p: Place) => `${p.city}|${p.state}`;
  // A saved address for this same code is re-selected if its city is in
  // the list, and reopens as Other with its typed city and state if not.
  // Without one, the first result stands until they choose.
  const saved =
    defaults && defaults.postalCode === postal.toUpperCase().trim()
      ? `${defaults.city}|${defaults.state}`
      : null;
  const place =
    picked && picked.key === lookupKey
      ? picked.value
      : saved
        ? places.some((p) => id(p) === saved)
          ? saved
          : "other"
        : places[0]
          ? id(places[0])
          : "other";

  const typed = places.length === 0 || place === "other";

  return (
    <form action={submit} className="flex w-full flex-col gap-3">
      {/* The address column keeps the field width; the contact rows below
          run wider so their notes can sit beside the inputs. */}
      <div className="flex w-full max-w-xl flex-col gap-3">
        <h2 className="text-[1.65rem] font-medium mb-2">
          Enter your name and address:{" "}
        </h2>
        <FloatingInput
          id={`${uid}-first`}
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          required
          defaultValue={defaults?.firstName}
        />
        <FloatingInput
          id={`${uid}-last`}
          name="lastName"
          label="Last Name"
          autoComplete="family-name"
          required
          defaultValue={defaults?.lastName}
        />
        <FloatingInput
          id={`${uid}-address1`}
          name="address1"
          label="Street Address"
          autoComplete="address-line1"
          required
          defaultValue={defaults?.address1}
        />
        <FloatingInput
          id={`${uid}-address2`}
          name="address2"
          label="Apartment, Suite, Building (Optional)"
          autoComplete="address-line2"
          defaultValue={defaults?.address2}
        />
        {!us && (
          <FloatingInput
            id={`${uid}-address3`}
            name="address3"
            label="Area or District (Optional)"
            autoComplete="address-line3"
            defaultValue={defaults?.address3}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:*:flex-1 sm:*:basis-0">
          <FloatingInput
            id={`${uid}-postal`}
            name="postalCode"
            label={postalLabel(country)}
            autoComplete="postal-code"
            inputMode={us ? "numeric" : "text"}
            required
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
          />
          {typed ? (
            <>
              <FloatingInput
                id={`${uid}-city`}
                name="city"
                label="City"
                autoComplete="address-level2"
                required
                defaultValue={defaults?.city}
              />
              <FloatingInput
                id={`${uid}-state`}
                name="state"
                label={stateLabel(country)}
                autoComplete="address-level1"
                required
                defaultValue={defaults?.state}
              />
            </>
          ) : (
            <FloatingSelect
              id={`${uid}-place`}
              name="place"
              label={`City, ${stateLabel(country)}`}
              value={place}
              onChange={(e) =>
                setPicked({ key: lookupKey ?? "", value: e.target.value })
              }
            >
              {places.map((p) => (
                <option
                  key={`${p.city}|${p.state}`}
                  value={`${p.city}|${p.state}`}
                >
                  {p.city}, {p.state}
                </option>
              ))}
              <option value="other">Other</option>
            </FloatingSelect>
          )}
          {/* Keeps the picked value in the submission when Other is open. */}
          {!typed
            ? null
            : places.length > 0 && (
                <input type="hidden" name="place" value="other" />
              )}
        </div>

        <FloatingSelect
          id={`${uid}-country`}
          name="country"
          label="Country/Region"
          autoComplete="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </FloatingSelect>

        <div className="mt-2 flex items-center gap-2.5">
          <Checkbox
            id={`${uid}-business`}
            name="business"
            value="1"
            checked={business}
            onCheckedChange={(checked) => setBusiness(checked === true)}
          />
          <Label htmlFor={`${uid}-business`} className="text-base font-normal">
            This is a business address.
          </Label>
          <HelpTip label="Why we ask">
            Carriers price and schedule deliveries to homes and businesses
            differently. Knowing which this is keeps your shipping cost and
            delivery dates accurate.
          </HelpTip>
        </div>
        {business && (
          <FloatingInput
            id={`${uid}-company`}
            name="company"
            label="Company Name (Optional)"
            autoComplete="organization"
            defaultValue={defaults?.company}
          />
        )}
      </div>

      <h2 className="mt-10 text-[1.65rem] font-medium">
        What&apos;s your contact information?
      </h2>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
        <FloatingInput
          id={`${uid}-email`}
          name="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          required
          defaultValue={defaults?.email || email}
          className="sm:min-w-0 sm:flex-1 sm:max-w-xl"
        />
        <p className="px-1 text-sm text-muted-foreground sm:w-72 sm:shrink-0">
          We&apos;ll email your receipt and order updates to this address.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
        <FloatingInput
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          label={us ? "Phone Number (Optional)" : "Phone Number"}
          autoComplete="tel"
          required={!us}
          defaultValue={defaults?.phone}
          className="sm:min-w-0 sm:flex-1 sm:max-w-xl"
        />
        <p className="px-1 text-sm text-muted-foreground sm:w-72 sm:shrink-0">
          Required for orders shipping outside the U.S., optional within it. If
          you add one, we&apos;ll text your tracking updates there too.
        </p>
      </div>

      <div className="mt-6 flex justify-start">
        <div className="w-full sm:w-80">
          <BagButton label="Continue to payment" />
        </div>
      </div>
      <RecommendedAddressDialog
        review={review !== dismissed ? review : null}
        onClose={() => setDismissed(review)}
      />
    </form>
  );
}
