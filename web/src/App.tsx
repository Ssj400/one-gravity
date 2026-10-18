import { useState } from "react";
import { useEngineStatus } from "./engine";
import { useTheme } from "./theme";
import { Solar } from "./tabs/Solar";
import { Galaxy } from "./tabs/Galaxy";
import { Universe } from "./tabs/Universe";
import { Supernovae } from "./tabs/Supernovae";

// La navegación es una regla logarítmica de distancias (en parsecs). Cada
// escala se marca donde le corresponde: la misma ecuación, 15 órdenes de magnitud.
const LOG_MIN = -6; // 1 UA ≈ 10^-5.3 pc
const LOG_MAX = 11.4; // supernovas a z ≈ 2: d_L ≈ 10^10.3 pc, con margen para la etiqueta
const pct = (logPc: number) => ((logPc - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;

const TICKS = [
  { logPc: -5.31, label: "1 UA" },
  { logPc: 0, label: "1 pc" },
  { logPc: 3, label: "1 kpc" },
  { logPc: 6, label: "1 Mpc" },
  { logPc: 9, label: "1 Gpc" },
];

const SCALES = [
  { id: "solar", label: "Sistema Solar", where: "hasta Neptuno, 30 UA", logPc: -3.84, row: 0, el: <Solar /> },
  { id: "galaxy", label: "Galaxia", where: "NGC 3198, 44 kpc", logPc: 4.64, row: 0, el: <Galaxy /> },
  { id: "universe", label: "Universo", where: "distancia de Hubble, 4,4 Gpc", logPc: 9.65, row: 0, el: <Universe /> },
  { id: "sn", label: "Supernovas", where: "z = 2, 18 Gpc", logPc: 10.27, row: 1, el: <Supernovae /> },
] as const;

type ScaleId = (typeof SCALES)[number]["id"];

function fromHash(): ScaleId {
  const h = location.hash.replace("#", "");
  return SCALES.some((s) => s.id === h) ? (h as ScaleId) : "solar";
}

export default function App() {
  const [scale, setScaleState] = useState<ScaleId>(fromHash);
  const setScale = (id: ScaleId) => {
    history.replaceState(null, "", `#${id}`);
    setScaleState(id);
  };
  const status = useEngineStatus();
  const { mode, setMode } = useTheme();
  const current = SCALES.find((s) => s.id === scale)!;

  return (
    <>
      <header className="header">
        <div className="masthead">
          <h1>Una sola gravedad, tres escalas</h1>
          <p className="subtitle">La misma ecuación de Newton, integrada con el mismo método, desde Mercurio hasta las supernovas más lejanas.</p>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} title="Modo claro para exportar las figuras del informe">
            {mode === "dark" ? "Modo informe" : "Modo espacial"}
          </button>
          <div className={`status ${status.ready ? "ready" : ""}`} title="El código Python corre en tu navegador con Pyodide">
            {status.ready ? "Python listo" : status.text}
          </div>
        </div>
      </header>

      <nav className="ruler" aria-label="Escala de distancias">
        <div className="ruler-line" />
        {TICKS.map((t) => (
          <div key={t.label} className="tick" style={{ left: `${pct(t.logPc)}%` }}>
            <span className="tick-mark" />
            <span className="tick-label">{t.label}</span>
          </div>
        ))}
        <div className="cursor" style={{ left: `${pct(current.logPc)}%` }} aria-hidden="true" />
        {SCALES.map((s) => (
          <button
            key={s.id}
            className={`mark row-${s.row} ${scale === s.id ? "active" : ""}`}
            style={{ left: `${pct(s.logPc)}%` }}
            onClick={() => setScale(s.id)}
            aria-current={scale === s.id ? "page" : undefined}
          >
            <span className="mark-dot" />
            <span className="mark-label">{s.label}</span>
            <span className="mark-where">{s.where}</span>
          </button>
        ))}
      </nav>

      <main className="main">{current.el}</main>

      <footer className="footer">
        Datos: SPARC (Lelli, McGaugh y Schombert 2016) y Pantheon+ (Scolnic et al. 2022; Brout et al. 2022). El paquete Python que corre en esta página es el mismo que pasa los tests de física en el repositorio.
      </footer>
    </>
  );
}
