import type { ReactNode } from "react";
import { PendingError } from "../engine";

export function Slider({ label, value, min, max, step, unit = "", onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="slider-value">{value}{unit}</span>
    </label>
  );
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="controls">{children}</div>;
}

/** Muestra el estado de una llamada: pendiente (función sin implementar), error o cargando. */
export function Outcome({ error, busy, children }: { error: Error | null; busy: boolean; children: ReactNode }) {
  if (error instanceof PendingError) {
    return (
      <div className="notice pending">
        <strong>Pendiente.</strong> Esta pestaña se activa cuando exista la función: <code>{error.what}</code>.
        Corre <code>pytest</code> en <code>core/</code> para ver qué falta.
      </div>
    );
  }
  if (error) return <div className="notice error"><strong>Error.</strong> <pre>{error.message}</pre></div>;
  return <div className={busy ? "busy" : ""}>{children}</div>;
}

export function Figure({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="figure">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
