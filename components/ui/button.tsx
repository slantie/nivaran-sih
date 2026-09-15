import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-[#123047] text-white hover:bg-[#1b435e]", outline: "border border-[#cbd5df] bg-white text-[#123047] hover:bg-[#f3f7f7]", secondary: "bg-[#dceeea] text-[#12423b] hover:bg-[#c8e3dd]", ghost: "text-[#24485b] hover:bg-[#edf4f3]", saffron: "bg-[#eea42a] text-[#172f3b] hover:bg-[#dd9219]" }, size: { default: "h-10 px-4 py-2", sm: "h-8 rounded px-3 text-xs", lg: "h-12 px-6 text-base", icon: "h-10 w-10" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; }); Button.displayName = "Button";
export { Button, buttonVariants };
