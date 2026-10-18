import { useState } from "react";
import { useCompute } from "../engine";
import { COLOR, Plot } from "../components/Plot";
import { Controls, Figure, Outcome, Slider } from "../components/Controls";

type GalaxyResult = {
  distance_mpc: number; r: number[]; v_obs: number[]; v_err: number[]; v_vis: number[]; v_halo: number[]; v_tot: number[];
  r_core: number; v_inf: number; chi2: number; n: number; m_dyn: number; m_vis: number; r_last: number;
};

const fmtMass = (m: number) => `${(m / 1e10).toFixed(1)} × 10¹⁰ M☉`;

export function Galaxy() {
  const [upsDisk, setUpsDisk] = useState(0.5);
  const [upsBulge, setUpsBulge] = useState(0.7);
  const [rCore, setRCore] = useState(3);
  const [vInf, setVInf] = useState(150);
  const [fit, setFit] = useState(true);
  const { result, error, busy } = useCompute<GalaxyResult>("galaxy", { ups_disk: upsDisk, ups_bulge: upsBulge, r_core: rCore, v_inf: vInf, fit });

  return (
    <section>
      <p className="lead">
        NGC 3198, una galaxia espiral a {result?.distance_mpc ?? 13.8} Mpc (datos SPARC). La materia visible (gas + disco) predice velocidades que caen hacia afuera, como los planetas. Las medidas se mantienen planas: hace falta un halo de materia oscura.
      </p>
      <Controls>
        <Slider label="Υ disco (M☉/L☉)" value={upsDisk} min={0.1} max={1.5} step={0.05} onChange={setUpsDisk} />
        <Slider label="Υ bulbo" value={upsBulge} min={0.1} max={1.5} step={0.05} onChange={setUpsBulge} />
        <label className="slider"><span className="slider-label">Ajustar halo (χ² mínimo)</span><input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} /></label>
        {!fit && <Slider label="r_c del halo" value={rCore} min={0.5} max={20} step={0.1} unit=" kpc" onChange={setRCore} />}
        {!fit && <Slider label="v_∞ del halo" value={vInf} min={50} max={300} step={1} unit=" km/s" onChange={setVInf} />}
      </Controls>
      <Outcome error={error} busy={busy}>
        {result && (
          <div className="grid2">
            <Figure caption={<>Figura 4. Curva de rotación de NGC 3198: observada (gris, con error), materia visible con Υ_disco = {upsDisk} (naranja), halo pseudo-isotermo con r_c = {result.r_core.toFixed(1)} kpc y v_∞ = {result.v_inf.toFixed(0)} km/s (verde) y la suma en cuadratura (azul).</>}>
              <Plot filename="fig4_curva_rotacion_ngc3198" data={[
                { x: result.r, y: result.v_obs, error_y: { type: "data", array: result.v_err, visible: true, color: COLOR.obs, thickness: 1, width: 3 }, type: "scatter", mode: "markers", name: "observada (SPARC)", marker: { color: COLOR.obs, size: 7 } },
                { x: result.r, y: result.v_vis, type: "scatter", mode: "lines", name: "materia visible", line: { color: COLOR.orange, width: 2 } },
                { x: result.r, y: result.v_halo, type: "scatter", mode: "lines", name: "halo oscuro", line: { color: COLOR.aqua, width: 2, dash: "dash" } },
                { x: result.r, y: result.v_tot, type: "scatter", mode: "lines", name: "visible + halo", line: { color: COLOR.blue, width: 2.5 } },
              ]} layout={{ xaxis: { title: { text: "radio (kpc)" }, rangemode: "tozero" }, yaxis: { title: { text: "velocidad circular (km/s)" }, rangemode: "tozero" } }} height={440} />
            </Figure>
            <div>
              <table className="table">
                <tbody>
                  <tr><th>Halo: r_c</th><td>{result.r_core.toFixed(2)} kpc</td></tr>
                  <tr><th>Halo: v_∞</th><td>{result.v_inf.toFixed(1)} km/s</td></tr>
                  <tr><th>χ² / (N − 2)</th><td>{(result.chi2 / (result.n - 2)).toFixed(2)}</td></tr>
                  <tr><th>Masa dinámica dentro de {result.r_last.toFixed(1)} kpc</th><td>{fmtMass(result.m_dyn)}</td></tr>
                  <tr><th>Masa visible dentro de {result.r_last.toFixed(1)} kpc</th><td>{fmtMass(result.m_vis)}</td></tr>
                  <tr><th>Fracción oscura</th><td>{(100 * (1 - result.m_vis / result.m_dyn)).toFixed(0)} %</td></tr>
                </tbody>
              </table>
              <p className="note">
                v_c = √(G M(&lt;r)/r), así que M(&lt;r) = v² r / G. Una curva plana exige M(&lt;r) ∝ r: masa que sigue sumándose donde casi no hay luz. Sube Υ_disco para ver cuánta masa estelar haría falta sin halo.
              </p>
            </div>
          </div>
        )}
      </Outcome>
    </section>
  );
}
