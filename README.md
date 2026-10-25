# Receptari de casa

Calculadores de receptes interactives, publicades amb GitHub Pages: https://ignasimallafre.github.io/receptari/

Tot és HTML, CSS i JavaScript estàtics: no cal cap servidor ni cap framework.

## Què hi ha

| Fitxer | Què és |
|---|---|
| `index.html` | Índex: tries una recepta i la calculadora s'obre al costat (es genera, no l'editis a mà) |
| `*.html` | Les calculadores |
| `receptari.css` | Sistema de disseny comú: colors, tipografia, components, accessibilitat, mode cuina i impressió |
| `receptari.js` | Comportament comú: pictogrames, barra d'accions, mode cuina (ingredients per marcar, passos d'un en un, pantalla encesa), temporitzadors, enllaç per compartir, afegir a la llista de la compra, resum fix al mòbil, tema clar/fosc, pestanyes amb teclat, sense connexió |
| `receptes.json` | **Font única** de la llista de receptes (títol, fitxer, enllaç a claude.ai, categoria...) |
| `sw.js`, `manifest.webmanifest`, `icones/` | Funcionar sense connexió i afegir el receptari a la pantalla d'inici del mòbil |
| `codi-font/` | Motor de les calculadores, dades de cada recepta i el script de construcció |

## Interfície de cada calculadora

Cada pàgina exposa `window.RECEPTARI` i `receptari.js` hi penja la resta:

| Funció | Retorna |
|---|---|
| `titol()` | «Arrossos secs · De carn · El de casa» |
| `mesura()` | «4 pers.» |
| `ingredients()` | `[{grup, items:[{nom, q}]}]` per al mode cuina |
| `passos()` | `[{quan, t, det?, min?}]`; `min` activa el temporitzador |
| `compra()` | `[{botiga, nom, n, u, uw, q}]` per sumar a la llista combinada |
| `estat()` / `carrega(o)` | l'estat serialitzable, per a l'enllaç `?estat=` |
| `resum()` | `[[etiqueta, valor]]` per a la franja fixa del mòbil |

El motor ja la porta; les pàgines fetes a mà (vermut, ensaïmades, Manitoba) la defineixen al final del seu script.

## Com s'actualitza

```
python3 codi-font/build.py
```

- Les calculadores amb camp `motor` a `receptes.json` es generen des de `codi-font/motor/` i `codi-font/receptes/<motor>.js`.
- La resta (vermut, ensaïmades, Manitoba) s'editen directament al seu `.html`; el build només en refà la capçalera comuna.
- Regenera `index.html` i `sw.js` (la versió de la memòria cau canvia sola quan canvia algun fitxer).
- Deixa a `codi-font/_artefactes/` (no es puja al repo) les versions per a claude.ai, amb el CSS i el JS comuns incrustats.

Per afegir una recepta: afegeix-la a `receptes.json`, executa el build i fes push.

## Domini propi

Quan `elreceptari.cat` estigui registrat, cal posar-hi registres A cap a 185.199.108.153, 185.199.109.153, 185.199.110.153 i 185.199.111.153, i afegir el fitxer `CNAME`.
