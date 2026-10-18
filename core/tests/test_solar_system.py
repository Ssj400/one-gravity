"""Unidad 2 — las tres leyes de Kepler salen de Newton."""

import math

import numpy as np
import pytest

from una_gravedad import solar_system as ss
from una_gravedad.units import AU_PER_YR_TO_KM_S, GM_SUN_AU3_YR2


def test_perihelion_state_geometry_and_vis_viva():
    a, e = 0.387, 0.206  # Mercurio
    r, v = ss.perihelion_state(a, e)
    assert np.allclose(r, [a * (1 - e), 0.0])
    assert v[0] == 0.0 and v[1] > 0
    v_expected = math.sqrt(GM_SUN_AU3_YR2 * (2 / (a * (1 - e)) - 1 / a))
    assert math.isclose(v[1], v_expected, rel_tol=1e-12)


def test_mercury_perihelion_speed_in_km_s():
    # Valor de referencia ≈ 58.98 km/s (NASA fact sheet: máx. 58.98); el compañero lo calcula a mano.
    _, v = ss.perihelion_state(0.387, 0.206)
    assert math.isclose(v[1] * AU_PER_YR_TO_KM_S, 59.0, rel_tol=0.01)


def test_energy_and_angular_momentum_signatures():
    r = np.array([[1.0, 0.0], [0.0, 2.0]])
    v = np.array([[0.0, 1.0], [-1.0, 0.0]])
    e = ss.specific_energy(r, v)
    l = ss.specific_angular_momentum(r, v)
    assert e.shape == (2,) and l.shape == (2,)
    assert np.allclose(e, [0.5 - GM_SUN_AU3_YR2, 0.5 - GM_SUN_AU3_YR2 / 2])
    assert np.allclose(l, [1.0, 2.0])


def test_bound_orbit_has_negative_energy():
    r, v = ss.perihelion_state(1.0, 0.017)
    assert ss.specific_energy(r, v) < 0


# --- Primera ley: elipse con el Sol en un foco -------------------------------

def test_kepler_1_aphelion_matches_ellipse():
    a, e = 0.387, 0.206
    t, r, v = ss.simulate_orbit(a, e, years=0.25, dt=1e-4)  # T(Mercurio) ≈ 0.241 años
    dist = np.linalg.norm(r, axis=1)
    assert math.isclose(dist.min(), a * (1 - e), rel_tol=1e-4)
    assert math.isclose(dist.max(), a * (1 + e), rel_tol=1e-4)


# --- Segunda ley: áreas iguales en tiempos iguales = momento angular constante

def test_kepler_2_angular_momentum_constant():
    t, r, v = ss.simulate_orbit(0.387, 0.206, years=1.0, dt=1e-4, record_every=10)
    l = ss.specific_angular_momentum(r, v)
    assert np.max(np.abs(l - l[0]) / abs(l[0])) < 1e-9


# --- Tercera ley: T² = a³ ----------------------------------------------------

@pytest.mark.parametrize("name", ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno"])
def test_kepler_3_period_squared_equals_a_cubed(name):
    a, e = ss.PLANETS[name]
    t_exp = a**1.5
    t, r, v = ss.simulate_orbit(a, e, years=1.2 * t_exp, dt=t_exp / 5000, record_every=5)
    period = ss.measure_period(t, r)
    assert math.isclose(period**2 / a**3, 1.0, rel_tol=1e-3)


def test_measure_period_returns_nan_when_orbit_incomplete():
    t, r, v = ss.simulate_orbit(1.0, 0.0, years=0.5, dt=1e-3)
    assert math.isnan(ss.measure_period(t, r))


def test_euler_orbit_spirals_out():
    t, r, v = ss.simulate_orbit(1.0, 0.017, years=5.0, dt=1e-2, method="euler")
    assert np.linalg.norm(r[-1]) > 1.8
