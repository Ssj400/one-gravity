# Unit 3 — The Universe as a thrown ball

**Goal:** run the same leapfrog on a single number, the scale factor a(t), and get the four fates from the class 10 slide, the age of the Universe, and the curvature as a conserved "energy".

File: `una_gravedad/universe.py`. Tests: `tests/test_universe.py`. Classes 9–10; Ryden chapters 4–6.

## 1. From one galaxy to one equation

Take a galaxy at distance r from us. Write `r = a(t)·x`: x is a fixed comoving label, a(t) is the scale factor, a = 1 today. The Universe has no edge; a says only how stretched it is.

By Newton's shell theorem, only the mass M inside the sphere of radius r pulls on the galaxy, and that mass is constant as the sphere expands with the galaxy. So

```
r̈ = −GM/r²    →    ä = −(4πG/3) ρ a,    with ρ ∝ a⁻³
```

exactly the equation of a ball thrown upward from a planet whose mass is fixed. A cosmological constant Λ adds a push proportional to a. Measure every density as a fraction of today's critical density (Ω_m for matter, Ω_Λ for Λ) and the equation the program solves is

```
ä = H0² ( Ω_Λ · a − Ω_m / (2a²) )
```

Two sanity checks: matter alone (Ω_Λ = 0) always decelerates; with Ω_m = 0.31, Ω_Λ = 0.69 the right side today (a = 1) is positive: the expansion accelerates **now**.

**Write** `scale_factor_acceleration(a, h0, omega_m, omega_l)`, one line, vectorised in `a`. `h0` is in 1/Gyr (`units.h0_per_gyr(67.4) ≈ 0.0689`).

## 2. The conserved "energy" is the curvature

Multiply the equation by ȧ and integrate, exactly as for the ball:

```
½ȧ² − ½H0² ( Ω_m/a + Ω_Λ a² ) = ½H0² Ω_k,    Ω_k = 1 − Ω_m − Ω_Λ
```

Negative "energy" → closed Universe, recollapses. Zero → flat (critical). Positive → open. It must stay constant along the whole evolution, which is Part 1's energy test again.

**Write** `curvature_energy(a, adot, h0, omega_m, omega_l)`: the left-hand side, vectorised.

## 3. Running it

Initial condition: today, a = 1 and ȧ = H0 (from the Hubble–Lemaître law, v = H0 d = H0 a x, so ȧ/a = H0 at a = 1). The same `integrate` + `leapfrog_step` from unit 1 works on 1-element arrays. Forward (dt > 0) gives the future; backward (dt < 0) gives the past until a → 0, the Big Bang.

**Write** `expand(omega_m, omega_l, h0_km_s_mpc, t_max_gyr, dt_gyr, a_min)` returning `(t, a, adot)` as 1-D arrays, t from 0 (today). Two things to handle:
- Stop when a < `a_min`: integrate in chunks (say 100 steps) and break. Also stop if a has turned around and fallen below `a_min` (the big crunch), which is the same test.
- Near a = 0 the acceleration diverges like 1/a²; `a_min = 10⁻³` keeps you away from it.

**Write** `age_numeric(omega_m, omega_l, h0_km_s_mpc, dt_gyr)`: run `expand` backward with a small step, take −t at the stopping point, and add the small remaining stretch from `a_min` to 0. For a matter-dominated early Universe a ∝ t^{2/3}, so that tail is `t_rest = (2/3)·a_min/ȧ(a_min)` (for the empty universe, a ∝ t, so it's `a_min/ȧ`). With a_min = 10⁻³ the tail is ~10⁻⁵ of the age; without it you'd miss the 0.1 % tolerance only barely, but it's the honest thing to do.

## 4. The four universes and what the tests check

| Universe | Ω_m | Ω_Λ | Fate | Age (H0 = 67.4) |
| --- | --- | --- | --- | --- |
| Recollapse | 5 (exaggerated so the crunch fits the chart) | 0 | big crunch | 6.4 Gyr |
| Critical | 1 | 0 | expands forever, slowing to zero | 9.67 Gyr = 2/(3H0) |
| Open | 0.3 | 0 | expands forever, never stopping | 11.7 Gyr |
| Accelerating (ours) | 0.31 | 0.69 | faster and faster | 13.86 Gyr |

Exact formulas for the critical and flat-ΛCDM ages are in the file (`age_critical_exact`, `age_flat_lcdm_exact`); your teammate computes them by hand; `test_age_numeric_matches_exact_formulas` demands your integration reproduce them to 0.1 %. `test_curvature_energy_conserved_along_expansion` checks the first integral stays constant for all four. `test_closed_universe_recollapses` checks the crunch. `test_matter_only_universes_are_younger_than_oldest_stars` encodes the age argument: globular clusters are ~12–13 Gyr old, so a 9.67 Gyr universe is ruled out.

Hubble tension: with H0 = 73 the same ΛCDM universe is 12.8 Gyr old (age ∝ 1/H0). One slider on the web page.

## 5. Questions

- Why do all four curves pass through "today" with the same slope?
- Why is a matter-only universe *younger* than an accelerating one with the same H0 today? (Think about which one was expanding faster in the past.)
- Where exactly did Newton stop being enough? (The equation is right for matter + Λ, but light paths and the meaning of Ω_k need general relativity; unit 4 uses the GR result for distances.)
- Radiation is ignored. For how long after the Big Bang did it matter, and what does that do to the age?
