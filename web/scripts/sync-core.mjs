// Copia el paquete Python (core/una_gravedad) y los datos (data/) a web/public/
// para que Pyodide los cargue en el navegador. Corre antes de `dev` y `build`.
//
// Variables opcionales:
//   CORE_DIR   otra carpeta con el paquete (por defecto ../core/una_gravedad)
//   OVERRIDES  un .py que se importa después del paquete para reemplazar funciones
//              (solo para probar la interfaz con una implementación de referencia)
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const coreDir = resolve(process.env.CORE_DIR ?? join(root, "core", "una_gravedad"));
const dataDir = join(root, "data");
const pub = join(here, "..", "public");
const pyOut = join(pub, "py");
const dataOut = join(pub, "data");

rmSync(pyOut, { recursive: true, force: true });
rmSync(dataOut, { recursive: true, force: true });
mkdirSync(join(pyOut, "una_gravedad"), { recursive: true });

const files = readdirSync(coreDir).filter((f) => f.endsWith(".py"));
for (const f of files) copyFileSync(join(coreDir, f), join(pyOut, "una_gravedad", f));
// `version` cambia en cada build: el worker la agrega como ?v= a cada archivo para
// saltarse la caché del navegador (GitHub Pages sirve con max-age=600).
const manifest = { version: Date.now().toString(36), package: files.map((f) => `una_gravedad/${f}`), overrides: false };

if (process.env.OVERRIDES && existsSync(process.env.OVERRIDES)) {
  copyFileSync(process.env.OVERRIDES, join(pyOut, "_overrides.py"));
  manifest.overrides = true;
}
writeFileSync(join(pyOut, "manifest.json"), JSON.stringify(manifest, null, 2));

mkdirSync(dataOut, { recursive: true });
cpSync(join(dataDir, "sparc", "NGC3198_rotmod.dat"), join(dataOut, "NGC3198_rotmod.dat"));
cpSync(join(dataDir, "pantheon_plus", "Pantheon+SH0ES.dat"), join(dataOut, "Pantheon+SH0ES.dat"));

console.log(`sync-core: ${files.length} módulos desde ${coreDir}${manifest.overrides ? " + overrides" : ""}; datos copiados`);
