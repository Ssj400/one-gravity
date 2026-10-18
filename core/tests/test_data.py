import math

import numpy as np

from una_gravedad.data import load_pantheon, load_sparc


def test_sparc_ngc3198():
    d = load_sparc()
    assert d["distance_mpc"] == 13.8
    assert d["r_kpc"].size == 43
    assert d["r_kpc"][0] == 0.32 and d["v_obs"][-1] == 149.0
    assert np.all(d["v_bulge"] == 0.0)  # NGC 3198 no tiene bulbo en el modelo SPARC


def test_pantheon_hubble_flow_sample():
    d = load_pantheon()
    assert 1500 < d["z"].size < 1701
    assert d["z"].min() > 0.01 and d["z"].max() > 2.0
    assert np.all(d["mu_err"] > 0)


def test_pantheon_full_table():
    d = load_pantheon(hubble_flow_only=False)
    assert d["z"].size == 1701
    assert math.isclose(d["mu"][0], 28.9987)  # SN 2011fe, primera fila
