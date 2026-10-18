"""Lectura de los datos descargados (único módulo con I/O).

Los archivos se guardan tal como se descargaron en ``data/``; ver data/FUENTES.md.
En el navegador el mismo código lee copias servidas como texto estático.
"""

from pathlib import Path

import numpy as np

DATA_DIR = Path(__file__).resolve().parents[2] / "data"

SPARC_COLUMNS = ("r_kpc", "v_obs", "v_err", "v_gas", "v_disk", "v_bulge", "sb_disk", "sb_bulge")


def load_sparc(path: str | Path | None = None, text: str | None = None) -> dict[str, np.ndarray | float]:
    """Lee un archivo ``*_rotmod.dat`` de SPARC.

    Devuelve un dict con las columnas de ``SPARC_COLUMNS`` (arreglos float, km/s
    y kpc) y ``distance_mpc`` leído del encabezado ``# Distance = 13.8 Mpc``.
    Acepta la ruta o directamente el texto (``text``), para Pyodide.
    """
    if text is None:
        path = Path(path) if path else DATA_DIR / "sparc" / "NGC3198_rotmod.dat"
        text = path.read_text()
    lines = text.splitlines()
    distance = float("nan")
    for line in lines:
        if line.startswith("# Distance"):
            distance = float(line.split("=")[1].split()[0])
            break
    rows = np.loadtxt([ln for ln in lines if ln and not ln.startswith("#")])
    out: dict[str, np.ndarray | float] = {name: rows[:, i] for i, name in enumerate(SPARC_COLUMNS)}
    out["distance_mpc"] = distance
    return out


def load_pantheon(path: str | Path | None = None, text: str | None = None, hubble_flow_only: bool = True) -> dict[str, np.ndarray]:
    """Lee ``Pantheon+SH0ES.dat`` y devuelve ``z`` (zHD), ``mu`` (MU_SH0ES) y ``mu_err`` (MU_SH0ES_ERR_DIAG).

    Con ``hubble_flow_only`` se excluyen las supernovas calibradoras (IS_CALIBRATOR = 1)
    y se exige z > 0,01, como hace el análisis cosmológico de Pantheon+ (Brout et al. 2022).
    Los errores son solo diagonales: el README advierte que sirven para graficar,
    no para ajustar parámetros con rigor.
    """
    if text is None:
        path = Path(path) if path else DATA_DIR / "pantheon_plus" / "Pantheon+SH0ES.dat"
        text = path.read_text()
    lines = text.splitlines()
    header = lines[0].split()
    col = {name: i for i, name in enumerate(header)}
    rows = [ln.split() for ln in lines[1:] if ln.strip()]
    z = np.array([float(r[col["zHD"]]) for r in rows])
    mu = np.array([float(r[col["MU_SH0ES"]]) for r in rows])
    err = np.array([float(r[col["MU_SH0ES_ERR_DIAG"]]) for r in rows])
    calib = np.array([int(r[col["IS_CALIBRATOR"]]) for r in rows])
    keep = np.ones_like(z, dtype=bool)
    if hubble_flow_only:
        keep = (calib == 0) & (z > 0.01)
    return {"z": z[keep], "mu": mu[keep], "mu_err": err[keep]}
