/**
 * Configuración manual de estadísticas históricas.
 *
 * ADOPTED_BEFORE_APP: número de adopciones ocurridas ANTES de que
 * existiera esta aplicación. Se suma al conteo real de la BD para
 * mostrar el total acumulado en la Home.
 *
 * FOUNDING_YEAR: año de fundación de la protectora, usado para
 * calcular "años de experiencia" automáticamente.
 *
 * ADOPTED_THIS_YEAR: adopciones manuales del año actual para el badge
 * del hero cuando aún no hay datos en la app.
 */
export const SITE_CONFIG = {
  ADOPTED_BEFORE_APP: 150,   // ← ajustar con el histórico real
  FOUNDING_YEAR: 2019,       // ← año de fundación real
  ADOPTED_THIS_YEAR: 12,     // ← ajustar con el dato real del año en curso
} as const;
