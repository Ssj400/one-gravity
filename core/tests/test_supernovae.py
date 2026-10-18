"""Unidad 4 — distancia de luminosidad y diagrama de Hubble."""

import math

import numpy as np
import pytest

from una_gravedad import supernovae as sn
from una_gravedad.data import load_pantheon

H0 = 70.0


def test_hubble_function_today_is_one():
    assert math.isclose(float(sn.hubble_function(0.0, 0.3, 0.7)), 1.0)
    assert math.isclose(float(sn.hubble_function(0.0, 0.3, 0.0)), 1.0)  # Ωk = 0.7 compensa


def test_hubble_function_formula():
    z = np.array([0.5, 1.0])
    e = sn.hubble_function(z, 0.3, 0.6)  # Ωk = 0.1
    assert np.allclose(e, np.sqrt(0.3 * (1 + z) ** 3 + 0.1 * (1 + z) ** 2 + 0.6))


def test_luminosity_distance_matches_matter_only_exact():
    z = np.array([0.1, 0.5, 1.0, 2.0])
    assert np.allclose(sn.luminosity_distance(z, H0, 1.0, 0.0), sn.luminosity_distance_critical_exact(z, H0), rtol=1e-4)


def test_luminosity_distance_matches_empty_universe_exact():
    """Universo abierto (Ωk = 1): prueba la rama con sinh."""
    z = np.array([0.1, 0.5, 1.0, 2.0])
    assert np.allclose(sn.luminosity_distance(z, H0, 0.0, 0.0), sn.luminosity_distance_empty_exact(z, H0), rtol=1e-4)


def test_luminosity_distance_flat_lcdm_reference():
    # Ned Wright's cosmology calculator: H0 = 70, Ωm = 0.3, plano, z = 1 → d_L ≈ 6607 Mpc.
    assert math.isclose(float(sn.luminosity_distance(1.0, H0, 0.3, 0.7)), 6607, rel_tol=5e-3)


def test_small_z_reduces_to_hubble_law():
    z = 1e-3
    d = float(sn.luminosity_distance(z, H0, 0.3, 0.7))
    assert math.isclose(d, sn.C_KM_S * z / H0, rel_tol=2e-3)


def test_distance_modulus():
    assert math.isclose(float(sn.distance_modulus(10e-6)), 0.0, abs_tol=1e-12)  # 10 pc
    assert math.isclose(float(sn.distance_modulus(1.0)), 25.0)
    assert math.isclose(float(sn.distance_modulus(100.0)), 35.0)


def test_accelerating_universe_supernovae_look_fainter_at_z_half():
    """A z = 0.5: ≈ 0.39 mag más tenue que en el universo crítico, ≈ 0.21 que en el abierto."""
    mu_acc = float(sn.distance_modulus(sn.luminosity_distance(0.5, H0, 0.31, 0.69)))
    mu_crit = float(sn.distance_modulus(sn.luminosity_distance(0.5, H0, 1.0, 0.0)))
    mu_open = float(sn.distance_modulus(sn.luminosity_distance(0.5, H0, 0.3, 0.0)))
    assert math.isclose(mu_acc - mu_crit, 0.39, abs_tol=0.03)
    assert math.isclose(mu_acc - mu_open, 0.21, abs_tol=0.03)


def test_chi_square_prefers_dark_energy_on_pantheon():
    d = load_pantheon()
    chi_acc, delta_acc = sn.chi_square(d["z"], d["mu"], d["mu_err"], 67.4, 0.31, 0.69)
    chi_crit, _ = sn.chi_square(d["z"], d["mu"], d["mu_err"], 67.4, 1.0, 0.0)
    chi_open, _ = sn.chi_square(d["z"], d["mu"], d["mu_err"], 67.4, 0.3, 0.0)
    assert chi_acc < chi_open < chi_crit
    # El desplazamiento absorbe la calibración SH0ES (H0 ≈ 73 vs 67.4): 5 log10(73/67.4) ≈ 0.17 mag.
    assert math.isclose(delta_acc, -5 * math.log10(73.0 / 67.4), abs_tol=0.06)


def test_chi_square_is_zero_for_perfect_model():
    z = np.linspace(0.05, 1.0, 20)
    mu = sn.distance_modulus(sn.luminosity_distance(z, H0, 0.3, 0.7)) + 0.3
    chi, delta = sn.chi_square(z, mu, np.full_like(z, 0.1), H0, 0.3, 0.7)
    assert abs(chi) < 1e-9 and math.isclose(delta, 0.3)
