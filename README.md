# Una sola gravedad, tres escalas

Simulador de gravedad para la Tarea 2 de AST101 (UC, 2026-2). Un mismo motor numérico (fuerza de Newton + integrador *leapfrog*) resuelve tres escalas:

1. **Sistema Solar:** las tres leyes de Kepler salen solas; sirven como tests de que el motor es correcto.
2. **Galaxia (NGC 3198, datos SPARC):** la materia visible no explica la curva de rotación; se ajusta un halo de materia oscura.
3. **Universo:** la ecuación de Friedmann como una pelota lanzada hacia arriba; cuatro destinos, la edad del Universo y la comparación con 1.500 supernovas Ia (Pantheon+).

## Estructura

```
core/                 paquete Python (numpy) + tests (pytest). Sin I/O salvo data.py
  una_gravedad/       forces, integrators, solar_system, universe, supernovae, galaxy, data, units
  tests/              una ley física por test; oráculos exactos donde existen
data/                 archivos descargados sin modificar; ver data/FUENTES.md
docs/                 notas de estudio por unidad (docs/00-como-trabajar.md primero)
web/                  página web (Vite + React + TypeScript + Plotly) que corre el mismo paquete Python en el navegador con Pyodide
```

## Correr

```
python3 -m venv .venv && .venv/bin/pip install numpy pytest
cd core && ../.venv/bin/python -m pytest -q

cd web && npm install && npm run dev        # http://localhost:5173
```

`npm run dev` y `npm run build` copian `core/una_gravedad/` y `data/` a `web/public/` automáticamente, así la página siempre usa el mismo código que los tests.

## Autores

José Santiago Garrillo Fernández (código, tests, figuras, Sección 3) y [compañero] (teoría astronómica, cálculos a mano, datos, referencias, Secciones 1, 2, 4 y 5). Ver el informe para la declaración de uso de herramientas de IA.

## Datos y referencias

SPARC (Lelli, McGaugh & Schombert 2016) y Pantheon+ (Scolnic et al. 2022; Brout et al. 2022). Detalles y citas en `data/FUENTES.md`.
