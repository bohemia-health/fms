import { cn } from "@/lib/utils";
import { orderWords, parcelWords, tones } from "./words";

export function StatusPill({ status, kind }: { status: string | null | undefined; kind: "order" | "parcel" }) {
  const words = kind === "order" ? orderWords : parcelWords;
  const w = (status && words[status]) || { label: "Awaiting update", tone: "muted" as const };
  return (
    <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium whitespace-nowrap", tones[w.tone])}>
      {w.label}
    </span>
  );
}
