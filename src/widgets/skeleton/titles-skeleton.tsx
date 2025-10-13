import "./titles-skeleton.scss";

export function TitlesSkeleton() {
  return (
    <div className="titles-skeleton">
      <div className="titles-skeleton__track">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="titles-skeleton__card" />
        ))}
      </div>
    </div>
  );
}
