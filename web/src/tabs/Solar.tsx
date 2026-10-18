import { useState } from "react";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { useColors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";

type Orbit = { t: number[]; x: number[]; y: number[]; energy_err: number[]; r_final: number };
type SolarResult = { a: number; e: number; planet: string; leapfrog: Orbit; euler: Orbit };
type KeplerRow = { planet: string; a: number; e: number; T: number; ratio: number };

const PLANETS = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];

export function Solar() {
  const C = useColors();
  const [planet, setPlanet] = useState("Tierra");
  const [years, setYears] = useState(5);
  const [dtExp, setDtExp] = useState(-2); // dt = 10^dtExp años
  const dt = Math.pow(10, dtExp);
  const { result, error, busy } = useCompute<SolarResult>("solar", { planet, years, dt });
  const k3 = useCompute<KeplerRow[]>("kepler3", {});

  return (
    <section>
      <p className="lead">
        Un mismo motor integra la órbita con dos métodos. Euler (naranja) inventa energía en cada paso y la órbita se abre en espiral; leapfrog (azul) la conserva. Las tres leyes de Kepler aparecen sin estar programadas.
      </p>
      <Controls>
        <label className="slider"><span className="slider-label">Planeta</span>
          <select value={planet} onChange={(e) => setPlanet(e.target.value)}>{PLANETS.map((p) => <option key={p}>{p}</option>)}</select>
        </label>
        <Slider label="Años simulados" value={years} min={1} max={50} step={1} unit=" a" onChange={setYears} />
        <Slider label="Paso Δt = 10^x años" value={dtExp} min={-4} max={-1} step={0.5} onChange={setDtExp} />
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 1a. Órbita de {result.planet} durante {years} años con Δt = {dt} a. Euler termina a {result.euler.r_final.toFixed(2)} UA; leapfrog a {result.leapfrog.r_final.toFixed(4)} UA.</>}>
              <Plot filename={`fig1a_orbita_${planet}`} data={[
                { x: result.euler.x, y: result.euler.y, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 1.5 } },
                { x: result.leapfrog.x, y: result.leapfrog.y, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
                { x: [0], y: [0], type: "scatter", mode: "markers", name: "Sol", marker: { color: C.yellow, size: 12 } },
              ]} layout={{ xaxis: { title: { text: "x (UA)" }, scaleanchor: "y" }, yaxis: { title: { text: "y (UA)" } } }} height={420} />
            </Figure>
            <Figure caption={<>Figura 1b. Error relativo de energía, (E − E₀)/|E₀|. Euler crece sin límite; leapfrog oscila acotado.</>}>
              <Plot filename={`fig1b_energia_${planet}`} data={[
                { x: result.euler.t, y: result.euler.energy_err, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 2 } },
                { x: result.leapfrog.t, y: result.leapfrog.energy_err, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
              ]} layout={{ xaxis: { title: { text: "tiempo (años)" } }, yaxis: { title: { text: "error relativo de energía" }, type: "log", exponentformat: "power" } }} height={420} />
            </Figure>
          </div>
        )}
      </Outcome>
      <h3>Tercera ley de Kepler: T² = a³</h3>
      <Outcome error={k3.error} busy={k3.busy}>
        {k3.result && (
          <div className="grid2">
            <Figure caption="Figura 2. Período medido contra semieje mayor (ejes logarítmicos). La recta de pendiente 3/2 es la tercera ley; los puntos son los períodos medidos en la simulación.">
              <Plot filename="fig2_kepler3" data={[
                { x: [0.3, 40], y: [Math.pow(0.3, 1.5), Math.pow(40, 1.5)], type: "scatter", mode: "lines", name: "T = a^(3/2)", line: { color: C.muted, width: 1.5, dash: "dot" } },
                { x: k3.result.map((r) => r.a), y: k3.result.map((r) => r.T), text: k3.result.map((r) => r.planet), type: "scatter", mode: "text+markers", textposition: "top left", name: "simulación", marker: { color: C.blue, size: 9 } },
              ]} layout={{ xaxis: { title: { text: "a (UA)" }, type: "log", range: [Math.log10(0.2), Math.log10(50)] }, yaxis: { title: { text: "T (años)" }, type: "log", range: [Math.log10(0.1), Math.log10(400)] } }} />
            </Figure>
            <table className="table">
              <thead><tr><th>Planeta</th><th>a (UA)</th><th>e</th><th>T medido (a)</th><th>T²/a³</th></tr></thead>
              <tbody>{k3.result.map((r) => (
                <tr key={r.planet}><td>{r.planet}</td><td>{r.a}</td><td>{r.e}</td><td>{r.T.toFixed(4)}</td><td>{r.ratio.toFixed(5)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Outcome>
    </section>
  );
}
