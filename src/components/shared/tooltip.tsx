import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content>;

const TooltipContent = ({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "bg-zinc-100 text-zinc-950 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="bg-zinc-100 fill-zinc-100 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);

type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider>;

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) => (
  <TooltipPrimitive.Provider
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props}
  />
);

type TooltipRootProps = ComponentProps<typeof TooltipPrimitive.Root>;

const TooltipRoot = ({ ...props }: TooltipRootProps) => (
  <TooltipProvider>
    <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  </TooltipProvider>
);

type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>;

const TooltipTrigger = ({ ...props }: TooltipTriggerProps) => (
  <TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild {...props} />
);

export const Tooltip = {
  Content: TooltipContent,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
};
