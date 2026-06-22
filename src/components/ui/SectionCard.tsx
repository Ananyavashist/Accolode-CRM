import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return <div className={cn("section-card", className)}>{children}</div>;
}
