# Datos descargados

Archivos guardados **tal como se descargaron**. No editar. Checksums MD5 para comprobar que siguen intactos (`md5sum -c` con la lista de abajo).

| Archivo | Origen | Descargado | MD5 |
| --- | --- | --- | --- |
| `sparc/NGC3198_rotmod.dat` | `https://astroweb.cwru.edu/SPARC/Rotmod_LTG.zip` (archivo `NGC3198_rotmod.dat` dentro del zip) | 2026-10-17 | `8ea48c4f54b1107c60b867d912448ba2` |
| `pantheon_plus/Pantheon+SH0ES.dat` | `https://github.com/PantheonPlusSH0ES/DataRelease`, carpeta `Pantheon+_Data/4_DISTANCES_AND_COVAR/` | 2026-10-17 | `2049b142e6aad384470b3364aa10f3fa` |
| `pantheon_plus/README` | misma carpeta | 2026-10-17 | `e7516d6ba3e598fec3a2b9a28b2df094` |

## Cómo citar (pendiente de verificar por el compañero)

- **SPARC:** el sitio pide citar el paper principal: Lelli, F., McGaugh, S. S., & Schombert, J. M. (2016). *SPARC: Mass models for 175 disk galaxies with Spitzer photometry and accurate rotation curves*. The Astronomical Journal, 152(6), 157. También conviene citar la fuente original de la curva de NGC 3198 (referencia en `SPARC_Lelli2016c.mrt`, Table 1 del sitio).
- **Pantheon+:** el README cita arXiv:2202.04077 (Scolnic et al. 2022, *The Pantheon+ Analysis: The Full Data Set and Light-curve Release*, ApJ 938, 113) y arXiv:2112.04510 (Riess et al. 2022, SH0ES, ApJL 934, L7). El análisis cosmológico es Brout et al. 2022 (ApJ 938, 110). Verificar todos en NASA ADS.

## Columnas que usamos

- SPARC: `Rad` (kpc), `Vobs`, `errV`, `Vgas`, `Vdisk`, `Vbul` (km/s). `Vdisk` y `Vbul` están tabuladas para un cociente masa-luz Υ = 1; `Vgas` puede ser negativa. El encabezado da la distancia adoptada (13,8 Mpc).
- Pantheon+: `zHD`, `MU_SH0ES`, `MU_SH0ES_ERR_DIAG`, `IS_CALIBRATOR`. Los módulos de distancia están calibrados con Cefeidas de SH0ES (H0 ≈ 73 km/s/Mpc). El README advierte que los errores diagonales solo sirven para graficar; un ajuste riguroso usa la matriz de covarianza completa (no descargada: 33 MB).
