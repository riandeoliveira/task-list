import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

type LinkProps = ComponentProps<"a">;

export const Link = ({
  children,
  className,
  href = "#",
  ...props
}: LinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "hover:underline underline-offset-4 font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};
