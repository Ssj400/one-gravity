# Revisión del nivel del informe — 1 de noviembre de 2026

## Criterio aplicado

Contrastamos el borrador con las clases 4, 5, 9 y 10 y con el enunciado y la rúbrica originales. Se mantienen los cinco apartados obligatorios, las fuentes y los resultados principales. El tono es académico accesible: explicar cada ecuación antes de usarla, sin presentar el trabajo como una investigación cosmológica original.

La rúbrica pide precisión conceptual, desarrollo fundamentado y comunicación clara. No exige derivar el carácter simpléctico del integrador, las fórmulas completas de distancias cosmológicas ni el estimador de calibración. Esos detalles se retiraron del cuerpo del informe; el código y las notas técnicas del repositorio siguen disponibles.

## Cambios

- Por indicación de José, no incorporamos el apartado de ecuaciones ni los cálculos a mano de Luis. Conservamos solo cinco relaciones esenciales del programa: aceleración gravitacional, Kepler, masa a partir de rotación, Hubble–Lemaître y aceleración de Friedmann; también explicamos 1 + z = 1/a y el avance de leapfrog mediante código real. No desarrollamos vis-viva ni la fórmula de módulo de distancia.
- Sustituimos jerga y derivaciones largas por el propósito del cálculo y el significado de las variables. Los resultados se concentran en la sección 3 para evitar repetir tablas numéricas.
- Distinguimos verificar el programa de contrastar un modelo con observaciones. La edad observada no se presenta como una ley que todos los universos deban cumplir.
- Corregimos el alcance del motor: leapfrog se usa en órbitas y expansión, no en la curva galáctica; la cosmología no es solo Newton.
- Mantenemos las correcciones bibliográficas de la revisión paralela: Ryden 2016 y 1.580 mediciones, no necesariamente objetos distintos. Al quitar el cálculo de Mercurio, retiramos su ficha de la bibliografía final; su verificación queda registrada en las notas de fuentes.
- Corregimos las afirmaciones de que cualquier halo puede ajustar una curva plana y de que una comparación simple excluye definitivamente modelos o resuelve la tensión de Hubble.
- Renumeramos los pies de figura de manera consecutiva y separamos la comparación de energía de cinco años de la prueba distinta de 100 órbitas.

## Estado de la versión (1 de noviembre, cierre)

- **Figuras insertadas.** Siete PNG exportados del simulador público (`figuras/`) con tema claro y sin barra de herramientas: 1a/1b, 2, 3, 4 y 5a/5b. Van dentro de párrafos `Figure` con `keepNext`, pie de 9,5 pt y ancho de 10,2 cm (pares, 7,0 cm).
- **Extensión.** El PDF exportado con Word tiene **12 páginas**: portada, cuerpo en las páginas 2–11 y bibliografía en 11–12. Cumple el rango de 8–12.
- **Formato.** Times New Roman 12, interlineado 1,5 y texto justificado; títulos de sección en Arial 16 y subtítulos en Times 13; márgenes de 1,8 cm. Los pies de figura usan 9,5 pt y las referencias interlineado simple con sangría francesa, para no salir del límite de páginas.
- **Portada.** Título centrado en negrita, autores en cursiva y dos enlaces con etiqueta legible (simulador y repositorio). Sin correos.
- **Integridad.** ZIP y XML válidos; 7 relaciones de imagen y 2 hipervínculos de portada, sin relaciones huérfanas; el código de leapfrog se conserva literal; las 15 referencias académicas y las de curso/software siguen intactas.
- **Exportación.** `informe_final.pdf` se generó con Microsoft Word (COM) desde el DOCX, no con un conversor alternativo.

## Antes de entregar

- **Reflexión personal.** Luis debe completar el párrafo marcado en cursiva en 5.1 (aprendizaje colaborativo); no inventamos experiencias personales.
- **Declaración de IA.** Ambos autores deben confirmar la revisión efectiva y aprobar el texto marcado en cursiva en 5.2.
- Al reemplazar esos dos fragmentos, volver a exportar y comprobar que el PDF siga en 12 páginas.
- Las copias `informe_borrador.antes-*.docx` son respaldos auxiliares, no versiones para entregar.

La entrega entre dos integrantes ya fue autorizada por el docente, según lo informado por el usuario; no es un pendiente.
