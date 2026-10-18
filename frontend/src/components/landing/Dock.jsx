import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const DockIconButton = React.forwardRef(
  ({ icon: Icon, label, onClick, className }, ref) => {
    const [hovered, setHovered] = React.useState(false)

    return (
      <motion.button
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileHover={{ scale: 1.25, y: -6 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-xl",
          "text-foreground/80 hover:text-foreground",
          "hover:bg-gradient-to-b hover:from-primary/15 hover:to-accent/10",
          "transition-colors",
          className
        )}
      >
        <Icon className="w-5 h-5 drop-shadow-sm" />

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute -top-9 left-1/2 -translate-x-1/2 z-50",
                "px-2.5 py-1 rounded-md text-xs font-medium",
                "bg-popover/95 backdrop-blur-md text-popover-foreground",
                "border border-border/60 shadow-lg",
                "whitespace-nowrap pointer-events-none"
              )}
            >
              {label}
              {/* tooltip arrow */}
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 bg-popover/95 border-r border-b border-border/60" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef(({ items, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full flex items-center justify-center p-2", className)}
    >
      <div className="w-full flex items-center justify-center relative">
        {/* Ambient glow behind dock */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-[60%] rounded-full bg-primary/20 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "relative flex items-center gap-1 p-2 rounded-2xl",
            "backdrop-blur-xl border shadow-2xl",
            "bg-background/70 border-border/60",
            "hover:shadow-primary/10 hover:border-primary/40",
            "transition-all duration-300"
          )}
        >
          {/* top sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />

          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    </div>
  )
})
Dock.displayName = "Dock"

export { Dock }