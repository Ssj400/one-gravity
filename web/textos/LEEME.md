# Editar la web en Word

`textos-pagina.docx` contiene los textos de la página, no los del informe.
Puedes editarlo directamente en Word y devolverlo para aplicar los cambios.

- Conserva los IDs (GEN-…, SOL-…, GAL-…, UNI-…, SUP-…, etc.).
- Conserva las marcas amarillas `⟦…⟧`: representan valores o textos dinámicos.
- Puedes agregar párrafos dentro del bloque correspondiente.
- Los textos alternativos de un mismo mensaje aparecen también por separado.
- No hace falta cambiar fórmulas, nombres de planetas ni unidades.
- El formato del Word es para editar: no cambia el diseño de la página.

`mapa-textos.json` conserva los textos originales, su ubicación en los archivos,
las expresiones dinámicas y el SHA-256 de cada fuente. Permite cotejar el Word
editado sin confundir los cambios con modificaciones posteriores del código.
Los bloques del Word tienen controles de contenido con el ID como etiqueta.

## Revisión recibida y aplicada

`textos-pagina-editado.docx` conserva la revisión de José. Se aplicaron literalmente
ocho bloques: GEN-015, GEN-016, GEN-026, GEN-027, SOL-010, SOL-026, SOL-038 y
SOL-049. No se corrigió su ortografía ni se modificaron otros textos. Los 195
IDs y todas las marcas dinámicas seguían presentes. El Word original y el mapa
se conservan como base de comparación; no representan una exportación nueva
de la página después de aplicar estos cambios.

## Al recibir el Word editado

1. Conservar el original y una copia de la revisión; no regenerar sobre ella.
2. Leer los controles `w:sdt` identificados por `w:tag` y comparar su contenido
   con `text` en el mapa. Si faltan bloques o marcas, consultar antes de borrar.
3. Si las fuentes cambiaron respecto del hash registrado, conciliar a mano.
4. Aplicar solo los cambios solicitados a los textos de `web/`; conservar las
   expresiones, el formato JSX, los parámetros y el motor. Hay bloques padre
   con variantes dinámicas internas; conciliar ambos, no aplicar rangos ciegamente.
5. Ejecutar build/lint y comprobar las cuatro pestañas con sus controles en
   escritorio y móvil. Commit y push después de revisar.
6. No tocar `informe/`.

## Crear una futura copia de edición

Desde `web/`:

```sh
node scripts/export-copy.mjs
python scripts/export-copy-word.py
```

El segundo script requiere `python-docx` y se niega a sobrescribir un Word
existente. Archivar primero el mapa y el Word juntos: forman una misma revisión.
