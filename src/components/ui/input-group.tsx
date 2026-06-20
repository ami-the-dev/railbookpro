import * as React from "react";
import { cn } from "@/lib/utils";

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, label, error, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
);
InputGroup.displayName = "InputGroup";

export { InputGroup };
