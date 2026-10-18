import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js";

// Paleta categórica validada (dataviz): asignación fija por entidad, nunca por orden.
export const COLOR = {
  blue: "#2a78d6", // leapfrog · nuestro Universo · velocidad total
  orange: "#eb6834", // Euler · recolapso · materia visible
  aqua: "#1baf7a", // abierto · halo
  yellow: "#eda100", // crítico
  violet: "#6250d6", // modelo personalizado
  ink: "#0b0b0b",
  muted: "#52514e",
  grid: "#e6e5e1",
  obs: "#6b6a66", // observaciones
};

export const BASE_LAYOUT: Partial<Layout> = {
  font: { family: "Inter, system-ui, sans-serif", size: 13, color: COLOR.ink },
  paper_bgcolor: "#fcfcfb",
  plot_bgcolor: "#fcfcfb",
  margin: { l: 64, r: 16, t: 40, b: 56 },
  hovermode: "closest",
  legend: { orientation: "h", y: -0.22, x: 0, font: { size: 12 } },
  xaxis: { gridcolor: COLOR.grid, zerolinecolor: COLOR.grid, linecolor: COLOR.muted, ticks: "outside", ticklen: 4 },
  yaxis: { gridcolor: COLOR.grid, zerolinecolor: COLOR.grid, linecolor: COLOR.muted, ticks: "outside", ticklen: 4 },
};

function merge(a: Partial<Layout>, b: Partial<Layout>): Partial<Layout> {
  return { ...a, ...b, xaxis: { ...a.xaxis, ...b.xaxis }, yaxis: { ...a.yaxis, ...b.yaxis } };
}

export function Plot({ data, layout, filename, height = 380 }: { data: Data[]; layout: Partial<Layout>; filename: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    void Plotly.react(el, data, merge(BASE_LAYOUT, { ...layout, height }), {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
      toImageButtonOptions: { format: "png", filename, width: 1400, height: 900, scale: 2 },
    });
  }, [data, layout, filename, height]);
  useEffect(() => () => void (ref.current && Plotly.purge(ref.current)), []);
  return <div ref={ref} className="plot" />;
}
