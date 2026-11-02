import { useState } from "react";
import type { Data } from "plotly.js";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { fmt, fmtAuto } from "../format";
import { useColors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { Story, Takeaway } from "../components/Story";
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
  // La curva personalizada solo se muestra cuando difiere de los cuatro presets.
  const customIsPreset = PRESETS.some((p) => p.om === om && p.ol === ol);
  const custom = { name: `Personalizado (Ωm = ${fmtAuto(om)}, ΩΛ = ${fmtAuto(ol)})`, om, ol };
  const models = [...PRESETS.map(({ name, om, ol }) => ({ name, om, ol })), ...(customIsPreset ? [] : [custom])];
  const { result, error, busy } = useCompute<SnResult>("supernovae", { models, h0 });
  const colors = [...PRESETS.map((p) => C[p.color]), C.violet];
  const N = PRESETS.length;

  return (
    <section>
      <Story
        question="¿Qué historia de expansión se acerca más a las observaciones?"
        did={<>Las supernovas de tipo Ia permiten estimar distancias al estandarizar su luminosidad con sus curvas de luz; no todas brillan igual. El corrimiento al rojo z mide cuánto se estiró la luz desde su emisión. Calculamos el brillo esperado en cada escenario y lo comparamos con {result ? fmt(result.n, 0) : "1.580"} mediciones de Pantheon+, excluyendo las calibradoras y exigiendo z &gt; 0,01. Son filas de datos, que pueden incluir un mismo objeto.</>}
        found={<>Entre los cuatro escenarios de referencia, el acelerado obtiene el menor χ²{result ? ` (${fmt(result.models[3].chi2, 0)}, frente a ${fmt(result.models[2].chi2, 0)} del abierto y ${fmt(result.models[1].chi2, 0)} del crítico)` : ""}. Ese valor resume las diferencias con los datos considerando sus incertidumbres: con el mismo procedimiento, menor χ² indica mejor acuerdo. La comparación ilustra la evidencia de expansión acelerada, sin reemplazar el análisis completo de Pantheon+.</>}
      />
      <p className="note">El módulo de distancia μ relaciona el brillo con la distancia: un valor mayor corresponde a una distancia mayor. H₀ describe la expansión actual, en km/s por megapársec (Mpc). En el modelo personalizado, Ωm y ΩΛ representan las densidades de materia y de una constante cosmológica, comparadas con la densidad crítica.</p>
      <Controls>
        <Slider label="H₀ (km/s/Mpc)" value={h0} min={60} max={80} step={0.1} onChange={setH0} />
        <Slider label="Materia Ωm (personalizado)" value={om} min={0} max={2} step={0.01} onChange={setOm} />
        <Slider label="Energía oscura ΩΛ (personalizado)" value={ol} min={0} max={1.2} step={0.01} onChange={setOl} />
        <label className="slider"><span className="slider-label">Mostrar incertidumbres individuales</span><input type="checkbox" checked={showErr} onChange={(e) => setShowErr(e.target.checked)} /></label>
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2 stack-figures">
            <Figure caption={<>Figura 5a. Diagrama de Hubble con {fmt(result.n, 0)} mediciones de Pantheon+: módulo de distancia μ frente al corrimiento al rojo z. Comparamos los datos con cuatro escenarios y el personalizado. Cada curva lleva un desplazamiento constante δ, elegido para ajustar la calibración del brillo.</>}>
              <Plot filename="fig5a_diagrama_hubble" data={[
                {
                  x: result.data.z, y: result.data.mu, type: "scatter", mode: "markers", name: "Pantheon+ (datos)",
                  marker: { color: C.obs, size: 4, opacity: 0.45 },
                  error_y: { type: "data", array: result.data.err, visible: showErr, color: C.obs, thickness: 0.6, width: 0 },
                },
                ...result.models.map((m, i): Data => ({
                  x: m.z, y: m.mu, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === N ? 1.5 : 2, dash: i === N ? "dash" : "solid" },
                })),
              ]} layout={{ xaxis: { title: { text: "corrimiento al rojo z" }, type: "log" }, yaxis: { title: { text: "módulo de distancia μ (mag)" }, range: [32, 46] } }} height={420} />
            </Figure>
            <Figure caption={<>Figura 5b. Diferencias respecto de un universo vacío de referencia (Ωm = ΩΛ = 0), representado por la línea cero. Agrupamos los datos por intervalos de z y mostramos su promedio ponderado con incertidumbres. Restar la referencia hace más visible la separación entre curvas, pero no agrega una prueba estadística.</>}>
              <Plot filename="fig5b_residuos_hubble" data={[
                { x: result.data.z, y: result.data.res, type: "scatter", mode: "markers", name: "Pantheon+ (cada medición)", marker: { color: C.obs, size: 3, opacity: 0.18 }, hoverinfo: "skip" },
                { x: result.bins.map((b) => b.z), y: result.bins.map((b) => b.res), error_y: { type: "data", array: result.bins.map((b) => b.err), visible: true, color: C.ink, thickness: 1.2, width: 3 }, type: "scatter", mode: "markers", name: "Pantheon+ (promedio por intervalo)", marker: { color: C.ink, size: 8 }, text: result.bins.map((b) => `${b.n} mediciones`) },
                ...result.models.map((m, i): Data => ({
                  x: m.z, y: m.res, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === N ? 1.5 : 2, dash: i === N ? "dash" : "solid" },
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
                    <td>{fmt(m.chi2, 0)}</td><td>{fmt(m.chi2 / result.n, 2)}</td><td>{fmt(m.delta, 3)}</td>
                  </tr>
                ))}</tbody>
              </table>
              <p className="note">
                δ es el desplazamiento vertical que mejor ajusta cada curva. Las distancias usadas están calibradas con Cefeidas de SH0ES, con H₀ cercano a 73; al usar 67,4 esperamos una diferencia de calibración de unos −0,17 mag. El ajuste también depende de la forma del modelo. Como dejamos libre δ, comparamos sobre todo la <em>forma</em> de las curvas, no medimos H₀ de manera independiente. Usamos incertidumbres individuales sin sus correlaciones: cómo se relacionan los errores entre mediciones.
              </p>
            </div>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>A fin de cuentas, el recorrido conecta dos tareas: comprobar lo que calcula un programa y comparar sus predicciones con observaciones. Kepler nos dio una referencia conocida; NGC 3198 permitió revisar el aporte de la materia visible; las supernovas permiten contrastar distintas historias de expansión.</p>
        <p>El escenario acelerado sigue mejor estos datos entre los modelos de referencia elegidos. Eso no demuestra qué es la energía oscura ni descarta todas las alternativas. Las distancias requieren relatividad general y el análisis completo debe considerar las correlaciones de los errores. La herramienta ayuda a seguir el razonamiento, no sustituye esa investigación.</p>
      </Takeaway>
    </section>
  );
}
