#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Importa el listado *ALIMENTACIÓN AYAM MIRADORES* a la tabla `producto` de Aiven.

Reglas de interpretación:
  - Cada línea del listado es un producto (una fila, aunque el nombre se repita).
  - ⚠️  -> caducado: no se guarda, se deriva de fecha_caducidad.
  - ❗  -> abierto=True (se añade la columna `abierto` si no existe).
  - ❌  -> reservado_cer=True (no aparece ninguno en el listado).
  - "(N)" numérico -> stock; fechas dd/mm/aa, mm/aa, mm-aaaa, "mes aaaa".
  - Categoría: ALIMENTACION para perro/gato, OTRO para la sección OTROS.
  - es_dieta=True en alimentos veterinarios/prescripción.

Uso:
  python import_miradores.py            # dry-run (solo muestra lo que haría)
  python import_miradores.py --execute  # aplica ALTER + INSERT en la BD
"""
import os
import re
import sys
import argparse
import datetime

import psycopg2

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get(
    'AIVEN_DSN',
    'postgres://avnadmin:CHANGEME@pg-713e10f-ayam.k.aivencloud.com:20563/defaultdb?sslmode=require',
)

TEXTO = """*ALIMENTACIÓN AYAM MIRADORES*
PERRO
GATO

PERRO
Adulto
Seco
* Amity salmón 3kg _19/08/25⚠️
* Royal Canin Hipoalergénico perro pequeño  3.5 kg _03/26 (2)❗⚠️
* Ownat prime grain free with natural ingredients 3Kg_  05-25 ⚠️
* Gosbi exclusive lamb médium 3Kg_ 8-2025 ⚠️
* Farmina pet foods N&D pumpkin adulto médium &maxi 2,5kg_ 27/08/2025 (2) ⚠️
* Farmina pet foods N&D pumpkin adulto médium &maxi 2,5kg_ 03/02/2025 ⚠️
* Farmina pet foods N&D pumpkin adulto médium &maxi 2,5kg_ 20/06/2025 ⚠️
* Dibaq sense holistic dog food grain free salmón 2kg_ 12/08/2025 (2) ⚠️
* Criadores grain free cordero a partir de 10kg de 2,5kg_ 05/01/2026 ⚠️
* Criadores grain free cordero a partir de 10kg de 2,5kg_ 05/01/2026 ⚠️❗
* Kibus banquete de Ternera 1,2kg_ 24/10/2025 ❗️⚠️
* Natural greatness wild recipe 10kg_ 27/03/2025 ⚠️
* Weego mini adult classic chicken 2kg_ 2/01/27
* Puri a friskies 5 promises (4)_5/27
* Advance weight balance +10kg, 3kg_ 28/03/2027 ❗
* Greenies dental treats teenie 2-7kg x22_ 28/11/26

Húmedo
* Latas royal canin gastrointestinal 400gr _ 02/07/ 2026 (9)
* Start true food adulto (rico en buey) 1200g _ 02-10-28
* Nature’s variety bocaditos en salsa de pollo y verduras, mini 100g_ 17/02/28
* I/d Hills digestive care 156g_ 9/27
* Daily con pavo y calabacín 100g (3)_ 9/11/27
* Daily con ternera y zanahorias 100g (3)_ 21/12/27
* Royal Canin hyppallergenic 400g_ 6/05/26 (2) ⚠️

Puppy
Leche Gosbi perro 400gr _19/10/2023 (3)⚠️

GATO
Adulto
* Hills m/d (diabetes) 3kg _11/26❗
* Libra Mediterranean balance adulto de salmón 3Kg _30/06/2027 ❗️
* Catextreme con pollo y guisantes SENIOR castrado 2,5 kg _28/09/26 
* Royal Canin renal 2kg_ 22/02/2024 ⚠️
* Natcane CER (2)_09/02/27 ❗
* Natcane CER_09/02/27
* Natcane prote (2)_09/02/27 ❗
* Natcane prote_09/02/27
* Dechra gato joven esterilizado 400g_ 9/01/27
* IAMS naturally con salmón y arroz 700gr_ 25/04/27
* Compy supreme con salmón, frutas y verduras 1,5 kg_ 18/03/27 ❗

Húmedo
* Trovet hipoallergenic conejo 200gr _10/1/28 (2)
* Majesty mousse con atún y pescado 85g(2)_ 18/12/27
* Majesty mousse con pollo e hígado 85g (2)_ 12/04/27
* Recovery renal alimento completo altamente calórico (dos botecitos 90ml)_ 2/28

Snacks
Compy rellenos de pollo y malta 70g_ 12/01/2026 ⚠️

Kitten
* / globuLait Leche de gato con inmunoglobulina _03/2024⚠️
* Lata Royal Canin Mother & babycat 1-4 meses 195g _04/08/2027
* Compy júnior con pollo 1,5kg_ 23/07/25 ⚠️
* Majesty mousse con pollo y pavo 85g_ 24/05/27
Majesty mousse con salmón 85g_ 12/10/27
*Lata criadores pollo con sardina 170g_ 10/26

OTROS
* Barritas de miel hamster- conejo-cobaya _abril 2026 ⚠️
* Saco Heno con manzanilla _ 13/01/2027
* Vitalive Goldfish comida pez 35gr_ 09/2028❗️
* Alimento paea peces de agua fría 32g_ 01_2028 ❗️
"""

MESES = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
}

FULL_DATE = re.compile(r'(\d{1,2})\s*[/-]\s*(\d{1,2})\s*[/-]\s*(\d{2,4})(?!\d)')
MONTH_DATE = re.compile(r'([A-Za-zÁÉÍÓÚáéíóú]+)\s+(\d{4})(?!\d)')
SHORT_DATE = re.compile(r'(\d{1,2})\s*[/-]\s*(\d{2,4})(?!\d)')
SHORT_DATE_UNDERSCORE = re.compile(r'(\d{1,2})_(\d{4})(?!\d)')
PAREN_NUM = re.compile(r'\(\s*(\d+)\s*\)')
DIETA_RE = re.compile(
    r'alerg|allerg|gastrointestinal|\brenal\b|\bm/d\b|\bi/d\b|recovery|weight balance'
    r'|natcane\s+(cer|prote)',
    re.IGNORECASE,
)


def parse_date(line):
    for m in FULL_DATE.finditer(line):
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if year < 100:
            year += 2000
        if month > 12:
            if day <= 12:
                day, month = month, day
            else:
                continue
        try:
            return datetime.date(year, month, day), m.start(), m.end()
        except ValueError:
            continue

    m = MONTH_DATE.search(line)
    if m and m.group(1).lower() in MESES:
        return datetime.date(int(m.group(2)), MESES[m.group(1).lower()], 1), m.start(), m.end()

    for regex in (SHORT_DATE, SHORT_DATE_UNDERSCORE):
        for m in regex.finditer(line):
            month, year = int(m.group(1)), int(m.group(2))
            if year < 100:
                year += 2000
            try:
                return datetime.date(year, month, 1), m.start(), m.end()
            except ValueError:
                continue
    return None


def clean_name(raw):
    n = raw.strip()
    n = re.sub(r'^\*+\s*', '', n)
    n = re.sub(r'^/\s*', '', n)
    n = PAREN_NUM.sub('', n)
    n = n.replace('_', ' ')
    n = re.sub(r'\s+', ' ', n).strip(' -,')
    return n.replace(' paea ', ' para ')


def tipo_kitten(nombre):
    low = nombre.lower()
    if 'lata' in low or 'mousse' in low or 'majesty' in low:
        return 'HUMEDO'
    if 'kg' in low or 'gr' in low or 'g ' in low:
        return 'SECO'
    return None


def parse_listado(texto):
    rows = []
    especie = etapa = tipo = None
    for raw in texto.splitlines():
        line = raw.strip()
        if not line:
            continue
        key = re.sub(r'[*_`]', '', line).strip().upper()
        if key == 'PERRO':
            especie, etapa, tipo = 'P', None, None
            continue
        if key == 'GATO':
            especie, etapa, tipo = 'G', None, None
            continue
        if key == 'OTROS':
            especie, etapa, tipo = 'O', None, None
            continue
        if key == 'ADULTO':
            etapa = 'ADULTO'
            if especie == 'G':
                tipo = 'SECO'
            continue
        if key == 'SECO':
            tipo = 'SECO'
            continue
        if key == 'HÚMEDO':
            tipo = 'HUMEDO'
            continue
        if key in ('PUPPY', 'KITTEN'):
            etapa, tipo = 'CACHORRO', None
            continue
        if key == 'SNACKS':
            tipo = None
            continue
        if 'MIRADORES' in key:
            continue

        d = parse_date(line)
        if not d:
            print(f'  [aviso] línea sin fecha, ignorada: {line}')
            continue
        fecha, start, _ = d
        nombre = clean_name(line[:start])
        if not nombre:
            print(f'  [aviso] línea sin nombre, ignorada: {line}')
            continue

        stock = sum(int(m.group(1)) for m in PAREN_NUM.finditer(line)) or 1
        abierto = '❗' in line
        categoria = 'OTRO' if especie == 'O' else 'ALIMENTACION'
        t, e = tipo, etapa
        if categoria == 'ALIMENTACION' and e == 'CACHORRO':
            t = tipo_kitten(nombre) if especie == 'G' else None
        dieta = bool(DIETA_RE.search(nombre)) and categoria == 'ALIMENTACION'
        rows.append({
            'nombre': nombre,
            'categoria': categoria,
            'stock': stock,
            'para_perro': especie == 'P',
            'para_gato': especie == 'G',
            'fecha_caducidad': fecha,
            'tipo_alimento': t if categoria == 'ALIMENTACION' else None,
            'etapa_alimento': e if categoria == 'ALIMENTACION' else None,
            'es_dieta': dieta,
            'abierto': abierto,
            'reservado_cer': False,
        })
    return rows


ALTER_ABIERTO = "ALTER TABLE producto ADD COLUMN IF NOT EXISTS abierto BOOLEAN NOT NULL DEFAULT false;"

INSERT = """
    INSERT INTO producto (nombre, descripcion, categoria, stock_total, stock_disponible,
                          para_perro, para_gato, stock_minimo, fecha_caducidad, reservado_cer,
                          tipo_alimento, etapa_alimento, es_dieta, abierto)
    VALUES (%s, NULL, %s, %s, %s, %s, %s, 0, %s, %s, %s, %s, %s, %s)
    RETURNING id;
"""

EXISTS = """
    SELECT id FROM producto
    WHERE nombre = %s AND categoria = %s AND abierto = %s AND stock_total = %s
      AND fecha_caducidad IS NOT DISTINCT FROM %s
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true', help='aplica los cambios en la BD')
    args = parser.parse_args()

    rows = parse_listado(TEXTO)
    print(f'\nProductos parseados: {len(rows)}\n')
    print(' # | esp | tipo   | etapa    | dieta | abierto | stk | caducidad  | nombre')
    print('-' * 100)
    for i, r in enumerate(rows, 1):
        esp = 'P' if r['para_perro'] else ('G' if r['para_gato'] else '·')
        print(f"{i:>2} |  {esp}  | {str(r['tipo_alimento'] or '-'):6} | {str(r['etapa_alimento'] or '-'):8} | "
              f"{str(r['es_dieta']):5} | {str(r['abierto']):7} | {r['stock']:>3} | "
              f"{str(r['fecha_caducidad']):10} | {r['nombre']}")

    if not args.execute:
        print('\n[DRY-RUN] Nada insertado. Usa --execute para guardar en la BD.')
        return

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()
    cur.execute(ALTER_ABIERTO)
    conn.commit()

    insertados = saltados = 0
    for r in rows:
        cur.execute(EXISTS, (r['nombre'], r['categoria'], r['abierto'], r['stock'], r['fecha_caducidad']))
        if cur.fetchone():
            saltados += 1
            print(f"  = ya existe | {r['nombre']}")
            continue
        cur.execute(INSERT, (
            r['nombre'], r['categoria'], r['stock'], r['stock'],
            r['para_perro'], r['para_gato'], r['fecha_caducidad'], r['reservado_cer'],
            r['tipo_alimento'], r['etapa_alimento'], r['es_dieta'], r['abierto'],
        ))
        pid = cur.fetchone()[0]
        print(f"  + id={pid:>3} | {r['nombre']}")
        insertados += 1

    conn.commit()
    cur.execute("SELECT COUNT(*) FROM producto")
    print(f"\nInsertados: {insertados} | Saltados (ya existían): {saltados} | Total en tabla: {cur.fetchone()[0]}")
    conn.close()


if __name__ == '__main__':
    main()
