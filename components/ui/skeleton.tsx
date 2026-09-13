import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("h-3 bg-line rounded", className)}
      {...props}
    />
  )
}

export { Skeleton }
