# How to work on this project

The physics lives in `core/una_gravedad/`. Every physics function is a stub that raises `NotImplementedError`; the tests for it show as **skipped** with the message `pendiente — Unidad N: escribe <función>`. You implement the function, its tests run for real, and when they're green that part of the report is backed by evidence.

The web page in `web/` runs the same Python package in the browser (Pyodide). It needs nothing from you: as soon as a function exists, the corresponding tab works.

## The loop

```
cd una-gravedad/core
../.venv/bin/python -m pytest -q            # see what's pending
# read docs/unidad-N-*.md, write the function in una_gravedad/<file>.py
../.venv/bin/python -m pytest -q tests/test_<file>.py -ra   # until green
```

Useful flags: `-k nombre` runs tests matching a substring, `-x` stops at the first failure, `--tb=short` shortens tracebacks.

## Order and time

| Unit | File | Functions | Tests | Time |
| --- | --- | --- | --- | --- |
| 1 Engine | `forces.py`, `integrators.py` | `central_acceleration`, `euler_step`, `leapfrog_step` | `test_engine.py` | 45–60 min |
| 2 Solar System | `solar_system.py` | `perihelion_state`, `specific_energy`, `specific_angular_momentum` | `test_solar_system.py` | 30 min |
| 3 Universe | `universe.py` | `scale_factor_acceleration`, `curvature_energy`, `expand`, `age_numeric` | `test_universe.py` | 60–75 min |
| 4 Supernovae | `supernovae.py` | `hubble_function`, `comoving_distance`, `luminosity_distance`, `distance_modulus`, `chi_square` | `test_supernovae.py` | 45–60 min |
| 5 Galaxy | `galaxy.py` | `circular_velocity`, `enclosed_mass`, `visible_velocity`, `halo_velocity`, `total_velocity`, `fit_halo` | `test_galaxy.py` | 45 min |

About 4–5 hours of your time in total. Units 1–2 are one sitting; 3–4 another; 5 is short. The remaining report work (Section 3 text, figure export) is separate.

## Rules that keep the tests meaningful

- Functions are pure: no printing, no file access, no global state. `data.py` is the only module that reads files.
- Don't change a test to make it pass. If you think a test is wrong, say so; the expected numbers were checked against an independent implementation.
- Keep the signatures as given: the web page calls them by name.
- numpy, not loops, wherever the docstring hints at it. The only Python loop that should exist is the time-stepping loop in `integrate` (already written) and possibly one over redshifts in `comoving_distance`.

## Where to look things up

- Ryden, *Introduction to Cosmology* (2nd ed.): chapters 4–6 for units 3–4.
- Hairer, Lubich & Wanner (2003), *Geometric numerical integration illustrated by the Störmer–Verlet method*, Acta Numerica 12: why leapfrog conserves energy (unit 1).
- SPARC paper (Lelli, McGaugh & Schombert 2016) for unit 5.
- The class 10 slides for the dark matter and expansion framing.
