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
    a = np.asarray(a, dtype=float)
    return h0**2 * (omega_l * a - omega_m / (2.0 * a**2))


def curvature_energy(a: np.ndarray, adot: np.ndarray, h0: float, omega_m: float, omega_l: float) -> np.ndarray:
    """Primera integral («energía» de la pelota), que debe conservarse:

        ½ ȧ² − ½ H0² ( Ω_m / a + Ω_Λ a² ) = ½ H0² Ω_k,   Ω_k = 1 − Ω_m − Ω_Λ

    Devuelve el lado izquierdo. Negativo: universo cerrado; cero: plano; positivo: abierto.
    """
    a = np.asarray(a, dtype=float)
    adot = np.asarray(adot, dtype=float)
    return 0.5 * adot**2 - 0.5 * h0**2 * (omega_m / a + omega_l * a**2)


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
    h0 = h0_per_gyr(h0_km_s_mpc)
    accel = lambda a: scale_factor_acceleration(a, h0, omega_m, omega_l)
    # Estado inicial: hoy. Arreglos de un elemento para reutilizar integrate/leapfrog tal cual.
    a = np.array([1.0])
    adot = np.array([h0])
    t_list, a_list, adot_list = [0.0], [1.0], [h0]
    n_total = int(round(abs(t_max_gyr) / abs(dt_gyr)))
    chunk = 100
    done = 0
    while done < n_total:
        n = min(chunk, n_total - done)
        t, r, v = integrate(a, adot, dt_gyr, n, accel, "leapfrog")
        # ¿Llegamos a a_min (Big Bang hacia atrás, o Big Crunch hacia adelante)?
        below = np.nonzero(r[1:, 0] < a_min)[0]
        last = below[0] + 1 if below.size else n
        base = done * dt_gyr
        t_list.extend((base + t[1 : last + 1]).tolist())
        a_list.extend(r[1 : last + 1, 0].tolist())
        adot_list.extend(v[1 : last + 1, 0].tolist())
        if below.size:
            break
        a, adot = r[-1], v[-1]
        done += n
    return np.array(t_list), np.array(a_list), np.array(adot_list)


def age_numeric(omega_m: float, omega_l: float, h0_km_s_mpc: float, dt_gyr: float = -1e-3) -> float:
    """Edad del Universo en Gyr: integra hacia atrás hasta a → 0 y mide el tiempo.

    Debe reproducir ``age_critical_exact`` y ``age_flat_lcdm_exact`` con error < 0,1 %.
    Cerca de a = 0 la aceleración diverge; usa un paso pequeño o detente en
    ``a_min`` y suma el tramo restante con la aproximación a ∝ t^{2/3}
    (universo dominado por materia): t_rest = (2/3) · a_min / ȧ(a_min).
    """
    a_min = 1e-3
    t, a, adot = expand(omega_m, omega_l, h0_km_s_mpc, t_max_gyr=60.0, dt_gyr=-abs(dt_gyr), a_min=a_min)
    # Tramo final de a_min a 0: a ∝ t^{2/3} si hay materia (t = (2/3) a/ȧ); a ∝ t si el universo está vacío.
    frac = 2.0 / 3.0 if omega_m > 0 else 1.0
    t_rest = frac * a[-1] / abs(adot[-1])
    return float(-t[-1] + t_rest)


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
