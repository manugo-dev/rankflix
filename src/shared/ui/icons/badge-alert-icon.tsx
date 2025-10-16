import type { SVGMotionProps } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";

interface BadgeAlertIconProps extends SVGMotionProps<SVGSVGElement> {
  size?: number;
}

export const BadgeAlertIcon = forwardRef<SVGSVGElement, BadgeAlertIconProps>(
  ({ size = 28, ...props }, reference) => {
    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        whileHover={{ rotate: [1, 1.1, 1.1, 1.1, 1], scale: [1, 1.2, 1, 1.2, 1, 1.2, 1] }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        {...props}
        ref={reference}
      >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </motion.svg>
    );
  },
);

BadgeAlertIcon.displayName = "BadgeAlertIcon";
