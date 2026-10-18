"""Unidad 1 — el motor: fuerza e integradores."""

import numpy as np
import pytest

from una_gravedad.forces import central_acceleration
from una_gravedad.integrators import euler_step, integrate, leapfrog_step
from una_gravedad.units import GM_SUN_AU3_YR2

GM = GM_SUN_AU3_YR2


def accel(r):
    return central_acceleration(r, GM)


def test_central_acceleration_points_to_origin_with_inverse_square_magnitude():
    a = central_acceleration(np.array([2.0, 0.0]), GM)
    assert a.shape == (2,)
    assert np.allclose(a, [-GM / 4.0, 0.0])


def test_central_acceleration_accepts_many_bodies():
    r = np.array([[1.0, 0.0], [0.0, 3.0]])
    a = central_acceleration(r, GM)
    assert a.shape == (2, 2)
    assert np.allclose(a[0], [-GM, 0.0])
    assert np.allclose(a[1], [0.0, -GM / 9.0])


def test_steps_do_not_mutate_inputs():
    r = np.array([1.0, 0.0])
    v = np.array([0.0, 2 * np.pi])
    r_copy, v_copy = r.copy(), v.copy()
    euler_step(r, v, 0.01, accel)
    leapfrog_step(r, v, 0.01, accel)
    assert np.array_equal(r, r_copy) and np.array_equal(v, v_copy)


def test_euler_step_formula():
    r = np.array([1.0, 0.0])
    v = np.array([0.0, 1.0])
    r1, v1 = euler_step(r, v, 0.1, accel)
    assert np.allclose(r1, r + 0.1 * v)
    assert np.allclose(v1, v + 0.1 * accel(r))


def test_leapfrog_step_formula():
    r = np.array([1.0, 0.0])
    v = np.array([0.0, 1.0])
    r1, v1 = leapfrog_step(r, v, 0.1, accel)
    v_half = v + 0.05 * accel(r)
    r_new = r + 0.1 * v_half
    assert np.allclose(r1, r_new)
    assert np.allclose(v1, v_half + 0.05 * accel(r_new))


def circular_earth():
    """Tierra en órbita circular: r = 1 UA, v = 2π UA/año."""
    return np.array([1.0, 0.0]), np.array([0.0, 2 * np.pi])


def energy(r, v):
    return 0.5 * np.sum(v**2, axis=-1) - GM / np.linalg.norm(r, axis=-1)


def test_leapfrog_conserves_energy_over_100_orbits():
    r0, v0 = circular_earth()
    t, r, v = integrate(r0, v0, 1e-3, 100_000, accel, "leapfrog", record_every=100)
    e = energy(r, v)
    assert np.max(np.abs(e - e[0]) / abs(e[0])) < 1e-6


def test_euler_invents_energy():
    """El método ingenuo gana más de 10 % de energía en 5 años con dt = 0.01."""
    r0, v0 = circular_earth()
    t, r, v = integrate(r0, v0, 1e-2, 500, accel, "euler")
    e = energy(r, v)
    assert (e[-1] - e[0]) / abs(e[0]) > 0.10
    assert np.linalg.norm(r[-1]) > 1.5  # y la Tierra se fue lejos


def test_leapfrog_is_time_reversible():
    r0, v0 = circular_earth()
    _, r, v = integrate(r0, v0, 1e-3, 2_000, accel, "leapfrog")
    _, r_back, v_back = integrate(r[-1], v[-1], -1e-3, 2_000, accel, "leapfrog")
    assert np.allclose(r_back[-1], r0, atol=1e-9)
    assert np.allclose(v_back[-1], v0, atol=1e-9)


def test_integrate_records_initial_state_and_time():
    r0, v0 = circular_earth()
    t, r, v = integrate(r0, v0, 0.5, 4, accel, "leapfrog", record_every=2)
    assert t.tolist() == [0.0, 1.0, 2.0]
    assert np.array_equal(r[0], r0)


@pytest.mark.parametrize("method", ["euler", "leapfrog"])
def test_both_methods_cost_similar_and_run(method):
    r0, v0 = circular_earth()
    t, r, v = integrate(r0, v0, 1e-2, 100, accel, method)
    assert r.shape == (101, 2)
