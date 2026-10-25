"""Paleta del receptari i comprovació de contrast WCAG.

Totes les pàgines comparteixen la mateixa paleta, definida a receptari.css.
Aquest fitxer en guarda una còpia per comprovar els contrastos:
    python3 codi-font/accents.py    ->  ha de dir "fails: 0"
Si canvies un color a receptari.css, canvia'l també aquí i torna-ho a comprovar.
"""
PAL = {
 "l": dict(bg="#f3eee6", surface="#fffcf7", sunk="#f8f2e9", ink="#221c16", muted="#5b5146", line="#e2d8ca", field="#8a7e70",
           accent="#a3401a", soft="#f8e3d8", aink="#ffffff", bar="#d08a3c", a2="#2f5d46",
           bad="#a8251b", badsoft="#f8ded8", warn="#7a4f00", warnsoft="#f6e9d0", info="#245a7a", infosoft="#e0eaf0"),
 "d": dict(bg="#16120f", surface="#201a15", sunk="#1a1511", ink="#f2eadf", muted="#b8ab9b", line="#3a3029", field="#85796b",
           accent="#f08c62", soft="#3e2419", aink="#1e0c04", bar="#e0a64f", a2="#8cc4a1",
           bad="#f39a90", badsoft="#3d201d", warn="#f2bd60", warnsoft="#3a2d15", info="#8fc0dc", infosoft="#17303d"),
}
TESTS = [("muted","bg",4.5),("muted","surface",4.5),("muted","sunk",4.5),("ink","bg",7),("field","surface",3),("field","sunk",3),
         ("surface","bad",4.5),("surface","warn",4.5),("surface","info",4.5),("ink","badsoft",4.5),("muted","warnsoft",4.5),("muted","infosoft",4.5),
         ("accent","surface",4.5),("accent","bg",4.5),("accent","sunk",4.5),("accent","soft",4.5),("aink","accent",4.5),("ink","soft",4.5),
         ("muted","soft",4.5),("a2","surface",4.5),("a2","bg",4.5),("bar","sunk",2.0),("accent","line",3)]

def lum(h):
    h = h.lstrip("#"); r, g, b = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)
def cr(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + .05) / (min(la, lb) + .05)

if __name__ == "__main__":
    bad = 0
    for m, P in PAL.items():
        for a, b, need in TESTS:
            r = cr(P[a], P[b]); ok = r >= need; bad += not ok
            print(m, f"{a}/{b}", round(r, 2), "OK" if ok else "FAIL")
    print("fails:", bad)
