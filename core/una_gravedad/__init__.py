"""Una sola gravedad, tres escalas.

Un motor numérico (``integrators``) resuelve la misma ecuación de movimiento en
tres escenarios: ``solar_system`` (validación con las leyes de Kepler),
``galaxy`` (curvas de rotación y materia oscura) y ``universe`` /
``supernovae`` (expansión, energía oscura y supernovas Ia).

El paquete no hace I/O salvo en ``data.py``; todo lo demás son funciones puras
sobre arreglos de numpy, de modo que corre igual en pytest y en el navegador
(Pyodide).
"""

__version__ = "0.1.0"
