import * as SelectPrimitive from "@radix-ui/react-select";
import { type ComponentProps, createContext, useContext } from "react";
import { Icon } from "@/assets";
import { cn } from "@/utils/cn";

type SelectContextType = {
  hasErrors: boolean;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("useSelect must be used within a Select.Root component");
  }

  return context;
};

type AreaProps = ComponentProps<typeof SelectPrimitive.Root>;

const Area = ({ ...props }: AreaProps) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
};

type ContentProps = ComponentProps<typeof SelectPrimitive.Content>;

const Content = ({ className, children, ...props }: ContentProps) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-zinc-800 text-zinc-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 border border-zinc-700",
          className,
        )}
        position="popper"
        {...props}
      >
        <ScrollUpButton />
        <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
          {children}
        </SelectPrimitive.Viewport>
        <ScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

type ErrorMessageProps = ComponentProps<"span">;

const ErrorMessage = ({ children, className, ...props }: ErrorMessageProps) => {
  const { hasErrors } = useSelect();

  if (!hasErrors) return null;

  return (
    <span
      className={cn("text-red-400 text-xs font-semibold", className)}
      {...props}
    >
      {children}
    </span>
  );
};

type ItemProps = ComponentProps<typeof SelectPrimitive.Item>;

const Item = ({ className, children, ...props }: ItemProps) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "text-zinc-100 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 hover:bg-zinc-700",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon.CheckIcon className="text-zinc-500 size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

type LabelProps = ComponentProps<"label">;

const Label = ({ children, className, htmlFor, ...props }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </label>
  );
};

type RootProps = ComponentProps<"div"> & Partial<SelectContextType>;

const Root = ({
  hasErrors = false,
  className,
  children,
  ...props
}: RootProps) => {
  return (
    <SelectContext.Provider value={{ hasErrors }}>
      <div className={cn("flex flex-col gap-1", className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

type ScrollDownButtonProps = ComponentProps<
  typeof SelectPrimitive.ScrollDownButton
>;

const ScrollDownButton = ({ className, ...props }: ScrollDownButtonProps) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon.ChevronDownIcon className="text-zinc-500 " />
    </SelectPrimitive.ScrollDownButton>
  );
};

type ScrollUpButtonProps = ComponentProps<
  typeof SelectPrimitive.ScrollUpButton
>;

const ScrollUpButton = ({ className, ...props }: ScrollUpButtonProps) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <Icon.ChevronUpIcon className="text-zinc-500 " />
    </SelectPrimitive.ScrollUpButton>
  );
};

type TriggerProps = ComponentProps<typeof SelectPrimitive.Trigger>;

const Trigger = ({ className, children, ...props }: TriggerProps) => {
  const { hasErrors } = useSelect();

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "bg-zinc-800 data-[placeholder]:text-zinc-400 enabled:hover:bg-zinc-800/80 flex items-center justify-between gap-2 rounded-md border px-3 py-2 whitespace-nowrap transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 w-full",
        hasErrors ? "border-red-400" : "border-zinc-800",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon.ChevronDownIcon className="text-zinc-500 " />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

type ValueProps = ComponentProps<typeof SelectPrimitive.Value>;

const Value = ({ ...props }: ValueProps) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
};

export const Select = {
  Area,
  Content,
  ErrorMessage,
  Item,
  Label,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value,
};
