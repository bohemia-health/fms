import { Badge } from "../ui/badge";
import { cn } from "cn";

/**
 * A store promotion chip. Renders a real <button>, and forwards every prop
 * it does not use, so it can sit in a Base UI `render` slot (a DialogTrigger,
 * a PopoverTrigger) and receive the trigger's onClick, ref and aria-* props.
 * A wrapper that swallowed those props would leave the trigger inert.
 */
export default function ProductBadge({
  label,
  className,
  ...props
}: { label: string } & React.ComponentProps<"button">) {
  return (
    <Badge
      render={<button type="button" />}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {label}
    </Badge>
  );
}
