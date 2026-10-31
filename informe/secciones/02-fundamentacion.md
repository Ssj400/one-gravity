# 2. Fundamentación Teórica y Técnica (bosquejo v0 — ~3 páginas)

> Parte astronómica = Luis. Parte numérica (2.4) = José. Base: `../docs/unidad-1…5`. Definir cada término la primera vez.

## 2.1 Gravedad de Newton y órbitas (≈ 0,6 pág.)

- Ley de gravitación; aceleración central `a = −GM r̂ / r²`.
- Leyes de Kepler como **consecuencia**, no punto de partida (clases 4–5 del curso).
- Ecuación vis-viva, momento angular específico; ejemplo a mano: Mercurio en el perihelio ≈ 59 km/s (NASA 58,98). `[Luis: reproducir el cálculo con sus datos]`
- Tercera ley: T²/a³ = 1 en UA/años/M☉.

## 2.2 Galaxias y materia oscura (≈ 0,8 pág.)

- Curva de rotación, velocidad circular, masa encerrada `M(<r) = v²r/G`.
- Esperado por la masa visible (disco + gas, cociente masa-luz Υ) vs observado: curva plana (Rubin & Ford 1970; Zwicky 1933).
- Halo pseudo-isotermo (parámetros r_c, v_∞).
- NGC 3198 (SPARC, Lelli et al. 2016): plana en ≈ 150 km/s; visible sola ≈ 65 km/s afuera; ≈ 81 % de la masa oscura `[confirmar con José]`.
- Aviso: Υ de SPARC verificar (disco 0,5 / bulbo 0,7 recordado de memoria) `[buscar referencia]`.

## 2.3 Cosmología: expansión y energía oscura (≈ 1,2 pág.)

- Ley de Hubble–Lemaître, constante H₀, factor de escala a(t), corrimiento al rojo `1 + z = 1/a` (clase 10).
- Parámetros Ωm, ΩΛ, densidad crítica, curvatura; constante cosmológica.
- Ecuación de aceleración (forma de Friedmann) `ä = H₀²(ΩΛ·a − Ωm/(2a²))`; **aclarar: derivación newtoniana vs relatividad general**.
- Cuatro destinos del Universo según los parámetros (figura 6).
- Edad: crítico 9,67 Gyr = 2/(3H₀); abierto 11,7; acelerado 13,86 (Planck: 13,8). Tensión de Hubble: H₀ = 73 → 12,8 Gyr.
- Distancias: comóvil, de luminosidad, módulo de distancia μ; supernovas Ia como candelas estándar (escalera de distancias, clase 9). Pantheon+ (Scolnic/Brout 2022), calibración SH0ES (Riess 2022).
- Edad de cúmulos globulares (≈ 12–13 Gyr) como chequeo independiente `[buscar referencia]`.

## 2.4 Herramientas numéricas y de ingeniería (≈ 0,6 pág., **escribe José**)

- Euler explícito vs leapfrog (Störmer–Verlet), integrador simpléctico (Hairer et al. 2003).
- Regla del trapecio para d_L.
- χ² para comparar modelos.
- Tests como leyes; Pyodide, numpy, Plotly.js; CI y despliegue.
- `[José escribe o aprueba]`

## Idea para el cierre de la sección

Una tabla "Ley física → Cómo se prueba en el código" (Kepler III → test T²/a³; energía → test leapfrog; edad ≈ 13,8 → test_universe...). Une 2 y 3.
