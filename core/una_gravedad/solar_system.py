"""Parte 1 — Sistema Solar: las leyes de Kepler salen solas de Newton.

Unidad 2 del plan de estudio (docs/unidad-2-sistema-solar.md).
Unidades: UA, año, M☉, con G·M☉ = 4π².
"""

import numpy as np

from .forces import central_acceleration
from .integrators import integrate
from .units import GM_SUN_AU3_YR2

# Semieje mayor (UA) y excentricidad. Fuente: NASA Planetary Fact Sheet
# (https://nssdc.gsfc.nasa.gov/planetary/factsheet/); el compañero verifica y cita.
PLANETS: dict[str, tuple[float, float]] = {
    "Mercurio": (0.387, 0.206),
    "Venus": (0.723, 0.007),
    "Tierra": (1.000, 0.017),
    "Marte": (1.524, 0.094),
    "Júpiter": (5.204, 0.049),
    "Saturno": (9.583, 0.057),
    "Urano": (19.19, 0.047),
    "Neptuno": (30.07, 0.009),
}


def perihelion_state(a: float, e: float, gm: float = GM_SUN_AU3_YR2) -> tuple[np.ndarray, np.ndarray]:
    """Posición y velocidad en el perihelio de una órbita de semieje ``a`` y excentricidad ``e``.

    Se pone el perihelio sobre el eje x: r = (a(1−e), 0). La velocidad es
    perpendicular, v = (0, v_p), con v_p dada por la ecuación vis-viva

        v² = GM (2/r − 1/a).

    Devuelve ``(r, v)`` como arreglos de forma (2,).
    """
    raise NotImplementedError("Unidad 2: escribe perihelion_state (solar_system.py)")


def specific_energy(r: np.ndarray, v: np.ndarray, gm: float = GM_SUN_AU3_YR2) -> np.ndarray:
    """Energía por unidad de masa, E = ½|v|² − GM/|r|. Acepta (2,) o (M, 2)."""
    raise NotImplementedError("Unidad 2: escribe specific_energy (solar_system.py)")


def specific_angular_momentum(r: np.ndarray, v: np.ndarray) -> np.ndarray:
    """Momento angular por unidad de masa en 2D, L = x·v_y − y·v_x. Acepta (2,) o (M, 2).

    Es el doble del área barrida por unidad de tiempo: la segunda ley de Kepler
    dice que L es constante.
    """
    raise NotImplementedError("Unidad 2: escribe specific_angular_momentum (solar_system.py)")


def simulate_orbit(
    a: float,
    e: float,
    years: float,
    dt: float = 1e-3,
    method: str = "leapfrog",
    record_every: int = 1,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Integra una órbita desde el perihelio durante ``years`` años. Devuelve (t, r, v)."""
    r0, v0 = perihelion_state(a, e)
    n_steps = int(round(years / dt))
    return integrate(r0, v0, dt, n_steps, lambda r: central_acceleration(r, GM_SUN_AU3_YR2), method, record_every)


def measure_period(t: np.ndarray, r: np.ndarray) -> float:
    """Período medido de una trayectoria que parte en el perihelio sobre +x.

    Detecta el primer cruce de y de negativo a positivo con x > 0 e interpola
    linealmente entre los dos pasos. Devuelve nan si no se completa una vuelta.
    """
    y = r[:, 1]
    x = r[:, 0]
    crossings = np.nonzero((y[:-1] < 0) & (y[1:] >= 0) & (x[1:] > 0))[0]
    if crossings.size == 0:
        return float("nan")
    i = crossings[0]
    frac = -y[i] / (y[i + 1] - y[i])
    return float(t[i] + frac * (t[i + 1] - t[i]))
