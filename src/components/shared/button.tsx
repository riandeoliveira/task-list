import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "px-3 py-2 font-semibold text-base cursor-pointer rounded-md disabled:opacity-60 disabled:cursor-not-allowed enabled:hover:transition-colors",
  {
    variants: {
      variant: {
        alert: "bg-red-500 text-zinc-100 enabled:hover:bg-red-500/80",
        default: "bg-zinc-100 text-zinc-950 enabled:hover:bg-zinc-100/80",
        ghost: "text-zinc-100 enabled:hover:bg-zinc-800",
        outline:
          "border bg-zinc-900 text-zinc-100 border-zinc-800 enabled:hover:bg-zinc-900/60",
        secondary: "bg-zinc-800 text-zinc-100 enabled:hover:bg-zinc-800/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export const Button = ({
  children,
  variant,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {children}
    </button>
  );
};
