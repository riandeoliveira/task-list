import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => {
  const styles = {
    "--normal-bg": "var(--color-zinc-900)",
    "--normal-text": "var(--color-zinc-100)",
    "--normal-border": "var(--color-zinc-800)",
  } as CSSProperties;

  return <Sonner position="top-right" style={styles} {...props} />;
};
