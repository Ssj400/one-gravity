"""Unidad 3 — expansión del Universo con el mismo integrador."""

import math

import numpy as np
import pytest

from una_gravedad import universe as u
from una_gravedad.units import h0_per_gyr

H0 = 67.4


def test_exact_ages_reference_values():
    # Oráculos: 2/(3H0) ≈ 9.67 Gyr y ΛCDM plano (Ωm = 0.31) ≈ 13.86 Gyr; el compañero los calcula a mano.
    assert math.isclose(u.age_critical_exact(H0), 9.674, rel_tol=1e-3)
    assert math.isclose(u.age_flat_lcdm_exact(0.31, H0), 13.86, rel_tol=1e-3)
    assert math.isclose(u.age_empty_exact(H0), 14.51, rel_tol=1e-3)


def test_hubble_tension_changes_age():
    assert math.isclose(u.age_flat_lcdm_exact(0.31, 73.0), 12.80, rel_tol=2e-3)


def test_acceleration_sign_today():
    h0 = h0_per_gyr(H0)
    assert u.scale_factor_acceleration(1.0, h0, 1.0, 0.0) < 0  # solo materia: frena
    assert u.scale_factor_acceleration(1.0, h0, 0.31, 0.69) > 0  # Λ domina hoy: acelera
    assert math.isclose(u.scale_factor_acceleration(1.0, h0, 0.31, 0.69), h0**2 * (0.69 - 0.155), rel_tol=1e-12)


def test_acceleration_vectorised():
    a = np.array([0.5, 1.0, 2.0])
    out = u.scale_factor_acceleration(a, 1.0, 1.0, 0.0)
    assert np.allclose(out, -0.5 / a**2)


def test_curvature_energy_is_zero_for_flat_universe_today():
    h0 = h0_per_gyr(H0)
    assert abs(u.curvature_energy(1.0, h0, h0, 0.31, 0.69)) < 1e-12
    assert u.curvature_energy(1.0, h0, h0, 5.0, 0.0) < 0  # cerrado
    assert u.curvature_energy(1.0, h0, h0, 0.3, 0.0) > 0  # abierto


@pytest.mark.parametrize("omega_m,omega_l", [(1.0, 0.0), (0.31, 0.69), (0.3, 0.0), (5.0, 0.0)])
def test_curvature_energy_conserved_along_expansion(omega_m, omega_l):
    t, a, adot = u.expand(omega_m, omega_l, H0, t_max_gyr=10.0, dt_gyr=1e-3)
    h0 = h0_per_gyr(H0)
    e = u.curvature_energy(a, adot, h0, omega_m, omega_l)
    assert np.max(np.abs(e - e[0])) < 1e-6 * h0**2


def test_expand_starts_today_and_grows_forward():
    t, a, adot = u.expand(0.31, 0.69, H0, t_max_gyr=5.0, dt_gyr=1e-2)
    assert t[0] == 0.0 and a[0] == 1.0
    assert math.isclose(adot[0], h0_per_gyr(H0), rel_tol=1e-12)
    assert a[-1] > 1.3  # en 5 Gyr el Universo crece ≈ 40 %
    assert np.all(np.diff(a) > 0)


def test_expand_backward_reaches_big_bang():
    t, a, adot = u.expand(0.31, 0.69, H0, t_max_gyr=20.0, dt_gyr=-1e-3)
    assert a[-1] <= 1e-3 + 1e-9
    assert -14.0 < t[-1] < -13.7


def test_closed_universe_recollapses():
    t, a, adot = u.expand(5.0, 0.0, H0, t_max_gyr=60.0, dt_gyr=1e-2)
    assert a.max() > 1.0
    assert a[-1] < 0.5  # vuelve a caer (big crunch)


@pytest.mark.parametrize(
    "omega_m,omega_l,exact",
    [(1.0, 0.0, u.age_critical_exact(H0)), (0.31, 0.69, u.age_flat_lcdm_exact(0.31, H0)), (0.0, 0.0, u.age_empty_exact(H0))],
)
def test_age_numeric_matches_exact_formulas(omega_m, omega_l, exact):
    assert math.isclose(u.age_numeric(omega_m, omega_l, H0), exact, rel_tol=1e-3)


def test_matter_only_universes_are_younger_than_oldest_stars():
    # Cúmulos globulares: ≈ 12–13 Gyr (fuente por confirmar). Solo materia abierto (Ωm = 0.3): ≈ 11.7 Gyr.
    assert u.age_numeric(0.3, 0.0, H0) < 12.0
    assert u.age_numeric(0.31, 0.69, H0) > 13.5
