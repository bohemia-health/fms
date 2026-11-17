import Image from "next/image";
import { cn } from "cn";
import { storeColumn } from "@/components/store/types";
import { formatCampaignTime } from "./campaign-timing";

const statusStyles: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "text-neutral-400" },
  upcoming: { label: "New · Upcoming", color: "text-orange-400" },
  active: { label: "Active", color: "text-emerald-400" },
  inactive: { label: "Inactive", color: "text-neutral-400" },
  funded: { label: "Funded", color: "text-emerald-400" },
  unfunded: { label: "Unfunded", color: "text-amber-400" },
  cancelled: { label: "Cancelled", color: "text-red-400" },
};

type CampaignBannerProps = {
  title: string;
  status?: string | null;
  opensAt?: string | null;
  closesAt?: string | null;
  artwork?: { src: string; alt: string };
};

export function CampaignBanner({ title, status, opensAt, closesAt, artwork }: CampaignBannerProps) {
  // The saved campaign status is authoritative; dates do not change it.
  const indicator = (status && Object.hasOwn(statusStyles, status) && statusStyles[status]) || {
    label: "Status unavailable", color: "text-neutral-400",
  };
  const schedule = [
    { label: "Opens", value: formatCampaignTime(opensAt) },
    { label: "Closes", value: formatCampaignTime(closesAt) },
  ];

  return (
    <section
      aria-labelledby="campaign-title"
      className="overflow-hidden bg-black text-white"
    >
      <div
        className={cn(
          storeColumn,
          "grid items-center gap-4 py-10 md:min-h-[440px]",
          artwork ? "md:grid-cols-[1.05fr_1fr] md:gap-6" : "md:py-20",
        )}
      >
        <div className="min-w-0 text-center md:text-left">
          <p className={cn("mb-4 text-[13px] font-bold uppercase leading-5 tracking-[0.08em]", indicator.color)}>
            <span className="sr-only">Campaign status: </span>
            {indicator.label}
          </p>

          <h1
            id="campaign-title"
            className="mx-auto max-w-[14ch] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl md:mx-0 lg:text-[3.5rem]"
          >
            {title}
          </h1>

          <dl className="mx-auto mt-8 grid w-fit max-w-full grid-cols-2 text-left md:mx-0">
            {schedule.map(({ label, value }, index) => (
              <div
                key={label}
                className={cn(
                  "min-w-0",
                  index === 0 ? "pr-6 sm:pr-8" : "border-l border-white/15 pl-6 sm:pl-8",
                )}
              >
                <dt className="text-xs font-medium text-white/55">{label}</dt>
                <dd className="mt-2 text-sm leading-5 sm:text-[15px]">
                  {value ? (
                    <time dateTime={value.iso}>
                      <span className="block font-medium text-white/90">{value.date}</span>
                      <span className="mt-0.5 block text-white/60">{value.time}</span>
                    </time>
                  ) : (
                    <span className="text-white/60">To be announced</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {artwork && (
          <Image
            src={artwork.src}
            alt={artwork.alt}
            width={1024}
            height={1024}
            sizes="(min-width: 960px) 440px, (min-width: 768px) 46vw, (min-width: 352px) 320px, calc(100vw - 32px)"
            className="mx-auto h-auto w-full max-w-80 object-contain md:ml-auto md:mr-0 md:max-w-[440px]"
            priority
          />
        )}
      </div>
    </section>
  );
}
