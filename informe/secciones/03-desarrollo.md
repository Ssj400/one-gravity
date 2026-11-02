# 3. Desarrollo de la Propuesta / Prototipo

## 3.1 Organización del programa

Con las ideas anteriores construimos una web con cuatro pestañas: Sistema Solar, Galaxia, Universo y Supernovas. Las últimas dos abordan la misma escala desde el modelo y desde las observaciones. El usuario cambia los parámetros y el programa vuelve a calcular.

Separamos los cálculos, las pruebas, los datos y la interfaz para poder revisar cada parte. Es lo que aprendimos en Programación Avanzada: módulos pequeños, funciones que no guardan estado y una prueba por cada ley física.

```text
Parámetros elegidos → cálculo en Python + datos → resultados → figuras
```

React organiza los controles y Pyodide ejecuta Python en un **Web Worker**, un contexto de trabajo separado que permite calcular sin bloquear la interfaz. Plotly muestra los resultados, y el mismo código se usa en el navegador y en las pruebas, para no mantener dos versiones del cálculo.

## 3.2 Implementación y comprobación

El motor recibe la posición, la velocidad, el paso de tiempo y una función de aceleración. En `integrators.py`, un paso de leapfrog se realiza así; `r` es la posición, `v` la velocidad, `dt` el paso y `accel` la aceleración:

```python
vn12 = v + accel(r)*dt*1/2
rn1 = r + vn12*dt
vn1 = vn12 + accel(rn1)*dt*1/2
return rn1,vn1
```

Las tres actualizaciones corresponden al procedimiento ya explicado y se reutilizan cambiando la función de aceleración; en cosmología, la variable que avanzamos es el factor de escala. Así, una decisión de programación queda ligada al problema físico que buscamos representar.

Aquí entra una idea de Matemáticas Discretas. Si una propiedad se mantiene de un paso al siguiente, por inducción se mantiene después de cualquier número de pasos. Por eso las pruebas revisan el paso y unas pocas órbitas contra respuestas conocidas, como las leyes de Kepler o la edad de un universo con solución exacta, y no cada simulación completa. Aprobarlas nos da razones para confiar en esos cálculos dentro de las condiciones comprobadas.

## 3.3 Sistema Solar

Comenzamos simulando los planetas por separado. Para la Tierra, con pasos de 0,01 años durante cinco años, Euler produce una espiral: el error de energía llega al 57,6 % y la distancia final al Sol es de 2,01 UA. Con la misma fuerza y el mismo paso, leapfrog mantiene una trayectoria aproximadamente cerrada. A partir de esto reconocemos que la diferencia proviene del método elegido.

![Figura 1. (a) Movimiento de la Tierra durante cinco años, con pasos de 0,01 años. La espiral de Euler y la órbita cerrada de leapfrog muestran el efecto del método. (b) Error relativo de energía en la misma simulación: Euler llega al 57,6 %, mientras que leapfrog se mantiene muy por debajo.](figuras/fig1a_orbita.png|figuras/fig1b_energia.png)

En una prueba distinta, con una órbita terrestre inicialmente circular y pasos de 0,001 años, leapfrog mantiene un error relativo de energía menor que 10⁻⁶ durante 100 vueltas. También obtenemos T²/a³ cercano a 1 para los ocho planetas de la interfaz, con diferencias menores que 0,1 %; la prueba automática de esa relación cubre de Mercurio a Saturno.

![Figura 2. Relación entre período y semieje mayor para los ocho planetas, en ejes logarítmicos. Los resultados se acercan a T²/a³ = 1, con diferencias menores que 0,1 % en las unidades adoptadas.](figuras/fig2_kepler3.png)

## 3.4 Rotación de NGC 3198

Para esta galaxia usamos 43 mediciones de SPARC, que llegan hasta unos 44 kpc del centro (Lelli et al., 2016). Calculamos las velocidades debidas al gas, las estrellas y un posible halo, sin avanzar órbitas en el tiempo. La materia visible predice unos 65 km/s en la región exterior, frente a cerca de 150 km/s observados; agregar el halo mejora el acuerdo, con un radio central de aproximadamente 2,7 kpc y una velocidad límite de 142 km/s.

![Figura 3. Rotación de NGC 3198: datos de SPARC y aportes calculados. En la región exterior la materia visible predice unos 65 km/s, mientras que el halo permite acercarse a los 150 km/s observados (Lelli et al., 2016).](figuras/fig3_rotacion_ngc3198.png)

Con M ≈ v²r/G estimamos que alrededor del 81 % de la masa dentro del último radio sería oscura. Esta cifra depende de nuestros supuestos y corresponde a NGC 3198; sería incorrecto extenderla a la composición de todo el Universo o tomarla como una explicación de qué es la materia oscura.

## 3.5 Expansión del Universo

Tomando el presente como a = 1, calculamos hacia el pasado y el futuro. Comparamos los escenarios crítico, abierto, acelerado y de recolapso de la clase 10 (*Cosmología, materia y energía oscura*, s. f.).

![Figura 4. Evolución del factor de escala en los cuatro escenarios, con H₀ = 67,4 km/s/Mpc. Las curvas de solo materia llegan a a = 0 antes; el de recolapso termina invirtiendo su expansión.](figuras/fig4_factor_escala.png)

Con H₀ = 67,4 km/s/Mpc obtenemos edades de 9,67 Gyr para el caso crítico (Ωm = 1, ΩΛ = 0), 11,7 para el abierto (0,3; 0) y 13,86 para el acelerado (0,31; 0,69). Gyr significa mil millones de años. En el escenario de recolapso (5; 0), la mayor cantidad de materia detiene la expansión y luego la invierte. La edad del acelerado se acerca a los 13,8 Gyr inferidos por Planck (Planck Collaboration, 2020).

## 3.6 Comparación con supernovas

Para contrastar esas historias seleccionamos 1.580 mediciones de Pantheon+, excluyendo las calibradoras y exigiendo z > 0,01 (Scolnic et al., 2022; Brout et al., 2022). Son filas de datos, que pueden incluir observaciones de un mismo objeto. La figura 5a muestra el módulo de distancia frente al corrimiento al rojo; en la 5b restamos un universo vacío de referencia para distinguir mejor las diferencias.

![Figura 5. (a) Diagrama de Hubble con las 1.580 mediciones y los cuatro modelos. (b) Diferencias respecto de un universo vacío de referencia, que hacen visible la separación entre escenarios sin agregar una prueba estadística.](figuras/fig5a_hubble.png|figuras/fig5b_residuos.png)

El escenario acelerado obtiene el menor χ², aproximadamente 686, seguido del abierto (817), el crítico (1.331) y el de recolapso (5.702). Dentro de esta comparación, el primero sigue mejor los datos. El resultado ilustra por qué es relevante contrastar las curvas con observaciones, aunque nuestro procedimiento simplificado no permite asignarle una certeza estadística.
