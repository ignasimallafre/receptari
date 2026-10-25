#!/usr/bin/env python3
"""Construeix el Receptari de casa.

    python3 codi-font/build.py

Font única: receptes.json (a l'arrel del repo).
  1. Calculadores del motor (camp "motor"): codi-font/motor + codi-font/receptes/<motor>.js -> <fitxer>
  2. Pàgines fetes a mà (sense "motor"): el fitxer del repo ja és la font; només s'hi actualitza la capçalera comuna.
  3. index.html (GitHub Pages) des de codi-font/index.html amb la llista de receptes incrustada.
  4. sw.js amb la llista de fitxers per funcionar sense connexió (la versió canvia amb el contingut).
  5. codi-font/_artefactes/: versions per a claude.ai (receptari.css i receptari.js incrustats, sense manifest).
     L'índex de claude.ai surt de codi-font/claude/index-claude.html i llegeix la base de dades de l'artefacte;
     les seves files es sincronitzen amb receptes.json (camp "artefacte").
"""
import hashlib, json, os, re, sys

CF = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(CF)
sys.path.insert(0, CF)

rd = lambda p: open(p, encoding="utf8").read()
def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf8").write(s)

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700'
         '&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap">\n')
FONTS_URL = re.search(r'href="(https://fonts\.googleapis\.com/css2[^"]+)"', FONTS).group(1).replace("&amp;", "&")
JSPDF = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"

def cap(desc):
    """Capçalera comuna de GitHub Pages (entre marques, per poder-la regenerar)."""
    d = desc.replace('"', "&quot;")
    return ("<!-- receptari:cap -->\n"
            f'<meta name="description" content="{d}">\n'
            '<meta name="theme-color" content="#2f5d46">\n'
            '<link rel="manifest" href="manifest.webmanifest">\n'
            '<link rel="icon" href="icones/icona.svg" type="image/svg+xml">\n'
            '<link rel="apple-touch-icon" href="icones/icona-180.png">\n'
            '<script src="receptari.js" defer></script>\n'
            "<!-- /receptari:cap -->\n")

def posa_cap(html, desc):
    html = re.sub(r"<!-- receptari:cap -->.*?<!-- /receptari:cap -->\n", "", html, flags=re.S)
    i = html.index("</title>") + len("</title>\n")
    return html[:i] + cap(desc) + html[i:]

def motor(r):
    k = r["motor"]
    layout = "/* Disposició del motor de calculadores */\n" + rd(os.path.join(CF, "motor", "engine.css"))
    sk = rd(os.path.join(CF, "motor", "skeleton.html")).replace("__TITLE__", r["titol"]).replace("__LEDE__", r["entradeta"])
    code = rd(os.path.join(CF, "receptes", k + ".js")) + "\n" + rd(os.path.join(CF, "motor", "engine.js"))
    return ('<!doctype html>\n<html lang="ca">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            f'<title>{r["titol"]}</title>\n{cap(r["descripcio"])}{FONTS}<style>\n{layout}</style>\n'
            f'<link rel="stylesheet" href="receptari.css">\n</head>\n<body>\n{sk}\n'
            f'<script src="{JSPDF}"></script>\n<script>\n{code}\n</script>\n</body>\n</html>\n'), code

def artefacte(html):
    """Versió per a claude.ai: CSS i JS comuns incrustats, sense res que depengui de fitxers del repo."""
    css, js = rd(os.path.join(R, "receptari.css")), rd(os.path.join(R, "receptari.js"))
    html = re.sub(r"<!-- receptari:cap -->.*?<!-- /receptari:cap -->\n", "", html, flags=re.S)
    assert '<link rel="stylesheet" href="receptari.css">' in html
    html = html.replace('<link rel="stylesheet" href="receptari.css">', "<style>\n" + css + "</style>")
    html = html.replace("</body>", "<script>\n" + js + "</script>\n</body>", 1)
    if "claude:viewport-fit-sides" not in html:
        i = html.index("</title>") + len("</title>")
        html = html[:i] + '\n<meta name="claude:viewport-fit-sides" content="cover">' + html[i:]
    return html

def main():
    L = json.loads(rd(os.path.join(R, "receptes.json")))
    ids = [r["id"] for r in L]
    assert len(ids) == len(set(ids)), "ids repetits a receptes.json"
    out = os.path.join(CF, "_artefactes")
    for r in L:
        p = os.path.join(R, r["fitxer"])
        if "motor" in r:
            html, code = motor(r)
            wr(os.path.join(out, r["motor"] + ".check.js"), code)
        else:
            html = posa_cap(rd(p), r["descripcio"])
            if '<script src="receptari.js"' in html:
                html = re.sub(r'\n?<script>document\.documentElement\.lang="ca"</script>', "", html)
        wr(p, html)
        wr(os.path.join(out, r["fitxer"]), artefacte(html))
        print("pàgina", r["fitxer"])

    # Índex de GitHub Pages
    pub = [{k: r[k] for k in ("id", "titol", "fitxer", "categoria", "mesura", "descripcio")} for r in L]
    idx = rd(os.path.join(CF, "index.html"))
    idx = idx.replace("<!--CAP-->\n", cap("Calculadores de receptes de casa: escalat, perfils, avisos, calendari i fitxa PDF."))
    idx = idx.replace("<!--FONTS-->\n", FONTS + '<link rel="stylesheet" href="receptari.css">\n')
    idx = idx.replace("<!--ACCENT-->\n", "")
    idx = re.sub(r"/\*RECEPTES\*/.*?/\*FI\*/", lambda m: json.dumps(pub, ensure_ascii=False), idx, flags=re.S)
    wr(os.path.join(R, "index.html"), idx)
    print("pàgina index.html")

    # Índex de claude.ai
    ic = rd(os.path.join(CF, "claude", "index-claude.html"))
    ic = ic.replace('<link rel="stylesheet" href="receptari.css">', "<style>\n" + rd(os.path.join(R, "receptari.css")) + "</style>")
    wr(os.path.join(out, "index-claude.html"), ic)

    # Service worker
    fitxers = ["./", "index.html", "receptari.css", "receptari.js", "manifest.webmanifest",
               "icones/icona.svg", "icones/icona-180.png", "icones/icona-192.png", "icones/icona-512.png"] + [r["fitxer"] for r in L]
    h = hashlib.sha256()
    for f in fitxers[1:]:
        h.update(open(os.path.join(R, f), "rb").read())
    sw = rd(os.path.join(CF, "sw.src.js")).replace("__VERSIO__", h.hexdigest()[:10]) \
        .replace("__FITXERS__", json.dumps(fitxers, ensure_ascii=False)) \
        .replace("__EXTERNS__", json.dumps([FONTS_URL, JSPDF]))
    wr(os.path.join(R, "sw.js"), sw)
    print("sw.js versió", h.hexdigest()[:10])

if __name__ == "__main__":
    main()
