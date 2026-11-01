# 2. Fundamentación Teórica y Técnica

Antes de revisar los resultados, es conveniente explicar qué estamos calculando. Las relaciones que siguen permiten seguir el funcionamiento del programa y conectar sus gráficos con los contenidos del curso.

## 2.1 Gravedad de Newton y leyes de Kepler

Comenzamos con un planeta que se mueve alrededor del Sol. Según la gravitación de Newton, la magnitud de su aceleración es:

> g(r) = GM/r².

G es la constante de gravitación, M la masa solar y r la distancia entre ambos cuerpos. La relación dice algo sencillo: al aumentar la distancia, la aceleración disminuye. Tratamos cada planeta por separado y suponemos que su masa es pequeña frente a la del Sol.

Ahora, ¿cómo comprobamos el movimiento que resulta? Las leyes de Kepler, revisadas en la clase 5, nos dan una referencia: órbitas elípticas con el Sol en un foco, áreas iguales en tiempos iguales y una relación entre el período y el tamaño de la órbita (*La consolidación del modelo heliocéntrico*, s. f.). Esta última toma una forma muy simple en nuestras unidades:

> T²/a³ = 1, con T en años y a en unidades astronómicas.

T es el tiempo de una vuelta y a el semieje mayor, que describe el tamaño de la elipse. Una unidad astronómica (UA) es aproximadamente la distancia media entre la Tierra y el Sol, y el valor 1 corresponde a la masa solar en estas unidades.

Cada órbita comienza con un tamaño y una excentricidad, es decir, qué tanto se aparta de un círculo. El programa obtiene la velocidad inicial con la relación vis-viva y revisa si el movimiento respeta lo esperado.

## 2.2 Rotación de galaxias y materia oscura

Al pasar a una galaxia, la pregunta cambia: ¿la materia que vemos alcanza para explicar la velocidad de sus estrellas y su gas? Una **curva de rotación** muestra esas velocidades a distintas distancias del centro. Si aproximamos el movimiento como circular y la masa como esférica, igualamos la aceleración necesaria para girar con la gravitatoria:

> v²/r = GM(<r)/r² → M(<r) ≈ v²r/G.

M(<r) es la masa encerrada dentro del radio r. Si casi toda la masa estuviera en el centro, esperaríamos velocidades menores lejos de él; sin embargo, muchas galaxias mantienen velocidades altas en sus regiones exteriores. Esa diferencia se estudió en casos como Andrómeda (Rubin y Ford, 1970) y forma parte de las evidencias de la clase 10 (*Cosmología, materia y energía oscura*, s. f.).

Usamos NGC 3198 y los datos de SPARC (Lelli et al., 2016). Comparamos el aporte del gas y las estrellas con un modelo que agrega un **halo de materia oscura**, una distribución extendida de masa que no observamos por su luz. El perfil elegido, pseudo-isotermo, tiene dos parámetros: el tamaño de su región central y la velocidad a la que tiende lejos del centro.

Para convertir la luz de las estrellas en masa fijamos el cociente masa-luz en 0,5 M☉/L☉, donde los símbolos representan la masa y la luminosidad del Sol. Ese supuesto, junto con la aproximación esférica, limita nuestra estimación.

## 2.3 Expansión del Universo y supernovas

La expansión de la clase 10 puede parecer más difícil de llevar a un programa. Para comenzar, la ley de Hubble–Lemaître relaciona la velocidad de alejamiento con la distancia:

> v = H₀d.

H₀ es la constante de Hubble actual y d la distancia. Esta expresión sirve para observaciones cercanas; con supernovas lejanas usamos las relaciones de distancia del modelo cosmológico.

Para representar el tamaño relativo del Universo usamos el **factor de escala** a(t), cuyo valor actual fijamos en 1; aquí la letra tiene un significado distinto del semieje orbital. Su aumento representa la expansión, que también estira la luz. Ese estiramiento se mide con el **corrimiento al rojo** z, relacionado con el factor de escala al emitirse la luz por 1 + z = 1/a.

Para calcular cómo cambia a(t) incorporamos esta forma de la ecuación de Friedmann (Ryden, 2016):

> ä = H₀²[ΩΛa − Ωm/(2a²)].

ä indica cómo cambia la rapidez de expansión. Ωm representa la densidad actual de materia y ΩΛ la de una constante cosmológica, con la que modelamos la energía oscura. Ambas se comparan con la **densidad crítica**, la referencia asociada a una geometría plana. Lo importante es el efecto de los términos: la materia frena la expansión y una constante cosmológica positiva puede acelerarla. Esta versión ignora la radiación y se fundamenta en relatividad general.

Para comparar estas historias con observaciones recurrimos a las **supernovas de tipo Ia**, explosiones estelares que usamos como indicadores de distancia. Como vimos en la clase 9, su luminosidad se estandariza a partir de sus curvas de luz, aunque no todas brillan igual (*Escalera de distancias*, s. f.); esas observaciones fueron clave para identificar la expansión acelerada (Riess et al., 1998).

El brillo esperado se relaciona con la distancia mediante el **módulo de distancia** μ: un valor mayor corresponde a una distancia mayor. Así contrastamos las curvas con Pantheon+, una recopilación de mediciones de supernovas (Scolnic et al., 2022; Brout et al., 2022). Las distancias se expresan en pársecs; un kilopársec (kpc) equivale a mil y un megapársec (Mpc), a un millón.

## 2.4 Del modelo al cálculo

Tener una ecuación no resuelve cómo llevarla al computador. Para avanzar en el tiempo dividimos el movimiento en pasos de duración Δt. **Euler** utiliza la posición y la velocidad iniciales de cada paso para obtener las siguientes. **Leapfrog**, en cambio, actualiza la velocidad durante medio paso, avanza la posición y completa la actualización con la aceleración nueva.

Elegimos leapfrog porque mantiene acotado el error de energía en nuestras pruebas orbitales con pasos suficientemente pequeños (Hairer et al., 2003). Sigue siendo una aproximación, así que debemos comprobar sus resultados. Para las distancias cosmológicas usamos la **regla del trapecio**, que aproxima el área bajo una función sumando partes pequeñas.

El valor **χ²** (chi cuadrado) resume las diferencias entre predicciones y observaciones considerando sus incertidumbres: con los mismos datos y procedimiento, un valor menor indica mejor acuerdo. En supernovas permitimos desplazar verticalmente las curvas para ajustar diferencias de calibración; el alcance de esa comparación depende de cómo tratamos los errores, cuestión que retomamos en la discusión.

Programamos con Python y NumPy (Harris et al., 2020), y usamos pytest para comprobar resultados conocidos. Pyodide ejecuta ese código en el navegador y Plotly dibuja los gráficos (The Pyodide development team, s. f.; Plotly Technologies Inc., s. f.).
