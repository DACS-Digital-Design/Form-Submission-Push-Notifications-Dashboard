"use client"

import { cn } from "@/lib/utils";
import * as React from "react";

type SeparatorProps = {
  className?: string
  orientation?: "horizontal" | "vertical"
  single?: boolean
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = "horizontal", single = false, className, ...props }, ref) => (
    <hr className={cn("bg-primary/20 border-none rounded-full", orientation === "vertical" ? "h-full w-0.5" : 'h-0.5 w-full')} />
  )
)