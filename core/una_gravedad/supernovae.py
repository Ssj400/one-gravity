"""Parte 3b — Supernovas Ia: del corrimiento al rojo a la distancia de luminosidad.

Unidad 4 del plan de estudio (docs/unidad-4-supernovas.md).
Distancias en Mpc, H0 en km/s/Mpc.
"""

import numpy as np

from .units import C_KM_S


def hubble_function(z: np.ndarray, omega_m: float, omega_l: float) -> np.ndarray:
    """E(z) = H(z)/H0 = √( Ω_m (1+z)³ + Ω_k (1+z)² + Ω_Λ ),  Ω_k = 1 − Ω_m − Ω_Λ.

    Es la primera integral de Friedmann escrita en función de z (1 + z = 1/a).
    """
    z = np.asarray(z, dtype=float)
    omega_k = 1.0 - omega_m - omega_l
    return np.sqrt(omega_m * (1.0 + z) ** 3 + omega_k * (1.0 + z) ** 2 + omega_l)


def comoving_distance(z: np.ndarray, h0: float, omega_m: float, omega_l: float, n: int = 2000) -> np.ndarray:
    """Distancia comóvil D_C(z) = (c/H0) ∫₀ᶻ dz'/E(z') en Mpc, con la regla del trapecio.

    ``z`` escalar o arreglo. Para cada z integra sobre ``n`` subintervalos
    (np.linspace + np.trapezoid). Esta integral es una suma de Riemann: Cálculo I.
    """
    z_arr = np.atleast_1d(np.asarray(z, dtype=float))
    out = np.empty_like(z_arr)
    for i, zi in enumerate(z_arr):
        zz = np.linspace(0.0, zi, n + 1)
        out[i] = np.trapezoid(1.0 / hubble_function(zz, omega_m, omega_l), zz)
    out *= C_KM_S / h0
    return out if np.ndim(z) else out[0]


def luminosity_distance(z: np.ndarray, h0: float, omega_m: float, omega_l: float) -> np.ndarray:
    """Distancia de luminosidad en Mpc.

        d_L = (1+z) · D_M,  con D_M = D_C si Ω_k = 0,
        D_M = (c/H0)/√Ω_k · sinh(√Ω_k · D_C · H0/c)   si Ω_k > 0 (abierto),
        D_M = (c/H0)/√|Ω_k| · sin(√|Ω_k| · D_C · H0/c) si Ω_k < 0 (cerrado).

    Trata |Ω_k| < 1e-8 como plano.
    """
    z = np.asarray(z, dtype=float)
    d_c = comoving_distance(z, h0, omega_m, omega_l)
    d_h = C_KM_S / h0
    omega_k = 1.0 - omega_m - omega_l
    if abs(omega_k) < 1e-8:
        d_m = d_c
    elif omega_k > 0:
        sk = np.sqrt(omega_k)
        d_m = d_h / sk * np.sinh(sk * d_c / d_h)
    else:
        sk = np.sqrt(-omega_k)
        d_m = d_h / sk * np.sin(sk * d_c / d_h)
    return (1.0 + z) * d_m


def distance_modulus(d_l_mpc: np.ndarray) -> np.ndarray:
    """μ = 5 log10( d_L / 10 pc ) = 5 log10( d_L[Mpc] ) + 25."""
    return 5.0 * np.log10(np.asarray(d_l_mpc, dtype=float)) + 25.0


def chi_square(z: np.ndarray, mu_obs: np.ndarray, mu_err: np.ndarray, h0: float, omega_m: float, omega_l: float) -> tuple[float, float]:
    """χ² entre μ_obs y el modelo, marginalizando analíticamente un desplazamiento constante.

    El desplazamiento absorbe la calibración de M (y por tanto de H0): los datos
    de Pantheon+ están calibrados con Cefeidas (H0 ≈ 73), no con 67,4. Con
    w = 1/σ² y Δ = μ_obs − μ_modelo, el mejor desplazamiento es
    δ = Σ wΔ / Σ w, y χ² = Σ w (Δ − δ)².  Devuelve ``(chi2, delta)``.

    Solo errores diagonales: sirve para comparar modelos en el informe, no para
    un ajuste publicable (el README de Pantheon+ exige la covarianza completa).
    """
    mu_model = distance_modulus(luminosity_distance(z, h0, omega_m, omega_l))
    w = 1.0 / np.asarray(mu_err, dtype=float) ** 2
    diff = np.asarray(mu_obs, dtype=float) - mu_model
    delta = float(np.sum(w * diff) / np.sum(w))
    return float(np.sum(w * (diff - delta) ** 2)), delta


# --- Oráculos exactos, para los tests ---------------------------------------

def luminosity_distance_critical_exact(z: np.ndarray, h0: float) -> np.ndarray:
    """Universo plano de solo materia (Ω_m = 1): d_L = (2c/H0)(1+z)(1 − 1/√(1+z)). Mpc."""
    z = np.asarray(z, dtype=float)
    return 2.0 * C_KM_S / h0 * (1.0 + z) * (1.0 - 1.0 / np.sqrt(1.0 + z))


def luminosity_distance_empty_exact(z: np.ndarray, h0: float) -> np.ndarray:
    """Universo vacío (Ω_m = Ω_Λ = 0, Ω_k = 1): d_L = (c/H0) z (1 + z/2). Mpc."""
    z = np.asarray(z, dtype=float)
    return C_KM_S / h0 * z * (1.0 + z / 2.0)
