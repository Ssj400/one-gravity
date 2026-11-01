"""Inserta 2.4 y 3 sin regenerar el resto del Word; conserva una copia previa."""

from pathlib import Path
import hashlib
import re
import shutil
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
from zipfile import ZipFile


BASE = Path(__file__).resolve().parents[1]
WORD = BASE / "informe_borrador.docx"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def paragraph(text, style="BodyText", code=False):
    props = f'<w:pStyle w:val="{style}"/><w:spacing w:line="360" w:lineRule="auto"/>'
    runs = []
    for chunk in re.split(r"(\*\*.*?\*\*|`[^`]+`|\*[^*]+\*)", text):
        bold = chunk.startswith("**") and chunk.endswith("**")
        italic = not bold and chunk.startswith("*") and chunk.endswith("*")
        mono = code or (chunk.startswith("`") and chunk.endswith("`"))
        if bold:
            chunk = chunk[2:-2]
        elif italic or (chunk.startswith("`") and chunk.endswith("`")):
            chunk = chunk[1:-1]
        font = "Courier New" if mono else "Times New Roman"
        rprops = f'<w:rFonts w:ascii="{font}" w:hAnsi="{font}"/><w:sz w:val="24"/><w:lang w:val="es-CL"/>'
        rprops += "<w:b/>" if bold else ""
        rprops += "<w:i/>" if italic else ""
        runs.append(f'<w:r><w:rPr>{rprops}</w:rPr><w:t xml:space="preserve">{escape(chunk)}</w:t></w:r>')
    return f'<w:p><w:pPr>{props}</w:pPr>{"".join(runs)}</w:p>'


def render(markdown, equations=()):
    # Las ecuaciones se escriben como texto Unicode editable, no como LaTeX crudo.
    equations = iter(equations)
    def replace_equation(match):
        return "\n\n" + next(equations) + "\n\n"
    markdown = re.sub(r"\$\$.*?\$\$", replace_equation, markdown, flags=re.S)
    inline = {
        r"h = \Delta t": "h = Δt", r"\mathbf r": "r", r"\mathbf v": "v",
        "h": "h", "h^2": "h²", r"a\to0": "a → 0", "f(z)=1/E(z)": "f(z) = 1/E(z)",
        "N=2000": "N = 2000", "c/H_0": "c/H₀", "1+z": "1 + z", r"\chi^2": "χ²",
        r"\delta": "δ", r"\mu_i": "μᵢ", r"\sigma_i": "σᵢ", r"d\chi^2/d\delta=0": "dχ²/dδ = 0",
        "10^{-6}": "10⁻⁶", "h=0{,}001": "h = 0,001",
    }
    def replace_inline(match):
        return inline[match.group(1)]
    markdown = re.sub(r"\$([^$]+)\$", replace_inline, markdown)
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
        elif line.startswith("## "):
            flush()
            result.append(paragraph(line[3:], "Heading2"))
        else:
            buffer.append(line)
    flush()
    if code:
        raise ValueError("Bloque de código sin cerrar")
    return "".join(result)


def main():
    raw = WORD.read_bytes()
    with ZipFile(WORD) as archive:
        xml = archive.read("word/document.xml").decode("utf-8")
    section24 = (BASE / "secciones/02-fundamentacion.md").read_text().split(
        "## 2.4 Herramientas numéricas y de ingeniería\n", 1
    )[1].split("## 2.5", 1)[0].strip()
    section3 = (BASE / "secciones/03-desarrollo.md").read_text().split("\n", 1)[1].strip()
    equations = [
        "rₙ₊₁ = rₙ + h vₙ;     vₙ₊₁ = vₙ + h a(rₙ).",
        "vₙ₊½ = vₙ + (h/2) a(rₙ);     rₙ₊₁ = rₙ + h vₙ₊½;     vₙ₊₁ = vₙ₊½ + (h/2) a(rₙ₊₁).",
        "∫₀ᶻ f(u) du ≈ Δz [(f(0) + f(z))/2 + Σⱼ₌₁ᴺ⁻¹ f(jΔz)];     Δz = z/N.",
        "χ²(δ) = Σᵢ [μᵢ − μmodelo(zᵢ) − δ]²/σᵢ²;     δ = Σᵢ wᵢ[μᵢ − μmodelo(zᵢ)]/Σᵢ wᵢ;     wᵢ = 1/σᵢ².",
    ]
    rendered = [render(section24, equations), render(section3)]
    changes = []
    root_attributes = re.search(r"<w:document\b([^>]*)>", xml).group(1)
    for match in re.finditer(r"<w:p(?:\s[^>]*)?>.*?</w:p>", xml, re.S):
        element = ET.fromstring(f'<root{root_attributes}>{match.group()}</root>')
        text = "".join(t.text or "" for t in element.findall(".//w:t", NS))
        if text.startswith("[Escribe José.] Debe cubrir:"):
            index = 0 if "Euler explícito" in text else 1 if "arquitectura del software" in text else None
            if index is not None:
                changes.append((match.start(), match.end(), rendered[index], index))
    if sorted(x[3] for x in changes) != [0, 1]:
        raise ValueError("No se encontraron exactamente los dos marcadores esperados; no se modificó el Word")
    for start, end, replacement, _ in reversed(changes):
        xml = xml[:start] + replacement + xml[end:]
    ET.fromstring(xml)
    backup = WORD.with_name("informe_borrador.antes-secciones-2-4-y-3.docx")
    if backup.exists():
        raise FileExistsError(f"La copia previa ya existe: {backup}")
    if WORD.read_bytes() != raw:
        raise RuntimeError("El Word cambió durante la operación; no se modificó")
    shutil.copy2(WORD, backup)
    temporary = WORD.with_suffix(".nuevo.docx")
    if temporary.exists():
        raise FileExistsError(temporary)
    with ZipFile(backup) as original, ZipFile(temporary, "w") as output:
        output.comment = original.comment
        for item in original.infolist():
            data = xml.encode("utf-8") if item.filename == "word/document.xml" else original.read(item.filename)
            output.writestr(item, data)
    with ZipFile(backup) as original, ZipFile(temporary) as output:
        assert output.testzip() is None
        assert original.namelist() == output.namelist()
        for name in original.namelist():
            if name != "word/document.xml":
                assert original.read(name) == output.read(name), name
        # Al quitar exclusivamente los dos textos insertados, el XML anterior debe coincidir.
        restored = xml
        for start, end, replacement, _ in changes:
            old_xml = original.read("word/document.xml").decode("utf-8")
            assert restored.count(replacement) == 1
            restored = restored.replace(replacement, old_xml[start:end], 1)
        assert restored == original.read("word/document.xml").decode("utf-8")
    if hashlib.sha256(WORD.read_bytes()).digest() != hashlib.sha256(raw).digest():
        raise RuntimeError("El Word cambió; se conserva el resultado en .nuevo.docx sin sobrescribir")
    temporary.replace(WORD)
    print(f"Actualizado: {WORD}")
    print(f"Copia anterior: {backup}")
    print("Verificado: solo se reemplazaron los marcadores de 2.4 y 3; el resto del archivo se conserva.")


if __name__ == "__main__":
    main()
