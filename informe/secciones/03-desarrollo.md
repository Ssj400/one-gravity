# 3. Desarrollo de la Propuesta / Prototipo

## 3.1 De una pregunta a una figura

Construimos una web con cuatro pestañas: Sistema Solar, Galaxia, Universo y Supernovas. Las dos últimas exploran la misma escala cosmológica desde el modelo y las observaciones. La persona elige parámetros, el programa calcula los resultados y las figuras se actualizan; no son animaciones con resultados pregrabados.

Separamos el proyecto en cuatro partes: ecuaciones y métodos de cálculo, pruebas automáticas, datos originales e interfaz. El recorrido básico es:

```text
Parámetros elegidos → cálculo en Python + datos → resultados → figuras
```

React organiza los controles. El cálculo se ejecuta con Pyodide en un Web Worker, un proceso de trabajo separado que evita bloquear la interfaz. Plotly representa los resultados. Usamos el mismo paquete Python en la web y en las pruebas locales, para no mantener dos versiones distintas de las ecuaciones.

## 3.2 El avance temporal y sus pruebas

El motor recibe una posición, una velocidad, un paso de tiempo y una función que calcula la aceleración. Repite el avance y guarda la evolución. Este extracto de `integrators.py` realiza un paso de leapfrog; `r` es la posición, `v` la velocidad, `dt` el paso y `accel` la función de aceleración:

```python
vn12 = v + accel(r)*dt*1/2
rn1 = r + vn12*dt
vn1 = vn12 + accel(rn1)*dt*1/2
return rn1,vn1
```

Las instrucciones corresponden a la media corrección de velocidad, el avance de posición y la segunda media corrección. Podemos reutilizarlas cambiando la función de aceleración. En cosmología, la variable que evoluciona es el factor de escala, no la posición de un planeta.

No comprobamos el programa solo mirando sus figuras. Las pruebas comparan órbitas con las leyes de Kepler y edades cosmológicas con soluciones conocidas para ciertos parámetros. También revisan propiedades del código, como no modificar los datos de entrada. Esto detecta errores concretos, sin demostrar que el modelo incluya toda la física real.

## 3.3 Sistema Solar: empezar por un caso conocido

Simulamos por separado cada planeta alrededor del Sol. Para la Tierra, con pasos de 0,01 años durante cinco años, Euler produce una espiral y un error de energía de 57,6 %. El planeta termina a 2,01 UA del Sol. Leapfrog mantiene una trayectoria aproximadamente cerrada con la misma fuerza y el mismo paso (figuras 1a y 1b). La diferencia está en cómo calculamos el movimiento, no en una fuerza nueva.

En una prueba más exigente y distinta de esa figura, una Tierra inicialmente circular con leapfrog y pasos de 0,001 años mantiene un error relativo de energía menor que 10⁻⁶ durante 100 órbitas. Conservamos esa cifra como control técnico, no como requisito para entender el resultado visual.

También medimos el período de los ocho planetas de la interfaz y obtenemos T²/a³ cercano a 1, con diferencias menores que 0,1 % (figura 2). La prueba automática de esta relación cubre de Mercurio a Saturno. Así conectamos la simulación con un contenido conocido del curso antes de pasar a escalas menos intuitivas.

## 3.4 Galaxia: lo visible no explica toda la rotación

Para NGC 3198 usamos 43 mediciones de SPARC, hasta unos 44 kpc del centro (Lelli et al., 2016). Aquí no avanzamos órbitas en el tiempo: calculamos las contribuciones gravitacionales del gas, las estrellas y un posible halo, y comparamos la curva resultante con los datos.

En la región exterior, la materia visible predice unos 65 km/s, frente a los aproximadamente 150 km/s observados. Al añadir el halo obtenemos un mejor acuerdo (figura 3). El ajuste de referencia entrega un radio central de unos 2,7 kpc y una velocidad límite de 142 km/s.

Con M ≈ v²r/G estimamos que cerca del 81 % de la masa dentro del último radio sería oscura, bajo los supuestos adoptados. Esta proporción corresponde a este modelo de NGC 3198: no es una medición de la composición de todo el Universo ni determina de qué está hecha la materia oscura.

## 3.5 Universo: comparar historias posibles

Tomamos el presente como a = 1 y calculamos hacia el futuro y hacia el pasado. Comparamos los cuatro escenarios de la clase 10: crítico, abierto, acelerado y de recolapso (*Cosmología, materia y energía oscura*, s. f.). Cambiar la cantidad de materia y energía oscura cambia la forma de las curvas (figura 4).

Con H₀ = 67,4 km/s/Mpc, obtenemos edades aproximadas de 9,67 mil millones de años para el escenario crítico (Ωm = 1, ΩΛ = 0), 11,7 para el abierto (0,3; 0) y 13,86 para el acelerado (0,31; 0,69). El cuarto caso, con mucha más materia (5; 0), ilustra una expansión que se detiene y luego se invierte. Gyr es la abreviatura de mil millones de años.

El escenario acelerado tiene una edad cercana a los 13,8 Gyr inferidos por Planck (Planck Collaboration, 2020). Es una comparación, no una condición que impongamos al programa para que todos los modelos den la misma respuesta.

## 3.6 Supernovas: mirar cuál curva sigue los datos

Seleccionamos 1.580 mediciones de Pantheon+, al excluir las calibradoras y exigir z > 0,01 (Scolnic et al., 2022; Brout et al., 2022). Son filas de datos, no necesariamente 1.580 objetos distintos. La figura 5a relaciona el corrimiento al rojo con el módulo de distancia; la figura 5b muestra las diferencias respecto de un universo vacío de referencia para distinguir mejor las curvas.

El escenario acelerado obtiene el menor χ², aproximadamente 686, seguido del abierto (817), el crítico (1.331) y el de recolapso (5.702). Con el mismo procedimiento y datos, el primero representa mejor las observaciones entre las alternativas elegidas. No usamos estos valores para declarar una certeza estadística ni para afirmar que hemos descubierto nuevamente la energía oscura.

Publicamos el código, la procedencia de los datos y las pruebas para que se puedan revisar y repetir los cálculos. Además, antes de publicar cambios en la web se ejecutan las pruebas automáticamente. El resultado es un prototipo didáctico que conecta parámetros, predicciones y observaciones.
