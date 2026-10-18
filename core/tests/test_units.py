import math

from una_gravedad import units


def test_h0_in_per_gyr():
    # 67.4 km/s/Mpc = 67.4 / 3.0857e19 s⁻¹ × 3.156e16 s/Gyr ≈ 0.0689 /Gyr
    assert math.isclose(units.h0_per_gyr(67.4), 0.06893, rel_tol=1e-3)


def test_hubble_time():
    assert math.isclose(units.hubble_time_gyr(67.4), 14.51, rel_tol=1e-3)


def test_au_per_year_in_km_s():
    # La Tierra orbita a 2π UA/año ≈ 29.8 km/s
    assert math.isclose(2 * math.pi * units.AU_PER_YR_TO_KM_S, 29.79, rel_tol=1e-3)


def test_hubble_distance():
    assert math.isclose(units.hubble_distance_mpc(67.4), 4448, rel_tol=1e-3)
