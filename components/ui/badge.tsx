import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "font-mono text-[10px] tracking-[0.15em] px-2.5 py-1 rounded border",
  {
    variants: {
      variant: {
        orange: "bg-orange/20 text-orange border-orange/30",
        olive: "bg-olive/20 text-olive border-olive/30",
        ice: "bg-ice/20 text-ice border-ice/30",
        paper: "bg-paper-dim/20 text-paper-dim border-paper-dim/30",
      },
    },
    defaultVariants: {
      variant: "ice",
    },
  }
)

function Badge({
  className,
  variant = "ice",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
