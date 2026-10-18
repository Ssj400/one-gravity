import { useState } from "react";
import { useEngineStatus } from "./engine";
import { Solar } from "./tabs/Solar";
import { Galaxy } from "./tabs/Galaxy";
import { Universe } from "./tabs/Universe";
import { Supernovae } from "./tabs/Supernovae";

const TABS = [
  { id: "solar", label: "1 · Sistema Solar", el: <Solar /> },
  { id: "galaxy", label: "2 · Galaxia", el: <Galaxy /> },
  { id: "universe", label: "3 · Universo", el: <Universe /> },
  { id: "sn", label: "3b · Supernovas", el: <Supernovae /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

function tabFromHash(): TabId {
  const h = location.hash.replace("#", "");
  return TABS.some((t) => t.id === h) ? (h as TabId) : "solar";
}

export default function App() {
  const [tab, setTabState] = useState<TabId>(tabFromHash);
  const setTab = (id: TabId) => {
    history.replaceState(null, "", `#${id}`);
    setTabState(id);
  };
  const status = useEngineStatus();
  return (
    <>
      <header className="header">
        <div>
          <h1>Una sola gravedad, tres escalas</h1>
          <p className="subtitle">Un motor numérico, tres preguntas astronómicas · AST101, Tarea 2 · UC 2026</p>
        </div>
        <div className={`status ${status.ready ? "ready" : ""}`} title="El código Python corre en tu navegador con Pyodide">
          {status.ready ? "Python listo" : status.text}
        </div>
      </header>
      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </nav>
      <main className="main">{TABS.find((t) => t.id === tab)!.el}</main>
      <footer className="footer">
        Datos: SPARC (Lelli, McGaugh &amp; Schombert 2016) y Pantheon+ (Scolnic et al. 2022; Brout et al. 2022). El mismo paquete Python de este sitio pasa los tests de física en el repositorio.
      </footer>
    </>
  );
}
