# Revisión de fuentes — 31 de octubre de 2026

## Cierre sobre la revisión de redacción — 1 de noviembre de 2026

- Revisamos en modo de solo lectura el cuerpo y las referencias del Word después de la simplificación de la otra sesión. El contenedor ZIP y el XML son íntegros. No modificamos el Word ni los Markdown de las secciones.
- Se mantienen las 15 entradas académicas, sus DOI y las cuatro referencias de curso. Las citas de las clases por título corresponden a esas entradas; las principales afirmaciones observacionales mantienen sus fuentes.
- Se conservan las precisiones de Ryden (2016), 1.580 mediciones y el alcance limitado de χ² y DESI. La generalización sobre que un halo siempre ajusta ya está corregida.
- En el cierre de integración se retiró la ficha de Williams (NASA) del Word y de `referencias-apa.md`, porque ya no se cita al quitar el cálculo de Mercurio. Su consulta queda registrada en estas notas. No se reintrodujo el cálculo para justificar la referencia.
- No quedan correcciones bibliográficas bloqueantes. Falta revisión visual de formato, cursivas y paginación en Word/PDF: la comprobación XML no sustituye esa revisión.
- La entrega entre dos integrantes ya fue autorizada por el docente según lo indicado por el usuario; no es un pendiente de fuentes ni motivo para añadir un tercer integrante.

## Qué verificamos

- Contrastamos 14 registros editoriales con la API de Crossref, guardados íntegramente en `crossref-verificado.json`. Revisamos títulos, autores, año, revista, volumen, número y DOI. Esto es verificación bibliográfica, no una lectura integral de los 14 artículos.
- Comprobamos el título, autor y páginas 110–127 de Zwicky en el original digitalizado por NASA ADS (`Zwicky-1933.pdf`). Las páginas 124–125 contienen la discusión de Coma y la masa oscura.
- Contrastamos los resúmenes de Planck, DESI DR2, Valcin, SH0ES, SPARC y Riess (1998) con los argumentos del informe.
- Revisamos las páginas oficiales de Cambridge, NASA, Pyodide y Plotly.
- NASA ADS no permitió acceder a su interfaz de resúmenes (HTTP 405); no atribuimos a ADS la verificación realizada con Crossref y arXiv. Para Zwicky sí accedimos al original alojado por ADS.

## Correcciones relevantes

1. **Ryden:** Cambridge fecha la segunda edición en 2016, no 2017. https://www.cambridge.org/core/product/identifier/9781316651087/type/book
2. **Mercurio:** la ficha de Williams actualizada el 11 de enero de 2024 da 58,97 km/s como velocidad orbital máxima. No cambia el resultado aproximado de 59 km/s. https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
3. **Pantheon+:** Brout et al. describen 1.701 curvas de luz de 1.550 supernovas distintas. El código selecciona 1.580 filas, no demuestra que haya 1.580 objetos distintos. Por eso usamos «mediciones» al describir el tamaño de la selección. Contamos las filas del archivo local usando exactamente `IS_CALIBRATOR == 0` y `zHD > 0.01`, sin modificar los datos. https://arxiv.org/abs/2202.04077
4. **ArXiv de Pantheon+:** 2202.04077 corresponde a Brout (restricciones cosmológicas), no al artículo de Scolnic (publicación de datos). La bibliografía usa sus DOI editoriales diferenciados: `ac8e04` y `ac8b7a`, respectivamente. No se modificó `data/FUENTES.md` porque está fuera del ámbito de edición del informe.
5. **DESI:** el DOI editorial confirmado es https://doi.org/10.1103/tr6y-kpc6. El resumen describe una preferencia por energía oscura dinámica de 3,1σ con BAO + CMB y 2,8–4,2σ al añadir supernovas, según la muestra. No es un resultado establecido contra ΛCDM. https://arxiv.org/abs/2503.14738
6. **Valcin:** la referencia correcta es Wandelt, B. D. El resumen distingue 13,32 ± 0,10 (estadística) ± 0,50 (sistemática) Gyr para los cúmulos más antiguos de la inferencia de edad del Universo de 13,5 Gyr, que incluye el tiempo de formación. https://arxiv.org/abs/2007.06594
7. **NumPy:** Harris et al. es un artículo académico de Nature, aunque trate sobre software. Se incluye entre las 15 fuentes académicas.
8. **Perlmutter (1999):** verificamos `10.1086/307221`, «Measurements of Ω and Λ from 42 high-redshift supernovae», ApJ 517(2), 565–586. Queda como lectura complementaria en estas notas, no en la bibliografía de obras citadas porque el texto no lo cita. Conservamos el trabajo de Riess (1998) como referencia histórica citada.
9. **Software:** citamos la documentación oficial con «s. f.», sin asignar arbitrariamente 2025 como año de versiones no comprobadas. Esto no verifica las versiones concretas del entorno del proyecto.

## Correspondencia con el texto

| Tema | Referencia |
| --- | --- |
| Fundamentos cosmológicos y distancias | Ryden (2016) |
| Ventajas y límites de Störmer–Verlet | Hairer et al. (2003) |
| Datos y cociente masa-luz de SPARC | Lelli et al. (2016) |
| Historia y alternativas de la masa oscura | Zwicky (1933); Rubin y Ford (1970); Milgrom (1983) |
| Evidencia del Cúmulo Bala | Clowe et al. (2006) |
| Aceleración mediante supernovas | Riess et al. (1998) |
| Datos y análisis de Pantheon+ | Scolnic et al. (2022); Brout et al. (2022) |
| H₀ con Cefeidas y con CMB | Riess et al. (2022); Planck Collaboration (2020) |
| Edades de cúmulos globulares | Valcin et al. (2020) |
| Indicios de energía oscura dinámica | DESI Collaboration (2025) |
| Cálculo y ejecución web | Harris et al. (2020); documentación de Pyodide y Plotly |

Los números del simulador se atribuyen al código y a sus condiciones de ejecución; los artículos no son fuentes de los χ² particulares calculados por este proyecto.

## Pendientes que no debemos inventar

- **Actualización del 1 de noviembre:** descargamos y revisamos las clases 4, 5, 9 y 10. Sus referencias están completas por título, con «s. f.» y enlaces de Canvas, sin inventar autor ni fecha. La clase 1 identifica al docente como Juan Carlos Beamin y muestra 2026; no demuestra por sí sola la autoría o fecha de las otras presentaciones. Véase `material-curso.md`.
- Revisar visualmente el Word/PDF y su extensión final: no hay Word ni LibreOffice instalado en este entorno. Verificamos la integridad del contenedor DOCX, pero no su paginación.
- La justificación estadística completa exige la covarianza de Pantheon+, como ya declara el informe. La comparación con errores diagonales no hereda las significancias de los artículos originales.
- Los resúmenes bibliográficos no bastan para avalar cada frase del borrador. La generalización «un halo con dos parámetros siempre puede ajustar una curva plana» se corrigió en la discusión: un buen ajuste no descarta por sí solo modelos alternativos.
