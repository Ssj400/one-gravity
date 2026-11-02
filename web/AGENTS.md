# Textos del simulador

## Voz de José

La página usa la misma voz que el informe: estudiantes de computación que explican cómo llevaron preguntas de astronomía a un programa. Referencia detallada de escritura: §13 de `../informe/AGENTS.md`. Sus instrucciones de limitar cambios a `informe/` solo rigen ese directorio, no esta web.

- Escribir en primera persona plural, con preguntas que guíen el razonamiento y ejemplos concretos. Adaptar el ritmo de José sin copiar sus ensayos.
- Explicar qué calculamos, qué encontramos y qué queda fuera. Definir símbolos y términos antes de depender de ellos; mantener breves los controles y los estados.
- Evitar lenguaje grandilocuente, impersonal o concluyente por encima de la evidencia. Una prueba del código no valida por sí sola un modelo físico.
- Las cifras de los bloques introductorios describen los parámetros iniciales y deben decirlo. Los pies dinámicos deben seguir siendo ciertos al cambiar planeta, paso, masa-luz o cosmología; no afirmar siempre que una órbita se cierra o que un halo se ajustó automáticamente.
- Pantheon+ aporta mediciones, no necesariamente objetos distintos. Menor χ² indica mejor acuerdo con el mismo procedimiento; aquí no usamos las correlaciones completas.
- La cosmología y sus distancias requieren relatividad general; reutilizar leapfrog no significa resolver todo con la ecuación de Newton. La curva galáctica no avanza órbitas con leapfrog.
- Materia y energía oscuras son componentes de los modelos comparados; el simulador no establece su naturaleza ni descarta todas las alternativas.
- Numeración coherente con el informe: 1a/1b (órbita/energía), 2 (Kepler), 3 (galaxia), 4 (expansión), 5a/5b (supernovas).

## Alcance y comprobación

Al pedir una reescritura, conservar diseño, navegación, parámetros y motor numérico. Revisar `src/App.tsx`, las cuatro pestañas, los pies de figura y los estados visibles. Ejecutar `npm run build` y `npm run lint`; comprobar las cuatro pestañas en escritorio y móvil. El criterio visual existente está en `DESIGN.md`.
