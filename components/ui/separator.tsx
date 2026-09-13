import { cn } from "@/lib/utils"

function Separator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr className={cn("border-t border-line", className)} {...props} />
  )
}

export { Separator }
