# 2. Fundamentación Teórica y Técnica

No buscamos desarrollar toda la teoría detrás de cada modelo. En esta sección explicamos las ideas del curso y las ecuaciones que necesitamos para entender qué hace el programa.

## 2.1 Gravedad de Newton y leyes de Kepler

Para simular una órbita partimos de la gravitación de Newton. La magnitud de la aceleración de un planeta debida al Sol es:

> g(r) = GM/r².

Aquí G es la constante de gravitación, M la masa del Sol y r la distancia al planeta. La aceleración apunta hacia el Sol y disminuye al aumentar la distancia. Suponemos que la masa del planeta es pequeña frente a la solar e ignoramos la atracción de los otros planetas.

Comparamos las trayectorias calculadas con las leyes de Kepler de la clase 5: órbitas elípticas con el Sol en un foco; áreas iguales en tiempos iguales; y una relación entre el período y el tamaño de la órbita (*La consolidación del modelo heliocéntrico*, s. f.). Para esta última usamos:

> T²/a³ = 1, con T en años y a en unidades astronómicas.

T es el tiempo de una vuelta y a el semieje mayor, que representa el tamaño de la elipse. Una unidad astronómica (UA) es aproximadamente la distancia media entre la Tierra y el Sol. Esta forma de la ecuación corresponde a un cuerpo que orbita el Sol en las unidades adoptadas; no vale con la misma constante para cualquier estrella.

Para iniciar cada órbita usamos su tamaño y excentricidad, que indica cuánto se aleja de un círculo. El código calcula la velocidad inicial con la relación orbital conocida como vis-viva. Dejamos ese detalle en el programa: lo importante para nuestro trabajo es comprobar después si la trayectoria respeta las relaciones de Kepler.

## 2.2 Rotación de galaxias y materia oscura

Una curva de rotación muestra cómo cambia la velocidad orbital del gas o las estrellas con la distancia al centro de una galaxia. Para entender su relación con la masa, aproximamos el movimiento como circular y la distribución de masa como esférica. Igualamos la aceleración necesaria para girar, v²/r, con la gravitatoria, GM(<r)/r²:

> v²/r = GM(<r)/r² → M(<r) ≈ v²r/G.

M(<r) es la masa encerrada dentro del radio r. Si casi toda la masa estuviera concentrada hacia el centro, esperaríamos que la velocidad disminuyera suficientemente lejos de él. En cambio, muchas galaxias mantienen velocidades altas en sus regiones exteriores. Esta discrepancia, estudiada históricamente en galaxias como Andrómeda (Rubin y Ford, 1970), es una de las evidencias de materia oscura vistas en la clase 10 (*Cosmología, materia y energía oscura*, s. f.).

Para explorarla usamos NGC 3198 y los datos de SPARC (Lelli et al., 2016). Comparamos el aporte gravitacional del gas y las estrellas con un modelo que añade un **halo de materia oscura**, una distribución extendida de masa que no observamos mediante su luz. Elegimos un perfil pseudo-isotermo: un modelo sencillo descrito por el tamaño de su región central y la velocidad a la que tiende su contribución lejos del centro.

Para estimar la masa de las estrellas a partir de su luz usamos un cociente masa-luz fijo de 0,5 M☉/L☉, donde M☉ y L☉ son la masa y la luminosidad del Sol. Es un supuesto del cálculo, no una medición directa de toda la masa. También reconocemos que aproximar una galaxia como una esfera no representa exactamente su disco.

## 2.3 Expansión del Universo y supernovas

La clase 10 presenta la expansión del Universo y sus posibles destinos. La ley de Hubble–Lemaître relaciona la velocidad de alejamiento con la distancia:

> v = H₀d.

H₀ es la constante de Hubble actual y d la distancia. Esta relación orienta la interpretación a distancias pequeñas; para comparar supernovas lejanas usamos las distancias del modelo cosmológico, no una extrapolación simple de esta fórmula.

Representamos el tamaño relativo del Universo mediante el **factor de escala** a(t), que vale 1 hoy. No es el semieje orbital de la sección 2.1. Si a(t) crece, el Universo se expande. El estiramiento de la luz se mide con el **corrimiento al rojo** z, relacionado con el factor de escala en el momento de emisión por 1 + z = 1/a.

Para calcular la evolución incorporamos al programa una forma de la ecuación de Friedmann, sin derivarla (Ryden, 2016):

> ä = H₀²[ΩΛa − Ωm/(2a²)].

ä indica cómo cambia la rapidez de expansión. Ωm representa la densidad de materia actual y ΩΛ la de una constante cosmológica, nuestra forma simplificada de energía oscura. Ambas se expresan respecto de la densidad crítica, la referencia asociada a una geometría espacial plana. En esta ecuación, sin radiación, la materia frena la expansión y el término de energía oscura puede acelerarla. La usamos como herramienta del proyecto, sin desarrollar la relatividad general que fundamenta el modelo.

Para contrastar los escenarios usamos **supernovas de tipo Ia**. No todas tienen idéntica luminosidad: sus curvas de luz permiten estandarizarlas y estimar distancias, como vimos en la clase 9 (*Escalera de distancias*, s. f.). Su observación fue clave para identificar la expansión acelerada (Riess et al., 1998).

El programa relaciona el brillo esperado con la distancia y lo expresa mediante el **módulo de distancia** μ, una medida basada en magnitudes. Un valor mayor corresponde a una distancia mayor. Así podemos comparar las curvas con los datos de Pantheon+ (Scolnic et al., 2022; Brout et al., 2022), sin desarrollar aquí todas las fórmulas de distancia. Usamos pársecs como unidad: un kilopársec (kpc) son mil pársecs y un megapársec (Mpc), un millón.

## 2.4 Cómo hacemos los cálculos y los comprobamos

El computador avanza la simulación en pasos de duración Δt. Comparamos dos métodos. **Euler** usa la posición y la velocidad al inicio de cada paso para calcular el siguiente. Es sencillo, pero en las órbitas estudiadas acumula un error importante de energía. **Leapfrog** corrige primero la velocidad durante medio paso, avanza la posición y termina de corregir la velocidad con la aceleración nueva.

Elegimos leapfrog porque, con un paso suficientemente pequeño, mantiene el error de energía limitado en las pruebas orbitales. No conserva la energía de forma exactamente perfecta ni garantiza cualquier simulación (Hairer et al., 2003). En la sección 3 mostramos las tres instrucciones que realizan ese avance. Para las distancias cosmológicas usamos la regla del trapecio: dividimos el área bajo una función en partes pequeñas y sumamos sus aproximaciones.

Para comparar observaciones y predicciones usamos **χ²** (chi cuadrado). Este valor resume las diferencias considerando las incertidumbres de las mediciones: entre modelos comparados con los mismos datos y procedimiento, uno menor indica un mejor acuerdo. En las supernovas permitimos además desplazar verticalmente cada curva para no confundir una diferencia de calibración con una diferencia en su forma. No analizamos todas las relaciones entre los errores de las mediciones, por lo que esta comparación es didáctica.

Programamos los cálculos con Python y NumPy (Harris et al., 2020). Usamos pytest para ejecutar pruebas automáticas: comprobar resultados conocidos antes de interpretar casos más complejos. El mismo paquete funciona en el navegador mediante Pyodide, y Plotly dibuja los gráficos (The Pyodide development team, s. f.; Plotly Technologies Inc., s. f.). Las derivaciones y los detalles de implementación quedan disponibles en el repositorio, sin ser necesarios para seguir el argumento del informe.
