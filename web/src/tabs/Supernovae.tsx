import { useState } from "react";
import type { Data } from "plotly.js";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { useColors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { PRESETS } from "./Universe";

type ModelRow = { name: string; om: number; ol: number; z: number[]; mu: number[]; res: number[]; chi2: number; delta: number };
type Bin = { z: number; res: number; err: number; n: number };
type SnResult = { n: number; data: { z: number[]; mu: number[]; err: number[]; res: number[] }; bins: Bin[]; models: ModelRow[] };

export function Supernovae() {
  const C = useColors();
  const [h0, setH0] = useState(67.4);
  const [om, setOm] = useState(0.31);
  const [ol, setOl] = useState(0.69);
  const [showErr, setShowErr] = useState(false);
  const models = [...PRESETS.map(({ name, om, ol }) => ({ name, om, ol })), { name: `Personalizado (Ωm = ${om}, ΩΛ = ${ol})`, om, ol }];
  const { result, error, busy } = useCompute<SnResult>("supernovae", { models, h0 });
  const colors = [...PRESETS.map((p) => C[p.color]), C.violet];

  return (
    <section>
      <p className="lead">
        Las supernovas Ia son candelas estándar: su brillo aparente da su distancia. Su corrimiento al rojo dice cuánto se estiró el Universo desde que salió la luz. Cada universo predice una curva distinta; solo el acelerado reproduce las {result?.n ?? "1.500"} supernovas de Pantheon+.
      </p>
      <Controls>
        <Slider label="H₀ (km/s/Mpc)" value={h0} min={60} max={80} step={0.1} onChange={setH0} />
        <Slider label="Ωm (personalizado)" value={om} min={0} max={2} step={0.01} onChange={setOm} />
        <Slider label="ΩΛ (personalizado)" value={ol} min={0} max={1.2} step={0.01} onChange={setOl} />
        <label className="slider"><span className="slider-label">Barras de error</span><input type="checkbox" checked={showErr} onChange={(e) => setShowErr(e.target.checked)} /></label>
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2 stack-figures">
            <Figure caption={<>Figura 7. Diagrama de Hubble: módulo de distancia μ contra corrimiento al rojo z para {result.n} supernovas Ia de Pantheon+ (gris) y los modelos. Cada curva está desplazada por su mejor δ (ver tabla), que absorbe la calibración absoluta de las supernovas.</>}>
              <Plot filename="fig7_diagrama_hubble" data={[
                {
                  x: result.data.z, y: result.data.mu, type: "scatter", mode: "markers", name: "Pantheon+ (datos)",
                  marker: { color: C.obs, size: 4, opacity: 0.45 },
                  error_y: { type: "data", array: result.data.err, visible: showErr, color: C.obs, thickness: 0.6, width: 0 },
                },
                ...result.models.map((m, i): Data => ({
                  x: m.z, y: m.mu, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === 4 ? 1.5 : 2, dash: i === 4 ? "dash" : "solid" },
                })),
              ]} layout={{ xaxis: { title: { text: "corrimiento al rojo z" }, type: "log" }, yaxis: { title: { text: "módulo de distancia μ (mag)" }, range: [32, 46] } }} height={420} />
            </Figure>
            <Figure caption={<>Figura 7b. Lo mismo, como residuos respecto a un universo vacío (Ωm = ΩΛ = 0, línea cero). Puntos: promedio ponderado de los datos en bins de z, con su error. Las supernovas lejanas son más tenues (Δμ &gt; 0) que en cualquier universo de solo materia: la expansión se acelera.</>}>
              <Plot filename="fig7b_residuos_hubble" data={[
                { x: result.data.z, y: result.data.res, type: "scatter", mode: "markers", name: "Pantheon+ (cada supernova)", marker: { color: C.obs, size: 3, opacity: 0.18 }, hoverinfo: "skip" },
                { x: result.bins.map((b) => b.z), y: result.bins.map((b) => b.res), error_y: { type: "data", array: result.bins.map((b) => b.err), visible: true, color: C.ink, thickness: 1.2, width: 3 }, type: "scatter", mode: "markers", name: "Pantheon+ (promedio por bin)", marker: { color: C.ink, size: 8 }, text: result.bins.map((b) => `${b.n} SNe`) },
                ...result.models.map((m, i): Data => ({
                  x: m.z, y: m.res, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === 4 ? 1.5 : 2, dash: i === 4 ? "dash" : "solid" },
                })),
              ]} layout={{ xaxis: { title: { text: "corrimiento al rojo z" }, type: "log" }, yaxis: { title: { text: "Δμ respecto al universo vacío (mag)" }, range: [-1, 0.6], zeroline: true, zerolinecolor: C.muted, zerolinewidth: 1 } }} height={420} />
            </Figure>
            <div>
              <table className="table">
                <thead><tr><th>Modelo</th><th>Ωm</th><th>ΩΛ</th><th>χ²</th><th>χ²/N</th><th>δ (mag)</th></tr></thead>
                <tbody>{result.models.map((m, i) => (
                  <tr key={m.name}>
                    <td><span className="swatch" style={{ background: colors[i] }} />{m.name}</td>
                    <td>{m.om}</td><td>{m.ol}</td>
                    <td>{m.chi2.toFixed(0)}</td><td>{(m.chi2 / result.n).toFixed(2)}</td><td>{m.delta.toFixed(3)}</td>
                  </tr>
                ))}</tbody>
              </table>
              <p className="note">
                δ es el desplazamiento constante que mejor ajusta cada modelo a los datos. Pantheon+ está calibrado con Cefeidas de SH0ES (H₀ ≈ 73), por eso con H₀ = 67,4 sale δ ≈ −0,17 mag = −5 log₁₀(73/67,4). Solo la <em>forma</em> de μ(z) distingue los modelos. Los χ² usan errores diagonales (solo para comparar; un ajuste publicable usa la covarianza completa).
              </p>
            </div>
          </div>
        )}
      </Outcome>
    </section>
  );
}
