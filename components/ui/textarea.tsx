import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full bg-surface border border-line rounded px-4 py-3 font-mono text-sm text-paper placeholder:text-ice-dim/40 focus:border-orange transition-colors resize-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
