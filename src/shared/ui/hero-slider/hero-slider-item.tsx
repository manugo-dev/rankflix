import type { PropsWithChildren } from "react";

interface HeroSliderItemProps extends PropsWithChildren {
  image: string;
  title?: string;
  description?: string;
}

export function HeroSliderItem({ children, description, image, title }: HeroSliderItemProps) {
  return (
    <div className="hero-slider__item">
      <img src={image} alt={title ?? "Slide"} className="hero-slider__image" />
      <div className="hero-slider__overlay" />
      <div className="hero-slider__content">
        {title && <h2 className="hero-slider__title">{title}</h2>}
        {description && <p className="hero-slider__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
