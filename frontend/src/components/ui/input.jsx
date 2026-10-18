import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type = "text",
  size = "default",
  startIcon,
  endIcon,
  ...props
}) {
  // Base wrapper only when icons are present
  const hasAdornment = startIcon || endIcon;

  const inputEl = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex w-full min-w-0 rounded-xl border border-border/60 bg-background/60",
        "px-3 text-base md:text-sm text-foreground",
        "shadow-sm transition-[color,box-shadow,border-color,background-color] duration-200",
        "outline-none",
        // file input styling
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // focus
        "focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:bg-background",
        // invalid
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40",
        // autofill override (Chromium yellow flash)
        "autofill:shadow-[inset_0_0_0_1000px_transparent]",
        // sizes
        size === "sm" && "h-8 text-xs px-2.5 rounded-lg",
        size === "default" && "h-9 py-1",
        size === "lg" && "h-11 text-base px-4 rounded-xl",
        // padding for adornments
        startIcon && "pl-9",
        endIcon && "pr-9",
        className
      )}
      {...props}
    />
  );

  if (!hasAdornment) return inputEl;

  return (
    <div className="relative w-full">
      {startIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground peer-focus-within:text-primary transition-colors [&_svg:not([class*='size-'])]:size-4">
          {startIcon}
        </span>
      )}
      {inputEl}
      {endIcon && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
          {endIcon}
        </span>
      )}
    </div>
  );
}

export { Input }