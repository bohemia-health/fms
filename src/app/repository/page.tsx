import ReportRow from "./ReportRow";
import ReportPreview from "./ReportPreview";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { coaTypeLabel } from "@/components/bag/coaTypeLabel";
import PillRow from "@/components/pill-row";
import ReportSort from "./ReportSort";
import QualityHighlights from "./QualityHighlights";
import { SetBreadcrumb } from "@asclepius/ui";
import { SetFootnotes } from "@asclepius/ui";
import { SetLocalNav } from "@asclepius/ui";
import { SetNavbar } from "@asclepius/ui";

import { api } from "@/lib/api";
import { labReportUrl } from "@/integrations/b2/client";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repository | Bohemia Health",
  description:
    "Discover precision and transparent testing through our comprehensive lab report library. Since 2024, we have personally verified more than a hundred individual compounds on HPLC-UV, LC-MS, Endotoxin Analysis, and TAMC+TYMC Microbial testing.",
  robots: {
    index: false,
    follow: false,
  },
};

// "report.pdf" -> "PDF". The bucket key is the only place the type lives for now.
function extOf(key: string): string {
  return key.slice(key.lastIndexOf(".") + 1).toUpperCase();
}

const pageSize = 20;
const sortOptions = [
  { value: "title", label: "Product A–Z" },
  { value: "newest", label: "Newest tested" },
  { value: "oldest", label: "Oldest tested" },
] as const;
const reportDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Repository({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const slug = first(params.category);
  const term = first(params.q)?.trim();
  const requestedSort = first(params.sort);
  const sort =
    sortOptions.find((option) => option.value === requestedSort)?.value ??
    "title";
  const pageParam = first(params.page) ?? "";
  const requestedPage = /^\d+$/.test(pageParam) ? Number(pageParam) : 1;
  const [filesRes, categoriesRes] = await Promise.all([
    api.coa.$get({ query: { category: slug, q: term } }),
    api.categories.$get(),
  ]);
  if (!filesRes.ok || !categoriesRes.ok) {
    throw new Error("Could not load lab reports");
  }
  const files = await filesRes.json();
  const categories = await categoriesRes.json();
  const reports = files.map((file) => {
    // The API may still be serving the previous response during deployment.
    const date =
      "testedAt" in file && typeof file.testedAt === "string"
        ? file.testedAt
        : null;
    const testedAt = date && Number.isFinite(Date.parse(date)) ? date : null;
    const vendorShort =
      "vendorShort" in file && typeof file.vendorShort === "string"
        ? file.vendorShort.trim()
        : "";
    const testType =
      "testType" in file && typeof file.testType === "string"
        ? file.testType
        : null;
    const testLabel =
      testType === "endotoxin"
        ? "Endotoxin Analysis"
        : coaTypeLabel(testType, "—");
    return {
      ...file,
      testedAt,
      testLabel,
      vendorLabel: vendorShort || file.vendor,
      labName:
        "labName" in file && typeof file.labName === "string"
          ? file.labName.trim() || null
          : null,
    };
  });
  if (sort === "title") {
    reports.sort(
      (a, b) =>
        a.compound.localeCompare(b.compound) ||
        a.batchNumber.localeCompare(b.batchNumber),
    );
  } else {
    reports.sort((a, b) => {
      if (!a.testedAt || !b.testedAt) {
        return Number(!a.testedAt) - Number(!b.testedAt);
      }
      return sort === "newest"
        ? b.testedAt.localeCompare(a.testedAt)
        : a.testedAt.localeCompare(b.testedAt);
    });
  }
  const pageCount = Math.max(1, Math.ceil(reports.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const start = (page - 1) * pageSize;
  const visibleReports = reports.slice(start, start + pageSize);

  function resultsHref(nextSort: typeof sort, nextPage = 1) {
    const query = new URLSearchParams();
    if (slug) query.set("category", slug);
    if (term) query.set("q", term);
    if (nextSort !== "title") query.set("sort", nextSort);
    if (nextPage > 1) query.set("page", String(nextPage));
    return `/repository${query.size ? `?${query}` : ""}#lab-reports`;
  }

  return (
    <main>
      <div className="relative aspect-[3/1] max-w-[2520px] mx-auto">
        <Image
          src="/banner-image.png"
          fill
          priority
          sizes="100vw"
          quality={100}
          alt="lab image"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 flex items-center justify-start">
          <h2 className="text-6xl font-medium text-white">Quality Control</h2>
        </div>
      </div>
      <section className="bg-[#1d1d1f] py-16 text-white">
        <h2 className="text-5xl font-medium tracking-tight mx-4">
          Research Further
        </h2>
        <br></br>
        <h3 className="text-[30px] font-medium tracking-wide mx-5">
          An even closer look at our progress.
        </h3>
        <p className="font-light text-[15px] tracking-snug mx-5">
          Our strong business performance in Quality Assurance & Control (QA &
          QC) drove new records for both samples tested and assays used.
          Continued customer demand for our services has helped us achieve
          dedicated Lab Reports across all major product categories.
        </p>
      </section>

      <section
        id="lab-reports"
        aria-labelledby="lab-reports-heading"
        className="scroll-mt-20 bg-[#f5f5f7] dark:bg-background"
      >
        <div className="mx-auto w-full max-w-[1240px] px-6 py-10 sm:px-8 md:py-16">
          <h2
            id="lab-reports-heading"
            className="text-4xl font-medium tracking-tight md:text-5xl"
          >
            Lab reports
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find the certificate of analysis for your batch.
          </p>
          <form
            method="get"
            action="/repository#lab-reports"
            className="relative mt-6"
          >
            <label htmlFor="report-search" className="sr-only">
              Search lab reports
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            />
            {slug && <input type="hidden" name="category" value={slug} />}
            {sort !== "title" && (
              <input type="hidden" name="sort" value={sort} />
            )}
            <Input
              key={term ?? ""}
              id="report-search"
              className="h-12 rounded-xl pl-11 text-lg"
              placeholder="Search by title, batch number, or vendor"
              type="search"
              name="q"
              defaultValue={term ?? ""}
            />
          </form>

          <PillRow
            className="mt-5"
            items={[
              { label: "All" },
              ...categories.map((c) => ({ label: c.title, slug: c.slug })),
            ]}
          />

          <div className="mt-8 mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <p role="status" className="text-muted-foreground">
                {reports.length} {reports.length === 1 ? "report" : "reports"}
              </p>
              {(term || slug) && (
                <Link
                  href={{
                    pathname: "/repository",
                    query: sort === "title" ? {} : { sort },
                    hash: "lab-reports",
                  }}
                  className="text-[#0065CC] hover:underline dark:text-[#66b0ff]"
                >
                  Clear filters
                </Link>
              )}
            </div>
            <ReportSort
              current={sort}
              choices={sortOptions.map((option) => ({
                ...option,
                href: resultsHref(option.value),
              }))}
            />
          </div>

          {visibleReports.length ? (
            <div className="border-b border-foreground/15">
              <Table aria-label="Lab reports">
                <TableHeader className="sr-only">
                  <TableRow interactive={false}>
                    <TableHead
                      scope="col"
                      className="h-12 pl-0 pr-4 text-xs font-normal text-muted-foreground"
                    >
                      Batch
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="hidden px-4 text-xs font-normal text-muted-foreground md:table-cell"
                    >
                      Test type
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="hidden pl-4 pr-0 text-xs font-normal text-muted-foreground md:table-cell"
                    >
                      Tested
                    </TableHead>
                    <TableHead scope="col">
                      <span className="sr-only">Expand</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleReports.map((report, i) => {
                    const grouped = sort === "title";
                    const newGroup =
                      grouped &&
                      report.compound !== visibleReports[i - 1]?.compound;
                    const tested = report.testedAt ? (
                      <time dateTime={report.testedAt}>
                        {reportDate.format(new Date(report.testedAt))}
                      </time>
                    ) : null;
                    const fileUrl = labReportUrl(report.fileKey);
                    const format = extOf(report.fileKey);
                    return (
                      <Fragment key={report.id}>
                        {newGroup && (
                          <TableRow
                            interactive={false}
                            className="border-foreground/15 hover:bg-transparent"
                          >
                            <TableCell
                              colSpan={4}
                              className="px-0 pt-10 pb-3 whitespace-normal"
                            >
                              <h3 className="text-2xl font-semibold tracking-tight">
                                {report.compound}
                              </h3>
                            </TableCell>
                          </TableRow>
                        )}
                        <ReportRow
                          batch={
                            <>
                              <span className="block text-[17px] leading-snug font-semibold tabular-nums">
                                {report.batchNumber}
                              </span>
                              <span className="mt-0.5 block text-sm text-muted-foreground">
                                {(grouped
                                  ? [report.vendorLabel]
                                  : [report.compound, report.vendorLabel]
                                )
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground md:hidden">
                                {report.testLabel}
                                {tested && <> · {tested}</>}
                              </span>
                            </>
                          }
                          details={
                            <div className="grid items-start gap-8 py-8 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] md:gap-12 md:py-10">
                              {(format === "PDF" || format === "PNG") && (
                                <div className="min-w-0">
                                  {format === "PDF" ? (
                                    <ReportPreview
                                      src={`/repository/preview?key=${encodeURIComponent(report.fileKey)}`}
                                      originalUrl={fileUrl}
                                      batchNumber={report.batchNumber}
                                    />
                                  ) : (
                                    <div className="relative aspect-[1/1.414] bg-white ring-1 ring-black/10">
                                      <Image
                                        src={fileUrl}
                                        alt={`Lab report for batch ${report.batchNumber}`}
                                        fill
                                        unoptimized
                                        className="object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex min-w-0 flex-col gap-5">
                                <div>
                                  <h3 className="text-xl font-medium tracking-tight">
                                    Report details
                                  </h3>
                                  <dl className="mt-6 grid gap-5">
                                    {[
                                      {
                                        label: "Testing lab",
                                        value:
                                          report.labName ?? "Not available",
                                      },
                                      {
                                        label: "Test performed",
                                        value:
                                          report.testLabel === "—"
                                            ? "Not available"
                                            : report.testLabel,
                                      },
                                      {
                                        label: "Result received",
                                        value: "Not available",
                                      },
                                      {
                                        label: "Result expected",
                                        value: "Not available",
                                      },
                                    ].map(({ label, value }) => (
                                      <div key={label} className="min-w-0">
                                        <dt className="text-xs text-muted-foreground">
                                          {label}
                                        </dt>
                                        <dd className="mt-1 font-medium wrap-anywhere">
                                          {value}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>
                                <div className="mt-3 space-y-2 border-t pt-5">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                      Original lab report
                                    </p>
                                    <p className="mt-1 text-xs wrap-anywhere text-muted-foreground">
                                      {report.fileKey.split("/").at(-1)}
                                    </p>
                                  </div>
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center gap-1 font-medium text-[#0065CC] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-[#66b0ff]"
                                  >
                                    Open {format}
                                    <ArrowUpRight
                                      aria-hidden="true"
                                      className="size-4"
                                    />
                                    <span className="sr-only">
                                      {" "}
                                      for batch {report.batchNumber} (opens in a
                                      new tab)
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <TableCell className="hidden px-4 text-[15px] whitespace-normal md:table-cell">
                            {report.testLabel}
                          </TableCell>
                          <TableCell className="hidden px-4 text-[15px] text-muted-foreground md:table-cell">
                            {tested ?? "—"}
                          </TableCell>
                        </ReportRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
              {term ? (
                <>No lab reports match “{term}”.</>
              ) : (
                "No lab reports found."
              )}
              {(term || slug) &&
                " Try a different search or clear your filters."}
            </p>
          )}

          {pageCount > 1 && (
            <nav
              aria-label="Lab report pages"
              className="mt-4 flex flex-wrap items-center justify-between gap-3"
            >
              <p className="text-sm text-muted-foreground tabular-nums">
                Showing {start + 1}–{start + visibleReports.length} of{" "}
                {reports.length}
              </p>
              <div className="flex items-center gap-3">
                {page > 1 && (
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 rounded-full px-3 font-normal",
                    )}
                    href={resultsHref(sort, page - 1)}
                  >
                    <ChevronLeft aria-hidden="true" />
                    Previous
                  </Link>
                )}
                <span className="text-sm text-muted-foreground tabular-nums">
                  Page {page} of {pageCount}
                </span>
                {page < pageCount && (
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 rounded-full px-3 font-normal",
                    )}
                    href={resultsHref(sort, page + 1)}
                  >
                    Next
                    <ChevronRight aria-hidden="true" />
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </section>

      <QualityHighlights />

      {/* Private Information */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        title="Quality Control"
        href="/repository"
        links={[
          { href: "/repository#lab-reports", label: "Lab Reports" },
          { href: "/research/mito", label: "Research" },
          { href: "/support", label: "Support" },
        ]}
      />
      <SetBreadcrumb items={[{ label: "Repository" }]} />
      <SetFootnotes
        notes={[
          "Lab reports are provided by independent third-party laboratories and reflect the batch tested, not every unit sold.",
        ]}
      />
    </main>
  );
}

{
  /* Inspiration: Hold on, I'm comin - Soul Brothers */
}
