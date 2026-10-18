# Cómo correr los tests

Siempre desde `core/`, con el Python del proyecto (el que tiene numpy):

```
cd ~/Programming/UC/AST-101/proyecto_interdisciplinario/one-gravity/core
../.venv/bin/python -m pytest -q
```

Cada `.` es un test que pasó, `s` uno saltado (la función todavía es un stub), `F` uno que falló. Al final, un resumen tipo `20 passed, 46 skipped`.

## Por sección

| Sección | Comando | Tests |
| --- | --- | --- |
| Unidad 1, motor (`forces.py`, `integrators.py`) | `../.venv/bin/python -m pytest -q tests/test_engine.py` | 11 |
| Unidad 2, Sistema Solar (`solar_system.py`) | `../.venv/bin/python -m pytest -q tests/test_solar_system.py` | 14 |
| Unidad 3, Universo (`universe.py`) | `../.venv/bin/python -m pytest -q tests/test_universe.py` | 16 |
| Unidad 4, supernovas (`supernovae.py`) | `../.venv/bin/python -m pytest -q tests/test_supernovae.py` | 10 |
| Unidad 5, galaxia (`galaxy.py`) | `../.venv/bin/python -m pytest -q tests/test_galaxy.py` | 8 |
| Datos y unidades (ya implementados) | `../.venv/bin/python -m pytest -q tests/test_data.py tests/test_units.py` | 7 |

## Por función o por nombre

`-k` filtra por texto en el nombre del test:

```
../.venv/bin/python -m pytest -q tests/test_engine.py -k euler        # solo los de Euler
../.venv/bin/python -m pytest -q tests/test_engine.py -k leapfrog     # solo leapfrog
../.venv/bin/python -m pytest -q tests/test_solar_system.py -k kepler_3
../.venv/bin/python -m pytest -q -k "energy or angular"               # combinaciones
```

Un test concreto, por su ruta completa:

```
../.venv/bin/python -m pytest -q tests/test_universe.py::test_age_numeric_matches_exact_formulas
```

## Flags útiles

| Flag | Qué hace |
| --- | --- |
| `-q` | salida corta (sin ella, muestra el nombre de cada test) |
| `-x` | se detiene en el primer fallo |
| `--tb=short` | tracebacks más cortos |
| `-ra` | al final, lista por qué se saltó cada test (qué función falta) |
| `-v` | un renglón por test, con nombre: útil para ver cuáles pasan |
| `--lf` | repite solo los que fallaron la última vez |

Ejemplo de ciclo de trabajo: `-x --lf` mientras arreglas una función, y la suite completa antes de hacer commit.

## Qué significa cada resultado

- **passed:** la función reproduce la ley física que el test exige (p. ej. T²/a³ = 1 con error < 0,1 %).
- **skipped, "pendiente — Unidad N: escribe X":** X todavía lanza `NotImplementedError`. No es un error; es la lista de lo que falta.
- **failed:** la función existe pero el resultado no cumple. Abajo del nombre, pytest muestra la línea del `assert` y los valores reales (`where ...`). Si el error es `TypeError ... 'function'`, casi siempre falta llamar a una función con paréntesis, por ejemplo `accel(r)` en vez de `accel`.

## En GitHub

Cada `git push` a `main` corre la suite completa en GitHub Actions (pestaña *Actions* del repo). Si pasa, se vuelve a publicar la página. Si falla, la página anterior sigue en línea.
