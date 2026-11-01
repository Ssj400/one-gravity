"""Sustituye únicamente el pendiente del curso y sus tres citas en el Word actual."""

from io import BytesIO
from pathlib import Path
import re
from zipfile import ZipFile
import xml.etree.ElementTree as ET

from aplicar_referencias_docx import P, visible, replace_visible
from completar_docx import paragraph

BASE = Path(__file__).resolve().parents[1]
REPLACEMENTS = {
    "(clases 4 y 5 del curso)": "(Modelos de Universo, s. f.; La consolidación del modelo heliocéntrico, s. f.)",
    "(clase 10)": "(Cosmología, materia y energía oscura, s. f.)",
    "(clase 9; Riess et al., 1998)": "(Escalera de distancias, s. f.; Riess et al., 1998)",
}


def main():
    word = BASE / "informe_borrador.docx"
    raw = word.read_bytes()
    refs = (BASE / "fuentes/material-curso.md").read_text().split("\n\n", 1)[1].split("\n\n## Criterio bibliográfico", 1)[0]
    with ZipFile(BytesIO(raw)) as z:
        xml = z.read("word/document.xml").decode()
    changes = []

    def edit(match):
        p = match.group()
        t = visible(p)
        if t == "Material del curso pendiente de identificación":
            changes.append("encabezado")
            return replace_visible(p, t, "Material del curso")
        if t.startswith("[Completar con las portadas de las láminas:"):
            changes.append("referencias")
            return "".join(paragraph(block) for block in refs.split("\n\n"))
        for old, new in REPLACEMENTS.items():
            if old in visible(p):
                changes.append(old)
                p = replace_visible(p, old, new)
        return p

    updated = P.sub(edit, xml)
    if "referencias" not in changes:
        raise ValueError("El pendiente cambió o ya está completado; revisar manualmente")
    ET.fromstring(updated)
    result = BytesIO()
    with ZipFile(BytesIO(raw)) as src, ZipFile(result, "w") as dst:
        dst.comment = src.comment
        for item in src.infolist():
            dst.writestr(item, updated.encode() if item.filename == "word/document.xml" else src.read(item.filename))
    with ZipFile(BytesIO(raw)) as src, ZipFile(BytesIO(result.getvalue())) as dst:
        assert dst.testzip() is None
        for name in src.namelist():
            if name != "word/document.xml":
                assert src.read(name) == dst.read(name)
    backup = word.with_name("informe_borrador.antes-fuentes-curso.docx")
    if word.read_bytes() != raw:
        raise RuntimeError("El Word cambió durante la edición; cancelado")
    with backup.open("xb") as out:
        out.write(raw)
    if word.read_bytes() != raw:
        raise RuntimeError("El Word cambió; cancelado, respaldo conservado")
    word.write_bytes(result.getvalue())
    print("Word actualizado; respaldo:", backup.name)
    print("Cambios puntuales:", changes)


if __name__ == "__main__":
    main()
