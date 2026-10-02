export default function Stat({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ''}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
