import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Angoli smussati: stessa forma dei CTA inline che il design system usa ovunque.
const chamfer =
  "[clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"

const buttonVariants = cva(
  "group inline-flex items-center justify-center font-mono text-[12px] px-[26px] py-3.5 transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: cn(
          "border border-orange text-orange bg-transparent hover:bg-orange hover:text-ink",
          chamfer
        ),
        secondary: cn(
          "border border-line text-paper-dim bg-transparent hover:border-ice hover:text-ice",
          chamfer
        ),
        ghost: "text-ice-dim hover:text-orange hover:bg-orange/10 transition-colors",
      },
      size: {
        default: "",
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