import Link from "next/link";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

export default function QualityHighlights() {
  return (
    <section
      aria-labelledby="quality-highlights-heading"
      className="bg-background px-6 py-16 sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-[1240px]">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Behind the lab reports
          </p>
          <h2
            id="quality-highlights-heading"
            className="mt-3 scroll-mt-24 text-4xl leading-none font-medium tracking-tight text-balance sm:text-6xl"
          >
            A closer look at quality.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-pretty text-muted-foreground sm:text-xl">
            See what independent labs tested and find the original report for
            the batch you’re looking for.
          </p>
        </header>

        <div className="mt-10 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#101317] px-7 py-10 text-white sm:px-12 md:mt-14 md:grid-cols-2 md:gap-12 md:px-16 md:py-16">
          <div>
            <h3 className="text-4xl leading-none font-medium tracking-tight text-balance sm:text-5xl">
              Batch by batch.
            </h3>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-300 sm:text-lg">
              The batch number ties a report to the material that was tested.
              Use it to find the document that applies to your batch.
            </p>
          </div>

          {/* Decorative sample array. The dots do not represent test results. */}
          <div
            aria-hidden="true"
            className="mx-auto w-full max-w-xs rounded-[1.75rem] bg-radial from-[#284665] to-[#151c26] p-7 ring-1 ring-white/15 sm:p-10"
          >
            <div className="grid grid-cols-10 gap-2.5">
              {Array.from({ length: 100 }, (_, dot) => (
                <span
                  key={dot}
                  className="aspect-square rounded-full bg-sky-200/80 shadow-[0_0_12px_rgb(125_211_252/0.25)]"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-12 md:gap-16">
          <div className="border-t pt-5">
            <h3 className="text-xl font-medium tracking-tight">
              Independent testing.
            </h3>
            <p className="mt-2 max-w-md text-pretty text-muted-foreground">
              Third-party laboratory reports identify the test performed and
              document the results for the sample analyzed.
            </p>
          </div>
          <div className="border-t pt-5">
            <h3 className="text-xl font-medium tracking-tight">
              The original report.
            </h3>
            <p className="mt-2 max-w-md text-pretty text-muted-foreground">
              Search by product or batch number to open the lab’s document
              and review its findings in full.
            </p>
            <Link
              href="#lab-reports"
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[#0065CC] hover:underline dark:text-[#66b0ff]"
            >
              Find a lab report
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
