# 4. Discusión Crítica e Impacto

Un simulador puede mostrar algo sorprendente. La pregunta que guía esta sección es cómo saber si eso sorprendente es el Universo o es el código. Respondemos con cinco puntos.

## 4.1 Artefactos que parecen física

Con el método de Euler, la Tierra se aleja del Sol en espiral (Figura 1a). Lo que se ve podría pasar por un fenómeno real, pero es un error del método: Euler gana 34,6 % de energía en el primer año y 57,6 % a los 5 años, con un paso Δt = 0,01 años, y la Tierra termina a 2,01 UA del Sol. No hay ninguna fuerza que lo cause. Por eso solo confiamos en un resultado cuando el método pasa pruebas con respuesta conocida: la tercera ley de Kepler, la conservación de la energía, la edad del Universo. Es el método científico aplicado al software. También separamos dos tipos de error. El del método (el 57,6 % de Euler) es grande y sistemático. El de la máquina, por el redondeo de los números en punto flotante, ronda 10⁻¹⁴ y es despreciable en comparación.

## 4.2 ¿Podría la materia oscura ser un artefacto?

Una curva de rotación plana admite dos lecturas. Una es que hay masa que no vemos. La otra es que la gravedad se comporta distinto cuando las aceleraciones son muy bajas, como propone MOND (Milgrom, 1983). Nuestro ajuste de NGC 3198 con un halo no decide entre ambas, porque un halo con dos parámetros siempre puede ajustar una curva plana. Deciden las evidencias independientes: el movimiento de las galaxias en cúmulos (Zwicky, 1933), las lentes gravitacionales y el Cúmulo Bala (Clowe et al., 2006), donde la masa inferida por lentes no coincide con la del gas visible. El simulador prueba una pieza del argumento, no el caso completo.

## 4.3 Qué deja fuera el modelo

Un modelo simple es útil porque se entiende, pero hay que decir qué ignora.

- **Relatividad general.** La ecuación de aceleración se puede obtener con argumentos newtonianos, pero la curvatura del espacio y el camino de la luz requieren relatividad general. Para la distancia de luminosidad usamos su resultado, no una derivación newtoniana.
- **Radiación y simetría.** Ignoramos la radiación, y tratamos la galaxia como simétrica.
- **Energía oscura constante.** Suponemos que Λ no cambia con el tiempo. DESI DR2 (2025) prefiere un modelo con energía oscura variable, con una significancia de 2,8σ a 4,2σ según la muestra de supernovas. Lo tomamos como un indicio, no como un resultado establecido, pero muestra que Λ constante no es un hecho cerrado.
- **Estadística.** Los errores de Pantheon+ que usamos son solo los diagonales. El χ² sirve para ordenar modelos (685,7 el acelerado, frente a 817,0, 1.331,1 y 5.702,1), no como un ajuste publicable.
- **Calibración.** Los módulos de distancia de Pantheon+ están calibrados con Cefeidas, con H₀ ≈ 73. Con H₀ = 67,4 el ajuste desplaza cada curva en δ ≈ −0,19 mag, consistente con los −0,17 esperados, y solo la forma de la curva distingue los universos.

## 4.4 ¿Qué pasaría si…? La tensión de Hubble

Dos formas de medir H₀ dan resultados distintos: unos 73 km/s/Mpc con la escalera de distancias y 67,4 km/s/Mpc con el fondo cósmico de microondas. En nuestro modelo, la misma mezcla de materia y energía oscura da una edad de 13,86 Gyr con 67,4 y de 12,8 Gyr con 73. La web lo muestra con un control deslizante. Esta diferencia importa porque hay un chequeo independiente: los cúmulos globulares más viejos tienen unos 13,3 ± 0,5 Gyr (Valcin et al., 2020). Con H₀ = 73, los 12,8 Gyr quedan en el límite inferior de esa cifra, dentro de su incertidumbre. Un universo de solo materia, con una edad de entre 9,7 y 11,7 Gyr, ya queda claramente excluido. Nuestro simulador no resuelve la tensión, pero deja ver qué cambia en cada caso.

## 4.5 Impacto

Cualquier persona puede escribir los parámetros de un universo en la web y ver su edad, su historia de expansión y su ajuste a las supernovas. Puede tomar un titular de cosmología, probar qué implica y comprobar si es compatible con los datos. El código, los datos y los tests son públicos, así que cualquiera puede ejecutar los mismos cálculos y obtener las mismas cifras: eso es reproducibilidad en la práctica. Reconocemos el límite: es una herramienta didáctica y no entrega un resultado científico nuevo.

## 4.6 Cierre

Volvemos a la pregunta inicial. Un computador puede mostrar un Universo que no existe, como la espiral de Euler. Lo que separa un resultado real de un error es que haya pruebas con respuesta conocida, fuentes independientes y límites declarados. Eso es lo que intentamos construir.
