import { useEffect, useState } from "react";
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
  { id: "solar", label: "Sistema Solar", where: "hasta Neptuno, 30 UA", logPc: -3.84, el: <Solar /> },
  { id: "galaxy", label: "Galaxia", where: "NGC 3198, 44 kpc", logPc: 4.64, el: <Galaxy /> },
  { id: "universe", label: "Universo", where: "distancia de Hubble, 4,4 Gpc", logPc: 9.65, el: <Universe /> },
  { id: "sn", label: "Supernovas", where: "z = 2, 18 Gpc", logPc: 10.27, el: <Supernovae /> },
] as const;

type ScaleId = (typeof SCALES)[number]["id"];

const isScale = (h: string): h is ScaleId => SCALES.some((s) => s.id === h);
const fromHash = (): ScaleId | null => {
  const h = location.hash.replace("#", "");
  return isScale(h) ? h : null;
};

export default function App() {
  // La URL manda: las marcas son enlaces a #id y el estado sigue al hash (atrás/adelante funcionan).
  const [scale, setScale] = useState<ScaleId>(() => fromHash() ?? "solar");
  useEffect(() => {
    const onHash = () => {
      const h = fromHash();
      if (h) setScale(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const status = useEngineStatus();
  const { mode, setMode } = useTheme();
  const current = SCALES.find((s) => s.id === scale)!;

  return (
    <>
      <a className="skip" href="#contenido">Ir al contenido</a>
      <header className="header">
        <div className="masthead">
          <h1>Una sola gravedad, tres escalas</h1>
          <p className="subtitle">¿Qué podemos entender del Universo a partir de un programa? Exploramos órbitas, galaxias y expansión, y revisamos hasta dónde podemos confiar en lo que calculamos.</p>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")} title="Cambiar entre el tema oscuro y el tema claro para el informe" aria-pressed={mode === "light"}>
            {mode === "dark" ? "Usar tema claro" : "Usar tema oscuro"}
          </button>
          <div className={`status ${status.ready ? "ready" : ""}`} aria-live="polite" title="El código Python corre en tu navegador con Pyodide">
            {status.ready ? "Python listo" : status.text}
          </div>
        </div>
      </header>

      <div className="distance-scale" role="img" aria-label={`Escala logarítmica de distancias. ${current.label}: ${current.where}.`}>
        <span className="distance-label">Distancia · escala logarítmica</span>
        <div className="ruler">
          <div className="ruler-line" />
          {TICKS.map((t) => (
            <div key={t.label} className="tick" style={{ left: `${pct(t.logPc)}%` }}>
              <span className="tick-mark" />
              <span className="tick-label">{t.label}</span>
            </div>
          ))}
          <div className="cursor" style={{ left: `${pct(current.logPc)}%` }} aria-hidden="true" />
          {SCALES.map((s) => <span key={s.id} className={`scale-point ${scale === s.id ? "selected" : ""}`} style={{ left: `${pct(s.logPc)}%` }} />)}
        </div>
      </div>

      <nav className="scale-nav" aria-label="Explorar las escalas">
        {SCALES.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`mark ${scale === s.id ? "active" : ""}`}
            aria-current={scale === s.id ? "page" : undefined}
          >
            <span className="mark-label">{s.label}</span>
            <span className="mark-where">{s.where}</span>
          </a>
        ))}
      </nav>

      <details className="thesis">
        <summary>Sobre el proyecto y su método</summary>
        <div className="thesis-content">
        <p>
          Como estudiantes de computación, nos preguntamos cómo llevar los contenidos de astronomía a instrucciones que podamos revisar. Comenzamos con el Sistema Solar: las leyes de Kepler nos dan resultados conocidos con los que comprobar el cálculo. Después pasamos a la rotación de una galaxia y a la expansión del Universo, donde también necesitamos relaciones basadas en relatividad general.
        </p>
        <p>
          La gravedad conecta los tres problemas, aunque no los resolvemos de la misma forma. En la galaxia comparamos velocidades con datos de SPARC; en el Universo calculamos distintas historias de expansión y las contrastamos con Pantheon+. Los controles permiten cambiar los supuestos y observar sus consecuencias. Las pruebas del código y las observaciones cumplen tareas distintas: comprobar el cálculo y revisar qué tan bien representa la realidad.
        </p>
        </div>
      </details>

      <main className="main" id="contenido" tabIndex={-1}>{current.el}</main>

      <footer className="footer">
        Datos: SPARC (Lelli, McGaugh y Schombert, 2016) y Pantheon+ (Scolnic et al., 2022; Brout et al., 2022). El código Python que usamos aquí es el mismo que revisamos con las pruebas de física del repositorio.
      </footer>
    </>
  );
}
