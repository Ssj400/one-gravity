"""Sincroniza el cuerpo desde Markdown y conserva la bibliografía del Word.

Ejecutar solo antes de la revisión manual final: reemplaza el cuerpo completo,
no mezcla cambios manuales posteriores. Conserva un respaldo sin sobrescribirlo.
No inserta imágenes ni verifica la paginación de Word.
"""

from pathlib import Path
import hashlib
import re
import shutil
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape
from zipfile import ZipFile


BASE = Path(__file__).resolve().parents[1]
WORD = BASE / "informe_borrador.docx"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def paragraph(text, style="BodyText", code=False, equation=False):
    props = f'<w:pStyle w:val="{style}"/>'
    props += '<w:spacing w:before="0" w:after="0" w:line="360" w:lineRule="auto"/>' if code else '<w:spacing w:line="360" w:lineRule="auto"/>'
    if style.startswith("Heading"):
        props += '<w:keepNext/>'
    if equation:
        props += '<w:jc w:val="center"/>'
    # El código se conserva literalmente: los asteriscos de multiplicación
    # no son delimitadores de cursiva de Markdown.
    chunks = [text] if code else re.split(r"(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)", text)
    runs = []
    for chunk in chunks:
        if not chunk:
            continue
        bold = not code and chunk.startswith("**") and chunk.endswith("**")
        italic = not code and not bold and chunk.startswith("*") and chunk.endswith("*")
        mono = code or (chunk.startswith("`") and chunk.endswith("`"))
        if bold:
            chunk = chunk[2:-2]
        elif italic or (not code and mono):
            chunk = chunk[1:-1]
        rprops = '<w:lang w:val="es-CL"/>'
        if mono:
            rprops += '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>'
        rprops += '<w:b/>' if bold else ''
        rprops += '<w:i/>' if italic else ''
        runs.append(f'<w:r><w:rPr>{rprops}</w:rPr><w:t xml:space="preserve">{escape(chunk)}</w:t></w:r>')
    return f'<w:p><w:pPr>{props}</w:pPr>{"".join(runs)}</w:p>'


def render(markdown):
    result, buffer, code = [], [], False

    def flush():
        if buffer:
            result.append(paragraph(" ".join(buffer)))
            buffer.clear()

    for line in markdown.splitlines():
        if line.startswith("```"):
            flush()
            code = not code
        elif code:
            result.append(paragraph(line, code=True))
        elif not line.strip():
            flush()
        elif line.startswith("# ") or line.startswith("## "):
            flush()
            level = 2 if line.startswith("## ") else 1
            result.append(paragraph(line[level + 1:], f"Heading{level}"))
        elif line.startswith("> "):
            flush()
            result.append(paragraph(line[2:], equation=not line.startswith("> Pendiente")))
        elif line.startswith("- "):
            flush()
            result.append(paragraph("• " + line[2:]))
        else:
            buffer.append(line)
    flush()
    if code:
        raise ValueError("Bloque de código sin cerrar")
    return "".join(result)


def main():
    raw = WORD.read_bytes()
    with ZipFile(WORD) as archive:
        xml = archive.read("word/document.xml").decode()
        styles = archive.read("word/styles.xml").decode()
        if any(name.startswith("word/media/") for name in archive.namelist()):
            raise ValueError("El Word ya contiene imágenes: revisar manualmente antes de regenerar el cuerpo")

    attributes = re.search(r"<w:document\b([^>]*)>", xml).group(1)
    boundary = []
    for match in re.finditer(r"<w:p(?:\s[^>]*)?>.*?</w:p>", xml, re.S):
        element = ET.fromstring(f'<root{attributes}>{match.group()}</root>')
        text = "".join(t.text or "" for t in element.findall(".//w:t", NS))
        if text == "5.3 Referencias (APA 7)":
            boundary.append(match.start())
    if len(boundary) != 1:
        raise ValueError("No se encontró un único inicio de bibliografía")
    body_start = re.search(r"<w:body(?:\s[^>]*)?>", xml).end()
    reference_tail = xml[boundary[0]:]
    if '<w:drawing' in xml[body_start:boundary[0]] or '<w:object' in xml[body_start:boundary[0]]:
        raise ValueError("El cuerpo contiene objetos que requieren conservación manual")

    sections = ["01-introduccion.md", "02-fundamentacion.md", "03-desarrollo.md", "04-discusion.md", "05-conclusiones.md"]
    parts = []
    for name in sections:
        text = (BASE / "secciones" / name).read_text()
        if name == "05-conclusiones.md":
            text = text.split("## 5.3 Referencias", 1)[0]
        parts.append(render(text))
        if name == "03-desarrollo.md":
            captions = (BASE / "secciones/03-pies-de-figura.md").read_text()
            captions = captions.replace("# Pies de figura", "## Pies de figura (pendientes de montaje)", 1)
            parts.append(render(captions))
    updated = xml[:body_start] + "".join(parts) + reference_tail
    ET.fromstring(updated)

    # Heredar la fuente del documento, corrigiendo el nombre inválido recibido
    # ("Times New Roman;serif") y la fuente alternativa de las cabeceras.
    styles = re.sub(r'w:(ascii|hAnsi|eastAsia|cs)="(?:Times New Roman;serif|Liberation Serif)"', r'w:\1="Times New Roman"', styles)
    styles = styles.replace('<w:lang w:val="en-US"', '<w:lang w:val="es-CL"')
    styles = re.sub(r'(<w:style\b[^>]*w:styleId="BodyText".*?<w:spacing\b[^>]*w:after=")283(")', r'\g<1>120\2', styles, flags=re.S)
    ET.fromstring(styles)
    backup = BASE / f"informe_borrador.antes-tono-{hashlib.sha256(raw).hexdigest()[:10]}.docx"
    if not backup.exists():
        shutil.copy2(WORD, backup)
    temp = WORD.with_suffix(".revision-nueva.docx")
    if temp.exists():
        raise FileExistsError(temp)
    with ZipFile(WORD) as original, ZipFile(temp, "w") as output:
        output.comment = original.comment
        for item in original.infolist():
            data = updated.encode() if item.filename == "word/document.xml" else styles.encode() if item.filename == "word/styles.xml" else original.read(item.filename)
            output.writestr(item, data)
    with ZipFile(WORD) as original, ZipFile(temp) as output:
        assert output.testzip() is None
        assert original.namelist() == output.namelist()
        for name in original.namelist():
            if name not in {"word/document.xml", "word/styles.xml"}:
                assert original.read(name) == output.read(name), name
        assert output.read("word/document.xml").decode().endswith(reference_tail)
        for line in ['vn12 = v + accel(r)*dt*1/2', 'vn1 = vn12 + accel(rn1)*dt*1/2']:
            assert escape(line) in updated
    if WORD.read_bytes() != raw:
        raise RuntimeError("El Word cambió durante la operación; no se sobrescribe")
    temp.replace(WORD)
    print(f"Actualizado: {WORD}")
    print(f"Respaldo: {backup}")
    print("Verificado: bibliografía conservada literalmente, XML válido y código sin pérdida de asteriscos.")


if __name__ == "__main__":
    main()
