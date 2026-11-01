"""Verifica metadatos con Crossref y genera referencias para revisión editorial."""

import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import quote
from urllib.request import Request, urlopen

BASE = Path(__file__).resolve().parents[1]
DOIS = [
    "10.3847/1538-4357/ac8e04", "10.1086/508162", "10.1103/tr6y-kpc6",
    "10.1017/S0962492902000144", "10.1038/s41586-020-2649-2",
    "10.3847/0004-6256/152/6/157", "10.1086/161130",
    "10.1051/0004-6361/201833910", "10.1086/300499", "10.3847/2041-8213/ac5c5b",
    "10.1086/150317", "10.1017/9781316651087", "10.3847/1538-4357/ac8b7a",
    "10.1088/1475-7516/2020/12/002",
]
TITLES = {
    DOIS[0]: "The Pantheon+ analysis: Cosmological constraints",
    DOIS[1]: "A direct empirical proof of the existence of dark matter",
    DOIS[2]: "DESI DR2 results. II. Measurements of baryon acoustic oscillations and cosmological constraints",
    DOIS[3]: "Geometric numerical integration illustrated by the Störmer–Verlet method",
    DOIS[4]: "Array programming with NumPy",
    DOIS[5]: "SPARC: Mass models for 175 disk galaxies with Spitzer photometry and accurate rotation curves",
    DOIS[6]: "A modification of the Newtonian dynamics as a possible alternative to the hidden mass hypothesis",
    DOIS[7]: "Planck 2018 results. VI. Cosmological parameters",
    DOIS[8]: "Observational evidence from supernovae for an accelerating universe and a cosmological constant",
    DOIS[9]: "A comprehensive measurement of the local value of the Hubble constant with 1 km s⁻¹ Mpc⁻¹ uncertainty from the Hubble Space Telescope and the SH0ES team",
    DOIS[10]: "Rotation of the Andromeda Nebula from a spectroscopic survey of emission regions",
    DOIS[11]: "Introduction to cosmology",
    DOIS[12]: "The Pantheon+ analysis: The full data set and light-curve release",
    DOIS[13]: "Inferring the age of the universe with globular clusters",
}


def author(a):
    if a.get("name"):
        return a["name"]
    family, given = a["family"], a.get("given", "")
    if family == "Ford":
        return "Ford, W. K., Jr."
    if family == "D’arcy Kenworthy":
        return "Kenworthy, W. D."
    if family == "Mackenty":
        family = "MacKenty"
    if family == "del Río":
        return "Fernández del Río, J."
    initials = " ".join("-".join(part[0] + "." for part in word.split("-") if part)
                        for word in given.replace(".", "").split())
    return f"{family}, {initials}"


def authors(m, doi):
    if doi == DOIS[2]:
        return "DESI Collaboration"
    if doi == DOIS[7]:
        return "Planck Collaboration"
    names = [author(a) for a in m["author"]]
    if len(names) > 20:
        return ", ".join(names[:19]) + ", … " + names[-1]
    if len(names) == 1:
        return names[0]
    return ", ".join(names[:-1]) + ", & " + names[-1]


def main():
    folder = BASE / "fuentes"
    folder.mkdir(exist_ok=True)
    metadata = []
    cached = json.loads((folder / "crossref-verificado.json").read_text()) if "--cache" in sys.argv else []
    for doi in DOIS:
        if cached:
            m = next(m for m in cached if m["DOI"].lower() == doi.lower())
        else:
            req = Request("https://api.crossref.org/works/" + quote(doi, safe=""),
                          headers={"User-Agent": "AST101-reference-verification/1.0"})
            with urlopen(req, timeout=45) as response:
                m = json.load(response)["message"]
        if m["DOI"].lower() != doi.lower():
            raise ValueError(doi)
        metadata.append(m)
        print("Verificado:", doi)
    (folder / "crossref-verificado.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    entries = []
    article_numbers = {DOIS[0]: "110", DOIS[2]: "083515", DOIS[5]: "157",
                       DOIS[7]: "A6", DOIS[9]: "L7", DOIS[12]: "113", DOIS[13]: "002"}
    for doi, m in zip(DOIS, metadata):
        year = m["published"]["date-parts"][0][0]
        title = TITLES[doi]
        names = authors(m, doi)
        prefix = f"{names}{'' if names.endswith('.') else '.'} ({year}). "
        if doi == DOIS[11]:
            entry = prefix + f"*{title}* (2.ª ed.). Cambridge University Press."
        else:
            journal = html.unescape(m["container-title"][0])
            # Se conserva el nombre de la revista tal como figura en el registro editorial.
            volume = m["volume"]
            issue = f"({m['issue']})" if m.get("issue") else ""
            location = "Artículo " + article_numbers[doi] if doi in article_numbers else m["page"].replace("-", "–")
            entry = prefix + f"{title}. *{journal}, {volume}*{issue}, {location}."
        entries.append(entry + " https://doi.org/" + doi)
    entries.append("Zwicky, F. (1933). Die Rotverschiebung von extragalaktischen Nebeln. *Helvetica Physica Acta, 6*, 110–127. https://articles.adsabs.harvard.edu/pdf/1933AcHPh...6..110Z")
    entries.sort(key=str.casefold)
    text = "# Referencias académicas\n\n" + "\n\n".join(entries)
    text += "\n\n# Datos y documentación de software\n\n"
    text += "Plotly Technologies Inc. (s. f.). *Plotly.js* [Documentación de software]. https://plotly.com/javascript/\n\n"
    text += "The Pyodide development team. (s. f.). *What is Pyodide?* [Documentación de software]. https://pyodide.org/en/stable/project/about.html\n\n"
    text += "Williams, D. R. (2024, 11 de enero). *Mercury fact sheet*. NASA Goddard Space Flight Center. https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html\n\n"
    text += "Los datos de SPARC y Pantheon+ se acreditan mediante Lelli et al. (2016), Scolnic et al. (2022), Brout et al. (2022) y Riess et al. (2022).\n\n"
    text += "# Material del curso\n\n"
    course = (folder / "material-curso.md").read_text()
    text += course.split("\n\n", 1)[1].split("\n\n## Criterio bibliográfico", 1)[0] + "\n"
    (folder / "referencias-apa.md").write_text(text)
    print("Generadas 15 referencias académicas y las referencias de documentación/datos.")


if __name__ == "__main__":
    main()
