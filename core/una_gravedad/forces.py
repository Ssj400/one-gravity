"""Fuerzas: la ley de gravitación de Newton como aceleración.

Unidad 1 del plan de estudio (docs/unidad-1-motor.md).
"""

import numpy as np


def central_acceleration(r: np.ndarray, gm: float) -> np.ndarray:
    """
        Aceleración de un cuerpo en posición ``r`` por una masa central en el origen.
    
        a = -GM r / |r|³

        r : array de forma (2,) o (N, 2)
        Posición (o posiciones) respecto a la masa central.
        
        gm : float
        Producto G·M en las unidades de ``r`` y del tiempo (p. ej. 4π² en UA³/año²).

        retorna un array con la misma forma que ``r``.
        
        """
    nr = np.linalg.norm(r, axis=-1, keepdims=True)
    nrcubed = nr ** 3
    a = (-1 * gm * r) / nrcubed
    return a
    
