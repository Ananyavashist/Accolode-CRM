import { cn } from "@/lib/utils";

export function AccoladeLogo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="16" cy="16" r="15" fill="#124553" />
      <path d="M16 7l5 13-5-3-5 3z" fill="#fff" />
    </svg>
  );
}