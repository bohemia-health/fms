import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PillRow from "@/components/pill-row";
import SetBreadcrumb from "@/components/footer/breadcrumb/SetBreadcrumb";
import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import SetLocalNav from "@/components/navbar/local-nav/SetLocalNav";
import SetNavbar from "@/components/navbar/local-nav/SetNavbar";
import { container } from "@/lib/layout";

export default function Repository() {
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

      <section className={`${container} py-8`}>
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
            "GLP-1",
            "MITO",
            "Nootropic",
            "Blend",
            "Bioregulator",
            "Endotoxin (EU)",
            "HPLC-MS (LC-MS)",
            "Heavy Metals",
            "TAMC/TYMC (Sterility)",
          ]}
        />
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
