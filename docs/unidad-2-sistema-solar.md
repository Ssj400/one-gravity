# Unit 2 — Solar System: Kepler's laws come out of Newton

**Goal:** start each planet from its perihelion with the right speed and watch all three Kepler laws appear without being programmed. That's the evidence the engine is right before we use it where nothing can be checked directly.

File: `una_gravedad/solar_system.py`. Tests: `tests/test_solar_system.py`. Classes 4–5.

## 1. Starting an orbit: vis-viva

An ellipse with semi-major axis a and eccentricity e has its closest point (perihelion) at `r_p = a(1 − e)` and farthest (aphelion) at `r_a = a(1 + e)`. Energy conservation along the orbit gives the speed at any distance r (the vis-viva equation):

```
v² = GM (2/r − 1/a)
```

Check two limits: circular (r = a) gives v² = GM/a, the circular speed. Parabolic escape (a → ∞) gives v² = 2GM/r, the escape speed. At perihelion the velocity is perpendicular to the radius.

**Write** `perihelion_state(a, e, gm)`: put the perihelion on +x, `r = (a(1−e), 0)`, and `v = (0, v_p)` with v_p from vis-viva at r = r_p. Mercury: a = 0.387 AU, e = 0.206 → v_p ≈ 59 km/s (the fact sheet says 58.98). Your teammate computes this by hand; the test `test_mercury_perihelion_speed_in_km_s` compares.

## 2. Two conserved quantities

Per unit mass (the planet's mass cancels everywhere):

```
E = ½|v|² − GM/|r|            energy; negative for a bound orbit
L = x·v_y − y·v_x             angular momentum in 2D (the z-component of r × v)
```

L is twice the area swept per unit time: in Δt the radius vector sweeps a thin triangle of area ½|r × v|Δt. So "L constant" **is** Kepler's second law, equal areas in equal times. It's conserved because a central force has no torque.

**Write** `specific_energy(r, v, gm)` and `specific_angular_momentum(r, v)`. Both must accept a single state `(2,)` or a trajectory `(M, 2)`: use `axis=-1` and `r[..., 0]` style indexing, no loops.

## 3. The three laws as tests

| Law | Test | How it's measured |
| --- | --- | --- |
| 1. Ellipse with the Sun at a focus | `test_kepler_1_aphelion_matches_ellipse` | min and max of \|r\| along Mercury's orbit equal a(1−e), a(1+e) to 10⁻⁴ |
| 2. Equal areas | `test_kepler_2_angular_momentum_constant` | L constant to 10⁻⁹ along the orbit |
| 3. T² = a³ | `test_kepler_3_period_squared_equals_a_cubed` ×6 | period measured from the trajectory (`measure_period`, already written: first return to the +x axis, linearly interpolated); T²/a³ = 1 within 0.1 % for Mercury to Saturn |

The third one is the headline: nothing in the code knows about periods or Kepler; only Newton's force and a careful stepping rule. `measure_period` is a helper I wrote; read it so you can explain the interpolation in the report.

## 4. Figures this unit produces (via the web page)

- Fig. 1: Euler vs leapfrog orbits for Earth, plus relative energy error against time. Two panels.
- Fig. 2: log T vs log a for the planets, slope 3/2 (`T = a^{3/2}` on a log–log plot is a straight line of slope 1.5).
- Fig. 3 (nice to have): Mercury's ellipse with equal-area wedges.

## 5. Questions

- Why does the planet's mass not appear anywhere?
- The eccentricity of Earth is 0.017. If you started it with the circular speed at 1 AU instead of the perihelion speed, what orbit would you get, and would Kepler III still hold?
- What goes wrong in `measure_period` if the orbit is Euler-integrated and spirals out?
