import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import PillRow from "@/components/pill-row";
import SetBreadcrumb from "@/components/footer/breadcrumb/SetBreadcrumb";
import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import SetLocalNav from "@/components/navbar/local-nav/SetLocalNav";
import SetNavbar from "@/components/navbar/local-nav/SetNavbar";
import { container } from "@/lib/layout";

import { db } from "@/index";
import { eq } from "drizzle-orm";
import { category, coa, manufacturer, batch, itemCodes } from "@/db";
import { labReportUrl } from "@/integrations/b2/client";

// "report.pdf" -> "PDF". The bucket key is the only place the type lives for now.
function extOf(key: string): string {
  return key.slice(key.lastIndexOf(".") + 1).toUpperCase();
}

export default async function Repository({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: slug } = await searchParams;
  const query = db
    .select({
      id: coa.id,
      title: coa.title,
      fileKey: coa.file_key,
      batchNumber: batch.batch_number,
      compound: itemCodes.codeTitle,
      vendor: manufacturer.name,
    })
    .from(coa)
    .innerJoin(batch, eq(coa.batch_id, batch.id))
    .innerJoin(itemCodes, eq(batch.item_code_id, itemCodes.id))
    .innerJoin(category, eq(itemCodes.category_id, category.id))
    .innerJoin(manufacturer, eq(batch.manufacturer_id, manufacturer.id))
    .orderBy(coa.title);
  const files = slug ? await query.where(eq(category.slug, slug)) : await query;
  const categories = await db
    .select({
      title: category.title,
      slug: category.slug,
    })
    .from(category)
    .orderBy(category.title);

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
      <section className="bg-footer py-16">
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

      <section className="mx-auto w-full max-w-[1240px] px-6 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
          <Input
            className="h-12 text-lg rounded-xl pl-11"
            placeholder="Search lab reports"
            type="search"
          />
        </div>

        <PillRow
          className="mt-8"
          items={[
            { label: "All" },
            ...categories.map((c) => ({ label: c.title, slug: c.slug })),
          ]}
        />

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {files.map((file) => (
            <li key={file.id}>
              <p className="text-[19px] leading-snug font-light lg:text-[17px]">
                {file.title}
              </p>
              <a
                href={labReportUrl(file.fileKey)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[#0065CC] font-light text-[16px] hover:underline"
              >
                View ({extOf(file.fileKey)})
                <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Private Information */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        title="Quality Control"
        href="/repository"
        links={[
          { href: "/repository/lab_reports", label: "Lab Reports" },
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
