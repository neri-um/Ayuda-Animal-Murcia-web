#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Añade y rellena las columnas de clasificación de alimentación:
  - tipo_alimento: SECO (sólido) | HUMEDO
  - etapa_alimento: ADULTO | CACHORRO
  - es_dieta: boolean
Deriva los valores de la columna `descripcion` (p. ej. "Sólido · Adulto"),
corrige la especie del Acana (debe ser gato) y limpia la descripcion redundante.
DSN desde la variable de entorno AIVEN_DSN.
"""
import os
import sys
import psycopg2

DSN = os.environ.get('AIVEN_DSN')
if not DSN:
    print('ERROR: define AIVEN_DSN')
    sys.exit(1)

ALTER = """
ALTER TABLE producto ADD COLUMN IF NOT EXISTS tipo_alimento  VARCHAR(20);
ALTER TABLE producto ADD COLUMN IF NOT EXISTS etapa_alimento VARCHAR(20);
ALTER TABLE producto ADD COLUMN IF NOT EXISTS es_dieta       BOOLEAN NOT NULL DEFAULT false;
"""

CLASIFICAR = """
UPDATE producto SET
  tipo_alimento = CASE
     WHEN descripcion ILIKE 'S%lido%' THEN 'SECO'
     WHEN descripcion ILIKE 'H%medo%' THEN 'HUMEDO'
     WHEN descripcion ILIKE 'Dietas%' THEN 'HUMEDO'
     ELSE tipo_alimento END,
  etapa_alimento = CASE
     WHEN descripcion ILIKE '%Adulto%'  THEN 'ADULTO'
     WHEN descripcion ILIKE '%itten%'   THEN 'CACHORRO'
     WHEN descripcion ILIKE '%achorro%' THEN 'CACHORRO'
     ELSE etapa_alimento END,
  es_dieta = (descripcion ILIKE 'Dietas%')
WHERE categoria = 'ALIMENTACION';
"""

LIMPIAR_DESC = "UPDATE producto SET descripcion = NULL WHERE categoria = 'ALIMENTACION';"


def main():
    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    for stmt in ALTER.strip().split(';'):
        if stmt.strip():
            cur.execute(stmt)

    cur.execute(CLASIFICAR)
    print(f'Clasificados: {cur.rowcount}')

    # Acana es de GATO (en el listado aparece en GATO · Sólido · Adulto)
    cur.execute("UPDATE producto SET para_perro=false, para_gato=true WHERE nombre ILIKE 'Acana%';")
    print(f'Acana corregido a gato: {cur.rowcount}')

    cur.execute(LIMPIAR_DESC)
    print(f'Descripciones limpiadas: {cur.rowcount}')

    conn.commit()

    cur.execute("""
        SELECT id, nombre, para_perro, para_gato, tipo_alimento, etapa_alimento, es_dieta, fecha_caducidad, reservado_cer
        FROM producto
        WHERE categoria = 'ALIMENTACION'
        ORDER BY para_gato DESC, tipo_alimento, etapa_alimento, es_dieta, id
    """)
    print('\nid | esp | tipo   | etapa    | dieta | caducidad  | CER | nombre')
    for (pid, nombre, perro, gato, tipo, etapa, dieta, cad, cer) in cur.fetchall():
        esp = 'P' if perro else ('G' if gato else '?')
        print(f'{pid:>3} | {esp}  | {str(tipo):6} | {str(etapa):8} | {str(dieta):5} | {str(cad):10} | {str(cer):5} | {nombre}')

    cur.execute("SELECT COUNT(*) FROM producto WHERE categoria='ALIMENTACION' AND tipo_alimento IS NULL AND NOT es_dieta")
    print(f'\nSin clasificar (alimentación): {cur.fetchone()[0]}')
    conn.close()


if __name__ == '__main__':
    main()
