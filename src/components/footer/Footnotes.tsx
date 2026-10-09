export default function Footnotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <ol className="list-decimal space-y-2 pl-4 py-5 text-[11px] leading-[1.4] text-muted-foreground">
      {notes.map((note, i) => (
        <li key={i}>{note}</li>
      ))}
    </ol>
  );
}
