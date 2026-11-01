"""Actualiza bibliografía y citas puntuales conservando el resto del Word."""

import html
from pathlib import Path
import re
import shutil
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
from zipfile import ZipFile

from completar_docx import paragraph

BASE = Path(__file__).resolve().parents[1]
WORD = BASE / "informe_borrador.docx"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
P = re.compile(r"<w:p(?:\s[^>]*)?>.*?</w:p>", re.S)
T = re.compile(r"(<w:t(?:\s[^>]*)?>)(.*?)(</w:t>)", re.S)


def visible(p):
    return "".join(html.unescape(m.group(2)) for m in T.finditer(p))


def replace_visible(p, old, new):
    """Reemplaza un fragmento aunque abarque varios runs, sin perder sus estilos."""
    matches = list(T.finditer(p))
    pieces = [html.unescape(m.group(2)) for m in matches]
    merged = "".join(pieces)
    positions = [m.start() for m in re.finditer(re.escape(old), merged)]
    for start in reversed(positions):
        end = start + len(old)
        offset = 0
        spans = []
        for i, text in enumerate(pieces):
            spans.append((i, offset, offset + len(text)))
            offset += len(text)
        intersect = [(i, a, b) for i, a, b in spans if a < end and b > start]
        for k, (i, a, b) in enumerate(intersect):
            lo, hi = max(0, start - a), min(len(pieces[i]), end - a)
            pieces[i] = pieces[i][:lo] + (new if k == 0 else "") + pieces[i][hi:]
    for match, text in reversed(list(zip(matches, pieces))):
        p = p[:match.start(2)] + escape(text) + p[match.end(2):]
    return p


def citations(p):
    replacements = {
        "58,98": "58,97",
        "Ryden (2017)": "Ryden (2016)",
        "Ryden, 2017": "Ryden, 2016",
        "1.580 supernovas de tipo Ia reales": "1.580 mediciones de supernovas de tipo Ia",
        "1.580 supernovas Ia": "1.580 mediciones de supernovas Ia",
        "1.580 supernovas de Pantheon+": "1.580 mediciones de supernovas de Pantheon+",
        "las 1.580 supernovas": "las 1.580 mediciones de supernovas",
        "con 1.580 supernovas": "con 1.580 mediciones de supernovas",
        "frente a los 58,97 km/s de NASA.": "frente a los 58,97 km/s de la ficha de NASA (Williams, 2024).",
        "en acuerdo con el valor de Planck (13,8 Gyr).": "en acuerdo aproximado con el valor de Planck (13,8 Gyr; Planck Collaboration, 2020).",
        "fondo cósmico de microondas.": "fondo cósmico de microondas (Riess et al., 2022; Planck Collaboration, 2020).",
        "Los datos solo calzan con una expansión acelerada por energía oscura.": "Los datos favorecen el escenario acelerado entre las alternativas comparadas.",
        "Para comparar con observaciones usamos las supernovas": "Para comparar con observaciones usamos las supernovas",
        "Usamos NumPy para operar con arreglos": "Usamos NumPy (Harris et al., 2020) para operar con arreglos",
        "mediante Pyodide, basado en WebAssembly.": "mediante Pyodide, basado en WebAssembly (The Pyodide development team, s. f.).",
        "Plotly.js muestra las figuras.": "Plotly.js muestra las figuras (Plotly Technologies Inc., s. f.).",
        "(clase 9). La distancia": "(clase 9; Riess et al., 1998). La distancia",
        "que no desarrollamos aquí.": "que no desarrollamos aquí (Ryden, 2016).",
        "obtener después la distancia de luminosidad.": "obtener después la distancia de luminosidad (Ryden, 2016).",
        "DESI DR2 (2025) prefiere": "El análisis DESI DR2 (DESI Collaboration, 2025) prefiere",
    }
    for old, new in replacements.items():
        if old != new and old in visible(p):
            p = replace_visible(p, old, new)
    return p


def bibliography():
    output = []
    for block in (BASE / "fuentes/referencias-apa.md").read_text().strip().split("\n\n"):
        if block.startswith("# "):
            output.append(paragraph(block[2:], "Heading2"))
        else:
            p = paragraph(" ".join(block.splitlines()))
            if "https://" in block and not block.startswith("Los datos"):
                p = p.replace("</w:pPr>", '<w:ind w:left="720" w:hanging="720"/></w:pPr>', 1)
            output.append(p)
    return "".join(output)


def main():
    raw = WORD.read_bytes()
    with ZipFile(WORD) as archive:
        original_xml = archive.read("word/document.xml").decode()
    matches = list(P.finditer(original_xml))
    heading = [m for m in matches if visible(m.group()) == "5.3 Referencias (APA 7)"]
    if len(heading) != 1:
        raise ValueError("Encabezado de referencias ausente o ambiguo")
    start = heading[0].end()
    tail = original_xml[start:]
    if "Lista acordada entre las dos sesiones" not in visible(tail):
        raise ValueError("La bibliografía cambió; revisar antes de reemplazar")
    # Conservamos las propiedades finales de sección y el cierre del documento.
    end = original_xml.rfind("<w:sectPr")
    if end < start:
        end = original_xml.index("</w:body>", start)
    suffix = original_xml[end:]
    new_xml = P.sub(lambda m: citations(m.group()), original_xml[:start]) + bibliography() + suffix
    ET.fromstring(new_xml)
    backup = WORD.with_name("informe_borrador.antes-referencias.docx")
    temporary = WORD.with_suffix(".referencias-nuevo.docx")
    if backup.exists() or temporary.exists():
        raise FileExistsError("Ya existe la copia previa o el archivo temporal")
    if WORD.read_bytes() != raw:
        raise RuntimeError("El Word cambió; se cancela para preservar los cambios")
    shutil.copy2(WORD, backup)
    with ZipFile(backup) as source, ZipFile(temporary, "w") as dest:
        dest.comment = source.comment
        for item in source.infolist():
            dest.writestr(item, new_xml.encode() if item.filename == "word/document.xml" else source.read(item.filename))
    with ZipFile(backup) as source, ZipFile(temporary) as dest:
        assert dest.testzip() is None
        for name in source.namelist():
            if name != "word/document.xml":
                assert source.read(name) == dest.read(name), name
        assert new_xml.endswith(suffix)
        before = [visible(m.group()) for m in P.finditer(original_xml[:start])]
        after = [visible(m.group()) for m in P.finditer(new_xml[:new_xml.index(bibliography())])]
        assert len(before) == len(after)
        for a, b in zip(before, after):
            if a != b:
                print("Cita/dato actualizado:", b[:150])
    if WORD.read_bytes() != raw:
        raise RuntimeError("El Word cambió; resultado conservado aparte, sin sobrescribir")
    temporary.replace(WORD)
    print("Actualizado:", WORD)
    print("Respaldo:", backup)


if __name__ == "__main__":
    main()
