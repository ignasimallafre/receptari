# Receptari de casa

Calculadores interactives de receptes (HTML estàtic), publicades amb GitHub Pages.

- `index.html`: índex de receptes (la llista és a l'script, `S.list`).
- `receptari.css`: sistema de disseny compartit (colors clar/fosc, tipografia, espaiat de 8 px, radis, components i accessibilitat). Totes les pàgines el carreguen després del seu estil propi.
- Cada pàgina només defineix el seu color d'accent (`--accent`, `--accent-soft`, `--accent-ink`, `--bar`, `--accent2`) en un `<style>` just després de `receptari.css`.

Per afegir una recepta: copia'n l'HTML autònom a l'arrel, enllaça `receptari.css`, defineix l'accent i afegeix l'entrada a `S.list` d'`index.html`.
