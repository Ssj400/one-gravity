// Tema: oscuro (espacial) por defecto; "modo informe" claro para exportar figuras
// que se imprimen en papel. Las dos paletas categóricas están validadas (dataviz).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "dark" | "light";

export type Colors = {
  blue: string; orange: string; aqua: string; yellow: string; violet: string;
  ink: string; muted: string; grid: string; obs: string; surface: string;
};

export const PALETTES: Record<Mode, Colors> = {
  dark: {
    blue: "#3987e5", orange: "#d95926", aqua: "#199e70", yellow: "#c98500", violet: "#9085e9",
    ink: "#f0efec", muted: "#c3c2b7", grid: "rgba(195,194,183,0.14)", obs: "#a9a8a0", surface: "rgba(0,0,0,0)",
  },
  light: {
    blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100", violet: "#6250d6",
    ink: "#0b0b0b", muted: "#52514e", grid: "#e6e5e1", obs: "#6b6a66", surface: "#fcfcfb",
  },
};

const ThemeCtx = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({ mode: "dark", setMode: () => {} });

function stored(): Mode {
  try { return localStorage.getItem("theme") === "light" ? "light" : "dark"; } catch { return "dark"; }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(stored);
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem("theme", mode); } catch { /* sin almacenamiento: no pasa nada */ }
  }, [mode]);
  return <ThemeCtx.Provider value={{ mode, setMode }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

export function useColors(): Colors {
  return PALETTES[useContext(ThemeCtx).mode];
}
