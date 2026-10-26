import { SetBreadcrumb } from "@asclepius/ui";
import { SetLocalNav } from "@asclepius/ui";
import { SetNavbar } from "@asclepius/ui";
import Image from "next/image";
import LegalSection from "@/components/legal/LegalSection";
import { legalSections } from "@/components/legal/cards";

export default function Page() {
  return (
    <main>
      <div className="relative -mt-12 aspect-square sm:aspect-[2/1] lg:aspect-[4/1]">
        <Image
          src="/abstract_banner.png"
          fill
          priority
          sizes="100vw"
          quality={100}
          alt="abstract image"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-start gap-2 px-6 pt-24 lg:pt-[9%] text-black">
          <h1 className="text-3xl font-medium md:text-4xl">Bohemia Legal</h1>
          <p className="max-w-sm text-center text-lg font-thin tracking-tight text-balance md:text-xl">
            Find legal information and resources for Bohemia Health products and
            services.
          </p>
        </div>
      </div>

      <div className="py-10">
        {legalSections.map((section) => (
          <LegalSection key={section.id} {...section} />
        ))}
      </div>

      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        overlay
        title="Legal"
        href="/legal"
        links={legalSections.map((s) => ({
          label: s.heading,
          href: `#${s.id}`,
        }))}
      />
      <SetBreadcrumb items={[{ label: "Legal" }]} />
    </main>
  );
}
