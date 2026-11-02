import type { ReactNode } from "react";
import { PendingError } from "../engine";
import { fmtAuto } from "../format";

const slug = (s: string) => s.normalize("NFD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();

export function Slider({ label, value, min, max, step, unit = "", format = fmtAuto, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit?: string; format?: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input type="range" name={slug(label)} min={min} max={max} step={step} value={value} aria-valuetext={`${format(value)}${unit}`} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="slider-value">{format(value)}{unit}</span>
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
      <div className="notice pending" aria-live="polite">
        <strong>Este cálculo aún no está disponible.</strong> Falta implementar la función <code>{error.what}</code>.
        Si estás trabajando en el código, ejecuta <code>pytest</code> en <code>core/</code> para revisar las pruebas pendientes.
      </div>
    );
  }
  if (error) {
    return (
      <div className="notice error" aria-live="polite">
        <strong>No pudimos completar el cálculo.</strong> Recarga la página para volver a intentarlo. Si el problema continúa, informa el error en el repositorio e incluye este mensaje:
        <pre>{error.message}</pre>
      </div>
    );
  }
  return <div className={busy ? "busy" : ""} aria-busy={busy}>{children}</div>;
}

export function Figure({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="figure">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
