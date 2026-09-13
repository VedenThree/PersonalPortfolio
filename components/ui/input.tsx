import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "w-full bg-surface border border-line rounded px-4 py-3 font-mono text-sm text-paper placeholder:text-ice-dim/40 focus:border-orange transition-colors",
        className
      )}
      {...props}
    />
  )
}

export { Input }
