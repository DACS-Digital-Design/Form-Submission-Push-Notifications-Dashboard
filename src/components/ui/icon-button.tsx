import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn("size-10 cursor-pointer rounded-md border-white/20 border-[1px] bg-white/10 flex items-center justify-center text-white", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
IconButton.displayName = "Button"

export { IconButton }