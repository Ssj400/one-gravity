# 1. Portada e Introducción Interdisciplinaria

**Una sola gravedad, tres escalas:** un simulador numérico del Sistema Solar, una galaxia y el Universo

AST101 — Un Paseo por el Universo · Tarea 2, proyecto interdisciplinario · Pontificia Universidad Católica de Chile · 2 de noviembre de 2026

**Integrantes:** José Santiago Garrillo Fernández (jose.garrillo@estudiante.uc.cl) y Luis Erazo (luis.erazo@estudiante.uc.cl), ambos de la Licenciatura en Ingeniería en Ciencias de la Computación.

**Simulador:** https://ssj400.github.io/one-gravity/ · **Código:** https://github.com/Ssj400/one-gravity

## 1.1 La pregunta

La gravedad es una sola ley, pero actúa en escalas muy distintas. Entre la órbita de la Tierra (1 UA ≈ 1,5 × 10¹¹ m) y el tamaño del Universo observable (del orden de Gpc, 1 Gpc ≈ 3 × 10²⁵ m) hay unos catorce órdenes de magnitud. Nos preguntamos si un mismo programa, con la misma ley y el mismo método numérico, puede describir tres sistemas tan distintos: un planeta, una galaxia y el cosmos entero. Y, sobre todo, cómo saber que lo que muestra el programa es el Universo y no un error del código.

## 1.2 Qué proponemos

Construimos un simulador de gravedad con interfaz web. El código está en Python y corre dentro del navegador, así que cualquiera lo usa sin instalar nada. Un solo motor numérico, basado en la ley de gravitación de Newton y en el método *leapfrog*, se aplica a tres escalas:

1. **Sistema Solar.** La respuesta se conoce desde Kepler, por lo que sirve para validar el programa. Verificamos que de Newton salen las leyes de Kepler y que un método numérico mal elegido (Euler) inventa energía que no existe.
2. **Galaxia (NGC 3198).** Con datos reales de rotación, comparamos lo que predice la materia visible con lo que se observa. La diferencia exige un halo de materia oscura.
3. **Universo.** Calculamos la edad del Universo y la comparamos con 1.580 supernovas de tipo Ia reales (Pantheon+). Los datos solo calzan con una expansión acelerada por energía oscura.

## 1.3 Por qué es un proyecto interdisciplinario

Los dos somos de computación, así que lo interdisciplinario no es juntar dos carreras, sino mostrar que la computación es la forma de responder cada pregunta astronómica. Cada ramo aporta una pieza concreta:

- **Cálculo I:** cada paso del integrador sigue la recta tangente; la distancia a las supernovas es una integral que resolvemos con la regla del trapecio.
- **Matemáticas Discretas:** por inducción, una cantidad que se conserva en cada paso se conserva en todos; y N cuerpos forman N(N−1)/2 pares.
- **Arquitectura de Computadores:** los números en punto flotante se redondean y el error se acumula paso a paso. Separamos el error del método (Euler) del error de la máquina.
- **Programación Avanzada:** organizamos el código en módulos y funciones puras, con una suite de tests en la que cada test comprueba una ley física.
- **Experiencia laboral de José:** trabaja como desarrollador y de ahí viene la idea de las pruebas automáticas, la integración continua y la publicación automática de la web.
- **Introducción a la Programación (Luis):** base para leer el código y los tests, y así supervisar el trabajo y comprobar sus resultados con cálculos propios.

La astronomía no es un adorno del programa: define qué hay que simular, con qué datos comparar y cuándo un resultado es creíble.

## 1.4 Qué tiene de nuevo

Hay tres ideas que distinguen este trabajo. Primero, un único motor sirve para tres escalas. Segundo, las leyes físicas (Kepler, conservación de energía, una edad cercana a 13,8 Gyr) son tests automáticos: si el código se rompe, la física lo delata. Tercero, usamos a propósito un método incorrecto, Euler, para mostrar cómo un artefacto numérico puede pasar por fenómeno real. Además, todo es abierto y reproducible: el código, los tests y la web son públicos.

## 1.5 Quién hizo qué

**José** escribió el motor y el código de las tres escalas, los tests y las figuras, y la sección 3 con la teoría numérica. **Luis** se ocupó de la teoría astronómica, de los cálculos a mano con que se comparan los resultados del programa, de los datos, las referencias, los pies de figura, las secciones 1, 2, 4 y 5 y el formato final. Ambos revisamos el rigor astronómico. Declaramos el uso de herramientas de IA en la sección 5.

## 1.6 Cómo sigue el informe

La sección 2 presenta la teoría astronómica y numérica. La sección 3 describe el simulador y sus resultados. La sección 4 discute sus límites y su impacto, y la sección 5 reúne las conclusiones y las referencias.
