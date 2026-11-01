# Criterios de diseño de la interfaz

## Lectura y exploración científica
- La interfaz combina lectura de preguntas, método y conclusiones con exploración de figuras y parámetros.
- La jerarquía favorece contenido y evidencia: títulos, texto de ancho contenido, figuras con pies y controles agrupados.
- Evitar decoración que compita con los datos; superficies discretas, separadores y un acento funcional bastan. No se presupone una identidad de marca externa.
- La tesis conserva sus dos párrafos dentro de un `<details>` cerrado inicialmente: «Sobre el proyecto y su método». Se reduce la carga inicial sin eliminar contenido.

## Paletas implementadas
Los colores de interfaz proceden de `src/index.css`; los de series, de `src/theme.tsx`.

| Uso | Oscuro | Claro |
| --- | --- | --- |
| Fondo | `#14191f` | `#fcfcfb` |
| Panel / superficie elevada | `#1c232b` | `#f2f4f6` |
| Texto principal | `#e8edf2` | `#202b36` |
| Texto secundario | `#a7b2be` | `#566473` |
| Separador / rejilla | `#323c47` | `#dce1e6` |
| Borde fuerte | `#627180` | `#82909c` |
| Acento / foco | `#8bb9e8` | `#285f95` |
| Series: azul | `#3987e5` | `#2a78d6` |
| Series: naranja | `#d95926` | `#eb6834` |
| Series: verde agua | `#199e70` | `#1baf7a` |
| Series: amarillo | `#c98500` | `#eda100` |
| Series: violeta | `#9085e9` | `#6250d6` |
| Observaciones | `#a9b4bf` | `#6b6a66` |

- Pendiente usa fondo/tinta `#2f2a1e` / `#e6c989` en oscuro y `#fff4d6` / `#70531a` en claro; listo, `#9acbb6` / `#28664e`.
- Error usa fondo `#392529` / `#fde4e1`; código, `#27313c` / `#e8edf1` (oscuro / claro).
- Oscuro es el valor inicial sin preferencia guardada; el selector persiste el tema en `localStorage` cuando está disponible.

## Tipografía y navegación
- Tipografía de sistema: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`, también en Plotly. Código y fórmulas usan monoespaciada de sistema; valores y tablas, cifras tabulares.
- Interlineado general 1,65, títulos fluidos y párrafos normalmente limitados a 67–75 caracteres tipográficos de ancho.
- La regla representa posiciones logarítmicas reales en parsecs; no distribuye equidistantemente las escalas.
- La navegación está separada de la regla para evitar solapamientos. Usa enlaces `#solar`, `#galaxy`, `#universe` y `#sn`; el estado sigue al hash y respeta atrás/adelante.

## Adaptación y modo informe
- Contenedor máximo de 1240 px; a ≤900 px las figuras pasan a una columna y el margen lateral baja a 24 px.
- A ≤640 px: margen de 20 px, cabecera apilada, navegación de dos columnas, texto y tesis en una columna, controles y tablas más compactos.
- Cada gráfico observa su propio ancho: por debajo de 480 px ajusta la leyenda horizontal, amplía el margen inferior según el número de trazas y aumenta la altura para alojarla.
- El tema claro sirve como «modo informe» para exportar figuras sobre fondo claro; no implica una maquetación de impresión de toda la página.
- La barra de Plotly permite exportar PNG con tamaño configurado de 1400 × 900 y escala 2, usando el tema activo y un nombre de archivo por figura.

## Accesibilidad y alcance de revisión
- Hay enlace «Ir al contenido», destino principal enfocable, navegación etiquetada y selección indicada con `aria-current`.
- Foco visible de 2 px con separación de 4 px; controles nativos, etiquetas y valores de sliders con `aria-valuetext`.
- Estado del motor y avisos usan `aria-live="polite"`; el contenido en cálculo comunica `aria-busy`. Las figuras incluyen pies mediante `figure` / `figcaption`.
- `prefers-reduced-motion: reduce` elimina las transiciones del cursor de escala y de la opacidad de carga.
- La revisión independiente dio **SHIP al alcance visual revisado**. No certifica accesibilidad integral ni valida por sí sola todos los contrastes, gráficos, lectores de pantalla o recorridos de teclado.
