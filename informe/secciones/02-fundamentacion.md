# 2. Fundamentación Teórica y Técnica

> Borrador en prosa. `[ECUACIÓN N: …]` marca dónde van las ecuaciones de Luis. La subsección 2.4 la escribe José.

## 2.1 Gravedad de Newton y órbitas

Todo el proyecto parte de una sola ley. Dos masas se atraen con una fuerza proporcional al producto de sus masas e inversamente proporcional al cuadrado de su distancia. Para un planeta que orbita el Sol, la aceleración apunta siempre hacia el Sol y vale GM/r², con G la constante de gravitación, M la masa del Sol y r la distancia entre ambos. `[ECUACIÓN 1: aceleración central]`

De esta ley salen las leyes de Kepler (clases 4 y 5 del curso). No las supusimos: las comprobamos. La tercera dice que el cuadrado del período orbital T es proporcional al cubo del semieje mayor a. En años, unidades astronómicas (UA) y masas solares, la constante de proporcionalidad vale 1, de modo que T²/a³ = 1. `[ECUACIÓN 2: tercera ley]` Otra cantidad que usamos es el momento angular específico, es decir, el momento angular por unidad de masa. Se conserva porque la fuerza es central, y esa conservación equivale a la segunda ley de Kepler (áreas iguales en tiempos iguales).

La ecuación vis-viva da la rapidez v de un cuerpo en cada punto de una órbita elíptica a partir de su distancia al Sol. `[ECUACIÓN 3: vis-viva]` Como ejemplo hecho a mano, con ella calculamos la velocidad de Mercurio en el perihelio, su punto más cercano al Sol. Obtenemos aproximadamente 59 km/s, frente a los 58,98 km/s de NASA. `[Luis: poner tus datos de entrada y el cálculo]` Este cálculo independiente es la referencia con la que medimos al programa.

## 2.2 Galaxias y materia oscura

La curva de rotación de una galaxia es la velocidad circular de sus estrellas y su gas en función de la distancia al centro. Si conocemos esa velocidad v a un radio r, la masa encerrada, es decir, la masa total que hay más cerca del centro que r, sale de igualar la fuerza gravitacional con la fuerza centrípeta. `[ECUACIÓN 4: masa encerrada]`

Lo esperable es que, fuera del disco visible, la velocidad disminuya, como ocurre en el Sistema Solar. Sin embargo, Rubin y Ford (1970) midieron la rotación de Andrómeda y la curva resultó plana. Antes, Zwicky (1933) ya había sospechado, al estudiar el cúmulo de Coma, que existe masa que no vemos. Una explicación es un halo de materia oscura, una distribución de masa extendida que no emite luz. Usamos un halo de perfil pseudo-isotermo, descrito por un radio de núcleo r_c y una velocidad asintótica v_∞. `[ECUACIÓN 5: halo]`

Aplicamos esto a NGC 3198 con los datos de SPARC (Lelli et al., 2016). La masa visible se calcula a partir del gas y del disco estelar. Para el disco, SPARC adopta un cociente masa-luz Υ (masa de las estrellas por unidad de luz) de 0,5 M☉/L☉ en 3,6 µm. NGC 3198 no tiene bulbo, así que el valor del bulbo no interviene. Con la masa visible sola, la velocidad cae a unos 65 km/s en el borde, mientras que los datos muestran una curva plana en torno a 150 km/s. Un halo con r_c = 2,67 kpc y v_∞ = 142,0 km/s ajusta los datos con χ²/(N−2) = 1,24, usando N = 43 radios hasta 44 kpc. Con ese ajuste, la masa dinámica es 2,28 × 10¹¹ M☉ y la visible 4,29 × 10¹⁰ M☉. Alrededor del 81 % de la masa sería oscura.

## 2.3 Cosmología: expansión y energía oscura

El Universo se expande. La ley de Hubble–Lemaître dice que las galaxias lejanas se alejan con una velocidad proporcional a su distancia, y la constante de proporcionalidad es la constante de Hubble H₀. Describimos la expansión con el factor de escala a(t), que vale 1 hoy y crece con el tiempo. La luz de una fuente lejana se estira junto con el espacio, y eso se mide como corrimiento al rojo z, que cumple 1 + z = 1/a (clase 10). `[ECUACIÓN 6: corrimiento al rojo]`

La evolución de a(t) depende de lo que llena el Universo. Usamos los parámetros de densidad Ωm (materia) y ΩΛ (constante cosmológica, la forma más simple de energía oscura), expresados como fracción de la densidad crítica, que es la que da una geometría plana. Si Ωm + ΩΛ es distinto de 1, el espacio tiene curvatura. La ecuación de aceleración, una forma de las ecuaciones de Friedmann, es `[ECUACIÓN 7: ä = H₀²(ΩΛ·a − Ωm/(2a²))]`. La materia frena la expansión y la constante cosmológica la acelera. Una advertencia de rigor: esta ecuación se puede obtener con argumentos newtonianos, pero su validez general y el camino de la luz dependen de la relatividad general, que no desarrollamos aquí.

Según los parámetros, el Universo tiene cuatro destinos posibles (Figura 6). Con H₀ = 67,4 km/s/Mpc, un universo crítico (solo materia, Ωm = 1) tiene una edad de 2/(3H₀) = 9,67 Gyr. Uno abierto (Ωm = 0,3) tiene 11,73 Gyr. Uno acelerado (Ωm = 0,31 y ΩΛ = 0,69) tiene 13,86 Gyr, en acuerdo con el valor de Planck (13,8 Gyr). Esto importa porque los cúmulos globulares más viejos tienen alrededor de 13,3 ± 0,5 Gyr (Valcin et al., 2020), y un universo de solo materia sería más joven que sus propias estrellas. Con H₀ = 73 km/s/Mpc, valor de la escalera de distancias, la edad baja a 12,8 Gyr. Esa diferencia entre dos mediciones de H₀ es la tensión de Hubble.

Para comparar con observaciones usamos las supernovas de tipo Ia, que funcionan como candelas estándar porque su luminosidad intrínseca es casi la misma (clase 9). La distancia de luminosidad d_L se obtiene de la distancia comóvil, una integral en z que calculamos con la regla del trapecio. El módulo de distancia μ = 5 log₁₀(d_L / 10 pc) convierte esa distancia en una magnitud. `[ECUACIÓN 8: d_L y μ]` Los datos son Pantheon+ (Scolnic et al., 2022; Brout et al., 2022): de las 1.701 filas del archivo usamos 1.580, al excluir las supernovas calibradoras y exigir z > 0,01. Como esos módulos de distancia están calibrados con Cefeidas (Riess et al., 2022; H₀ ≈ 73), cada modelo lleva un desplazamiento constante δ. Para el universo acelerado el ajuste da δ ≈ −0,19 mag, consistente con los −0,17 esperados por esa calibración. Comparamos modelos con χ²: 685,7 (acelerado), 817,0 (abierto), 1.331,1 (crítico) y 5.702,1 (recolapso). Estos χ² usan solo los errores diagonales y sirven para ordenar modelos; no son un ajuste publicable.

## 2.4 Herramientas numéricas y de ingeniería

> **[Escribe José.]** Debe cubrir: método de Euler explícito frente a *leapfrog* (Störmer–Verlet) y por qué el segundo es simpléctico (Hairer et al., 2003); regla del trapecio; χ²; tests como leyes físicas; Pyodide, NumPy y Plotly.js; integración continua y despliegue.

## 2.5 De la ley física al test

Esta tabla une las secciones 2 y 3.

| Ley o resultado | Cómo se comprueba en el código |
| --- | --- |
| Tercera ley de Kepler | T²/a³ = 1,00000 para los ocho planetas, error < 0,1 % |
| Conservación de energía | *Leapfrog*: error relativo < 10⁻⁶ en 100 órbitas; reversible en el tiempo a 10⁻⁹ |
| Euler inventa energía | Gana 34,6 % en el primer año y 57,6 % en 5 años; el test exige más de 10 % |
| Velocidad de Mercurio | ≈ 59 km/s en el perihelio (NASA: 58,98) |
| Edad del Universo | 13,86 Gyr para Ωm = 0,31 y ΩΛ = 0,69 |
| Aceleración | χ² del universo acelerado menor que el del abierto, y este menor que el del crítico |
