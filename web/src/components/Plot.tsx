import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js";
import { useColors, useTheme } from "../theme";
import type { Colors } from "../theme";

export function baseLayout(c: Colors): Partial<Layout> {
  const axis = { gridcolor: c.grid, zerolinecolor: c.grid, linecolor: c.muted, tickcolor: c.muted, ticks: "outside" as const, ticklen: 4, color: c.ink };
  return {
    font: { family: '"IBM Plex Sans", system-ui, sans-serif', size: 13, color: c.ink },
    paper_bgcolor: c.surface,
    plot_bgcolor: c.surface,
    margin: { l: 64, r: 16, t: 40, b: 56 },
    hovermode: "closest",
    hoverlabel: { font: { family: '"IBM Plex Sans", system-ui, sans-serif' } },
    legend: { orientation: "h", y: -0.22, x: 0, font: { size: 12, color: c.ink } },
    xaxis: axis,
    yaxis: axis,
  };
}

function merge(a: Partial<Layout>, b: Partial<Layout>): Partial<Layout> {
  return { ...a, ...b, xaxis: { ...a.xaxis, ...b.xaxis }, yaxis: { ...a.yaxis, ...b.yaxis } };
}

export function Plot({ data, layout, filename, height = 380 }: { data: Data[]; layout: Partial<Layout>; filename: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const { mode } = useTheme();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    void Plotly.react(el, data, merge(baseLayout(colors), { ...layout, height }), {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
      toImageButtonOptions: { format: "png", filename, width: 1400, height: 900, scale: 2 },
    });
  }, [data, layout, filename, height, colors, mode]);
  useEffect(() => () => void (ref.current && Plotly.purge(ref.current)), []);
  return <div ref={ref} className="plot" />;
}
