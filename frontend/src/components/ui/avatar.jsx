import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ring = false,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        "transition-shadow duration-300",
        ring &&
          "ring-2 ring-primary/40 ring-offset-2 ring-offset-background shadow-lg shadow-primary/20",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        "transition-opacity duration-500 ease-out",
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        "bg-gradient-to-br from-primary/25 via-primary/10 to-accent/25",
        "text-foreground font-semibold tracking-tight",
        "text-[0.7em] uppercase",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

/* Optional: small status indicator (online / away / offline) */
function AvatarStatus({ status = "online", className }) {
  const color =
    status === "online"
      ? "bg-green-500"
      : status === "away"
      ? "bg-yellow-500"
      : "bg-muted-foreground/60";

  return (
    <span
      aria-label={`Status: ${status}`}
      className={cn(
        "absolute bottom-0 right-0 z-10",
        "block size-[28%] min-h-2 min-w-2 rounded-full",
        "ring-2 ring-background",
        color,
        "shadow-sm",
        className
      )}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStatus }