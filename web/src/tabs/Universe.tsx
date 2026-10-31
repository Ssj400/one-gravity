import { useState } from "react";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { fmt } from "../format";
import { useColors, type Colors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { Story, Takeaway } from "../components/Story";

type Model = { name: string; om: number; ol: number };
type UniverseRow = Model & { t: number[]; a: number[]; age: number; age_exact: number | null; recollapses: boolean };

export const PRESETS: (Model & { color: keyof Colors; fate: string })[] = [
  { name: "Recolapso (Ωm = 5, exagerado)", om: 5, ol: 0, color: "orange", fate: "Deja de crecer y colapsa (big crunch)" },
  { name: "Crítico (Ωm = 1)", om: 1, ol: 0, color: "yellow", fate: "Se expande por siempre, frenando hacia velocidad cero" },
  { name: "Abierto (Ωm = 0,3)", om: 0.3, ol: 0, color: "aqua", fate: "Se expande por siempre, frenando pero sin detenerse" },
  { name: "Acelerado (Ωm = 0,31, ΩΛ = 0,69)", om: 0.31, ol: 0.69, color: "blue", fate: "Se expande cada vez más rápido" },
];

export function Universe() {
  const C = useColors();
  const [h0, setH0] = useState(67.4);
  const [om, setOm] = useState(0.31);
  const [ol, setOl] = useState(0.69);
  const [tFuture, setTFuture] = useState(30);
  const custom: Model = { name: `Personalizado (Ωm = ${om}, ΩΛ = ${ol})`, om, ol };
  const models = [...PRESETS.map(({ name, om, ol }) => ({ name, om, ol })), custom];
  const { result, error, busy } = useCompute<UniverseRow[]>("universe", { models, h0, t_future: tFuture, dt: 0.005 });
  const colors = [...PRESETS.map((p) => C[p.color]), C.violet];

  return (
    <section>
      <Story
        question="¿Qué le pasa al Universo si solo actúa la gravedad? ¿Y si además hay energía oscura?"
        did={<>El tamaño del Universo cabe en un número, el factor de escala a (a = 1 hoy). Su ecuación es la de una pelota lanzada hacia arriba: la materia la frena y la energía oscura la empuja. Con el mismo integrador de los planetas corrimos cuatro universos con distinto contenido, todos con la expansión que se mide hoy, hacia el futuro y hacia atrás hasta el Big Bang.</>}
        found={<>Con solo materia la expansión frena siempre, y el Universo resulta joven: entre 6 y 12 mil millones de años según cuánta materia haya. Con energía oscura (Ωm = 0,31, ΩΛ = 0,69) acelera y tiene 13,86 mil millones de años, lo que da la fórmula exacta y lo que mide el satélite Planck. Las estrellas más viejas tienen 12–13 mil millones de años: un universo de solo materia sería más joven que sus estrellas.</>}
      />
      <Controls>
        <Slider label="H₀ (km/s/Mpc)" value={h0} min={60} max={80} step={0.1} onChange={setH0} />
        <Slider label="Ωm (personalizado)" value={om} min={0} max={5} step={0.01} onChange={setOm} />
        <Slider label="ΩΛ (personalizado)" value={ol} min={0} max={1.5} step={0.01} onChange={setOl} />
        <Slider label="Futuro simulado" value={tFuture} min={5} max={60} step={5} unit=" Gyr" onChange={setTFuture} />
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 6. Factor de escala a(t) para cinco universos, todos con la misma expansión hoy (H₀ = {h0} km/s/Mpc). Difieren solo en su contenido. Las curvas de solo materia llegan a a = 0 antes: son más jóvenes.</>}>
              <Plot filename="fig6_cuatro_universos" data={result.map((m, i) => ({
                x: m.t, y: m.a, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === 4 ? 1.5 : 2, dash: i === 4 ? "dash" : "solid" },
              }))} layout={{
                xaxis: { title: { text: "tiempo desde hoy (Gyr)" }, range: [-16, tFuture] },
                yaxis: { title: { text: "factor de escala a" }, range: [0, 4] },
                shapes: [{ type: "line", x0: 0, x1: 0, y0: 0, y1: 4, line: { color: C.muted, width: 1, dash: "dot" } }],
                annotations: [{ x: 0, y: 3.8, text: "hoy", showarrow: false, xanchor: "left", font: { color: C.muted } }],
              }} height={440} />
            </Figure>
            <div>
              <table className="table">
                <thead><tr><th>Universo</th><th>Ωm</th><th>ΩΛ</th><th>Edad numérica (Gyr)</th><th>Edad exacta (Gyr)</th><th>Destino</th></tr></thead>
                <tbody>{result.map((m, i) => (
                  <tr key={m.name}>
                    <td><span className="swatch" style={{ background: colors[i] }} />{m.name}</td>
                    <td>{m.om}</td><td>{m.ol}</td>
                    <td>{fmt(m.age, 2)}</td>
                    <td>{m.age_exact == null ? "—" : fmt(m.age_exact, 2)}</td>
                    <td>{i < 4 ? PRESETS[i].fate : m.recollapses ? "Colapsa" : "Se expande"}</td>
                  </tr>
                ))}</tbody>
              </table>
              <p className="note">
                Las edades exactas vienen de fórmulas cerradas (2/(3H₀) para el crítico; la fórmula de ΛCDM plano para el acelerado). Las estrellas más viejas, en cúmulos globulares, tienen ≈ 12–13 Gyr: un universo de solo materia con este H₀ es más joven que sus estrellas. Con H₀ = 73 (escalera de distancias) la edad de ΛCDM baja a ≈ 12,8 Gyr: la tensión de Hubble.
              </p>
            </div>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>La ecuación de la pelota y la del Universo son la misma, y por eso el mismo código resuelve las dos. También se conserva lo mismo: la "energía" de la pelota es aquí la curvatura del Universo, y el programa comprueba que no cambia, igual que comprobó la energía de la órbita.</p>
        <p>La edad es una prueba independiente de las supernovas: no usa ninguna medición de distancia, solo el contenido del Universo y la expansión de hoy. Cambia H₀ a 73 (el valor de la escalera de distancias) y la misma mezcla da 12,8 mil millones de años: esa diferencia es la tensión de Hubble, un problema abierto.</p>
      </Takeaway>
    </section>
  );
}
