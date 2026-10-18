"""Fuerzas: la ley de gravitación de Newton como aceleración.

Unidad 1 del plan de estudio (docs/unidad-1-motor.md).
"""

import numpy as np


def central_acceleration(r: np.ndarray, gm: float) -> np.ndarray:
    """Aceleración de un cuerpo en posición ``r`` por una masa central en el origen.

    a = -GM r / |r|³

    Parámetros
    ----------
    r : array de forma (2,) o (N, 2)
        Posición (o posiciones) respecto a la masa central.
    gm : float
        Producto G·M en las unidades de ``r`` y del tiempo (p. ej. 4π² en UA³/año²).

    Devuelve
    --------
    array con la misma forma que ``r``.

    Pista: para (N, 2) calcula |r| por fila con ``np.linalg.norm(r, axis=-1, keepdims=True)``.
    """
    raise NotImplementedError("Unidad 1: escribe central_acceleration (forces.py)")
