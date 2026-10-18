"""Parte 3 — Universo: el factor de escala como una pelota lanzada hacia arriba.

Unidad 3 del plan de estudio (docs/unidad-3-universo.md).
Unidades: ``a`` adimensional (a = 1 hoy), tiempo en Gyr, H0 en 1/Gyr.
"""

import math

import numpy as np

from .integrators import integrate
from .units import h0_per_gyr


def scale_factor_acceleration(a: np.ndarray, h0: float, omega_m: float, omega_l: float) -> np.ndarray:
    """Ecuación de aceleración de Friedmann para materia + constante cosmológica.

        ä = H0² ( Ω_Λ · a − Ω_m / (2 a²) )

    ``a`` puede ser escalar o arreglo; ``h0`` en 1/Gyr. El término de materia
    frena (como la gravedad de un planeta sobre una pelota); el de Λ empuja y
    crece con ``a``.
    """
    raise NotImplementedError("Unidad 3: escribe scale_factor_acceleration (universe.py)")


def curvature_energy(a: np.ndarray, adot: np.ndarray, h0: float, omega_m: float, omega_l: float) -> np.ndarray:
    """Primera integral («energía» de la pelota), que debe conservarse:

        ½ ȧ² − ½ H0² ( Ω_m / a + Ω_Λ a² ) = ½ H0² Ω_k,   Ω_k = 1 − Ω_m − Ω_Λ

    Devuelve el lado izquierdo. Negativo: universo cerrado; cero: plano; positivo: abierto.
    """
    raise NotImplementedError("Unidad 3: escribe curvature_energy (universe.py)")


def expand(
    omega_m: float,
    omega_l: float,
    h0_km_s_mpc: float,
    t_max_gyr: float,
    dt_gyr: float = 0.01,
    a_min: float = 1e-3,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Historia a(t) desde hoy (a = 1, ȧ = H0) hacia el futuro (dt > 0) o el pasado (dt < 0).

    Usa ``integrate`` con leapfrog en 1D. Se detiene al llegar a ``a_min``
    (Big Bang) o si ``a`` deja de crecer y vuelve a 0 (Big Crunch). Devuelve
    ``(t, a, adot)`` con t medido desde hoy en Gyr (negativo hacia el pasado).

    Pista: la condición inicial es a0 = 1, ȧ0 = H0 (en 1/Gyr). Integra en
    trozos de pocos pasos y corta cuando a < a_min.
    """
    raise NotImplementedError("Unidad 3: escribe expand (universe.py)")


def age_numeric(omega_m: float, omega_l: float, h0_km_s_mpc: float, dt_gyr: float = -1e-3) -> float:
    """Edad del Universo en Gyr: integra hacia atrás hasta a → 0 y mide el tiempo.

    Debe reproducir ``age_critical_exact`` y ``age_flat_lcdm_exact`` con error < 0,1 %.
    Cerca de a = 0 la aceleración diverge; usa un paso pequeño o detente en
    ``a_min`` y suma el tramo restante con la aproximación a ∝ t^{2/3}
    (universo dominado por materia): t_rest = (2/3) · a_min / ȧ(a_min).
    """
    raise NotImplementedError("Unidad 3: escribe age_numeric (universe.py)")


# --- Oráculos exactos, para los tests y para comparar con los cálculos a mano ---

def age_critical_exact(h0_km_s_mpc: float) -> float:
    """Edad de un universo plano de solo materia (Ω_m = 1): t0 = 2/(3 H0). Para 67,4 da ≈ 9,67 Gyr."""
    return 2.0 / (3.0 * h0_per_gyr(h0_km_s_mpc))


def age_flat_lcdm_exact(omega_m: float, h0_km_s_mpc: float) -> float:
    """Edad de un universo plano con materia y Λ (Ω_Λ = 1 − Ω_m):

        t0 = 2 / (3 H0 √Ω_Λ) · arsinh( √(Ω_Λ / Ω_m) )

    Para Ω_m = 0,31 y H0 = 67,4 da ≈ 13,86 Gyr (Ryden 2017, ec. 5.100 aprox.; verificar).
    """
    omega_l = 1.0 - omega_m
    h0 = h0_per_gyr(h0_km_s_mpc)
    return 2.0 / (3.0 * h0 * math.sqrt(omega_l)) * math.asinh(math.sqrt(omega_l / omega_m))


def age_empty_exact(h0_km_s_mpc: float) -> float:
    """Universo vacío (Ω_m = Ω_Λ = 0): expansión uniforme, edad = 1/H0."""
    return 1.0 / h0_per_gyr(h0_km_s_mpc)
