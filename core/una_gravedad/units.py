"""Unidades y constantes. Se eligen para que los números queden cerca de 1.

Escala          Distancia   Tiempo    Masa     Constante
Sistema Solar   UA          año       M☉       G·M☉ = 4π²  ⇒  T² = a³
Galaxia         kpc         (km/s)    M☉       G = 4.30e-6 kpc (km/s)² / M☉
Universo        —  (factor de escala a, adimensional)   Gyr   H0 en 1/Gyr
"""

import math

# --- Sistema Solar: UA, año, M☉ ------------------------------------------
GM_SUN_AU3_YR2 = 4.0 * math.pi**2  # G·M☉ en UA³/año²: con esto T² = a³ exactamente
AU_KM = 1.495978707e8  # 1 UA en km (IAU 2012)
YEAR_S = 365.25 * 86400.0  # 1 año juliano en s
AU_PER_YR_TO_KM_S = AU_KM / YEAR_S  # 1 UA/año ≈ 4.740 km/s
GM_SUN_KM3_S2 = 1.32712440018e11  # G·M☉ en km³/s² (DE440)

# --- Galaxia: kpc, km/s, M☉ ------------------------------------------------
G_KPC_KMS2_MSUN = 4.30091e-6  # G en kpc (km/s)² / M☉
KPC_KM = 3.0856775814913673e16  # 1 kpc en km

# --- Universo: Gyr, Mpc ------------------------------------------------------
MPC_KM = 3.0856775814913673e19  # 1 Mpc en km
GYR_S = 1e9 * YEAR_S  # 1 Gyr en s
C_KM_S = 299792.458  # velocidad de la luz en km/s

# Valores de referencia (Planck 2018, TT,TE,EE+lowE+lensing; verificar al citar)
H0_PLANCK = 67.4  # km/s/Mpc
OMEGA_M_PLANCK = 0.315
OMEGA_L_PLANCK = 0.685
# Escalera de distancias (SH0ES 2022; verificar al citar)
H0_SH0ES = 73.0


def h0_per_gyr(h0_km_s_mpc: float) -> float:
    """Convierte H0 de km/s/Mpc a 1/Gyr. Para 67.4 da ≈ 0.0689 /Gyr."""
    return h0_km_s_mpc / MPC_KM * GYR_S


def hubble_time_gyr(h0_km_s_mpc: float) -> float:
    """Tiempo de Hubble 1/H0 en Gyr. Para 67.4 da ≈ 14.5 Gyr."""
    return 1.0 / h0_per_gyr(h0_km_s_mpc)


def hubble_distance_mpc(h0_km_s_mpc: float) -> float:
    """Distancia de Hubble c/H0 en Mpc. Para 67.4 da ≈ 4448 Mpc."""
    return C_KM_S / h0_km_s_mpc
