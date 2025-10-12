interface HeroSliderControlsProps {
  onNext: () => void;
  onPrev: () => void;
}

export function HeroSliderControls({ onNext, onPrev }: HeroSliderControlsProps) {
  return (
    <div className="hero-slider__controls">
      <button className="hero-slider__control hero-slider__control--prev" onClick={onPrev}>
        ‹
      </button>
      <button className="hero-slider__control hero-slider__control--next" onClick={onNext}>
        ›
      </button>
    </div>
  );
}
