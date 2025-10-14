import { type HTMLMotionProps, motion } from "motion/react";

import { cn } from "@/shared/lib/styles";

import "./button.scss";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant: "danger" | "primary";
}

export function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <motion.button {...props} className={cn(props.className, `button button--${variant}`)}>
      {children}
    </motion.button>
  );
}
