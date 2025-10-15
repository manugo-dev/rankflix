import "./spinner.scss";

export function Spinner() {
  return (
    <div className="spinner" role="status">
      <div className="eye"></div>
      <div className="halo"></div>
    </div>
  );
}
