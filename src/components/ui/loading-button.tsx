"use client"
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./button";
import { forwardRef, isValidElement, MouseEventHandler, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    onClick: () => Promise<boolean>
}

const LoadingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, children, onClick, ...props }, ref) => {
    const [loading, setLoading] = useState(false);
    return (
      <Button
        variant={variant}
        className={cn("", className)}
        ref={ref}
        disabled={loading}
        {...props}
        onClick={async () => {
          setLoading(true)
          const res = await onClick() 
          if (res) setLoading(false)
        }}
      >
        {loading ? (
          (isValidElement(children) && typeof children !== typeof "") ? (
            <Loader2 className="animate-spin transition-all"/>
          ) : 'Loading...'
        ) : children}
      </Button>
    )
  }
)
LoadingButton.displayName = "Loading Button"

export { LoadingButton }