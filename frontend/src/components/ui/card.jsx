import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  glow = false,
  interactive = false,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative flex flex-col gap-6 rounded-2xl border border-border/60 py-6",
        "bg-card/70 backdrop-blur-xl text-card-foreground",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        "transition-[transform,box-shadow,border-color] duration-300",
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-primary/40",
        glow &&
          "before:pointer-events-none before:absolute before:-inset-px before:-z-10 before:rounded-2xl before:bg-gradient-to-br before:from-primary/20 before:via-transparent before:to-accent/20 before:opacity-70",
        className
      )}
      {...props}
    >
      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {props.children}
    </div>
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6 [.border-b]:border-border/60",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  gradient = false,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-tight font-semibold tracking-tight",
        gradient &&
          "bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 [.border-t]:pt-6 [.border-t]:border-border/60",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}