# Unit 1 — The engine: one force, two ways to step

**Goal:** write the three functions that every other part of the project reuses, and see with your own eyes why the naive method is wrong.

Files: `una_gravedad/forces.py`, `una_gravedad/integrators.py`. Tests: `tests/test_engine.py`.

## 1. The force

Newton: a body at position **r** relative to a mass M at the origin feels an acceleration that points back to the origin and falls with the square of the distance.

```
a = − G M · r / |r|³
```

The `/|r|³` looks odd until you see it as `(1/|r|²) · (r/|r|)`: inverse-square magnitude times a unit vector toward the mass, with the minus sign making it attractive.

**Units.** In AU, years and solar masses, G·M☉ = 4π². Check: a circular orbit at 1 AU needs v²/r = GM/r², so v = √(GM) = 2π AU/yr, one circumference per year. That's Earth. With this choice Kepler's third law reads exactly `T² = a³` (unit 2).

**Write** `central_acceleration(r, gm)`. It must work for one body (shape `(2,)`) and for many at once (shape `(N, 2)`). The trick is `np.linalg.norm(r, axis=-1, keepdims=True)`: `axis=-1` takes the norm along the last axis (x, y) and `keepdims` leaves a trailing 1 so the division broadcasts row by row. Three lines.

## 2. Stepping in time

A simulation is: given **r**, **v** now, where are they a moment Δt later? Over a short enough Δt, velocity is nearly constant, so `r ← r + v·Δt`. Likewise `v ← v + a·Δt`. That's Cálculo I: following the tangent line.

### Euler (deliberately kept, deliberately wrong)

```
r_{n+1} = r_n + v_n·Δt
v_{n+1} = v_n + a(r_n)·Δt
```

Both updates use the *old* state. Picture a circular orbit: the velocity is tangent, so moving along it for Δt takes you slightly *outside* the circle. Every step. The orbit spirals out and the energy grows. In our test run (Earth, Δt = 0.01 yr, 5 yr) Euler gains 57 % in energy and pushes Earth past 2 AU.

**Write** `euler_step(r, v, dt, accel)`: two lines. Return new arrays; don't modify the inputs (`r + v*dt` already creates a new array, `r += …` would not).

### Leapfrog, kick–drift–kick

```
v_half   = v_n   + a(r_n)·Δt/2        kick
r_{n+1}  = r_n   + v_half·Δt          drift
v_{n+1}  = v_half + a(r_{n+1})·Δt/2   kick, with the new force
```

The velocity used for the drift is the one *halfway* through the step, which is the average velocity over the step to second order. The second kick uses the force at the new position, so the method is symmetric: swap Δt → −Δt and the three lines undo themselves. That symmetry is what makes it **time-reversible**, and a reversible, symplectic method can't drift in energy; its error stays bounded and oscillates. Same cost as Euler.

**Write** `leapfrog_step(r, v, dt, accel)`: three lines.

`integrate(...)` is already written: it's just the loop that calls your step and records the trajectory. Read it once.

## 3. What the tests check, in order

| Test | What it proves |
| --- | --- |
| `..._inverse_square_magnitude`, `..._many_bodies` | force shape, sign, magnitude |
| `test_steps_do_not_mutate_inputs` | you returned new arrays |
| `test_euler_step_formula`, `test_leapfrog_step_formula` | the exact update |
| `test_leapfrog_conserves_energy_over_100_orbits` | relative energy error < 10⁻⁶ over 100 Earth orbits |
| `test_euler_invents_energy` | Euler gains > 10 % in 5 years |
| `test_leapfrog_is_time_reversible` | 2000 steps forward then back returns to the start to 10⁻⁹ |

The last three are the ones that go in the report as evidence. The Euler test is kept on purpose: it documents a wrong method that gives a plausible picture, which is the hook of the critical discussion.

## 4. Questions to be able to answer afterwards

- Why does Euler gain energy rather than lose it on a circular orbit? (Where does the tangent line sit relative to the circle?)
- Leapfrog uses the force twice per step. Why is it still "the same cost" as Euler in a long run? (Hint: `a(r_{n+1})` of this step is `a(r_n)` of the next.)
- What does "reversible" mean operationally, and why does the test use it as a correctness check?
- Discretas link: the energy test checks 1000 recorded points. Why does "the invariant holds after every step" plus "it holds at step 0" let you claim it for all steps?

## 5. Numerical hygiene (for the Arquitectura paragraph of the report)

Floating point is not exact arithmetic: each operation rounds to about 16 significant digits. Over 10⁵ steps those roundings accumulate as a random walk, roughly √N × 10⁻¹⁶ ≈ 3 × 10⁻¹⁴, far below the 10⁻⁶ energy tolerance. Euler's 57 % is not rounding; it's the method. Separating "error of the method" from "error of the machine" is the point of the paragraph.
