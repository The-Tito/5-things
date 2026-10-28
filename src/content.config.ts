/* ==========================================================================
   Colecciones de contenido. Cada archivo .mdx es una página del sitio y se
   publica en /<nombre-del-archivo>/. Los que empiezan con «_» no se publican.
     guias/     episodios de la serie «5 cosas» (tarjetas, casillas, progreso)
     recursos/  extras sueltos: prompts, plantillas, herramientas
   ========================================================================== */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const color = z.enum(["rosa", "amarillo", "azul", "verde", "lila"]);

const ctaVariant = z.object({
  label: z.string(),
  title: z.string(),
  body: z.string(),
  button: z.string(),
  meta: z.string().optional(),
  fine: z.string().optional(),
  sticker: z.string().optional(),
});

// Campos que comparten guías y recursos
const pagina = z.object({
  // Id corto y único: separa el progreso guardado y prefija los eventos de GoatCounter.
  // No lo cambies en una página ya publicada: se perderían el progreso y la continuidad de métricas.
  guide: z.string().regex(/^[a-z0-9-]+$/),
  // *palabra* entre asteriscos = resaltado de marcador
  titulo: z.string(),
  lede: z.string(),
  descripcion: z.string(),          // <meta name="description">
  og: z.object({
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    imagen: z.string(),             // ruta en public/, p. ej. assets/og/crea-tu-skill.png
    alt: z.string().optional(),
  }),
  // Tarjeta en la portada del sitio
  portada: z.object({
    emoji: z.string(),
    color,
    resumen: z.string(),
    accion: z.string().default("Abrir"),
  }),
  actualizado: z.coerce.date(),
  borrador: z.boolean().default(false),   // true = se publica con noindex y no sale en la portada
  cta: z.object({ canal: ctaVariant, perfil: ctaVariant }),
  pie: z.string().optional(),
});

const guias = defineCollection({
  loader: glob({ pattern: "[^_]*.mdx", base: "./src/content/guias" }),
  schema: pagina.extend({
    episodio: z.number().int().positive(),
    nota: z.array(z.string()).min(1),        // «Cómo usar esta guía»
    temas: z.array(z.object({ corto: z.string(), color })).length(5),
  }),
});

const recursos = defineCollection({
  loader: glob({ pattern: "[^_]*.mdx", base: "./src/content/recursos" }),
  schema: pagina.extend({
    etiqueta: z.string(),                     // kicker y sticker: «Prompt», «Plantilla»…
  }),
});

export const collections = { guias, recursos };
