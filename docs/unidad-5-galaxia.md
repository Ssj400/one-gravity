# Unit 5 — Galaxy: the rotation curve that needs dark matter

**Goal:** take one real galaxy, NGC 3198, compute what its visible stars and gas can hold in orbit, see that the measured speeds are far higher, and fit the simplest dark halo that fixes it.

File: `una_gravedad/galaxy.py`. Tests: `tests/test_galaxy.py`. Class 10, slide "Las galaxias rotan más rápido de lo que deberían"; SPARC paper.

## 1. One formula

On a circular orbit, gravity supplies the centripetal acceleration: v²/r = GM(<r)/r². So

```
v_c(r) = √( G M(<r) / r )          and inversely        M(<r) = v² r / G
```

Only the mass *inside* the orbit matters (shell theorem again). Units: kpc, km/s, M☉, with G = 4.30 × 10⁻⁶ kpc (km/s)²/M☉. Example: 200 km/s at 30 kpc → 2.8 × 10¹¹ M☉.

Once you're outside most of the mass, M(<r) stops growing and v falls like 1/√r: the Keplerian fall-off unit 2 verified (Mercury 47 km/s, Neptune 5.4 km/s). A **flat** curve needs M(<r) ∝ r: mass that keeps piling up where there is almost no light.

**Write** `circular_velocity(enclosed_mass, r)` and `enclosed_mass(v, r)`.

## 2. What SPARC gives us

`data.load_sparc()` reads `NGC3198_rotmod.dat`: at 43 radii, the observed speed and its error, plus the speed each visible component *would* produce alone: `v_gas`, `v_disk`, `v_bulge` (NGC 3198 has no bulge). Disk and bulge are tabulated for a mass-to-light ratio Υ = 1; SPARC recommends Υ_disk = 0.5 and Υ_bulge = 0.7 at 3.6 µm (verify in the paper before citing).

Accelerations add, and v² ∝ a·r, so the components add in quadrature:

```
v_vis² = v_gas·|v_gas| + Υ_d v_disk² + Υ_b v_bulge²
```

`v_gas·|v_gas|` instead of `v_gas²` because SPARC stores a negative v_gas where the gas distribution pulls outward (a central hole): the sign carries the direction of the force.

**Write** `visible_velocity(...)`.

## 3. The halo

A pseudo-isothermal halo, density `ρ(r) = ρ₀ / (1 + (r/r_c)²)`, has two parameters: a core radius r_c and an asymptotic speed v_∞. Integrating the mass and applying the formula above:

```
v_h²(r) = v_∞² · ( 1 − (r_c/r) · arctan(r/r_c) )
```

Limits to check in your head: r ≫ r_c → v_h → v_∞ (flat); r ≪ r_c → v_h ≈ v_∞ r/(√3 r_c) (solid-body rise). The test checks both.

**Write** `halo_velocity(r, r_core, v_inf)` and `total_velocity(v_visible, v_halo)` (= √(v_vis² + v_h²)).

## 4. The fit

**Write** `fit_halo(r, v_obs, v_err, v_visible, r_core_grid, v_inf_grid)`: grid search minimising χ² = Σ((v_obs − v_tot)/v_err)². Build `RC, VI = np.meshgrid(r_core_grid, v_inf_grid, indexing="ij")`, add a trailing axis so they broadcast against `r` (`RC[..., None]`), evaluate the halo and total speed for every grid point at once, sum χ² over the last axis, `np.argmin` + `np.unravel_index`. Default grids: r_c ∈ [0.5, 20] kpc (100 points), v_∞ ∈ [50, 300] km/s (126 points). That's 12,600 × 43 numbers: trivial. The Discretas/Arquitectura link: one vectorised expression instead of 12,600 Python loop iterations.

`test_fit_halo_recovers_synthetic_parameters` feeds a curve made with known (r_c, v_∞) = (4, 140) and expects them back. `test_fit_halo_on_ngc3198_is_good` wants a reduced χ² below 5 with only two parameters.

`test_ngc3198_needs_dark_matter` is the result for the report: beyond 25 kpc the visible matter explains less than 75 % of the speed, so less than 56 % of the mass; at the last point less than 60 % of the dynamical mass is visible.

## 5. For the critical discussion

A flat curve alone has two explanations: unseen mass, or gravity behaving differently at very low accelerations (MOND, Milgrom 1983). Our fit cannot distinguish them; what does is independent evidence: cluster velocities (Zwicky 1933), gravitational lensing, the Bullet Cluster (Clowe et al. 2006), and the failed searches for dark compact objects the class 10 slide mentions. Say explicitly that the simulator tests one piece of the case.

Stretch, only if time remains: release test stars with the observed speeds in the visible-only potential and watch the outer disk fly apart (speeds above escape), then add the halo. Not needed for the grade.

## 6. Questions

- Why "in quadrature"? Write the acceleration sum and multiply by r.
- Why is "mass inside r" the right quantity even though the disk isn't spherical? (Exactly: it isn't; the SPARC curves already account for the disk geometry. Our halo is spherical, which is fine for a halo.)
- If Υ_disk were 1 instead of 0.5, would NGC 3198 still need a halo? (Try it on the web page.)
