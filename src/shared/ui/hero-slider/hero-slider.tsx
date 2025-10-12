import { AnimatePresence, motion } from "framer-motion";
import { type PropsWithChildren, useCallback, useEffect, useState } from "react";

import { HeroSliderControls } from "./hero-slider-controls";

import "./hero-slider.scss";

interface HeroSliderProps extends PropsWithChildren {
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSlider({ autoPlay = true, children, interval = 6000 }: HeroSliderProps) {
  const slides = Array.isArray(children) ? children : [children];
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((previous) => (previous + 1) % slides.length);
  }, [slides.length]);

  const previous = useCallback(() => {
    setIndex((previous_) => (previous_ - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  }, [index, autoPlay, interval, next]);

  return (
    <div className="hero-slider">
      <div className="hero-slider__viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="hero-slider__item"
            initial={{ opacity: 0.2, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {slides[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <HeroSliderControls onPrev={previous} onNext={next} />
    </div>
  );
}

export function HeroSliderItem({ children }: PropsWithChildren) {
  return <div className="hero-slider__item-content">{children}</div>;
}
