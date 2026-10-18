// Números en español de Chile (coma decimal), igual en etiquetas, sliders y tablas.
const cache = new Map<number, Intl.NumberFormat>();

export function fmt(n: number, digits: number): string {
  let f = cache.get(digits);
  if (!f) {
    f = new Intl.NumberFormat("es-CL", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    cache.set(digits, f);
  }
  return f.format(n);
}

/** Como fmt, pero sin forzar decimales (para valores de sliders: 5, 0,31, 67,4). */
export function fmtAuto(n: number): string {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 3 }).format(n);
}
