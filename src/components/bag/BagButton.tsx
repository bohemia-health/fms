import { cn } from "cn";
import { Button } from "../ui/button";

interface BagButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
}

export default function BagButton({ label, className, ...props }: BagButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      {...props}
      // Apple's bag button: 56px tall, 17px regular text, 12px corners,
      // their blue (#0071E3, #0077ED on hover). Fills whatever row it sits in;
      // `shrink` undoes the base Button's shrink-0 so two of these split a row.
      className={cn(
        "h-14 w-full shrink rounded-xl bg-[#0071E3] text-[17px] font-normal tracking-normal text-white hover:bg-[#0077ED]",
        className,
      )}
    >
      {label}
    </Button>
  );
}
