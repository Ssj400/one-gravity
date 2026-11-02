"""Aplica una revisión conciliada de Markdown, portada, figuras y estilos al Word.

Uso: python3 -B aplicar_estilo_personal_docx.py --expected-sha256 HASH [--force]
El hash debe corresponder al Word leído y conciliado antes de editar las secciones.
--force permite reemplazar un cuerpo que ya generó esta misma herramienta (con figuras).
No usar para regenerar un documento con cambios manuales sin conciliarlos primero.
La bibliografía y las demás partes del documento se conservan.
"""

import argparse
import hashlib
from io import BytesIO
from pathlib import Path
import re
import struct
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape, quoteattr
from zipfile import ZipFile

from sincronizar_revision_docx import paragraph, render

BASE = Path(__file__).resolve().parents[1]
WORD = BASE / "informe_borrador.docx"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
PIC = "http://schemas.openxmlformats.org/drawingml/2006/picture"
P = re.compile(r"<w:p(?:\s[^>]*)?>.*?</w:p>", re.S)
IMAGE = re.compile(r"^!\[(.+?)\]\((.+?)\)\s*$")
EMU_PER_CM = 360000
SINGLE_CM = 9.4
PAIR_CM = 7.0


def text_of(xml, attributes):
    root = ET.fromstring(f"<root{attributes}>{xml}</root>")
    return "".join(t.text or "" for t in root.iter(f"{{{W}}}t"))


def style(xml, name, definition):
    pattern = rf'<w:style\b[^>]*\bw:styleId="{re.escape(name)}"[^>]*>.*?</w:style>'
    if re.search(pattern, xml, re.S):
        return re.sub(pattern, lambda _: definition, xml, count=1, flags=re.S)
    return xml.replace("</w:styles>", definition + "</w:styles>")


def make_style(name, label, size, *, center=False, italic=False, bold=False,
               before=0, after=120, keep=False, justify=False):
    align = "center" if center else ("both" if justify else "left")
    return (
        f'<w:style w:type="paragraph" w:styleId="{name}">'
        f'<w:name w:val="{label}"/><w:basedOn w:val="Normal"/>'
        '<w:next w:val="BodyText"/><w:qFormat/><w:pPr>'
        + ('<w:keepNext/>' if keep else '')
        + f'<w:spacing w:before="{before}" w:after="{after}" w:line="360" w:lineRule="auto"/>'
        + f'<w:jc w:val="{align}"/></w:pPr><w:rPr>'
        + ('<w:b/><w:bCs/>' if bold else '')
        + ('<w:i/><w:iCs/>' if italic else '')
        + f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
        + '</w:rPr></w:style>'
    )


def png_size(path):
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"No es un PNG: {path.name}")
    return struct.unpack(">II", data[16:24])


def drawing(rid, name, cx, cy, index):
    return (
        f'<w:r><w:drawing><wp:inline xmlns:a="{A}" distT="0" distB="0" distL="0" distR="0">'
        f'<wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>'
        f'<wp:docPr id="{index}" name="Figura {index}"/>'
        '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>'
        f'<a:graphic><a:graphicData uri="{PIC}">'
        f'<pic:pic xmlns:pic="{PIC}"><pic:nvPicPr>'
        f'<pic:cNvPr id="{index}" name={quoteattr(name)}/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        '<pic:spPr><a:xfrm><a:off x="0" y="0"/>'
        f'<a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
        '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>'
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected-sha256", required=True)
    parser.add_argument("--force", action="store_true",
                        help="reemplaza un cuerpo generado antes por esta herramienta")
    args = parser.parse_args()
    raw = WORD.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != args.expected_sha256:
        raise RuntimeError("El Word cambió: conciliar la versión actual antes de aplicar")
    with ZipFile(BytesIO(raw)) as source:
        xml = source.read("word/document.xml").decode()
        styles = source.read("word/styles.xml").decode()
        rels = source.read("word/_rels/document.xml.rels").decode()
        core = source.read("docProps/core.xml").decode()
        names = set(source.namelist())

    attrs = re.search(r"<w:document\b([^>]*)>", xml).group(1)
    matches = [m for m in P.finditer(xml)
               if text_of(m.group(), attrs) == "5.3 Referencias (APA 7)"]
    if len(matches) != 1:
        raise ValueError("Inicio de bibliografía ausente o ambiguo")
    body_start = re.search(r"<w:body(?:\s[^>]*)?>", xml).end()
    old_body = xml[body_start:matches[0].start()]
    active = r"<(?:w:(?:drawing|object|tbl|ins|del|fldChar)|m:oMath)\b"
    if re.search(active, old_body) and not args.force:
        raise ValueError("El cuerpo contiene activos/cambios: conciliar a mano o usar --force")
    reference_tail = xml[matches[0].start():]
    refs = reference_tail[:reference_tail.rfind("<w:sectPr")]
    section = reference_tail[len(refs):]
    # Márgenes uniformes de 1,8 cm; el texto hereda Times New Roman 12 del Word.
    section = re.sub(r"<w:pgMar\b[^>]*/>",
                     '<w:pgMar w:top="1020" w:right="1020" w:bottom="1020" '
                     'w:left="1020" w:header="510" w:footer="510" w:gutter="0"/>', section)

    # La bibliografía conserva sus entradas; solo se alinea a la izquierda para
    # que las URLs largas no estiren las líneas.
    def left_align(match):
        block = match.group()
        if 'w:val="Heading' in block:
            return block
        # Entradas de bibliografía: alineadas a la izquierda y con interlineado
        # compacto, para que las URLs largas no estiren las líneas.
        if 'w:val="BodyText"' in block:
            block = re.sub(r'<w:spacing\b[^>]*/>',
                           '<w:spacing w:before="0" w:after="30" w:line="240" w:lineRule="auto"/>',
                           block, count=1)
        block = re.sub(r'<w:jc\b[^>]*/>', '', block)
        if "</w:pPr>" in block:
            block = block.replace("</w:pPr>", '<w:jc w:val="left"/></w:pPr>', 1)
        else:
            block = block.replace("<w:p>", '<w:p><w:pPr><w:jc w:val="left"/></w:pPr>', 1)
        return block
    refs = P.sub(left_align, refs)

    rel_root = ET.fromstring(rels)
    existing_ids = {node.get("Id") for node in rel_root}
    new_relationships = []
    media = {}          # nombre de archivo -> rId
    media_files = {}    # nombre de archivo -> ruta
    counter = iter(range(1000, 100000))

    def add_relationship(kind, target, external=False):
        rid = "rIdInformeEstilo" + str(len(new_relationships) + 1)
        while rid in existing_ids:
            rid += "x"
        existing_ids.add(rid)
        mode = ' TargetMode="External"' if external else ''
        new_relationships.append(
            f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/'
            f'officeDocument/2006/relationships/{kind}" Target={quoteattr(target)}{mode}/>'
        )
        return rid

    def link_paragraph(label, url):
        rid = add_relationship("hyperlink", url, external=True)
        return (f'<w:p><w:pPr><w:pStyle w:val="CoverLinks"/></w:pPr>'
                f'<w:hyperlink r:id="{rid}" w:history="1"><w:r><w:rPr>'
                '<w:u w:val="single"/></w:rPr>'
                f'<w:t>{escape(label)}</w:t></w:r></w:hyperlink></w:p>')

    def figure_paragraph(caption, files):
        width = PAIR_CM if len(files) > 1 else SINGLE_CM
        runs = []
        for path in files:
            if not path.is_file():
                raise FileNotFoundError(path)
            if path.name not in media:
                target = "media/" + path.name
                existing = [n.get("Id") for n in rel_root
                            if n.get("Type", "").endswith("/image") and n.get("Target") == target]
                media[path.name] = existing[0] if existing else add_relationship("image", target)
                media_files[path.name] = path
            w, h = png_size(path)
            cx = int(width * EMU_PER_CM)
            runs.append(drawing(media[path.name], path.name, cx, int(cx * h / w), next(counter)))
        images = '<w:r><w:t xml:space="preserve"> </w:t></w:r>'.join(runs)
        return (f'<w:p><w:pPr><w:pStyle w:val="Figure"/></w:pPr>{images}</w:p>'
                f'<w:p><w:pPr><w:pStyle w:val="Caption"/></w:pPr>'
                f'<w:r><w:t>{escape(caption)}</w:t></w:r></w:p>')

    def render_with_figures(markdown):
        blocks = []
        chunk = []
        for line in markdown.splitlines():
            match = IMAGE.match(line)
            if not match:
                chunk.append(line)
                continue
            if chunk:
                blocks.append(render("\n".join(chunk) + "\n"))
                chunk = []
            caption, target = match.groups()
            files = [(BASE / item.strip()).resolve()
                     for item in target.split("|")]
            blocks.append(figure_paragraph(caption, files))
        if chunk:
            blocks.append(render("\n".join(chunk) + "\n"))
        return "".join(blocks)

    cover = []
    title = None
    for block in (BASE / "secciones/00-portada.md").read_text().strip().split("\n\n"):
        if block.startswith("# "):
            title = block[2:]
            cover.append(paragraph(title, "Title"))
        elif block.startswith("*") and not block.startswith("**"):
            cover.append(paragraph(block.strip("*"), "Subtitle"))
        elif re.fullmatch(r"\[([^\]]+)\]\((https://[^)]+)\)", block):
            match = re.fullmatch(r"\[([^\]]+)\]\((https://[^)]+)\)", block)
            cover.append(link_paragraph(*match.groups()))
        else:
            cover.append(paragraph(block, "CoverMeta"))
    if not title:
        raise ValueError("Portada sin título")
    # Solo la portada fuerza un salto; las cinco secciones forman un texto continuo.
    parts = []
    for name in ["01-introduccion.md", "02-fundamentacion.md", "03-desarrollo.md",
                 "04-discusion.md", "05-conclusiones.md"]:
        markdown = (BASE / "secciones" / name).read_text()
        if name.startswith("05"):
            markdown = markdown.split("## 5.3 Referencias", 1)[0]
        body = render_with_figures(markdown)
        if name.startswith("01"):
            body = body.replace('<w:pPr>', '<w:pPr><w:pageBreakBefore/>', 1)
        parts.append(body)
    updated = xml[:body_start] + "".join(cover + parts) + refs + section
    # Nombre de autor en cursiva y título centrado, como en los trabajos de referencia.
    styles = style(styles, "Title", make_style("Title", "Title", 48, center=True,
                                              bold=True, before=1440, after=360, keep=True))
    styles = style(styles, "Subtitle", make_style("Subtitle", "Subtitle", 32, center=True,
                                                 italic=True, after=600, keep=True))
    styles = style(styles, "CoverMeta", make_style("CoverMeta", "Datos de portada", 24,
                                                   center=True, after=160, keep=True))
    styles = style(styles, "CoverLinks", make_style("CoverLinks", "Enlaces del proyecto", 24,
                                                    center=True, before=160, after=80))
    styles = style(styles, "Figure", make_style("Figure", "Figura", 24, center=True,
                                                before=120, after=30, keep=True))
    styles = style(styles, "Caption", make_style("Caption", "Pie de figura", 19,
                                                 before=0, after=120, justify=True))
    # Mantener encabezados semánticos, pero sin una página nueva por apartado.
    h1 = re.search(r'<w:style\b[^>]*w:styleId="Heading1".*?</w:style>', styles, re.S).group()
    styles = styles.replace(h1, h1.replace('<w:pageBreakBefore/>', '<w:pageBreakBefore w:val="0"/>'))
    body_style = re.search(r'<w:style\b[^>]*w:styleId="BodyText".*?</w:style>', styles, re.S).group()
    updated_body_style = re.sub(r'<w:jc\b[^>]*/>', '', body_style)
    updated_body_style = re.sub(r'w:after="\d+"', 'w:after="100"', updated_body_style)
    updated_body_style = re.sub(r'(<w:widowControl/>)+', '<w:widowControl/>', updated_body_style)
    updated_body_style = updated_body_style.replace('</w:pPr>', '<w:jc w:val="both"/><w:widowControl/></w:pPr>')
    styles = styles.replace(body_style, updated_body_style)
    if '<dc:title' in core:
        core = re.sub(r'<dc:title(?:\s[^>]*)?>.*?</dc:title>|<dc:title\s*/>',
                      lambda _: f'<dc:title>{escape(title)}</dc:title>', core, count=1, flags=re.S)
    # Eliminar relaciones huérfanas de ejecuciones anteriores (portada/figuras
    # reemplazadas) y conservar solo las que el documento usa.
    used = set(re.findall(r'r:(?:id|embed)="([^"]+)"', updated))
    head = rels[:rels.index("<Relationships")]
    kept = []
    for match in re.finditer(r"<Relationship\b[^>]*/>", rels):
        tag = match.group()
        kind = re.search(r'Type="([^"]+)"', tag).group(1)
        rid = re.search(r'Id="([^"]+)"', tag).group(1)
        if kind.endswith(("/hyperlink", "/image")) and rid not in used:
            continue
        kept.append(tag)
    rels = (head +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            + ''.join(kept) + ''.join(new_relationships) + '</Relationships>')

    updates = {"word/document.xml": updated, "word/styles.xml": styles,
               "word/_rels/document.xml.rels": rels, "docProps/core.xml": core}
    for key, data in updates.items():
        try:
            ET.fromstring(data)
        except ET.ParseError as error:
            Path('/tmp/opencode/fallo.xml').write_text(data)
            print('Fallo en', key, error, 'columna', getattr(error, 'position', None))
            raise
    assert refs in updated
    assert updated.count("https://doi.org/") == xml.count("https://doi.org/")
    for literal in ['vn12 = v + accel(r)*dt*1/2', 'vn1 = vn12 + accel(rn1)*dt*1/2']:
        assert escape(literal) in updated
    if not media_files:
        raise ValueError("No se encontraron figuras en las secciones")
    result = BytesIO()
    with ZipFile(BytesIO(raw)) as src, ZipFile(result, "w") as dst:
        dst.comment = src.comment
        for item in src.infolist():
            media_name = item.filename.removeprefix("word/media/")
            if media_name in media_files:
                dst.writestr(item, media_files[media_name].read_bytes())
            elif item.filename in updates:
                dst.writestr(item, updates[item.filename].encode())
            else:
                dst.writestr(item, src.read(item.filename))
        for name, path in media_files.items():
            if "word/media/" + name not in names:
                dst.writestr("word/media/" + name, path.read_bytes())
    with ZipFile(BytesIO(raw)) as src, ZipFile(BytesIO(result.getvalue())) as dst:
        assert dst.testzip() is None
        updated_media = {"word/media/" + name for name in media_files}
        for name in src.namelist():
            if name not in updates and name not in updated_media:
                assert src.read(name) == dst.read(name), name
        assert len(dst.namelist()) == len(src.namelist()) + len(
            [n for n in media_files if "word/media/" + n not in names])
    backup = BASE / f"informe_borrador.antes-estilo-personal-{digest[:10]}.docx"
    if not backup.exists():
        with backup.open("xb") as out:
            out.write(raw)
    elif backup.read_bytes() != raw:
        raise RuntimeError("El respaldo existente no corresponde a esta versión")
    temp = WORD.with_suffix(".estilo-nuevo.docx")
    with temp.open("xb") as out:
        out.write(result.getvalue())
    if WORD.read_bytes() != raw:
        raise RuntimeError("El Word cambió durante la edición; resultado conservado aparte")
    temp.replace(WORD)
    print("Actualizado:", WORD)
    print("Respaldo:", backup.name)
    print(f"Figuras insertadas: {len(media_files)}; bibliografía conservada; ZIP/XML válidos.")


if __name__ == "__main__":
    main()
