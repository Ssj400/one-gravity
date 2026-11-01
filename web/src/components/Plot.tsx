import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js";
import { useColors, useTheme } from "../theme";
import type { Colors } from "../theme";

export function baseLayout(c: Colors): Partial<Layout> {
  const axis = { gridcolor: c.grid, zerolinecolor: c.grid, linecolor: c.muted, tickcolor: c.muted, ticks: "outside" as const, ticklen: 4, color: c.ink };
  return {
    font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', size: 13, color: c.ink },
    paper_bgcolor: c.surface,
    plot_bgcolor: c.surface,
    margin: { l: 64, r: 16, t: 40, b: 56 },
    hovermode: "closest",
    hoverlabel: { font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } },
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
  const [compact, setCompact] = useState(false);
  const colors = useColors();
  const { mode } = useTheme();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 480));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bottom = compact ? Math.max(140, data.length * 21 + 95) : 56;
    const responsiveLayout = compact ? {
      margin: { l: 56, r: 12, t: 40, b: bottom },
      legend: { orientation: "h" as const, y: -0.38, yanchor: "top" as const, x: 0, font: { size: 11, color: colors.ink } },
    } : {};
    void Plotly.react(el, data, merge(baseLayout(colors), { ...layout, ...responsiveLayout, height: height + bottom - 56 }), {
      responsive: true,
      displaylogo: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
      toImageButtonOptions: { format: "png", filename, width: 1400, height: 900, scale: 2 },
    });
  }, [data, layout, filename, height, colors, mode, compact]);
  useEffect(() => () => void (ref.current && Plotly.purge(ref.current)), []);
  return <div ref={ref} className="plot" />;
}
