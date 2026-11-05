import { container } from "@asclepius/ui";
import { cn } from "cn";

export default function Page() {
  return (
    <main className={cn(container, "py-4")}>
      <h1> This is the page for angiogenics</h1>
      <p>This page is still in development.</p>
    </main>
  );
}
