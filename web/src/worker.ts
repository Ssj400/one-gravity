// Web Worker: carga Pyodide, instala el paquete una_gravedad y atiende llamadas.
import bridgeSource from "./py/bridge.py?raw";

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

interface Pyodide {
  loadPackage(name: string): Promise<void>;
  pyimport(name: string): { call(fn: string, params: string): string; set_data(name: string, text: string): void };
  runPython(code: string): unknown;
  FS: { mkdirTree(path: string): void; writeFile(path: string, data: string): void };
}

export type Request = { id: number; fn: string; params: unknown };
export type Response =
  | { id: number; ok: true; result: unknown }
  | { id: number; ok: false; pending?: string; error: string }
  | { id: -1; status: string; ready?: boolean };

let bridge: ReturnType<Pyodide["pyimport"]> | null = null;
let baseUrl = "./";

function status(text: string, ready = false) {
  (self as unknown as Worker).postMessage({ id: -1, status: text, ready } satisfies Response);
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch(baseUrl + path);
  if (!res.ok) throw new Error(`No se pudo leer ${path} (${res.status})`);
  return res.text();
}

async function init(): Promise<void> {
  status("Cargando Python (Pyodide)…");
  const mod = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
  const py: Pyodide = await mod.loadPyodide({ indexURL: PYODIDE_URL });
  status("Cargando numpy…");
  await py.loadPackage("numpy");

  status("Instalando una_gravedad…");
  const manifest = JSON.parse(await fetchText("py/manifest.json")) as { package: string[]; overrides: boolean };
  py.FS.mkdirTree("/app/una_gravedad");
  for (const rel of manifest.package) py.FS.writeFile(`/app/${rel}`, await fetchText(`py/${rel}`));
  py.FS.writeFile("/app/bridge.py", bridgeSource);
  if (manifest.overrides) py.FS.writeFile("/app/_overrides.py", await fetchText("py/_overrides.py"));
  py.runPython("import sys; sys.path.insert(0, '/app')");
  if (manifest.overrides) py.runPython("import _overrides");
  bridge = py.pyimport("bridge");

  status("Leyendo datos…");
  bridge.set_data("sparc", await fetchText("data/NGC3198_rotmod.dat"));
  bridge.set_data("pantheon", await fetchText("data/Pantheon+SH0ES.dat"));
  status("Listo", true);
}

let ready: Promise<void> | null = null;

self.onmessage = async (ev: MessageEvent<Request | { init: string }>) => {
  if ("init" in ev.data) {
    baseUrl = ev.data.init;
    ready = init().catch((e) => {
      status(`Error al iniciar: ${String(e)}`);
      throw e;
    });
    return;
  }
  const { id, fn, params } = ev.data;
  try {
    await ready;
    const out = bridge!.call(fn, JSON.stringify(params));
    (self as unknown as Worker).postMessage({ id, ok: true, result: JSON.parse(out) } satisfies Response);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const m = /NotImplementedError: (.*)/.exec(msg);
    (self as unknown as Worker).postMessage({ id, ok: false, pending: m?.[1]?.trim(), error: msg } satisfies Response);
  }
};
