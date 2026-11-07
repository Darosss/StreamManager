export default function Loading() {
  return (
    <div className="loading-wrapper">
      <div className="loading-content">
        {"Loading".split("").map((w, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <div key={index} className={w === " " ? "dot" : ""}>
            {w}
          </div>
        ))}
      </div>
    </div>
  );
}
