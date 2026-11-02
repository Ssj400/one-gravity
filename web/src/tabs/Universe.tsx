import { useState } from "react";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { fmt, fmtAuto } from "../format";
import { useColors, type Colors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { Story, Takeaway } from "../components/Story";

type Model = { name: string; om: number; ol: number };
type UniverseRow = Model & { t: number[]; a: number[]; age: number; age_exact: number | null; recollapses: boolean };

export const PRESETS: (Model & { color: keyof Colors; fate: string })[] = [
  { name: "Recolapso (Ωm = 5)", om: 5, ol: 0, color: "orange", fate: "La expansión se detiene y se invierte" },
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
  // La curva personalizada solo se muestra cuando difiere de los cuatro presets.
  const customIsPreset = PRESETS.some((p) => p.om === om && p.ol === ol);
  const custom: Model = { name: `Personalizado (Ωm = ${fmtAuto(om)}, ΩΛ = ${fmtAuto(ol)})`, om, ol };
  const models = [...PRESETS.map(({ name, om, ol }) => ({ name, om, ol })), ...(customIsPreset ? [] : [custom])];
  const { result, error, busy } = useCompute<UniverseRow[]>("universe", { models, h0, t_future: tFuture, dt: 0.005 });
  const colors = [...PRESETS.map((p) => C[p.color]), C.violet];
  const N = PRESETS.length;

  return (
    <section>
      <Story
        question="¿Cómo cambia la expansión según el contenido del Universo?"
        did={<>Representamos su tamaño relativo con el factor de escala a, cuyo valor actual fijamos en 1. Usamos una ecuación cosmológica basada en relatividad general: la materia frena la expansión y una constante cosmológica positiva puede acelerarla. Con el integrador leapfrog calculamos hacia el pasado y el futuro cuatro escenarios y uno que puedes modificar.</>}
        found={<>Con H₀ = 67,4 km/s/Mpc, los escenarios crítico, abierto y acelerado tienen edades de 9,67, 11,7 y 13,86 mil millones de años. El último se acerca a los 13,8 inferidos por Planck. El escenario con más materia termina invirtiendo su expansión. No fijamos una edad que todos deban cumplir: la obtenemos de los parámetros elegidos.</>}
      />
      <p className="note">H₀ describe la expansión actual. Ωm representa la densidad de materia y ΩΛ la de una constante cosmológica, con la que modelamos la energía oscura; ambas se comparan con la densidad crítica, asociada a una geometría plana. Gyr significa mil millones de años y Mpc, un millón de pársecs. Aquí ignoramos la radiación, por lo que el modelo no describe las primeras etapas del Universo.</p>
      <Controls>
        <Slider label="H₀ (km/s/Mpc)" value={h0} min={60} max={80} step={0.1} onChange={setH0} />
        <Slider label="Materia Ωm (personalizado)" value={om} min={0} max={5} step={0.01} onChange={setOm} />
        <Slider label="Energía oscura ΩΛ (personalizado)" value={ol} min={0} max={1.5} step={0.01} onChange={setOl} />
        <Slider label="Futuro simulado" value={tFuture} min={5} max={60} step={5} unit=" Gyr" onChange={setTFuture} />
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 4. Factor de escala a(t) para cuatro escenarios, con H₀ = {fmt(h0, 1)} km/s/Mpc. Todos pasan por a = 1 hoy. Compara cuánto tiempo ha transcurrido desde el inicio de cada expansión y cómo cambia hacia el futuro; si cambias Ωm o ΩΛ, la curva personalizada aparece discontinua.</>}>
              <Plot filename="fig4_factor_escala" data={result.map((m, i) => ({
                x: m.t, y: m.a, type: "scatter", mode: "lines", name: m.name, line: { color: colors[i], width: i === N ? 1.5 : 2, dash: i === N ? "dash" : "solid" },
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
                La edad numérica se obtiene avanzando en pasos pequeños; la exacta usa una fórmula conocida cuando está disponible. Compararlas permite comprobar el cálculo, no contrastarlo por sí solo con observaciones. Las estrellas antiguas aportan otra referencia: Valcin et al. (2020) estiman unos 13,3 Gyr para los cúmulos globulares más antiguos, con incertidumbres importantes. El Universo debe ser más viejo que sus estrellas.
              </p>
            </div>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>Reutilizar el integrador de las órbitas no convierte la cosmología en un problema de Newton. Cambiamos la ecuación y la variable que avanzamos: aquí calculamos el factor de escala. Las soluciones conocidas permiten revisar ese cálculo, mientras que las edades de estrellas y otras observaciones ayudan a evaluar el modelo.</p>
        <p>Prueba cambiar H₀ de 67,4 a 73 manteniendo la mezcla acelerada: su edad baja de 13,86 a unos 12,8 Gyr. Es una consecuencia de la tensión de Hubble, la diferencia entre valores inferidos con el fondo cósmico de microondas y con la escalera de distancias. El control permite visualizarla, no resolverla.</p>
      </Takeaway>
    </section>
  );
}
