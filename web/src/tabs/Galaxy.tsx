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
        did={<>Tomamos NGC 3198, una espiral a {fmtAuto(result?.distance_mpc ?? 13.8)} Mpc con su curva de rotación medida (SPARC): a qué velocidad orbita el gas a cada distancia del centro. Con la misma relación del Sistema Solar, v² = GM/r, calculamos la velocidad que producirían sus estrellas y su gas, y la comparamos con la medida.</>}
        found={<>La materia visible predice que, lejos del centro, la velocidad cae como con los planetas. La curva medida no cae: se mantiene plana en 150 km/s. Para sostenerla hace falta masa que no brilla: {result ? `${fmt(100 * (1 - result.m_vis / result.m_dyn), 0)} %` : "alrededor del 80 %"} de la masa dentro de {result ? fmt(result.r_last, 0) : "44"} kpc es oscura.</>}
      />
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
            <Figure caption={<>Figura 4. Velocidad de rotación de NGC 3198 contra la distancia al centro. Puntos grises: medida, con su error. Naranja: lo que produciría la materia visible (gas más estrellas, con Υ_disco = {fmtAuto(upsDisk)}); baja hacia afuera como en el Sistema Solar. Verde: un halo de materia oscura con r_c = {fmt(result.r_core, 1)} kpc y v_∞ = {fmt(result.v_inf, 0)} km/s, ajustado a los datos. Azul: visible más halo, que sigue la curva medida.</>}>
              <Plot filename="fig4_curva_rotacion_ngc3198" data={[
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
                v_c = √(G M(&lt;r)/r), así que M(&lt;r) = v² r / G. Una curva plana exige M(&lt;r) ∝ r: masa que sigue sumándose donde casi no hay luz. Sube Υ_disco para ver cuánta masa estelar haría falta sin halo.
              </p>
            </div>
          </div>
        )}
      </Outcome>
      <Takeaway>
        <p>Es la misma física de la primera escala. Un planeta lejano orbita lento porque toda la masa del Sol queda adentro de su órbita; una estrella lejana en NGC 3198 debería hacer lo mismo, y no lo hace. La curva plana es evidencia directa de masa que no vemos, la misma que Rubin y Ford midieron en Andrómeda en 1970.</p>
        <p>Lo que esta escala no demuestra: que esa masa sea materia oscura y no una gravedad distinta a aceleraciones muy bajas (MOND). Eso lo deciden otras evidencias, como el Cúmulo Bala y las lentes gravitacionales. El simulador aporta una pieza del argumento, no el argumento entero.</p>
      </Takeaway>
    </section>
  );
}
