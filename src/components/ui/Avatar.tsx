import { avatarColor, cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const dimension = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={dimension}
        className={cn("shrink-0 rounded-full object-cover", className)}
        loading="lazy"
      />
    );
  }
  return (
    <span
      style={{ ...dimension, backgroundColor: avatarColor(name), fontSize: size * 0.36 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
