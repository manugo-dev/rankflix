import { useRef } from "react";

import "./carousel.scss";

export function Carousel({ children }: { children: React.ReactNode }) {
  const containerReference = useRef<HTMLDivElement>(null);

  return (
    <div className="carousel">
      <button className="carousel__control carousel__control--prev">‹</button>
      <div ref={containerReference} className="carousel__track">
        {children}
      </div>
      <button className="carousel__control carousel__control--next">›</button>
    </div>
  );
}
