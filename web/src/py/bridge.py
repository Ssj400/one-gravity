"""Puente entre la página y el paquete ``una_gravedad`` dentro de Pyodide.

Cada función recibe sus parámetros como JSON (string) y devuelve JSON. Así el
paquete sigue siendo puro: la conversión de tipos JS ↔ Python vive solo aquí.
"""

import json

import numpy as np

from una_gravedad import data, galaxy as g, solar_system as ss, supernovae as sn, universe as u

DATA: dict[str, str] = {}  # textos de los archivos de datos, los pone JS


def set_data(name: str, text: str) -> None:
    DATA[name] = text


def _l(x) -> list:
    return np.asarray(x, dtype=float).tolist()


def _thin(n: int, target: int) -> int:
    return max(1, n // target)


def solar(p: dict) -> dict:
    a, e = ss.PLANETS[p["planet"]]
    years, dt = float(p["years"]), float(p["dt"])
    n = int(round(years / dt))
    out: dict = {"a": a, "e": e, "planet": p["planet"]}
    for method in ("leapfrog", "euler"):
        t, r, v = ss.simulate_orbit(a, e, years, dt, method, _thin(n, 4000))
        en = ss.specific_energy(r, v)
        out[method] = {
            "t": _l(t),
            "x": _l(r[:, 0]),
            "y": _l(r[:, 1]),
            "energy_err": _l((en - en[0]) / abs(en[0])),
            "r_final": float(np.linalg.norm(r[-1])),
        }
    return out


def kepler3(p: dict) -> list:
    rows = []
    for name, (a, e) in ss.PLANETS.items():
        t_exp = a**1.5
        t, r, _ = ss.simulate_orbit(a, e, 1.2 * t_exp, t_exp / 4000, "leapfrog", 4)
        period = ss.measure_period(t, r)
        rows.append({"planet": name, "a": a, "e": e, "T": period, "ratio": period**2 / a**3})
    return rows


def universe(p: dict) -> list:
    h0, t_future, dt = float(p["h0"]), float(p["t_future"]), float(p["dt"])
    out = []
    for m in p["models"]:
        om, ol = float(m["om"]), float(m["ol"])
        tf, af, _ = u.expand(om, ol, h0, t_future, dt)
        tp, ap, _ = u.expand(om, ol, h0, 40.0, -dt)
        t = np.concatenate([tp[::-1], tf[1:]])
        a = np.concatenate([ap[::-1], af[1:]])
        step = _thin(t.size, 1500)
        exact = None
        if ol == 0.0 and om == 1.0:
            exact = u.age_critical_exact(h0)
        elif ol > 0.0 and abs(om + ol - 1.0) < 1e-9:
            exact = u.age_flat_lcdm_exact(om, h0)
        elif om == 0.0 and ol == 0.0:
            exact = u.age_empty_exact(h0)
        out.append({
            "name": m["name"],
            "om": om,
            "ol": ol,
            "t": _l(t[::step]),
            "a": _l(a[::step]),
            "age": float(u.age_numeric(om, ol, h0)),
            "age_exact": exact,
            "recollapses": bool(af[-1] < 1.0),
        })
    return out


def supernovae(p: dict) -> dict:
    d = data.load_pantheon(text=DATA["pantheon"])
    h0 = float(p["h0"])
    z = np.linspace(0.01, float(p.get("zmax", 2.3)), 200)
    # Referencia para los residuos: el universo vacío (Ωm = ΩΛ = 0) con su mejor desplazamiento.
    _, delta_empty = sn.chi_square(d["z"], d["mu"], d["mu_err"], h0, 0.0, 0.0)
    mu_empty_grid = sn.distance_modulus(sn.luminosity_distance(z, h0, 0.0, 0.0)) + delta_empty
    mu_empty_data = sn.distance_modulus(sn.luminosity_distance(d["z"], h0, 0.0, 0.0)) + delta_empty
    res = d["mu"] - mu_empty_data
    # Residuos promediados en 18 bins logarítmicos de z (media ponderada por 1/σ²).
    edges = np.logspace(np.log10(d["z"].min()), np.log10(d["z"].max()) + 1e-9, 19)
    idx = np.digitize(d["z"], edges) - 1
    w = 1.0 / d["mu_err"] ** 2
    bins = []
    for k in range(18):
        sel = idx == k
        if sel.sum() < 3:
            continue
        bins.append({
            "z": float(np.exp(np.mean(np.log(d["z"][sel])))),
            "res": float(np.sum(w[sel] * res[sel]) / np.sum(w[sel])),
            "err": float(1.0 / np.sqrt(np.sum(w[sel]))),
            "n": int(sel.sum()),
        })
    models = []
    for m in p["models"]:
        om, ol = float(m["om"]), float(m["ol"])
        mu = sn.distance_modulus(sn.luminosity_distance(z, h0, om, ol))
        chi2, delta = sn.chi_square(d["z"], d["mu"], d["mu_err"], h0, om, ol)
        models.append({
            "name": m["name"], "om": om, "ol": ol, "z": _l(z),
            "mu": _l(mu + delta), "res": _l(mu + delta - mu_empty_grid),
            "chi2": chi2, "delta": delta,
        })
    return {
        "n": int(d["z"].size),
        "data": {"z": _l(d["z"]), "mu": _l(d["mu"]), "err": _l(d["mu_err"]), "res": _l(res)},
        "bins": bins,
        "models": models,
    }


def galaxy(p: dict) -> dict:
    d = data.load_sparc(text=DATA["sparc"])
    r = d["r_kpc"]
    v_vis = g.visible_velocity(d["v_gas"], d["v_disk"], d["v_bulge"], float(p["ups_disk"]), float(p["ups_bulge"]))
    rc, vinf, chi2 = float(p["r_core"]), float(p["v_inf"]), None
    if p.get("fit"):
        rc, vinf, chi2 = g.fit_halo(r, d["v_obs"], d["v_err"], v_vis)
    v_h = g.halo_velocity(r, rc, vinf)
    v_tot = g.total_velocity(v_vis, v_h)
    if chi2 is None:
        chi2 = float(np.sum(((d["v_obs"] - v_tot) / d["v_err"]) ** 2))
    m_dyn = float(g.enclosed_mass(d["v_obs"][-1], r[-1]))
    m_vis = float(g.enclosed_mass(v_vis[-1], r[-1]))
    return {
        "distance_mpc": d["distance_mpc"],
        "r": _l(r),
        "v_obs": _l(d["v_obs"]),
        "v_err": _l(d["v_err"]),
        "v_vis": _l(v_vis),
        "v_halo": _l(v_h),
        "v_tot": _l(v_tot),
        "r_core": rc,
        "v_inf": vinf,
        "chi2": float(chi2),
        "n": int(r.size),
        "m_dyn": m_dyn,
        "m_vis": m_vis,
        "r_last": float(r[-1]),
    }


FUNCTIONS = {"solar": solar, "kepler3": kepler3, "universe": universe, "supernovae": supernovae, "galaxy": galaxy}


def call(fn: str, params_json: str) -> str:
    return json.dumps(FUNCTIONS[fn](json.loads(params_json)))
