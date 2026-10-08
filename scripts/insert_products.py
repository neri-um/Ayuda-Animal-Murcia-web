#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Inserta los ~50 productos del listado de alimentación en la tabla `producto`.
Usa la DSN de Aiven desde variable de entorno AIVEN_DSN.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor

DSN = os.environ.get('AIVEN_DSN', 'postgres://avnadmin:CHANGEME@pg-713e10f-ayam.k.aivencloud.com:20563/defaultdb?sslmode=require')

# Estructura: cada producto es una tupla (nombre, descripcion, categoria, stock, para_perro, para_gato, stock_minimo, fecha_caducidad, reservado_cer)
# fecha_caducidad en formato "YYYY-MM-DD" (primer día del mes para "MM/YY")
# descripcion incluye el tipo (Sólido/Húmedo/Dietas) y edad (Adulto/Kitten/Cachorro)

PRODUCTOS = [
    # GATO - Sólido Adultos
    ("True origins trucha 2kg", "Sólido · Adulto", "ALIMENTACION", 1, True, False, 0, "2026-09-01", False),
    ("Start salmón 2kg", "Sólido · Adulto", "ALIMENTACION", 2, True, False, 0, "2027-03-01", False),
    ("Brekkies pescado 1.5kg", "Sólido · Adulto", "ALIMENTACION", 1, True, False, 0, "2027-08-01", False),
    ("Start pollo 2kg", "Sólido · Adulto", "ALIMENTACION", 2, True, False, 0, "2027-05-01", False),
    ("Start pollo 14kg CER", "Sólido · Adulto", "ALIMENTACION", 1, True, False, 0, "2027-05-01", True),  # reservado CER
    ("Applaws pescado 1.8kg", "Sólido · Adulto", "ALIMENTACION", 1, True, False, 0, "2026-10-01", False),
    ("Acana carne y pescado 1.8kg", "Sólido · Adulto", "ALIMENTACION", 1, True, False, 0, "2026-11-01", False),
    ("Orijen carne 340g", "Sólido · Adulto", "ALIMENTACION", 2, True, False, 0, "2026-10-01", False),

    # GATO - Dietas
    ("Nath gastrointestinal 200g", "Dietas · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Purina ProPlan gastrointestinal 195g", "Dietas · Adulto", "ALIMENTACION", 11, True, False, 0, None, False),
    ("Criadores gastrointestinal 200g", "Dietas · Adulto", "ALIMENTACION", 4, True, False, 0, None, False),

    # GATO - Kitten
    ("Salvaje pollo 1.5kg", "Sólido · Kitten", "ALIMENTACION", 1, True, False, 0, "2026-11-01", False),
    ("Criadores científico pollo 2kg", "Sólido · Kitten", "ALIMENTACION", 1, True, False, 0, "2027-05-01", False),
    ("Start! Pollo 1.5kg", "Sólido · Kitten", "ALIMENTACION", 8, True, False, 0, "2027-03-01", False),
    ("Hanty kitten & Mother pollo 2kg", "Sólido · Kitten", "ALIMENTACION", 1, True, False, 0, "2025-10-01", False),  # caducado

    # GATO - Húmedo Adulto
    ("Criadores mousse pollo 100g", "Húmedo · Adulto", "ALIMENTACION", 3, True, False, 0, None, False),
    ("Applaws broth pollo y espárragos 70g", "Húmedo · Adulto", "ALIMENTACION", 3, True, False, 0, None, False),
    ("Applaws broth pollo y arroz salvaje 70g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Applaws jelly pollo y ternera 70g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Criadores atún, pollo y sardinas 170g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Criadores pollo y verduras y atún 170g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Criadores pollo y buey 170g", "Húmedo · Adulto", "ALIMENTACION", 3, True, False, 0, None, False),
    ("Catextreme cordero 395g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Felix trozos en salsa 85g", "Húmedo · Adulto", "ALIMENTACION", 48, True, False, 0, None, False),
    ("Almo nature carne y conejo 400g", "Húmedo · Adulto", "ALIMENTACION", 1, True, False, 0, None, False),
    ("Criadores esterilizado pavo y salmón 200g", "Húmedo · Adulto", "ALIMENTACION", 2, True, False, 0, None, False),
    ("Catzilla salmón 400g", "Húmedo · Adulto", "ALIMENTACION", 2, True, False, 0, None, False),
    ("Catzilla pollo 400g", "Húmedo · Adulto", "ALIMENTACION", 2, True, False, 0, None, False),
    ("Catzilla atún y trucha 400g", "Húmedo · Adulto", "ALIMENTACION", 2, True, False, 0, None, False),
    ("Cosma pollo y salmón 80g", "Húmedo · Adulto", "ALIMENTACION", 6, True, False, 0, None, False),

    # GATO - Húmedo Kitten
    ("Salvaje paté pavo 100g", "Húmedo · Kitten", "ALIMENTACION", 10, True, False, 0, None, False),

    # PERRO - Sólido Cachorro
    ("Natural trainer pollo 3kg", "Sólido · Cachorro", "ALIMENTACION", 1, False, True, 0, "2027-01-01", False),
    ("Wellness Core ave 1.5kg ABIERTO", "Sólido · Cachorro", "ALIMENTACION", 1, False, True, 0, "2027-05-01", False),
    ("Gosbi exclusive puppy mini 500g", "Sólido · Cachorro", "ALIMENTACION", 6, False, True, 0, "2025-08-01", False),  # caducado
    ("Amity pollo mini puppy 2kg", "Sólido · Cachorro", "ALIMENTACION", 1, False, True, 0, "2025-12-01", False),
    ("Bravery mini pollo 600g", "Sólido · Cachorro", "ALIMENTACION", 2, False, True, 0, "2026-04-01", False),  # caducado

    # PERRO - Húmedo Adulto
    ("True origins wild ternera 400g", "Húmedo · Adulto", "ALIMENTACION", 1, False, True, 0, None, False),

    # PERRO - Húmedo Cachorro
    ("Hills chicken 370g", "Húmedo · Cachorro", "ALIMENTACION", 1, False, True, 0, None, False),
    ("Criadores GF pollo, ternera y boniato 400g", "Húmedo · Cachorro", "ALIMENTACION", 1, False, True, 0, None, False),
    ("Criadores pollo y arroz 400g", "Húmedo · Cachorro", "ALIMENTACION", 2, False, True, 0, None, False),
    ("Criadores ternera y judías 400g", "Húmedo · Cachorro", "ALIMENTACION", 1, False, True, 0, None, False),
]

def insert_products():
    conn = psycopg2.connect(DSN)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Limpiar tabla (opcional, comenta si no quieres borrar existentes)
    # cur.execute("TRUNCATE TABLE producto RESTART IDENTITY CASCADE;")

    inserted = 0
    for nombre, descripcion, categoria, stock, para_perro, para_gato, stock_minimo, fecha_caducidad, reservado_cer in PRODUCTOS:
        try:
            cur.execute("""
                INSERT INTO producto (nombre, descripcion, categoria, stock_total, stock_disponible,
                                      para_perro, para_gato, stock_minimo, fecha_caducidad, reservado_cer)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (nombre, descripcion, categoria, stock, stock, para_perro, para_gato, stock_minimo,
                  fecha_caducidad, reservado_cer))
            pid = cur.fetchone()['id']
            print(f"  OK {pid:>3} | {nombre[:50]:50} | stock={stock} | perro={para_perro} gato={para_gato} | cad={fecha_caducidad} | CER={reservado_cer}")
            inserted += 1
        except Exception as e:
            print(f"  ERR insertando '{nombre}': {e}")
            conn.rollback()
            continue

    conn.commit()
    print(f"\nTotal insertados: {inserted}")
    conn.close()

if __name__ == "__main__":
    insert_products()