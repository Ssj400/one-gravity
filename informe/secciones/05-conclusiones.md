# 5. Conclusiones y Referencias

## 5.1 Conclusiones

Construimos un motor numérico que, con la misma ley de Newton y el mismo método *leapfrog*, describe tres escalas. En el Sistema Solar reproduce la tercera ley de Kepler (T²/a³ = 1,00000 con error menor que 0,1 %) y conserva la energía con un error relativo menor que 10⁻⁶ en 100 órbitas. En NGC 3198, la materia visible no alcanza para explicar la curva plana y un halo explica alrededor del 81 % de la masa. En el Universo, un modelo acelerado da una edad de 13,86 Gyr y es el que mejor ajusta las 1.580 supernovas de Pantheon+. Cada resultado está comprobado por un test escrito antes que el código.

Hay límites que declaramos. Es un modelo simplificado: ilustra y verifica, pero no descubre nada nuevo. Una pieza de evidencia como el ajuste de un halo no prueba la materia oscura, y el χ² con errores diagonales solo compara modelos.

**Aprendizaje colaborativo.** `[Luis: 3–4 líneas propias sobre cómo se repartieron el trabajo (código y numérica frente a astronomía, datos y redacción) y qué aprendió cada uno del área del otro. Luis las dictará.]`

Como trabajo futuro, queda un disco de estrellas de prueba para ver cómo se desarma una galaxia sin halo, usar la matriz de covarianza completa de Pantheon+ y probar una energía oscura que varíe en el tiempo.

## 5.2 Declaración de uso de herramientas de IA

Para este trabajo usamos asistentes de IA como apoyo a la redacción, la revisión y el desarrollo del código. El motor numérico y el Sistema Solar los escribió José. Las funciones de Universo, Supernovas y Galaxia se escribieron el 31 de octubre de 2026 con asistencia de Claude (Anthropic), por el plazo de entrega. La redacción de este informe también contó con apoyo de IA. Todos los resultados fueron verificados por nosotros con los tests del repositorio, que se escribieron antes que ese código, y con las fuentes citadas. `[José y Luis: aprueben o ajusten esta declaración.]`

## 5.3 Referencias (APA 7)

Lista acordada entre las dos sesiones el 2026-10-31: 15 académicas + software y material de curso. Orden alfabético al armar el documento.
Estado: **V** = verificada hoy por la sesión de José (Crossref/arXiv); **?** = aún sin comprobar.

**Académicas**

- V · Brout, D., et al. (2022). The Pantheon+ analysis: Cosmological constraints. ApJ, 938, 110. `[?: título y DOI]`
- V · Clowe, D., et al. (2006). A direct empirical proof of the existence of dark matter. ApJ, 648(2), L109–L113. https://doi.org/10.1086/508162
- V · DESI Collaboration (2025). DESI DR2 results II: Measurements of baryon acoustic oscillations and cosmological constraints. Phys. Rev. D, 112, 083515. arXiv:2503.14738
- V · Hairer, E., Lubich, C., & Wanner, G. (2003). Geometric numerical integration illustrated by the Störmer–Verlet method. Acta Numerica, 12, 399–450. https://doi.org/10.1017/S0962492902000144
- V · Lelli, F., McGaugh, S. S., & Schombert, J. M. (2016). SPARC: Mass models for 175 disk galaxies with Spitzer photometry and accurate rotation curves. AJ, 152(6), 157. https://doi.org/10.3847/0004-6256/152/6/157
- ? · Milgrom, M. (1983). ApJ, 270, 365.
- ? · Perlmutter, S., et al. (1999). ApJ, 517, 565.
- ? · Planck Collaboration (2020). A&A, 641, A6.
- ? · Riess, A. G., et al. (1998). AJ, 116, 1009.
- ? · Riess, A. G., et al. (2022). ApJL, 934, L7.
- V · Rubin, V. C., & Ford, W. K., Jr. (1970). Rotation of the Andromeda Nebula from a spectroscopic survey of emission regions. ApJ, 159, 379. https://doi.org/10.1086/150317
- ? · Ryden, B. (2017). *Introduction to Cosmology* (2.ª ed.). Cambridge University Press.
- ? · Scolnic, D., et al. (2022). The Pantheon+ analysis: The full data set and light-curve release. ApJ, 938, 113. `[?: DOI]`
- V · Valcin, D., Bernal, J. L., Jimenez, R., Verde, L., & Wandelt, B. D. (2020). Inferring the age of the universe with globular clusters. JCAP, 2020(12), 002. https://doi.org/10.1088/1475-7516/2020/12/002
- ? · Zwicky, F. (1933). Helvetica Physica Acta, 6, 110.

**Software y datos** (se citan, pero no cuentan como académicas)

- Harris, C. R., et al. (2020). Array programming with NumPy. Nature, 585, 357–362. https://doi.org/10.1038/s41586-020-2649-2 (V)
- Pyodide contributors (2025). Pyodide (versión 314.0.7) [software]. https://pyodide.org `[confirmar año en el changelog]`
- Plotly Technologies Inc. (2025). Plotly.js (versión 4.1.2) [software]. https://plotly.com/javascript/ `[confirmar año]`
- Datos: SPARC (NGC 3198) y Pantheon+, ver `../data/FUENTES.md`.

**Material de curso:** láminas de AST101, clases 4–5, 9 y 10.

Pendiente: verificar las marcadas con **?** (ADS o Crossref) antes de entregar.
