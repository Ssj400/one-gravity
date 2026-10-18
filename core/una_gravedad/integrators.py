"""Integradores: cómo dar un paso de tiempo sin inventar energía.

Unidad 1 del plan de estudio (docs/unidad-1-motor.md).

Las dos funciones de paso reciben el estado (r, v), el paso ``dt`` y una
función ``accel(r) -> a``. Devuelven el nuevo estado (r, v). No modifican sus
argumentos.
"""

from collections.abc import Callable

import numpy as np

Accel = Callable[[np.ndarray], np.ndarray]


def euler_step(r: np.ndarray, v: np.ndarray, dt: float, accel: Accel) -> tuple[np.ndarray, np.ndarray]:
    """
        r_{n+1} = r_n + v_n·dt
        v_{n+1} = v_n + a(r_n)·dt
    """
    rn1 = r + v*dt
    vn1 = v + accel(r)*dt
    return rn1, vn1


def leapfrog_step(r: np.ndarray, v: np.ndarray, dt: float, accel: Accel) -> tuple[np.ndarray, np.ndarray]:
    """Un paso de leapfrog en forma kick–drift–kick (Störmer–Verlet).

        v_{n+1/2} = v_n + a(r_n)·dt/2        (medio empujón)
        r_{n+1}   = r_n + v_{n+1/2}·dt       (desplazamiento completo)
        v_{n+1}   = v_{n+1/2} + a(r_{n+1})·dt/2   (el otro medio empujón, con la fuerza nueva)

    Cuesta una evaluación de ``accel`` por paso si se reutiliza a(r_{n+1}) en el
    paso siguiente; aquí se aceptan dos por simplicidad.
    """
    vn12 = v + accel(r)*dt*1/2
    rn1 = r + vn12*dt
    vn1 = vn12 + accel(rn1)*dt*1/2
    return rn1,vn1

STEPPERS = {"euler": euler_step, "leapfrog": leapfrog_step}


def integrate(
    r0: np.ndarray,
    v0: np.ndarray,
    dt: float,
    n_steps: int,
    accel: Accel,
    method: str = "leapfrog",
    record_every: int = 1,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Repite ``n_steps`` pasos y guarda la trayectoria.

    Devuelve ``(t, r, v)`` con ``t`` de forma (M,), y ``r``, ``v`` de forma
    (M, *r0.shape), donde M = n_steps // record_every + 1 (incluye el estado
    inicial). ``dt`` puede ser negativo para integrar hacia el pasado.

    Esta función es solo el ciclo; la física está en ``accel`` y en el paso.
    """
    step = STEPPERS[method]
    r = np.array(r0, dtype=float)
    v = np.array(v0, dtype=float)
    n_rec = n_steps // record_every + 1
    t_out = np.empty(n_rec)
    r_out = np.empty((n_rec, *r.shape))
    v_out = np.empty((n_rec, *v.shape))
    t_out[0], r_out[0], v_out[0] = 0.0, r, v
    k = 1
    for i in range(1, n_steps + 1):
        r, v = step(r, v, dt, accel)
        if i % record_every == 0:
            t_out[k], r_out[k], v_out[k] = i * dt, r, v
            k += 1
    return t_out[:k], r_out[:k], v_out[:k]
