# 1. Portada e Introducción Interdisciplinaria (bosquejo v0 — ~1 página)

> Bosquejo para pulir. Marcas: `[Luis]` = completa Luis; `[confirmar con José]` = depende de José o del código.

## Portada (no cuenta como texto, pero sí como página)

- Título: *Una sola gravedad, tres escalas: un simulador numérico del Sistema Solar, una galaxia y el Universo*
- Curso AST101 — Un Paseo por el Universo, Tarea 2 (proyecto interdisciplinario), UC, 2 de noviembre de 2026
- Integrantes: José Santiago Garrillo Fernández (jose.garrillo@estudiante.uc.cl) y Luis Erazo (luis.erazo@estudiante.uc.cl)
- Carrera de ambos: Licenciatura en Ingeniería en Ciencias de la Computación (LICC)
- Enlaces: web https://ssj400.github.io/one-gravity/ y repositorio https://github.com/Ssj400/one-gravity (ojalá también un QR)

## 1.1 La pregunta (1 párrafo)

- Gancho: la gravedad es una sola ley, pero se usa en escalas que difieren en unos catorce órdenes de magnitud (1 UA ≈ 1,5 × 10¹¹ m → 1 Gpc ≈ 3 × 10²⁵ m). ¿Puede un mismo programa describir las tres?
- Idea central: un motor numérico, tres usos (órbita de la Tierra, rotación de NGC 3198, expansión del Universo).

## 1.2 Qué propone el proyecto (1 párrafo)

- Simulador con interfaz web; el código Python corre en el navegador (Pyodide).
- Sistema Solar = validación (la respuesta se conoce desde Kepler); Galaxia = materia oscura; Universo = energía oscura con supernovas Ia reales.
- Lectura rápida de cada escala en una frase, con su resultado clave (ver tabla de números de AGENTS.md §5).

## 1.3 Por qué es interdisciplinario (2 párrafos — criterio 1)

Tesis: la computación no decora la astronomía; **es el método para responder cada pregunta**. Un pilar por ramo, con nombre:

| Pilar | Qué aporta | Dónde se ve |
| --- | --- | --- |
| Cálculo I | Tangente → Euler/leapfrog; distancia a supernovas como integral (trapecio) | Esc. 1 y 3 |
| Discretas | Inducción: invariante conservado en cada paso → en todos; N(N−1)/2 pares | Esc. 1 |
| Arquitectura | Punto flotante: error del método vs error de la máquina (~10⁻¹⁴) | Esc. 1 |
| Prog. Avanzada | Módulos, funciones puras, un test por ley física | Todo el código |
| Experiencia laboral de José | Desarrollador en una empresa de software (Python/Flask y Flutter): suites de pruebas automáticas, integración continua (CI), revisión de código y despliegue. De ahí sale la idea de convertir las leyes físicas en tests y de publicar la web automáticamente en cada cambio `[José aprueba esta redacción y si nombra la empresa]` | Tests + CI + GitHub Pages |
| Introducción a la Programación (Luis) | Lectura de código y tests para supervisar y verificar; comprobación independiente: cálculos a mano que el programa debe reproducir (p. ej. Mercurio ≈ 59 km/s) | Validación, datos, documento |

## 1.4 Qué tiene de nuevo (1 párrafo — criterio 4, decirlo explícito)

- Un motor para tres escalas.
- Las leyes físicas (Kepler, conservación de energía, edad ≈ 13,8 Gyr) como tests automáticos.
- Equivocarse a propósito (Euler) para mostrar un artefacto numérico.
- Web abierta y reproducible.

## 1.5 Quién hizo qué (tabla corta)

- José: código, tests, figuras, sección 3 y teoría numérica.
- Luis: teoría astronómica, cálculos a mano (p. ej. velocidad de Mercurio en el perihelio ≈ 59 km/s), datos, referencias, pies de figura, secciones 1, 2, 4, 5 y formato final.
- Ambos: revisión de rigor astronómico.
- Luis tiene como base solo Introducción a la Programación; por eso no escribió código y su rol fue de estudio, verificación y coordinación del informe. Decirlo así en el texto final, sin inflarlo `[Luis: revisa que lo diga como tú quieres]`.

## 1.6 Hoja de ruta del informe (2 líneas)
