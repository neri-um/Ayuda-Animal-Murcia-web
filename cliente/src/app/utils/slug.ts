/**
 * Convierte un nombre de animal en un slug de URL limpio.
 * Ejemplos:
 *   "Luna"         → "luna"
 *   "Max García"   → "max-garcia"
 *   "Ñoño"        → "nono"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')                    // descompone acentos
    .replace(/[\u0300-\u036f]/g, '')     // elimina diacríticos (á→a, ñ→n…)
    .replace(/[^a-z0-9\s-]/g, '')        // elimina caracteres especiales
    .trim()
    .replace(/\s+/g, '-');               // espacios → guiones
}
