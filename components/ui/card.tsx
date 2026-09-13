import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props} />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3 className={cn("font-display text-xl font-bold text-paper tracking-[-0.01em]", className)} {...props} />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p className={cn("text-sm text-paper-dim leading-relaxed", className)} {...props} />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("shrink-0", className)} {...props} />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2 pt-4 border-t border-line", className)} {...props} />
  )
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
