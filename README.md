# 5 cosas

Sitio de las guías de la serie «5 cosas…». HTML, CSS y JS sin frameworks ni build, publicado en GitHub Pages.

```
index.html                    portada de la serie (lista de guías)
antes-de-la-carrera/          guía 1 · link del DM
_plantilla/                   esqueleto para la siguiente guía (GitHub Pages no lo publica)
assets/base.css               diseño compartido
assets/app.js                 casillas, contador, copiar, compartir, medición
assets/config.js              ← GoatCounter, canal de difusión, perfil
assets/og/                    imágenes para la vista previa al compartir
```

## Antes de publicar

1. **GoatCounter**: en `assets/config.js`, pon tu código en `goatcounter` (si tu panel es `https://antonio.goatcounter.com`, el código es `antonio`).
2. **Canal de difusión**: cuando exista, pega su link en `canal` dentro de `assets/config.js`. Mientras esté vacío, el bloque final muestra «Sígueme para la siguiente parte».
3. **«Por qué importa»**: en `antes-de-la-carrera/index.html` hay cinco comentarios `TODO`. Cambia esas líneas por lo que te pasó de verdad.

## Publicación (GitHub Pages)

- Repo: [The-Tito/5-things](https://github.com/The-Tito/5-things)
- En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
- Sitio: `https://the-tito.github.io/5-things/`
- **Link para el DM**: `https://the-tito.github.io/5-things/antes-de-la-carrera/?ref=reel-antes`
- Revisa la vista previa en el [depurador de Meta](https://developers.facebook.com/tools/debug/) y abre el link desde Instagram en tu celular, no solo desde Chrome.

## Ramas (Git Flow)

| Rama | Para qué |
| --- | --- |
| `main` | Lo publicado. Cada merge lleva tag (`v1.0.0`, `v1.1.0`…). GitHub Pages sale de aquí. |
| `develop` | Integración. Aquí se juntan las features antes de publicar. |
| `feature/<nombre>` | Una guía nueva o un cambio de diseño. Sale de `develop` y vuelve a `develop`. |
| `release/<versión>` | Ajustes finales antes de publicar. Sale de `develop`, se fusiona en `main` y en `develop`. |
| `hotfix/<versión>` | Un arreglo urgente en lo publicado. Sale de `main`, se fusiona en `main` y en `develop`. |

Flujo para el próximo video:

```bash
git checkout develop && git pull
git checkout -b feature/guia-herramientas-ia
# … crear la guía, commits …
git checkout develop && git merge --no-ff feature/guia-herramientas-ia
git checkout -b release/1.1.0
# … revisar en el celular, ajustes …
git checkout main && git merge --no-ff release/1.1.0 && git tag -a v1.1.0 -m "Guía 2: Herramientas de IA"
git checkout develop && git merge --no-ff release/1.1.0
git push origin main develop --tags
```

Versiones: una guía nueva sube el número de en medio (`1.1.0`); un arreglo sube el último (`1.0.1`).

## Agregar una guía nueva

1. Copia `_plantilla/` a una carpeta nueva, por ejemplo `herramientas-ia/`.
2. En su `index.html`, cambia `data-guide="CAMBIA-id"` por un id único y corto, por ejemplo `ia`. Ese id separa el progreso guardado y las métricas de esta guía de las demás.
3. Reemplaza cada `CAMBIA`, duplica la tarjeta hasta tener 5 y quita `<meta name="robots" content="noindex">`.
4. Agrega un bloque `<li>` en `index.html` (portada de la serie), arriba de los demás, con `data-progress-of` igual al nuevo `data-guide`.
5. Imagen para compartir: copia `assets/og/og-antes-de-la-carrera.html`, cámbiale el texto, ábrela en una ventana de 1200×630 y guarda la captura como `assets/og/<carpeta>.png`.
6. Publícala siguiendo el flujo de ramas de arriba. Las guías anteriores no se tocan.

**Regla para no romper nada:** no cambies los nombres de clases ni de atributos `data-*` en `base.css` y `app.js` si una guía ya publicada los usa. Si necesitas una pieza nueva, agrégala como clase nueva.

## Medición

Eventos que se registran en GoatCounter, con el id de cada guía como prefijo:

| Evento | Cuándo |
| --- | --- |
| `antes/empieza-01` … `05` | clic en «Empieza aquí» |
| `antes/hecho-01` … `05` | casilla marcada |
| `antes/copiar-prompt-1` … `3` | prompt copiado |
| `antes/compartir-01` … | «Mándatelo a tu compu» |
| `antes/canal` · `antes/perfil` | clic en el bloque final |

Las visitas que llegan con `?ref=reel-antes` se ven en GoatCounter como «Referrer: reel-antes». A los 7 días, anota: comentarios ANTES → visitas con ese ref → clics al canal.
