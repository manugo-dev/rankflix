import { AnimatePresence, motion } from "framer-motion";
import { type HTMLProps, useCallback, useEffect, useState } from "react";

import { cn } from "@/shared/lib/styles";

import "./hero-slider.scss";

export interface HeroSliderProps extends HTMLProps<HTMLDivElement> {
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSlider({
  autoPlay = true,
  children,
  className,
  interval = 6000,
  ...props
}: HeroSliderProps) {
  const slides = Array.isArray(children) ? children : [children];
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((previous) => (previous + 1) % slides.length);
  }, [slides.length]);

  const previous = useCallback(() => {
    setIndex((previous) => (previous - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  }, [index, autoPlay, interval, next]);

  return (
    <div {...props} className={cn("hero-slider", className)}>
      <div className="hero-slider__track">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="hero-slider__item"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {slides[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero-slider__controls">
        <button className="hero-slider__control hero-slider__control--prev" onClick={previous}>
          ‹
        </button>
        <button className="hero-slider__control hero-slider__control--next" onClick={next}>
          ›
        </button>
      </div>
    </div>
  );
}
