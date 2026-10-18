import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function TabsList({ className, variant = "pills", ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "relative inline-flex w-fit items-center justify-center",
        "rounded-xl p-1",
        "transition-colors duration-200",
        // variants
        variant === "pills" &&
          "bg-muted/60 backdrop-blur-sm border border-border/60 shadow-sm",
        variant === "underline" && "bg-transparent gap-1 p-0 border-b border-border/60 rounded-none",
        variant === "ghost" && "bg-transparent gap-1 p-0 rounded-none",
        // text + behavior
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, variant, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // base
        "relative inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap",
        "text-sm font-medium",
        "border border-transparent rounded-lg",
        "px-3 py-1.5",
        "transition-[color,background-color,box-shadow,border-color] duration-200",
        "outline-none",
        // focus
        "focus-visible:ring-[3px] focus-visible:ring-primary/25 focus-visible:border-primary/40",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // default (inactive)
        "text-muted-foreground hover:text-foreground",
        // active
        "data-[state=active]:text-foreground",
        "data-[state=active]:bg-background",
        "data-[state=active]:border-border/60",
        "data-[state=active]:shadow-sm",
        "dark:data-[state=active]:bg-input/40",
        // underline variant
        "data-[variant=underline]:rounded-none data-[variant=underline]:border-x-0 data-[variant=underline]:border-t-0",
        "data-[variant=underline]:data-[state=active]:bg-transparent",
        "data-[variant=underline]:data-[state=active]:border-b-primary",
        "data-[variant=underline]:data-[state=active]:border-b-2",
        "data-[variant=underline]:data-[state=active]:shadow-none",
        // ghost variant
        "data-[variant=ghost]:data-[state=active]:bg-muted/60",
        "data-[variant=ghost]:data-[state=active]:border-transparent",
        "data-[variant=ghost]:data-[state=active]:shadow-none",
        // svg
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-variant={variant}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        "data-[state=active]:animate-in data-[state=inactive]:animate-out",
        "data-[state=active]:fade-in-0 data-[state=inactive]:fade-out-0",
        "data-[state=active]:slide-in-from-bottom-1",
        "duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }