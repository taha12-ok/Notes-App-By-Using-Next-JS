import * as React from "react";

// Utility function for class names (cn) - ensure this is properly defined in your project
import { cn } from "@/lib/utils";

// InputProps interface extending the standard input attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// React.forwardRef for Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type} // Input type (default: "text")
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className // Allows additional className props
        )}
        ref={ref} // Forwarding the ref to input element
        {...props} // Spread the remaining props
      />
    );
  }
);

// Display name for the component
Input.displayName = "Input";

// Exporting the Input component
export { Input };
