import { useState } from "react";
import { useCompute } from "../engine";
import { Plot } from "../components/Plot";
import { fmt, fmtAuto } from "../format";
import { useColors } from "../theme";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";
import { Story, Takeaway } from "../components/Story";

type GalaxyResult = {
  distance_mpc: number; r: number[]; v_obs: number[]; v_err: number[]; v_vis: number[]; v_halo: number[]; v_tot: number[];
  r_core: number; v_inf: number; chi2: number; n: number; m_dyn: number; m_vis: number; r_last: number;
};

const fmtMass = (m: number) => `${fmt(m / 1e10, 1)} × 10¹⁰ M☉`;

export function Galaxy() {
  const C = useColors();
  const [upsDisk, setUpsDisk] = useState(0.5);
  const [upsBulge, setUpsBulge] = useState(0.7);
  const [rCore, setRCore] = useState(3);
  const [vInf, setVInf] = useState(150);
  const [fit, setFit] = useState(true);
  const { result, error, busy } = useCompute<GalaxyResult>("galaxy", { ups_disk: upsDisk, ups_bulge: upsBulge, r_core: rCore, v_inf: vInf, fit });

  return (
    <section>
      <Story
        question="¿Alcanza la materia que vemos para explicar cómo gira una galaxia?"
        did={<>Usamos NGC 3198, una galaxia espiral a {fmtAuto(result?.distance_mpc ?? 13.8)} Mpc, y las mediciones de SPARC. Su curva de rotación muestra la velocidad del gas a distintas distancias del centro. Comparamos esos datos con el aporte del gas y las estrellas, y con un modelo que agrega un halo: una distribución extendida de materia oscura. Aquí calculamos velocidades, sin avanzar órbitas en el tiempo.</>}
        found={<>En las regiones exteriores, las velocidades observadas se mantienen cerca de 150 km/s. Con los parámetros iniciales, la materia visible predice unos 65 km/s y agregar un halo mejora el acuerdo. Bajo los supuestos elegidos estimamos que {result ? `${fmt(100 * (1 - result.m_vis / result.m_dyn), 0)} %` : "alrededor del 81 %"} de la masa dentro de {result ? fmt(result.r_last, 0) : "44"} kpc sería oscura. Esa cifra cambia con el cociente masa-luz que elijas.</>}
      />
      <p className="note">El cociente masa-luz Υ permite convertir la luz de las estrellas en masa; M☉ y L☉ representan la masa y la luminosidad del Sol. Un kpc equivale a mil pársecs y un Mpc, a un millón. El halo tiene un radio central r_c y una velocidad límite v_∞. NGC 3198 no tiene bulbo, por lo que ese control no cambia el resultado.</p>
      <Controls>
        <Slider label="Masa-luz del disco Υ (M☉/L☉)" value={upsDisk} min={0.1} max={1.5} step={0.05} onChange={setUpsDisk} />
        <Slider label="Masa-luz del bulbo Υ (M☉/L☉)" value={upsBulge} min={0.1} max={1.5} step={0.05} onChange={setUpsBulge} />
        <label className="slider"><span className="slider-label">Ajustar el halo automáticamente</span><input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} /></label>
        {!fit && <Slider label="Radio central del halo r_c" value={rCore} min={0.5} max={20} step={0.1} unit=" kpc" onChange={setRCore} />}
        {!fit && <Slider label="Velocidad límite del halo v_∞" value={vInf} min={50} max={300} step={1} unit=" km/s" onChange={setVInf} />}
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 3. Rotación de NGC 3198: datos de SPARC con sus incertidumbres y aportes calculados. Usamos Υ_disco = {fmtAuto(upsDisk)} y un halo con r_c = {fmt(result.r_core, 1)} kpc y v_∞ = {fmt(result.v_inf, 0)} km/s, {fit ? "ajustado automáticamente" : "elegido con los controles"}. Compara la curva de materia visible con la suma de visible y halo para revisar el acuerdo con las observaciones.</>}>
              <Plot filename="fig3_curva_rotacion_ngc3198" data={[
                { x: result.r, y: result.v_obs, error_y: { type: "data", array: result.v_err, visible: true, color: C.obs, thickness: 1, width: 3 }, type: "scatter", mode: "markers", name: "observada (SPARC)", marker: { color: C.obs, size: 7 } },
                { x: result.r, y: result.v_vis, type: "scatter", mode: "lines", name: "materia visible", line: { color: C.orange, width: 2 } },
                { x: result.r, y: result.v_halo, type: "scatter", mode: "lines", name: "halo oscuro", line: { color: C.aqua, width: 2, dash: "dash" } },
                { x: result.r, y: result.v_tot, type: "scatter", mode: "lines", name: "visible + halo", line: { color: C.blue, width: 2.5 } },
              ]} layout={{ xaxis: { title: { text: "radio (kpc)" }, rangemode: "tozero" }, yaxis: { title: { text: "velocidad circular (km/s)" }, rangemode: "tozero" } }} height={440} />
            </Figure>
            <div>
              <table className="table">
                <tbody>
                  <tr><th>Halo: r_c</th><td>{fmt(result.r_core, 2)} kpc</td></tr>
                  <tr><th>Halo: v_∞</th><td>{fmt(result.v_inf, 1)} km/s</td></tr>
                  <tr><th>χ² / (N − 2)</th><td>{fmt(result.chi2 / (result.n - 2), 2)}</td></tr>
                  <tr><th>Masa dinámica dentro de {fmt(result.r_last, 1)} kpc</th><td>{fmtMass(result.m_dyn)}</td></tr>
                  <tr><th>Masa visible dentro de {fmt(result.r_last, 1)} kpc</th><td>{fmtMass(result.m_vis)}</td></tr>
                  <tr><th>Fracción oscura</th><td>{fmt(100 * (1 - result.m_vis / result.m_dyn), 0)} %</td></tr>
                </tbody>
              </table>
              <p className="note">
                Si aproximamos la masa como esférica y el movimiento como circular, M(&lt;r) ≈ v²r/G: estimamos la masa encerrada dentro del radio r a partir de la velocidad v. La galaxia tiene un disco, así que esta aproximación limita el resultado. χ² resume las diferencias con los datos considerando sus incertidumbres; N es el número de mediciones. El denominador N − 2 corresponde al ajuste de los dos parámetros del halo, no a su elección manual.
              </p>
            </div>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>La pregunta era si la materia visible alcanza. Con el cociente masa-luz inicial, su aporte queda por debajo de las velocidades exteriores observadas. El halo permite acercarnos a ellas. Este tipo de diferencia, estudiada también en Andrómeda por Rubin y Ford (1970), es una de las evidencias de materia oscura.</p>
        <p>Pero ajustar un halo no responde qué es esa materia ni descarta una descripción distinta de la gravedad, como MOND. No la implementamos. Para avanzar necesitamos otras evidencias, como las lentes gravitacionales y el Cúmulo Bala. Además, la fracción estimada corresponde a esta galaxia y a nuestros supuestos, no a todo el Universo.</p>
      </Takeaway>
    </section>
  );
}
