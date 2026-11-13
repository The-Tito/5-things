# 5 cosas · guías y recursos

Sitio de las guías de la serie «5 cosas…» y de los recursos extra que comparto (prompts, plantillas). Hecho con [Astro](https://astro.build): el contenido se escribe en archivos `.mdx` y el sitio se genera como HTML estático, sin JS de framework, publicado en GitHub Pages.

```
src/
  site.ts                     ← nombre, GoatCounter, canal de difusión, perfil
  content/
    guias/                    episodios de «5 cosas» (un .mdx por guía)
      antes-de-la-carrera.mdx episodio 01 · link del DM
    recursos/                 extras fuera de la serie
      crea-tu-skill.mdx       prompt para crear una skill (CTA «SKILL»)
      crea-tu-skill.prompt.txt  el texto exacto que se copia
      crea-tus-reglas.mdx     prompt para crear reglas (CTA «REGLAS»)
      crea-tus-reglas.prompt.txt
      elige-tus-conectores.mdx  prompt y lista de conectores (CTA «MCP»)
      elige-tus-conectores.prompt.txt
    */_plantilla.mdx          esqueletos (el «_» hace que no se publiquen)
  content.config.ts           qué campos lleva cada guía y cada recurso (se validan al compilar)
  components/                 piezas: botones, tarjeta, bloques, bloque final, pie
  layouts/                    Base (head y vista previa), Guia, Recurso
  pages/                      portada y la ruta que publica cada .mdx
  styles/base.css             diseño compartido
  scripts/app.js              casillas, contador, copiar, compartir, medición
og/                           plantillas de las imágenes para compartir
public/assets/og/             las imágenes ya capturadas
```

Cada `.mdx` de `guias/` o `recursos/` se publica en `/5-things/<nombre-del-archivo>/` y aparece solo en la portada. Las URLs ya compartidas no cambian.

## Trabajar en local

```bash
npm install        # la primera vez
npm run dev        # http://localhost:4321/5-things/ con recarga al guardar
npm run build      # genera dist/ (falla si a un .mdx le falta un campo)
npm run og         # captura las imágenes de og/*.html (necesita Google Chrome)
```

## Configuración

Todo está en `src/site.ts`:

- `goatcounter`: `antonio-selvas` → panel en [antonio-selvas.goatcounter.com](https://antonio-selvas.goatcounter.com).
- `canal`: link del canal de difusión. Mientras esté vacío, el bloque final muestra la variante «perfil».
- `perfil`: tu perfil de Instagram.

## Publicación (GitHub Pages)

- Repo: [The-Tito/5-things](https://github.com/The-Tito/5-things)
- En el repo: **Settings → Pages → Source: GitHub Actions**. El flujo `.github/workflows/deploy.yml` compila y publica cada vez que algo llega a `main`.
- Sitio: `https://the-tito.github.io/5-things/`
- **Links para el DM**:
  - Antes de la carrera: `https://the-tito.github.io/5-things/antes-de-la-carrera/?ref=reel-antes`
  - Crea tu skill: `https://the-tito.github.io/5-things/crea-tu-skill/?ref=dm-skill`
  - Crea tus reglas: `https://the-tito.github.io/5-things/crea-tus-reglas/?ref=dm-reglas`
  - Elige tus conectores: `https://the-tito.github.io/5-things/elige-tus-conectores/?ref=dm-mcp`
- Revisa la vista previa en el [depurador de Meta](https://developers.facebook.com/tools/debug/) y abre el link desde Instagram en tu celular, no solo desde Chrome.

## Ramas (Git Flow)

| Rama | Para qué |
| --- | --- |
| `main` | Lo publicado. Cada merge lleva tag (`v1.0.0`, `v1.1.0`…). GitHub Pages sale de aquí. |
| `develop` | Integración. Aquí se juntan las features antes de publicar. |
| `feature/<nombre>` | Una guía, un recurso o un cambio de diseño. Sale de `develop` y vuelve a `develop`. |
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

Versiones: una guía o un recurso nuevo sube el número de en medio (`1.1.0`); un arreglo sube el último (`1.0.1`).

## Agregar una guía o un recurso

1. Copia `src/content/guias/_plantilla.mdx` (o `recursos/_plantilla.mdx`) con el nombre que quieras en la URL, por ejemplo `herramientas-ia.mdx`.
2. Reemplaza cada `CAMBIA`. El campo `guide` es un id único y corto (`ia`): separa el progreso guardado y las métricas de las demás páginas. No lo cambies después de publicar.
3. Imagen para compartir: copia `og/antes-de-la-carrera.html` como `og/<nombre>.html`, cámbiale el texto y corre `npm run og <nombre>`.
4. Quita `borrador: true` cuando esté lista. La portada la agrega sola.
5. Publícala siguiendo el flujo de ramas de arriba.

El contenido se escribe en Markdown dentro del `.mdx` (negritas, `código`, párrafos) y las piezas especiales son componentes: `<Card>`, `<Why>`, `<Start>`, `<Step>`, `<Ignore>`, `<Pills>`, `<Glossary>`, `<Prompt>`, `<Weeks>`, `<Tools>`, `<Conectores>`, `<Btn>`, `<CopyButton>`, `<ShareButton>`. En los títulos, `*palabra*` lleva el resaltado de marcador.

**Para no romper nada:** el progreso guardado y las métricas dependen de `guide` y de los atributos `data-*` que `app.js` lee (`data-step`, `data-copy`, `data-track`…). Si cambias un componente, revisa que las páginas publicadas sigan generando los mismos atributos.

## Copiar textos largos

`data-copy="id"` copia el texto del elemento `#id` en una sola línea (sirve para prompts cortos). Para un prompt con pasos, agrega `data-copy-raw`: conserva los saltos de línea, también en la vía de respaldo del navegador de Instagram. En los componentes es `<Btn copy="id" copyRaw>` y `<CopyButton target="id" raw />`. Guarda el texto en un `.txt` junto al `.mdx` e impórtalo con `?raw`, así lo que se ve y lo que se copia salen del mismo archivo.

## Mantenimiento

- **Elige tus conectores:** la lista de conectores (dónde está cada uno, planes, permisos) cambia seguido. Revísala cada 2 o 3 meses en `src/content/recursos/elige-tus-conectores.mdx` y actualiza la línea «Revisado en…» y el campo `actualizado`.

## Medición

Eventos que se registran en GoatCounter, con el `guide` de cada página como prefijo:

| Evento | Cuándo |
| --- | --- |
| `antes/empieza-01` … `05` | clic en «Empieza aquí» |
| `antes/hecho-01` … `05` | casilla marcada |
| `antes/copiar-prompt-1` … `3` | prompt copiado |
| `antes/compartir-01` … | «Mándatelo a tu compu» |
| `antes/canal` · `antes/perfil` | clic en el bloque final |
| `skill/copiar` · `skill/copiar-abajo` | prompt copiado (botón de arriba / de abajo) |
| `skill/compartir` | «Mándatelo a tu compu» |
| `skill/canal` · `skill/perfil` | clic en el bloque final |
| `reglas/copiar` · `reglas/copiar-abajo` | prompt copiado (botón de arriba / de abajo) |
| `reglas/compartir` | «Mándatelo a tu compu» |
| `reglas/canal` · `reglas/perfil` | clic en el bloque final |
| `mcp/copiar` · `mcp/copiar-abajo` | prompt copiado (botón de arriba / de abajo) |
| `mcp/compartir` | «Mándatelo a tu compu» |
| `mcp/canal` · `mcp/perfil` | clic en el bloque final |

Las visitas que llegan con `?ref=reel-antes`, `?ref=dm-skill`, `?ref=dm-reglas` o `?ref=dm-mcp` aparecen en **Top referrers** con ese nombre. Para filtrar una página en el panel, escribe su prefijo (`antes/`, `skill/`, `reglas/`, `mcp/`) o `5-things` en «Filter paths». A los 7 días, anota: comentarios ANTES → visitas con ese ref → clics al canal.
