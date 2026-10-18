"""Unidad 5 — curva de rotación de NGC 3198 y el halo de materia oscura."""

import math

import numpy as np

from una_gravedad import galaxy as g
from una_gravedad.data import load_sparc
from una_gravedad.units import G_KPC_KMS2_MSUN


def test_circular_velocity_and_enclosed_mass_are_inverses():
    r = np.array([5.0, 10.0, 30.0])
    m = np.array([1e10, 5e10, 2e11])
    v = g.circular_velocity(m, r)
    assert np.allclose(v, np.sqrt(G_KPC_KMS2_MSUN * m / r))
    assert np.allclose(g.enclosed_mass(v, r), m)


def test_enclosed_mass_reference_value():
    # 200 km/s a 30 kpc ⇒ M ≈ 2.8e11 M☉
    assert math.isclose(float(g.enclosed_mass(200.0, 30.0)), 2.79e11, rel_tol=0.01)


def test_visible_velocity_combines_in_quadrature_with_gas_sign():
    v = g.visible_velocity(np.array([-3.0, 4.0]), np.array([10.0, 10.0]), np.array([0.0, 5.0]), 0.5, 0.7)
    assert np.allclose(v**2, [-9.0 + 50.0, 16.0 + 50.0 + 17.5])


def test_halo_velocity_limits():
    r = np.array([1e-3, 1e4])
    v = g.halo_velocity(r, r_core=2.0, v_inf=150.0)
    assert math.isclose(v[1], 150.0, rel_tol=1e-3)  # plana lejos
    assert math.isclose(v[0], 150.0 * r[0] / (2.0 * math.sqrt(3)), rel_tol=1e-3)  # ∝ r cerca
    assert np.all(np.diff(g.halo_velocity(np.linspace(0.1, 50, 100), 2.0, 150.0)) > 0)


def test_total_velocity():
    assert math.isclose(float(g.total_velocity(3.0, 4.0)), 5.0)


def test_ngc3198_needs_dark_matter():
    d = load_sparc()
    v_vis = g.visible_velocity(d["v_gas"], d["v_disk"], d["v_bulge"])
    outer = d["r_kpc"] > 25
    # Afuera, la materia visible explica menos de ~75 % de la velocidad, o < 56 % de la masa.
    assert np.all(v_vis[outer] < 0.75 * d["v_obs"][outer])
    m_dyn = g.enclosed_mass(d["v_obs"][-1], d["r_kpc"][-1])
    m_vis = g.enclosed_mass(v_vis[-1], d["r_kpc"][-1])
    assert m_vis / m_dyn < 0.6


def test_fit_halo_recovers_synthetic_parameters():
    r = np.linspace(1.0, 40.0, 40)
    v_vis = 80.0 * np.exp(-r / 15.0) + 30.0
    v_obs = g.total_velocity(v_vis, g.halo_velocity(r, 4.0, 140.0))
    rc, vinf, chi2 = g.fit_halo(r, v_obs, np.full_like(r, 3.0), v_vis, np.linspace(1, 10, 91), np.linspace(100, 200, 101))
    assert math.isclose(rc, 4.0, abs_tol=0.11) and math.isclose(vinf, 140.0, abs_tol=1.1)
    assert chi2 < 1e-6


def test_fit_halo_on_ngc3198_is_good():
    d = load_sparc()
    v_vis = g.visible_velocity(d["v_gas"], d["v_disk"], d["v_bulge"])
    rc, vinf, chi2 = g.fit_halo(d["r_kpc"], d["v_obs"], d["v_err"], v_vis)
    n = d["r_kpc"].size
    assert chi2 / (n - 2) < 5.0  # χ² reducido razonable con solo dos parámetros
    assert 100 < vinf < 250
