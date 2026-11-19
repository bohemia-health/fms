"use client";

import { useEffect, useState } from "react";

type Specification = {
  min: number | null;
  max: number | null;
  expected: string | null;
  unit: string | null;
  label: { amount: number | null; unit: string | null } | null;
};

type Reading = {
  assayDefId: number;
  name: string;
  value?: number | string | null;
  qualifier?: string;
  unit?: string | null;
  items?: { name: string; value: number; unit?: string }[];
  specification: Specification | null;
  verdict: { status: "pass" | "flag" | "unjudged"; reason?: string } | null;
};

type Sample = { id: string; scopedToReport?: boolean; results: Reading[] };

const verdictLabels = {
  pass: "Meets spec",
  flag: "Outside spec",
  unjudged: "Unable to compare",
} as const;

function withUnit(value: number | string, unit?: string | null) {
  return `${value}${unit === "%" ? "%" : unit ? ` ${unit}` : ""}`;
}

function measurement(reading: Reading) {
  if (reading.items?.length) {
    return reading.items
      .map((item) => `${item.name} ${withUnit(item.value, item.unit ?? reading.unit)}`)
      .join(", ");
  }
  if (reading.value === null || reading.value === undefined || reading.value === "") {
    return "No measurement recorded";
  }

  const bound = reading.qualifier === "=" ? "" : reading.qualifier;
  return [bound, withUnit(reading.value, reading.unit)].filter(Boolean).join(" ");
}

function expectation(specification: Specification | null) {
  if (!specification) return "No standard set";
  const { label, min, max, expected, unit } = specification;
  const criteria = [];
  if (label) {
    criteria.push(
      label.amount !== null && label.unit
        ? `≥ ${withUnit(label.amount, label.unit)} (batch label)`
        : "Batch label amount or unit missing",
    );
  }
  if (min !== null) criteria.push(`≥ ${withUnit(min, unit)}`);
  if (max !== null) criteria.push(`≤ ${withUnit(max, unit)}`);
  if (expected !== null) criteria.push(expected);
  return criteria.join(", ");
}

export default function ReportResults({
  reportId,
  excerpts,
}: {
  reportId: string;
  excerpts: { label: string; value: string }[];
}) {
  // Undefined while fetching, null when the API fails, and an array on success.
  const [samples, setSamples] = useState<Sample[] | null>();

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/repository/results?id=${encodeURIComponent(reportId)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Results unavailable");
        const payload: { samples: Sample[] } = await response.json();
        if (!controller.signal.aborted) setSamples(payload.samples);
      } catch {
        if (!controller.signal.aborted) setSamples(null);
      }
    }

    void load();
    return () => controller.abort();
  }, [reportId]);

  const scoped = samples?.filter((sample) => sample.scopedToReport && sample.results.length) ?? [];
  const ambiguous = samples?.some((sample) => sample.scopedToReport === false && sample.results.length);

  return (
    <section className="mt-5">
      <h4 className="text-base font-medium">Test results</h4>
      {samples === undefined ? (
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          Loading test results…
        </p>
      ) : (
        <>
          {samples === null && (
            <p role="status" className="mt-2 text-sm text-muted-foreground">
              Live test results couldn’t load.
            </p>
          )}
          {ambiguous && (
            <p className="mt-2 text-sm text-muted-foreground">
              A sample is linked to multiple certificates. See the original report for its readings.
            </p>
          )}

          {scoped.length ? (
            <ul className="mt-3 grid gap-3">
              {scoped.map((sample, index) => (
                <li key={sample.id} className="rounded-lg border p-3">
                  {scoped.length > 1 && (
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Sample {index + 1}
                    </p>
                  )}
                  <ul className="divide-y">
                    {sample.results.map((reading, readingIndex) => (
                      <li key={`${reading.assayDefId}-${readingIndex}`} className="py-2 first:pt-0 last:pb-0">
                        <p className="text-sm font-medium">{reading.name}</p>
                        <dl className="mt-1 grid grid-cols-2 gap-2 text-sm">
                          <div className="min-w-0">
                            <dt className="text-xs text-muted-foreground">Measured</dt>
                            <dd className="tabular-nums wrap-anywhere">{measurement(reading)}</dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-xs text-muted-foreground">Expected</dt>
                            <dd className="tabular-nums wrap-anywhere">{expectation(reading.specification)}</dd>
                          </div>
                        </dl>
                        {reading.verdict && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {verdictLabels[reading.verdict.status]}
                            </span>
                            {reading.verdict.reason && ` · ${reading.verdict.reason}`}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : excerpts.length ? (
            <>
              <p className="mt-2 text-xs text-muted-foreground">Certificate excerpt</p>
              <dl className="mt-2 grid gap-3">
                {excerpts.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-medium tabular-nums wrap-anywhere">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              See the original lab report for the test results.
            </p>
          )}
        </>
      )}
    </section>
  );
}
