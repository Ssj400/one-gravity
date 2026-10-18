// Cliente del worker: una promesa por llamada, estado de carga observable.
import { useEffect, useState } from "react";
import type { Response } from "./worker";

export class PendingError extends Error {
  readonly what: string;
  constructor(what: string) {
    super(`pendiente — ${what}`);
    this.what = what;
  }
}

type Listener = (s: { text: string; ready: boolean }) => void;

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
const waiting = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
const listeners = new Set<Listener>();
let state = { text: "Iniciando…", ready: false };
let nextId = 1;

worker.onmessage = (ev: MessageEvent<Response>) => {
  const msg = ev.data;
  if ("status" in msg) {
    state = { text: msg.status, ready: !!msg.ready };
    listeners.forEach((l) => l(state));
    return;
  }
  const w = waiting.get(msg.id);
  if (!w) return;
  waiting.delete(msg.id);
  if (msg.ok) w.resolve(msg.result);
  else w.reject(msg.pending ? new PendingError(msg.pending) : new Error(msg.error));
};

worker.postMessage({ init: new URL(import.meta.env.BASE_URL, location.href).href });

export function call<T>(fn: string, params: unknown): Promise<T> {
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    waiting.set(id, { resolve: resolve as (v: unknown) => void, reject });
    worker.postMessage({ id, fn, params });
  });
}

export function useEngineStatus() {
  const [s, setS] = useState(state);
  useEffect(() => {
    listeners.add(setS);
    setS(state);
    return () => void listeners.delete(setS);
  }, []);
  return s;
}

/** Ejecuta `fn` cada vez que cambian los parámetros (serializados). */
export function useCompute<T>(fn: string, params: unknown, enabled = true) {
  const key = JSON.stringify(params);
  const { ready } = useEngineStatus();
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!ready || !enabled) return;
    let alive = true;
    setBusy(true);
    call<T>(fn, JSON.parse(key)).then(
      (r) => alive && (setResult(r), setError(null), setBusy(false)),
      (e: Error) => alive && (setError(e), setBusy(false)),
    );
    return () => void (alive = false);
  }, [fn, key, ready, enabled]);
  return { result, error, busy };
}
