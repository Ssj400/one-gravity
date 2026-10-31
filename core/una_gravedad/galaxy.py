"""Parte 2 — Galaxia: curvas de rotación y el halo de materia oscura.

Unidad 5 del plan de estudio (docs/unidad-5-galaxia.md).
Unidades: kpc, km/s, M☉, con G = 4.30e-6 kpc (km/s)² / M☉.
"""

import numpy as np

from .units import G_KPC_KMS2_MSUN

# Cocientes masa-luz recomendados por SPARC (Lelli, McGaugh & Schombert 2016,
# banda 3.6 µm): disco 0.5, bulbo 0.7. Verificar en el paper antes de citar.
UPSILON_DISK = 0.5
UPSILON_BULGE = 0.7


def circular_velocity(enclosed_mass: np.ndarray, r: np.ndarray, g: float = G_KPC_KMS2_MSUN) -> np.ndarray:
    """v_c = √( G M(<r) / r ). Con kpc y M☉ devuelve km/s."""
    return np.sqrt(g * np.asarray(enclosed_mass, dtype=float) / np.asarray(r, dtype=float))


def enclosed_mass(v: np.ndarray, r: np.ndarray, g: float = G_KPC_KMS2_MSUN) -> np.ndarray:
    """Masa dinámica dentro de r a partir de la velocidad circular: M(<r) = v² r / G. M☉."""
    return np.asarray(v, dtype=float) ** 2 * np.asarray(r, dtype=float) / g


def visible_velocity(
    v_gas: np.ndarray,
    v_disk: np.ndarray,
    v_bulge: np.ndarray,
    upsilon_disk: float = UPSILON_DISK,
    upsilon_bulge: float = UPSILON_BULGE,
) -> np.ndarray:
    """Velocidad circular que produce la materia visible sola.

        v_vis² = v_gas·|v_gas| + Υ_d · v_disk² + Υ_b · v_bulge²

    Las contribuciones se suman en cuadratura porque las aceleraciones se suman
    y v² ∝ a·r. SPARC tabula v_disk y v_bulge para Υ = 1; v_gas puede ser
    negativo donde el gas tira hacia afuera, por eso v·|v| y no v².
    """
    v_gas = np.asarray(v_gas, dtype=float)
    v2 = v_gas * np.abs(v_gas) + upsilon_disk * np.asarray(v_disk, dtype=float) ** 2 + upsilon_bulge * np.asarray(v_bulge, dtype=float) ** 2
    return np.sqrt(v2)


def halo_velocity(r: np.ndarray, r_core: float, v_inf: float) -> np.ndarray:
    """Halo pseudo-isotermo: ρ(r) = ρ0 / (1 + (r/r_c)²). Su velocidad circular es

        v_h²(r) = v_∞² · ( 1 − (r_c / r) · arctan(r / r_c) )

    Tiende a v_∞ para r ≫ r_c (curva plana) y crece como r para r ≪ r_c.
    """
    r = np.asarray(r, dtype=float)
    return v_inf * np.sqrt(1.0 - (r_core / r) * np.arctan(r / r_core))


def total_velocity(v_visible: np.ndarray, v_halo: np.ndarray) -> np.ndarray:
    """v_tot² = v_vis² + v_halo²."""
    return np.sqrt(np.asarray(v_visible, dtype=float) ** 2 + np.asarray(v_halo, dtype=float) ** 2)


def fit_halo(
    r: np.ndarray,
    v_obs: np.ndarray,
    v_err: np.ndarray,
    v_visible: np.ndarray,
    r_core_grid: np.ndarray | None = None,
    v_inf_grid: np.ndarray | None = None,
) -> tuple[float, float, float]:
    """Búsqueda en grilla de (r_c, v_∞) que minimiza χ² = Σ ((v_obs − v_tot)/v_err)².

    Devuelve ``(r_core, v_inf, chi2_min)``. Grillas por defecto: r_c en
    np.linspace(0.5, 20, 100) kpc, v_∞ en np.linspace(50, 300, 126) km/s.
    Pista: construye las dos grillas con np.meshgrid y evalúa todo vectorizado.
    """
    if r_core_grid is None:
        r_core_grid = np.linspace(0.5, 20.0, 100)
    if v_inf_grid is None:
        v_inf_grid = np.linspace(50.0, 300.0, 126)
    rc, vi = np.meshgrid(r_core_grid, v_inf_grid, indexing="ij")
    # Un eje extra al final para que cada punto de la grilla se evalúe en todos los radios a la vez.
    v_h = halo_velocity(r, rc[..., None], vi[..., None])
    v_tot = total_velocity(v_visible, v_h)
    chi2 = np.sum(((v_obs - v_tot) / v_err) ** 2, axis=-1)
    i, j = np.unravel_index(np.argmin(chi2), chi2.shape)
    return float(r_core_grid[i]), float(v_inf_grid[j]), float(chi2[i, j])
