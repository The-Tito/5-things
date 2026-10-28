// Captura cada plantilla de og/*.html a 1200×630 → public/assets/og/<nombre>.png
// Uso: npm run og            (todas)
//      npm run og crea-tu-skill
// Necesita Google Chrome instalado. Otra ruta: CHROME=/ruta/al/chrome npm run og
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";

const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const solo = process.argv.slice(2);
const plantillas = readdirSync("og").filter((f) => f.endsWith(".html"))
  .filter((f) => !solo.length || solo.includes(basename(f, ".html")));

for (const f of plantillas) {
  const out = resolve("public/assets/og", basename(f, ".html") + ".png");
  execFileSync(chrome, [
    "--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--window-size=1200,630", "--virtual-time-budget=5000",
    `--screenshot=${out}`, pathToFileURL(resolve("og", f)).href,
  ], { stdio: "ignore" });
  console.log("✓", out);
}
