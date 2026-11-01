# 1. Portada e Introducción Interdisciplinaria

**Una sola gravedad, tres escalas:** una herramienta para explorar órbitas, galaxias y expansión del Universo

AST101 — Un Paseo por el Universo · Tarea 2, proyecto interdisciplinario · Pontificia Universidad Católica de Chile · 2 de noviembre de 2026

**Integrantes:** José Santiago Garrillo Fernández (jose.garrillo@estudiante.uc.cl) y Luis Erazo (luis.erazo@estudiante.uc.cl), ambos de la Licenciatura en Ingeniería en Ciencias de la Computación.

**Simulador:** https://ssj400.github.io/one-gravity/ · **Código:** https://github.com/Ssj400/one-gravity

## 1.1 Qué queremos explorar

En clases vimos que conocer el Universo requiere comparar modelos con observaciones, y no solo producir una explicación convincente (*Modelos de Universo*, s. f.). A partir de esa idea, nos propusimos construir una herramienta que permita cambiar parámetros y observar sus consecuencias. La pregunta que conecta todo el proyecto es: ¿cómo distinguimos un resultado físico de un error del programa?

Exploramos tres escalas. Primero, simulamos un planeta alrededor del Sol y comprobamos resultados conocidos de Kepler. Después, comparamos la rotación de una galaxia con lo que predice su materia visible. Finalmente, representamos distintos escenarios de expansión del Universo y los contrastamos con mediciones de supernovas.

Como estudiantes de computación, nos interesó convertir estos contenidos en algo que pudiéramos programar y probar. El vínculo es la gravedad, pero no resolvemos los tres problemas de manera idéntica: avanzamos las órbitas y la expansión en el tiempo, mientras que para la galaxia calculamos velocidades de rotación. En cosmología usamos además fórmulas basadas en relatividad general; no intentamos desarrollar esa teoría.

## 1.2 Cómo se unen astronomía y computación

La astronomía nos dio las preguntas y los datos con que comparar. Desde computación aportamos una forma de organizar los cálculos, detectar errores y mostrar los resultados. Relacionamos el trabajo con herramientas de nuestra formación:

- **Cálculo I:** aproximamos movimientos mediante pasos pequeños y calculamos distancias sumando áreas con la regla del trapecio.
- **Matemáticas Discretas:** organizamos las condiciones lógicas de las pruebas y distinguimos comprobar casos de demostrar una propiedad general.
- **Arquitectura de Computadores:** reconocemos que el computador redondea números y que una simulación siempre tiene precisión limitada.
- **Programación Avanzada:** separamos el código en módulos y usamos pruebas automáticas para detectar errores.
- **Experiencias del equipo:** José aporta prácticas de su trabajo como desarrollador, como las pruebas y la publicación automática. Luis utiliza su formación en Introducción a la Programación para leer el código, revisar los resultados y relacionarlos con la astronomía.

Nuestra propuesta combina esas herramientas en una web que funciona sin instalar programas. Su aporte didáctico es mostrar tanto un cálculo útil como uno que falla: al comparar dos métodos para una órbita, podemos ver por qué una figura atractiva no basta para confiar en una simulación.

## 1.3 Organización del trabajo

José se encargó del motor de cálculo, las pruebas, las visualizaciones y el desarrollo técnico de la sección 3. Luis trabajó en la fundamentación astronómica, las fuentes, los pies de figura y las secciones 1, 2, 4 y 5. La declaración de apoyo con IA se incluye en la sección 5 para precisar cómo se elaboraron el código y el texto.

En lo que sigue presentamos las ecuaciones necesarias para entender la herramienta, mostramos sus resultados y discutimos qué podemos concluir de ellos y qué queda fuera de su alcance.
