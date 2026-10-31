# Informe de la Tarea 2 (AST101) — contexto para el agente de Luis

Este archivo le da a un agente de IA todo lo que necesita para ayudar a **Luis** a escribir el informe del proyecto *Una sola gravedad, tres escalas*. Léelo completo antes de escribir una línea. Última actualización: 2026-10-31.

## 1. Qué es el proyecto, en tres frases

Un simulador de gravedad con interfaz web. La misma ley (gravitación de Newton) y el mismo método numérico (integrador *leapfrog*) se aplican a tres escalas: el Sistema Solar, donde la respuesta se conoce desde Kepler y sirve para validar el programa; una galaxia real (NGC 3198), donde la materia visible no explica la curva de rotación y hace falta un halo de materia oscura; y el Universo entero, donde la edad y 1.580 supernovas Ia reales (Pantheon+) solo calzan con una expansión acelerada por energía oscura.

- Web pública: https://ssj400.github.io/one-gravity/ (el código Python corre en el navegador; cada escala tiene figuras, controles y un bloque "Qué hicimos / Qué encontramos / Por qué importa").
- Repositorio: https://github.com/Ssj400/one-gravity
- Equipo: **José Santiago Garrillo Fernández** (código, tests, figuras, sección 3 y teoría numérica) y **Luis** (teoría astronómica, cálculos a mano, datos, referencias, secciones 1, 2, 4 y 5, pies de figura y formato final). Ambos estudian Computación (Ingeniería) en la UC.

## 2. Entrega

- **Fecha:** lunes 2 de noviembre de 2026 (hora y canal de entrega: confirmar en Canvas; asumir que es durante el día, no a medianoche).
- **Formato obligatorio:** PDF, **entre 8 y 12 páginas**, Arial 11 o Times New Roman 12, **interlineado 1,5**. Portada incluida.
- **Idioma:** español. Redacción propia; nada de pegar texto de la web ni de este archivo sin reescribirlo.
- Vale 7,5 % de la nota final del curso. Nota 4,0 con 60/100 puntos.

## 3. Estructura obligatoria del informe (del enunciado) y quién escribe cada parte

| # | Sección (nombre del enunciado) | Qué debe contener | Páginas sugeridas | Escribe |
| --- | --- | --- | --- | --- |
| 1 | Portada e Introducción Interdisciplinaria | Equipo, carreras, cómo se combinan sus áreas (ver §6), qué tiene de nuevo el proyecto, quién hizo qué | 1 | Luis |
| 2 | Fundamentación Teórica y Técnica | Astronomía rigurosa con terminología precisa (§7) + las herramientas de la carrera (métodos numéricos, tests, web) | 3 | Luis (astronomía); José (numérica) |
| 3 | Desarrollo de la Propuesta / Prototipo | Arquitectura del software, el motor, los tests como leyes físicas, las tres escalas con sus figuras, extractos de código | 3–3,5 | José; Luis escribe los pies de figura |
| 4 | Discusión Crítica e Impacto | Los cinco puntos de §8 | 1,5–2 | Luis |
| 5 | Conclusiones y Referencias | Aprendizaje colaborativo; 10–15 referencias académicas en un solo estilo (APA 7) | 1 | Luis |

## 4. Rúbrica: 5 criterios × 20 puntos

| Criterio | Para "Sobresaliente" | Riesgo a evitar |
| --- | --- | --- |
| Integración interdisciplinaria y experiencia universitaria | La computación es *cómo* se responde cada pregunta astronómica; cada ramo aporta una pieza con nombre (§6) | Que parezca un proyecto de programación con decoración astronómica |
| Rigor y terminología astronómica | Términos precisos y bien definidos (§7); decir qué es Newton y qué es relatividad general | Exagerar lo que demuestra un modelo simplificado |
| Profundidad del desarrollo y fundamentación | Ecuaciones derivadas, método justificado, cada resultado comprobado por un test | Muchas partes a medias |
| Creatividad, innovación u originalidad | Un motor para tres escalas; leyes físicas como tests automáticos; el método incorrecto a propósito (Euler); web abierta y reproducible | No decir explícitamente qué tiene de nuevo |
| Comunicación efectiva, redacción y formato | Formato exacto, figuras numeradas con pie, un solo estilo de citas, sin faltas | Dejar el formato para la última noche |

## 5. Los números del proyecto (fuente de verdad)

**Regla: ningún número del informe se inventa.** Vienen del código (tests en `core/tests/`), de la web, o de las fuentes citadas. Si un número no está aquí ni en la web, pregúntale a José.

| Resultado | Valor | De dónde sale |
| --- | --- | --- |
| Euler, Tierra, Δt = 0,01 a | gana 34,6 % de energía en el primer año y 57,6 % a los 5 años; termina a 2,01 UA del Sol (el test exige > 10 % a 5 años) | `test_engine.py`, web (escala Sistema Solar); corrida del 2026-10-31 |
| Leapfrog, 100 órbitas, Δt = 0,001 a | error relativo de energía < 10⁻⁶; reversible en el tiempo a 10⁻⁹ | `test_engine.py` |
| Tercera ley de Kepler | T²/a³ = 1,00000 para los ocho planetas (error < 0,1 %) | `test_solar_system.py`, tabla en la web |
| Velocidad de Mercurio en el perihelio | ≈ 59 km/s (NASA: 58,98) | `test_solar_system.py`; cálculo a mano de Luis |
| NGC 3198 (SPARC), 44 kpc | curva plana en ≈ 150 km/s; visible sola ≈ 65 km/s afuera; halo ajustado r_c ≈ 2,7 kpc, v_∞ ≈ 142 km/s; χ²/(N−2) ≈ 1,24; **≈ 81 % de la masa es oscura** (22,8 × 10¹⁰ M☉ dinámica vs 4,3 × 10¹⁰ visible) | `test_galaxy.py`, web (escala Galaxia) |
| Edad, universo crítico (Ωm = 1), H₀ = 67,4 | 9,67 Gyr = 2/(3H₀) | fórmula exacta y `test_universe.py` |
| Edad, abierto (Ωm = 0,3) | 11,7 Gyr | `test_universe.py` |
| Edad, acelerado (Ωm = 0,31, ΩΛ = 0,69) | **13,86 Gyr** (Planck: 13,8) | fórmula exacta y numérica |
| Misma mezcla con H₀ = 73 | 12,8 Gyr (tensión de Hubble) | `test_universe.py` |
| Supernova a z = 0,5 | 0,39 mag más tenue en el acelerado que en el crítico; 0,21 que en el abierto | `test_supernovae.py` |
| Pantheon+ (1.580 SNe del flujo de Hubble) | χ²: acelerado 686 < abierto 817 < crítico 1.331 < recolapso 5.702; δ ≈ −0,19 mag por la calibración SH0ES | web (escala Supernovas) |

**Estado del código al 2026-10-31 (tarde):** las tres escalas están implementadas y **los 66 tests pasan**; la web muestra las cuatro escalas con figuras. El motor y el Sistema Solar los escribió José; las funciones de Universo, Supernovas y Galaxia se escribieron con asistencia de IA (Claude) por el plazo, y José las revisa. **Esto debe quedar en la declaración de uso de IA del informe** (§12, punto 5): decir qué partes del código se hicieron con asistencia y que todas pasan los tests de física escritos antes que el código.

## 6. Integración interdisciplinaria (criterio 1): qué aporta cada ramo

Los dos integrantes son de Computación, así que el criterio se gana mostrando que la computación es la forma de responder las preguntas, y que la experiencia universitaria de cada uno está en el proyecto:

- **Cálculo I (MAT1610):** cada paso del integrador sigue la recta tangente (Euler, leapfrog); la distancia a las supernovas es una integral resuelta con sumas de Riemann (regla del trapecio).
- **Matemáticas Discretas (IIC1253):** por inducción, una cantidad que se conserva en cada paso se conserva en todos; N cuerpos tienen N(N−1)/2 pares.
- **Arquitectura de Computadores (IIC2343):** los errores de redondeo del punto flotante se acumulan paso a paso; distinguir error del método (Euler, 57 %) de error de la máquina (~10⁻¹⁴).
- **Programación Avanzada (IIC2233):** módulos, funciones puras, una suite de tests con una ley física por test.
- **Experiencia de José:** desarrollador en una empresa (testing, CI, web); de ahí la idea de las leyes como tests automáticos y el despliegue continuo.
- **Experiencia de Luis:** `[Luis completa: ramos, proyectos, trabajo]`.

## 7. Terminología que la rúbrica premia (usar y definir la primera vez)

Factor de escala, constante de Hubble H₀, ley de Hubble–Lemaître, corrimiento al rojo z (1 + z = 1/a), densidad crítica, parámetros de densidad Ωm y ΩΛ, constante cosmológica, ecuación de Friedmann (forma de aceleración), curvatura, distancia comóvil, distancia de luminosidad, módulo de distancia μ, candela estándar, supernova de tipo Ia, curva de rotación, velocidad circular, masa encerrada, cociente masa-luz Υ, halo de materia oscura (perfil pseudo-isotermo), ecuación vis-viva, momento angular específico, integrador simpléctico, método de Euler explícito, *leapfrog* (Störmer–Verlet), regla del trapecio, χ².

## 8. Discusión crítica (sección 4): los cinco puntos

Hilo conductor: *cuando un computador muestra algo sorprendente, ¿cómo sabemos que es el Universo y no el código?*

1. **Artefactos que parecen física.** Con Euler la Tierra se aleja del Sol en espiral: parece real y es un error del método. Solo confiamos en un resultado si el método pasa pruebas con respuesta conocida (el método científico aplicado al software).
2. **¿Podría la materia oscura ser un artefacto?** Una curva plana tiene dos explicaciones: masa que no vemos o una gravedad distinta a aceleraciones muy bajas (MOND, Milgrom 1983). Deciden las evidencias independientes: cúmulos (Zwicky 1933), lentes gravitacionales, Cúmulo Bala (Clowe et al. 2006), búsqueda de objetos compactos oscuros. El simulador prueba una pieza, no el caso completo.
3. **Qué deja fuera el modelo.** La cosmología newtoniana da la ecuación correcta para materia + Λ, pero la curvatura y el camino de la luz requieren relatividad general (para d_L usamos el resultado de la RG). Se ignora la radiación. La galaxia es simétrica. Λ se toma constante aunque DESI (2024–2025) sugiere que podría variar. Los errores de Pantheon+ son diagonales: el χ² compara modelos, no es un ajuste publicable.
4. **Un "¿qué pasaría si…?": la tensión de Hubble.** H₀ = 73 (escalera de distancias) vs 67,4 (fondo cósmico) cambia la edad de 13,86 a 12,8 Gyr. La web lo muestra con un control deslizante.
5. **Impacto.** Cualquiera puede poner un titular de cosmología en el simulador y ver qué implica; el código con sus tests es público: reproducibilidad en la práctica.

## 9. Figuras (las exporta José desde la web, en "Modo informe", fondo blanco)

| Fig. | Contenido | Escala |
| --- | --- | --- |
| 1a, 1b | Órbita Euler vs leapfrog; error de energía vs tiempo | Sistema Solar |
| 2 | log T vs log a, pendiente 3/2 (tercera ley) | Sistema Solar |
| 4 | Curva de rotación de NGC 3198: datos, visible, halo, total | Galaxia |
| 6 | a(t) para cuatro universos | Universo |
| 7, 7b | Diagrama de Hubble con Pantheon+; residuos respecto al universo vacío | Supernovas |
| 9 | Diagrama de arquitectura del software y figura de "pilares" (ramos) | Sección 3 / 1 |

Cada figura lleva número y un pie de 1–3 frases que diga qué muestra y qué se concluye (Luis los redacta; los pies de la web sirven de base).

## 10. Referencias (verificar cada una en NASA ADS antes de citar; estilo APA 7)

- Zwicky, F. (1933). Helvetica Physica Acta, 6, 110.
- Rubin, V. C., & Ford, W. K., Jr. (1970). Rotation of the Andromeda Nebula from a spectroscopic survey of emission regions. ApJ, 159, 379. https://doi.org/10.1086/150317 **(verificada 2026-10-31, Crossref)**
- Lelli, F., McGaugh, S. S., & Schombert, J. M. (2016). AJ, 152, 157. https://doi.org/10.3847/0004-6256/152/6/157 (SPARC; el sitio pide citar este paper). **Verificado 2026-10-31 en el abstract:** adopta Υ = 0,5 M☉/L☉ para el disco a 3,6 µm "as suggested by stellar population models". El 0,7 del bulbo está en el cuerpo del paper (no verificado en el abstract); NGC 3198 no tiene bulbo, así que no afecta ningún número del informe.
- Milgrom, M. (1983). ApJ, 270, 365. (MOND)
- Clowe, D., et al. (2006). A direct empirical proof of the existence of dark matter. ApJ, 648(2), L109–L113. https://doi.org/10.1086/508162 (Cúmulo Bala) **(verificada 2026-10-31, arXiv)**
- Riess, A. G., et al. (1998). AJ, 116, 1009; Perlmutter, S., et al. (1999). ApJ, 517, 565.
- Planck Collaboration (2020). A&A, 641, A6.
- Scolnic, D., et al. (2022). ApJ, 938, 113; Brout, D., et al. (2022). ApJ, 938, 110. (Pantheon+)
- Riess, A. G., et al. (2022). ApJL, 934, L7. (SH0ES, H₀ ≈ 73)
- DESI Collaboration (2025). *DESI DR2 Results II: Measurements of Baryon Acoustic Oscillations and Cosmological Constraints*. Phys. Rev. D, 112, 083515. arXiv:2503.14738. **Verificado 2026-10-31 en el abstract:** un modelo con energía oscura variable (w₀ > −1, wₐ < 0) se prefiere sobre ΛCDM a 3,1σ con BAO + CMB, y entre 2,8σ y 4,2σ agregando supernovas según la muestra. Citar como "indicio", no como resultado establecido.
- Hairer, E., Lubich, C., & Wanner, G. (2003). Geometric numerical integration illustrated by the Störmer–Verlet method. Acta Numerica, 12, 399–450. https://doi.org/10.1017/S0962492902000144 (por qué leapfrog conserva energía) **(verificada 2026-10-31, Crossref)**
- Ryden, B. (2017). *Introduction to Cosmology* (2.ª ed.). Cambridge University Press.
- Harris, C. R., et al. (2020). Array programming with NumPy. Nature, 585, 357–362. https://doi.org/10.1038/s41586-020-2649-2 **(verificada 2026-10-31, Crossref)**
- Software, fuera del conteo académico: Pyodide 314.0.7 (CPython 3.14.2 en WebAssembly, numpy 2.4.6), Plotly.js 4.1.2, React 19.2, Vite 8.3. Localmente: Python 3.14.7, numpy 2.5.4, pytest 9.1.
- Edad de los cúmulos globulares: Valcin, D., Bernal, J. L., Jimenez, R., Verde, L., & Wandelt, B. D. (2020). Inferring the age of the universe with globular clusters. JCAP, 2020(12), 002. https://doi.org/10.1088/1475-7516/2020/12/002. Abstract: t_GC = 13,32 ± 0,10 (est.) ± 0,50 (sist.) Gyr para los más viejos; edad del Universo 13,5 (+0,16/−0,14) ± 0,5 Gyr. **(verificada 2026-10-31, arXiv)**
- Láminas del curso AST101 (clases 4–5, 9 y 10): citar como material de curso.

Detalles de los datos y cómo citarlos: `../data/FUENTES.md`.

## 11. Material disponible en el repositorio

- `../docs/unidad-1-motor.md` … `unidad-5-galaxia.md`: la física y la numérica de cada parte, en inglés, con las ecuaciones. Es la mejor base para la sección 2.
- `../web/src/tabs/*.tsx`: los textos de la web (bloques `Story` y `Takeaway`, pies de figura) ya cuentan el argumento de cada escala en español. Reescribir, no copiar.
- `../core/una_gravedad/*.py`: el código, con docstrings en español que explican cada función.
- `../core/tests/`: los tests; cada uno es una ley física con su tolerancia. Para correrlos: `cd ../core && ../.venv/bin/python -m pytest -q` (ver `../docs/tests.md`).
- `../data/FUENTES.md`: datasets, URL, fecha de descarga y cómo citarlos.

## 12. Reglas para el agente

1. Escribe en español, en primera persona del plural, con frases cortas. Una idea por párrafo.
2. No inventes números, citas ni resultados. Si falta algo, deja `[confirmar con José]` o `[buscar referencia]`.
3. No modifiques nada fuera de `informe/`. El código, los tests y la web son de José.
4. Guarda cada sección como Markdown en `informe/secciones/0N-nombre.md` (por ejemplo `01-introduccion.md`, `02-fundamentacion.md`, `04-discusion.md`, `05-conclusiones.md`). José integra todo en el documento final (Google Docs) y exporta el PDF.
5. El informe debe **declarar el uso de herramientas de IA** (Código de Honor UC). Redacta un párrafo breve para la sección 5 que diga que se usaron asistentes de IA para apoyo en redacción, revisión y desarrollo, y que todos los resultados fueron verificados por los autores con los tests y las fuentes citadas.
6. Define cada término técnico la primera vez que aparece. Distingue siempre lo que el simulador demuestra de lo que solo ilustra.
7. Longitud: apunta al centro del rango (10 páginas en total). Las secciones de Luis suman unas 5,5 páginas.
