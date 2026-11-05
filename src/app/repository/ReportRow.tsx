"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

export default function ReportRow({
  batch,
  details,
  children,
}: {
  batch: ReactNode;
  details: ReactNode;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [opened, setOpened] = useState(false);
  const panelId = useId();

  return (
    <>
      <TableRow
        interactive={false}
        onClick={() => {
          setOpened(true);
          setExpanded((open) => !open);
        }}
        className={`cursor-pointer border-foreground/15 ${expanded ? "border-b-0" : ""}`}
      >
        <TableCell className="p-0 whitespace-normal wrap-anywhere">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={opened ? panelId : undefined}
            className="group block w-full cursor-pointer py-4 pr-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            {batch}
          </button>
        </TableCell>
        {children}
        <TableCell className="w-8 pr-0 text-right">
          <ChevronDown
            aria-hidden="true"
            className={`ml-auto size-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </TableCell>
      </TableRow>
      {opened && (
        <TableRow interactive={false} hidden={!expanded} className="border-foreground/15">
          <TableCell colSpan={4} className="p-0 whitespace-normal">
            <div id={panelId} className="border-t">{details}</div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
