import { cn, navContainer } from "@asclepius/ui";
import { api } from "@/lib/api";

const SYMBOLS = ["*", "†", "‡", "§", "◊", "‖", "¶"];

function footnoteSymbol(position: number): string {
  const symbol = SYMBOLS[position % SYMBOLS.length];
  return symbol.repeat(Math.floor(position / SYMBOLS.length) + 1);
}

// A page's footnotes, fetched and rendered on the server. Placed last in the
// page so it sits directly above MegaFooter; it shares the footer's
// background and 1200px column so the two read as one block.
export default async function Footnotes({ slug }: { slug: string }) {
  const res = await api.footnotes.$get({ query: { slug } });
  if (!res.ok) return null;
  const rows = await res.json();
  if (rows.length === 0) return null;

  return (
    <section aria-label="Footnotes" className="bg-footer">
      <ol
        className={cn(
          navContainer,
          "space-y-1.5 py-5 text-[11px] leading-[1.4] text-muted-foreground",
        )}
      >
        {rows.map((row, i) => (
          <li key={row.id} className="flex gap-0">
            <span className="min-w-3.5 shrink-0 text-[16px] leading-[15px] text-foreground/70">
              {footnoteSymbol(i)}
            </span>
            <span>{row.content}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
