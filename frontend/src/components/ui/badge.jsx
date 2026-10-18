import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-full border px-2.5 py-0.5",
    "text-xs font-semibold w-fit whitespace-nowrap shrink-0",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200",
    "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/20 [a&]:hover:bg-primary/90 [a&]:hover:-translate-y-px",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80 [a&]:hover:-translate-y-px",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm shadow-destructive/30 [a&]:hover:bg-destructive/90 [a&]:hover:-translate-y-px focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:-translate-y-px",
        gradient:
          "border-transparent text-white bg-gradient-to-r from-primary to-accent shadow-sm shadow-primary/25 [a&]:hover:shadow-md [a&]:hover:shadow-primary/30 [a&]:hover:-translate-y-px",
        soft:
          "border-primary/30 bg-primary/10 text-primary [a&]:hover:bg-primary/15 [a&]:hover:border-primary/50",
        success:
          "border-green-500/30 bg-green-500/10 text-green-500 dark:text-green-400 [a&]:hover:bg-green-500/15",
        warning:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 [a&]:hover:bg-yellow-500/15",
        info:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 [a&]:hover:bg-cyan-500/15",
      },
      size: {
        sm: "h-5 px-2 text-[10px] gap-1",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  dot = false,
  dotClassName,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "relative flex h-1.5 w-1.5 shrink-0 rounded-full",
            variant === "gradient" || variant === "default"
              ? "bg-primary-foreground/90"
              : "bg-current",
            dotClassName
          )}
        >
          <span className="absolute inset-0 rounded-full bg-current opacity-40 animate-ping" />
        </span>
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }