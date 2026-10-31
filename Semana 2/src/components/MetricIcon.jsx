/** Íconos lineales SVG independientes, sin bibliotecas adicionales. */
export default function MetricIcon({ kind }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {kind === 'package' && <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="M3 7v10l9 5 9-5V7M12 12v10"/></>}
      {kind === 'basket' && <><path d="m3 10 2 11h14l2-11H3ZM8 10l4-7 4 7M9 14v4M15 14v4"/></>}
      {kind === 'warning' && <><path d="m10.3 3.8-8.4 14.6A1.7 1.7 0 0 0 3.4 21h17.2a1.7 1.7 0 0 0 1.5-2.6L13.7 3.8a1.9 1.9 0 0 0-3.4 0Z"/><path d="M12 9v5m0 3h.01"/></>}
    </svg>
  );
}
