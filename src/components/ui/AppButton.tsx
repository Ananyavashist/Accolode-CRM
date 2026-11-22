import { type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  leadsBanner: "btn-leads-banner-cta",
} as const;

export type AppButtonVariant = keyof typeof VARIANT_CLASS;

export type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant;
  /** Icon rendered after the label (standard pattern across the app). */
  trailingIcon?: ReactElement;
};

/** Text button with optional trailing icon — prefer this over raw `<button className="btn-*">`. */
export function AppButton({
  variant = "primary",
  trailingIcon,
  className,
  children,
  type = "button",
  ...rest
}: AppButtonProps) {
  return (
    <button type={type} className={cn(VARIANT_CLASS[variant], "gap-1.5", className)} {...rest}>
      {children}
      {trailingIcon}
    </button>
  );
}