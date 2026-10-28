/* Convierte «Crea tu *skill*» en HTML con el resaltado de marcador. */
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function resaltado(s: string): string {
  return escape(s).replace(/\*([^*]+)\*/g, '<span class="hl">$1</span>');
}

export function sinMarcas(s: string): string {
  return s.replace(/\*/g, "");
}
