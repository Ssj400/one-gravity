import { useState } from "react";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { fmt, fmtAuto } from "../format";
import { useColors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { Story, Takeaway } from "../components/Story";

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
      <Story
        question="¿Podemos confiar en lo que calcula el simulador?"
        did={<>Pusimos el Sol y un planeta, con la fuerza de Newton y nada más: ninguna ley de Kepler está programada. Avanzamos el tiempo de dos maneras, con Euler (el método ingenuo) y con leapfrog (el que conserva la energía), y medimos el período de los ocho planetas.</>}
        found={<>Con Euler la Tierra se escapa del Sol en cinco años: el método inventa energía en cada paso. Con leapfrog la órbita se cierra y las tres leyes de Kepler aparecen solas: T²/a³ = 1 para los ocho planetas, con error menor que 0,1 %.</>}
      />
      <section className="methods" aria-label="Los dos métodos">
        <p className="story-label">Cómo se avanza el tiempo</p>
        <p>
          El computador no puede seguir la órbita de forma continua: la corta en pasos pequeños de duración Δt y, en cada uno, usa la fuerza de Newton para decidir dónde estará el planeta un instante después. Todo el problema es cómo dar ese paso.
        </p>
        <div className="methods-cols">
          <div>
            <h3>Euler (el método ingenuo)</h3>
            <p className="method-formula">r<sub>nuevo</sub> = r + v·Δt<br />v<sub>nuevo</sub> = v + a(r)·Δt</p>
            <p>Mueve el planeta con la velocidad que tenía al inicio del paso y después corrige la velocidad. Como la velocidad es tangente a la órbita, cada paso sale un poco hacia afuera. El error no se compensa: se acumula, y la órbita se abre en espiral.</p>
          </div>
          <div>
            <h3>Leapfrog (patada, avance, patada)</h3>
            <p className="method-formula">v<sub>½</sub> = v + a(r)·Δt/2<br />r<sub>nuevo</sub> = r + v<sub>½</sub>·Δt<br />v<sub>nuevo</sub> = v<sub>½</sub> + a(r<sub>nuevo</sub>)·Δt/2</p>
            <p>Media patada a la velocidad, avance completo con esa velocidad intermedia, y la otra media patada con la fuerza en la posición nueva. El paso es simétrico: hecho al revés se deshace solo. Por eso el error de energía no crece, oscila, y la órbita se cierra. Cuesta lo mismo que Euler.</p>
          </div>
        </div>
      </section>
      <Controls>
        <label className="slider"><span className="slider-label">Planeta</span>
          <select value={planet} onChange={(e) => setPlanet(e.target.value)}>{PLANETS.map((p) => <option key={p}>{p}</option>)}</select>
        </label>
        <Slider label="Años simulados" value={years} min={1} max={50} step={1} unit=" a" onChange={setYears} />
        <Slider label="Paso Δt" value={dtExp} min={-4} max={-1} step={0.5} unit=" años" format={(x) => fmtAuto(Math.pow(10, x))} onChange={setDtExp} />
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 1a. La misma órbita de {result.planet}, {years} años, paso Δt = {fmtAuto(dt)} años. La azul (leapfrog) vuelve sobre sí misma; la naranja (Euler) se abre en espiral y termina a {fmt(result.euler.r_final, 2)} UA del Sol en vez de {fmt(result.leapfrog.r_final, 2)}. Misma fuerza, mismo paso: solo cambia el orden en que se actualizan posición y velocidad.</>}>
              <Plot filename={`fig1a_orbita_${planet}`} data={[
                { x: result.euler.x, y: result.euler.y, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 1.5 } },
                { x: result.leapfrog.x, y: result.leapfrog.y, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
                { x: [0], y: [0], type: "scatter", mode: "markers", name: "Sol", marker: { color: C.yellow, size: 12 } },
              ]} layout={{ xaxis: { title: { text: "x (UA)" }, scaleanchor: "y" }, yaxis: { title: { text: "y (UA)" } } }} height={420} />
            </Figure>
            <Figure caption={<>Figura 1b. Cuánto cambió la energía de la órbita respecto a la inicial, en escala logarítmica. La de Euler crece sin parar (ya superó el 10 % en el primer año); la de leapfrog sube y baja dentro de una banda y vuelve a su valor en cada vuelta. En física la energía se conserva, así que la curva naranja mide el error del método, no algo real.</>}>
              <Plot filename={`fig1b_energia_${planet}`} data={[
                { x: result.euler.t, y: result.euler.energy_err, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 2 } },
                { x: result.leapfrog.t, y: result.leapfrog.energy_err, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
              ]} layout={{ xaxis: { title: { text: "tiempo (años)" } }, yaxis: { title: { text: "error relativo de energía" }, type: "log", exponentformat: "power" } }} height={420} />
            </Figure>
          </div>
        )}
      </Outcome>
      <h2>Las leyes de Kepler salen solas</h2>
      <p className="lead">
        Kepler las encontró en 1609 midiendo a Marte durante años. Aquí nadie las escribió: el programa solo sabe que la fuerza va como 1/r². Si el motor es correcto, deben aparecer. La primera (órbitas elípticas) y la segunda (áreas iguales) se comprueban en los tests automáticos; la tercera, que relaciona el período con el tamaño de la órbita, se ve abajo.
      </p>
      <Outcome error={k3.error} busy={k3.busy}>
        {k3.result && (
          <div className="grid2">
            <Figure caption="Figura 2. Período que tarda cada planeta simulado en dar una vuelta, contra el tamaño de su órbita, en ejes logarítmicos. La tercera ley de Kepler, T² = a³, es la recta punteada de pendiente 3/2. Los ocho puntos caen sobre ella: en años y unidades astronómicas, T²/a³ vale 1 para todos (tabla).">
              <Plot filename="fig2_kepler3" data={[
                { x: [0.3, 40], y: [Math.pow(0.3, 1.5), Math.pow(40, 1.5)], type: "scatter", mode: "lines", name: "T = a^(3/2)", line: { color: C.muted, width: 1.5, dash: "dot" } },
                { x: k3.result.map((r) => r.a), y: k3.result.map((r) => r.T), text: k3.result.map((r) => r.planet), type: "scatter", mode: "text+markers", textposition: "top left", name: "simulación", marker: { color: C.blue, size: 9 } },
              ]} layout={{ xaxis: { title: { text: "a (UA)" }, type: "log", range: [Math.log10(0.2), Math.log10(50)] }, yaxis: { title: { text: "T (años)" }, type: "log", range: [Math.log10(0.1), Math.log10(400)] } }} />
            </Figure>
            <table className="table">
              <thead><tr><th>Planeta</th><th>a (UA)</th><th>e</th><th>T medido (a)</th><th>T²/a³</th></tr></thead>
              <tbody>{k3.result.map((r) => (
                <tr key={r.planet}><td>{r.planet}</td><td>{r.a}</td><td>{r.e}</td><td>{fmt(r.T, 4)}</td><td>{fmt(r.ratio, 5)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>El Sistema Solar es la calibración del instrumento. Donde la respuesta se conoce desde hace cuatro siglos, el programa la reproduce; por eso podemos usarlo donde la respuesta no se puede comprobar a mano, en una galaxia y en el Universo entero.</p>
        <p>La espiral de Euler es la advertencia que acompaña todo lo demás: un resultado puede verse razonable y ser un error del método. Por eso cada ley física de esta página es también un test automático, y solo usamos leapfrog.</p>
      </Takeaway>
    </section>
  );
}
