# Unit 4 — Supernovae: from redshift to brightness

**Goal:** for each universe of unit 3, predict how bright a Type Ia supernova should look at a given redshift, and check which universe matches 1,500 real ones. This is the 1998 discovery.

File: `una_gravedad/supernovae.py`. Tests: `tests/test_supernovae.py`. Classes 9–10; Ryden chapters 6–7.

## 1. The chain of ideas

1. Type Ia supernovae reach nearly the same peak luminosity: standard candles (class 9). So apparent brightness → distance.
2. Their spectral lines are redshifted by 1 + z = 1/a: the light left when the Universe was a = 1/(1+z) as large (class 10).
3. Each universe (Ω_m, Ω_Λ) predicts a different distance for a given z, because the expansion history between then and now differs.
4. Plot measured distance against z for real supernovae, draw the four model curves, see which fits.

## 2. The functions

**E(z)**: the first integral of unit 3, rewritten in z. With a = 1/(1+z):

```
E(z) = H(z)/H0 = √( Ω_m (1+z)³ + Ω_k (1+z)² + Ω_Λ )
```

**Write** `hubble_function(z, omega_m, omega_l)`. One line; E(0) = 1 always.

**Comoving distance**: light travels at c, and the comoving distance covered is `c dt / a`. Converting dt to dz gives

```
D_C(z) = (c/H0) ∫₀ᶻ dz' / E(z')        [Mpc, with c/H0 = 299792.458/H0]
```

**Write** `comoving_distance(z, h0, omega_m, omega_l, n=2000)` with the trapezoid rule: `zz = np.linspace(0, z_i, n+1)`, `np.trapezoid(1/E(zz), zz)`. A loop over the entries of z is fine here; the integrand is vectorised. This integral is a Riemann sum, which is the Cálculo link for the report.

**Luminosity distance**: the distance that makes the inverse-square law work for the observed flux. Two factors of (1+z) (photon energy and arrival rate) give one (1+z) in distance:

```
d_L = (1+z) · D_M
D_M = D_C                                          Ω_k = 0  (flat)
D_M = (c/H0)/√Ω_k · sinh( √Ω_k · D_C / (c/H0) )    Ω_k > 0  (open)
D_M = (c/H0)/√|Ω_k| · sin( √|Ω_k| · D_C / (c/H0) ) Ω_k < 0  (closed)
```

**Write** `luminosity_distance(z, h0, omega_m, omega_l)`. This is the one place we take a general-relativity result on trust; say so in the report.

**Distance modulus**: astronomers plot distance as a magnitude difference:

```
μ = m − M = 5 log10( d_L / 10 pc ) = 5 log10( d_L[Mpc] ) + 25
```

**Write** `distance_modulus(d_l_mpc)`. One line.

## 3. Checks with exact answers

Two universes have closed-form d_L, already in the file as oracles:
- Critical (Ω_m = 1): `d_L = (2c/H0)(1+z)(1 − 1/√(1+z))`
- Empty (Ω_m = Ω_Λ = 0, so Ω_k = 1, exercising the sinh branch): `d_L = (c/H0) z (1 + z/2)`

Plus a reference value from Ned Wright's calculator: flat, Ω_m = 0.3, H0 = 70, z = 1 → d_L ≈ 6607 Mpc.

`test_accelerating_universe_supernovae_look_fainter_at_z_half` encodes the discovery in numbers: at z = 0.5, supernovae in our Universe are 0.39 mag fainter than the critical model predicts and 0.21 mag fainter than the open one. Riess et al. (1998) and Perlmutter et al. (1999) measured exactly that excess faintness.

## 4. Comparing with Pantheon+ (1,500 supernovae)

`data.load_pantheon()` gives z, μ_obs, σ for the Hubble-flow sample. One catch, important for the report: Pantheon+ distance moduli are **calibrated with SH0ES Cepheids**, i.e. H0 ≈ 73. A model drawn with H0 = 67.4 sits about `5 log10(73/67.4) ≈ 0.17 mag` above the data, for a reason that has nothing to do with dark energy. The honest fix is to let a constant offset float: it absorbs the absolute magnitude M and H0 together, which is exactly what supernova cosmology does (only the *shape* of μ(z) constrains Ω_m, Ω_Λ).

**Write** `chi_square(z, mu_obs, mu_err, h0, omega_m, omega_l)`: with weights w = 1/σ² and residuals Δ = μ_obs − μ_model, the best offset is `δ = Σ wΔ / Σ w` and `χ² = Σ w (Δ − δ)²`. Return `(chi2, delta)`. The test checks the accelerating model beats open beats critical, and that δ ≈ −0.17 mag.

Diagonal errors only: the README says that's fine for plotting and for this comparison, not for a publishable fit (that needs the 1701×1701 covariance). Say so in the report.

## 5. Questions

- Why does the absolute magnitude of a Type Ia not need to be known to tell the universes apart?
- What would the Hubble diagram look like if the Universe were empty? (It's the straight-line case, and the 1998 data lie *above* even that.)
- In your own words: what, physically, makes a distant supernova look fainter in an accelerating universe than in a decelerating one with the same H0 today?
