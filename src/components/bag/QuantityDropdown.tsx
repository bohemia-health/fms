"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuantityDropdownProps {
  maxQuantity?: number;
  defaultValue?: number;
  onQuantityChange?: (value: number) => void;
}

export function QuantityDropdown({
  maxQuantity = 10,
  defaultValue = 1,
  onQuantityChange,
}: QuantityDropdownProps) {
  const [quantity, setQuantity] = useState(defaultValue.toString());

  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) =>
    (i + 1).toString(),
  );

  const handleValueChange = (value: string | null) => {
    if (value === null) return;
    setQuantity(value);
    onQuantityChange?.(Number(value));
  };

  return (
    <Select value={quantity} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label="Quantity"
        className="h-auto gap-1 rounded-none border-0 bg-transparent p-0 text-2xl leading-tight font-semibold tracking-tight tabular-nums shadow-none hover:text-foreground/70 focus-visible:border-0 focus-visible:ring-0 data-[size=default]:h-auto dark:bg-transparent dark:hover:bg-transparent [&_svg]:size-4.5 [&_svg]:text-muted-foreground"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" className="w-auto min-w-0">
        {quantityOptions.map((num) => (
          <SelectItem
            key={num}
            value={num}
            className="cursor-pointer py-1.5 pr-9 pl-3 text-[15px] tabular-nums"
          >
            {num}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
