export function lerp(a, b, a2, b2, v) {
  const vd = v - a;
  const d = b - a;
  return a2 + ((b2 - a2) * vd / d);
}
