import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] font-mono text-[13px] tracking-[0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-orange text-orange bg-transparent hover:bg-orange hover:text-ink",
        secondary:
          "border border-line text-paper-dim bg-transparent hover:border-ice hover:text-ice",
        ghost:
          "text-ice-dim hover:text-orange hover:bg-orange/10 transition-colors",
      },
      size: {
        default: "px-[26px] py-3.5",
        sm: "px-4 py-2 text-[12px]",
        lg: "px-[30px] py-4 text-[14px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
