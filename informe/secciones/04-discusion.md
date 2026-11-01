# 4. Discusión Crítica e Impacto

## 4.1 Una figura convincente también puede estar equivocada

La espiral de Euler resume un aprendizaje del proyecto: el computador puede ejecutar correctamente las instrucciones y aun así producir una mala aproximación física. Por eso necesitamos comparar con casos conocidos, repetir cálculos con pasos menores y revisar cantidades como la energía. La conservación de energía es una propiedad del modelo físico; el método numérico solo la reproduce con cierto error.

Este cuidado se relaciona con la clase 4: un modelo debe contrastarse con evidencia y admitir revisión (*Modelos de Universo*, s. f.). Las pruebas ayudan a detectar fallas del cálculo, mientras que las observaciones permiten evaluar si el modelo sirve para describir el sistema real. Son controles distintos y necesitamos ambos.

## 4.2 Qué significa el ajuste de materia oscura

El halo mejora la curva de NGC 3198, pero su buen ajuste no descarta por sí solo otras explicaciones. Por ejemplo, MOND propone modificar la descripción de la gravedad cuando las aceleraciones son muy pequeñas (Milgrom, 1983). No implementamos esa alternativa, así que no podemos compararla directamente con nuestro resultado.

La discusión sobre materia oscura se apoya en evidencias independientes. Incluye el movimiento de galaxias en cúmulos, estudiado por Zwicky (1933), y las lentes gravitacionales: la desviación de la luz permite inferir masa sin depender únicamente de la luz emitida. El Cúmulo Bala aporta un caso importante de esa comparación (Clowe et al., 2006). Nuestro prototipo ilustra una parte del problema, no toda la evidencia ni la identidad de la materia oscura.

## 4.3 Límites que importan para interpretar los resultados

Usamos modelos simplificados: los planetas no se atraen entre sí, la galaxia se trata de manera simétrica y la cosmología ignora la radiación. Por ello no pretendemos representar encuentros planetarios ni las primeras etapas del Universo. Aunque parte del razonamiento se puede motivar con Newton, el tratamiento cosmológico y la propagación de la luz requieren relatividad general (Ryden, 2016).

Para las supernovas consideramos las incertidumbres individuales, pero no sus correlaciones, es decir, los errores compartidos entre mediciones. Además, permitimos un desplazamiento de calibración al comparar las curvas. Esto limita el alcance del χ²: sirve para nuestra comparación, no para sustituir el análisis completo de Pantheon+.

Suponemos también que la energía oscura es constante. DESI Collaboration (2025) ha presentado indicios de que podría variar, cuyo alcance depende de los datos combinados. Es una pregunta abierta que nuestro modelo no resuelve. Distinguir entre una hipótesis útil y un hecho establecido es parte del uso responsable de la herramienta.

## 4.4 Cambiar un parámetro para entender una pregunta actual

La tensión de Hubble es la diferencia entre valores de H₀ obtenidos por métodos distintos. Como referencias usamos aproximadamente 73 km/s/Mpc para la escalera de distancias y 67,4 para la inferencia a partir del fondo cósmico de microondas (Riess et al., 2022; Planck Collaboration, 2020).

En el escenario acelerado del simulador, cambiar de 67,4 a 73 reduce la edad de 13,86 a unos 12,8 Gyr, manteniendo los demás parámetros. Esto permite ver por qué una diferencia en la expansión actual tiene consecuencias para la historia calculada. No es una solución a la tensión: cada medición requiere su propio análisis.

Las edades de estrellas antiguas ofrecen otro contraste, porque el Universo debe ser más viejo que ellas. Valcin et al. (2020) estiman unos 13,3 Gyr para los cúmulos globulares más antiguos, con incertidumbres relevantes. Esta comparación motiva revisar los escenarios demasiado jóvenes, pero no la convertimos en una prueba definitiva basada en un solo número.

## 4.5 Utilidad educativa e impacto

La web permite pasar de una afirmación a una pregunta comprobable: ¿qué cambia si solo incluimos materia visible?, ¿qué ocurre si aumentamos H₀?, ¿la órbita cambia por la física o por el método? Ese recorrido fomenta el pensamiento crítico sin exigir que la persona programe o siga todas las derivaciones.

Su aporte no es un descubrimiento astronómico nuevo, sino hacer visibles las decisiones detrás de una simulación. Al publicar código, datos y pruebas, facilitamos que otras personas revisen los mismos pasos. Aun así, usar la herramienta no reemplaza consultar las fuentes ni evaluar las incertidumbres: una visualización ayuda a entender un argumento, pero no lo demuestra por sí sola.
