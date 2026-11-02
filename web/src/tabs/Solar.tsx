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
        did={<>Comenzamos con un planeta alrededor del Sol. Calculamos su movimiento con la gravedad de Newton y dos métodos: Euler y leapfrog. No imponemos las leyes de Kepler durante el avance; las usamos después para revisar el resultado. También medimos el período de los ocho planetas.</>}
        found={<>Para la Tierra, con pasos de 0,01 años durante cinco años, Euler produce una espiral y un error de energía del 57,6 %. Con el mismo paso, leapfrog mantiene una órbita aproximadamente cerrada. En la comprobación de los ocho planetas, T²/a³ se acerca a 1 con diferencias menores que 0,1 %.</>}
      />
      <section className="methods" aria-label="Los dos métodos">
        <p className="story-label">Cómo se avanza el tiempo</p>
        <p>
          Para llevar el movimiento al computador dividimos el tiempo en pasos de duración Δt. En cada uno calculamos una posición r y una velocidad v nuevas a partir de la aceleración a(r). Ahora, ¿cómo influye la forma de dar ese paso?
        </p>
        <div className="methods-cols">
          <div>
            <h3>Euler: un paso con los valores iniciales</h3>
            <p className="method-formula">r<sub>nuevo</sub> = r + v·Δt<br />v<sub>nuevo</sub> = v + a(r)·Δt</p>
            <p>Calculamos la posición con la velocidad al inicio del paso, y la velocidad con la aceleración en esa misma posición inicial. En la prueba terrestre el error se acumula: la energía aumenta y la trayectoria se abre en espiral. Reducir Δt permite revisar cuánto depende el resultado de esa aproximación.</p>
          </div>
          <div>
            <h3>Leapfrog: medio paso, avance y medio paso</h3>
            <p className="method-formula">v<sub>½</sub> = v + a(r)·Δt/2<br />r<sub>nuevo</sub> = r + v<sub>½</sub>·Δt<br />v<sub>nuevo</sub> = v<sub>½</sub> + a(r<sub>nuevo</sub>)·Δt/2</p>
            <p>Primero actualizamos la velocidad durante medio paso. Con ella avanzamos la posición y completamos la velocidad usando la aceleración nueva. Esta secuencia es simétrica en el tiempo. Con pasos suficientemente pequeños mantiene acotado el error de energía en nuestras pruebas; no significa que el cálculo sea exacto.</p>
          </div>
        </div>
      </section>
      <Controls>
        <label className="slider"><span className="slider-label">Planeta</span>
          <select value={planet} onChange={(e) => setPlanet(e.target.value)}>{PLANETS.map((p) => <option key={p}>{p}</option>)}</select>
        </label>
        <Slider label="Tiempo simulado" value={years} min={1} max={50} step={1} unit=" años" onChange={setYears} />
        <Slider label="Paso de tiempo Δt" value={dtExp} min={-4} max={-1} step={0.5} unit=" años" format={(x) => fmtAuto(Math.pow(10, x))} onChange={setDtExp} />
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 1a. Movimiento de {result.planet} durante {years} años, con pasos de {fmtAuto(dt)} años. Euler termina a {fmt(result.euler.r_final, 2)} UA del Sol y leapfrog a {fmt(result.leapfrog.r_final, 2)} UA. Una UA es aproximadamente la distancia media entre la Tierra y el Sol. Usamos la misma fuerza y el mismo paso: la diferencia proviene del método de cálculo.</>}>
              <Plot filename={`fig1a_orbita_${planet}`} data={[
                { x: result.euler.x, y: result.euler.y, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 1.5 } },
                { x: result.leapfrog.x, y: result.leapfrog.y, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
                { x: [0], y: [0], type: "scatter", mode: "markers", name: "Sol", marker: { color: C.yellow, size: 12 } },
              ]} layout={{ xaxis: { title: { text: "x (UA)" }, scaleanchor: "y" }, yaxis: { title: { text: "y (UA)" } } }} height={420} />
            </Figure>
            <Figure caption={<>Figura 1b. Error relativo de energía en la misma simulación, en escala logarítmica. Lo comparamos con la energía inicial, que debería conservarse en este modelo. Cambia el paso de tiempo para revisar cómo responde cada método; una variación de energía aquí refleja el error numérico, no una fuerza adicional.</>}>
              <Plot filename={`fig1b_energia_${planet}`} data={[
                { x: result.euler.t, y: result.euler.energy_err, type: "scatter", mode: "lines", name: "Euler", line: { color: C.orange, width: 2 } },
                { x: result.leapfrog.t, y: result.leapfrog.energy_err, type: "scatter", mode: "lines", name: "Leapfrog", line: { color: C.blue, width: 2 } },
              ]} layout={{ xaxis: { title: { text: "tiempo (años)" } }, yaxis: { title: { text: "error relativo de energía" }, type: "log", exponentformat: "power" } }} height={420} />
            </Figure>
          </div>
        )}
      </Outcome>
      <h2>¿El movimiento respeta las leyes de Kepler?</h2>
      <p className="lead">
        Las leyes de Kepler nos dan una referencia independiente del método. Revisamos las órbitas elípticas y las áreas iguales en tiempos iguales con pruebas automáticas. Abajo comparamos la tercera ley: el período T es el tiempo de una vuelta y el semieje mayor a describe el tamaño de la órbita. Para la masa solar, usando años y UA, esperamos T²/a³ = 1.
      </p>
      <Outcome error={k3.error} busy={k3.busy}>
        {k3.result && (
          <div className="grid2">
            <Figure caption="Figura 2. Período y semieje mayor de los ocho planetas, en ejes logarítmicos. La línea punteada representa T² = a³ en años y UA. La tabla permite revisar cuánto se acerca cada resultado al valor esperado; e indica la excentricidad, es decir, cuánto se aparta la órbita de un círculo.">
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
        <p>Volvamos a la pregunta inicial: una órbita convincente en pantalla no basta para confiar en el programa. Compararla con Kepler y revisar la energía nos da razones para confiar en el cálculo dentro de las condiciones comprobadas.</p>
        <p>La espiral de Euler muestra por qué importa esa distinción. El computador puede seguir correctamente las instrucciones y aun así representar mal el movimiento. Estas pruebas ayudan a revisar el motor, pero no validan por sí solas los modelos de galaxias y del Universo.</p>
      </Takeaway>
    </section>
  );
}
