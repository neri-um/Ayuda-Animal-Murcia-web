#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Corrige los atributos de los productos insertados:
- Intercambia para_perro/para_gato (estaban invertidos)
- Añade fechas de caducidad faltantes según el listado original
- Marca reservado_cer donde corresponde
"""
import os
import psycopg2

DSN = os.environ.get('AIVEN_DSN', 'postgres://avnadmin:CHANGEME@pg-713e10f-ayam.k.aivencloud.com:20563/defaultdb?sslmode=require')

# Correcciones: id -> {campo: valor}
CORRECCIONES = {
    # GATO - Sólido Adultos (eran para_perro=True, deben ser para_gato=True)
    12: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2026-09-01"},
    13: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-03-01"},
    14: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-08-01"},
    15: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-05-01"},
    16: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-05-01", "reservado_cer": True},
    17: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2026-10-01"},
    18: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2026-11-01"},
    19: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2026-10-01"},

    # GATO - Dietas (sin fecha en listado, pero son gato)
    20: {"para_gato": True, "para_perro": False},
    21: {"para_gato": True, "para_perro": False},
    22: {"para_gato": True, "para_perro": False},

    # GATO - Kitten
    23: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2026-11-01"},
    24: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-05-01"},
    25: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2027-03-01"},
    26: {"para_gato": True, "para_perro": False, "fecha_caducidad": "2025-10-01"},  # caducado

    # GATO - Húmedo Adulto
    27: {"para_gato": True, "para_perro": False},
    28: {"para_gato": True, "para_perro": False},
    29: {"para_gato": True, "para_perro": False},
    30: {"para_gato": True, "para_perro": False},
    31: {"para_gato": True, "para_perro": False},
    32: {"para_gato": True, "para_perro": False},
    32: {"para_gato": True, "para_perro": False},
    33: {"para_gato": True, "para_perro": False},
    34: {"para_gato": True, "para_perro": False},
    35: {"para_gato": True, "para_perro": False},
    36: {"para_gato": True, "para_perro": False},
    37: {"para_gato": True, "para_perro": False},
    38: {"para_gato": True, "para_perro": False},
    39: {"para_gato": True, "para_perro": False},
    40: {"para_gato": True, "para_perro": False},
    41: {"para_gato": True, "para_perro": False},

    # GATO - Húmedo Kitten
    42: {"para_gato": True, "para_perro": False},

    # PERRO - Sólido Cachorro
    43: {"para_perro": True, "para_gato": False, "fecha_caducidad": "2027-01-01"},
    44: {"para_perro": True, "para_gato": False, "fecha_caducidad": "2027-05-01"},
    45: {"para_perro": True, "para_gato": False, "fecha_caducidad": "2025-08-01"},
    46: {"para_perro": True, "para_gato": False, "fecha_caducidad": "2025-12-01"},
    47: {"para_perro": True, "para_gato": False, "fecha_caducidad": "2026-04-01"},

    # PERRO - Húmedo Adulto
    48: {"para_perro": True, "para_gato": False},

    # PERRO - Húmedo Cachorro
    49: {"para_perro": True, "para_gato": False},
    50: {"para_perro": True, "para_gato": False},
    51: {"para_perro": True, "para_gato": False},
    52: {"para_perro": True, "para_gato": False},

    # Productos existentes (1-10) - objetos/transporte/accesorios -> sin especie
    # ya tienen para_perro=False, para_gato=False (correcto)
}

def fix_products():
    import psycopg2
    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    for pid, cambios in CORRECCIONES.items():
        sets = []
        vals = []
        for k, v in cambios.items():
            col = k
            if k == "fecha_caducidad":
                col = "fecha_caducidad"
            elif k == "para_gato":
                col = "para_gato"
            elif k == "para_perro":
                col = "para_perro"
            elif k == "reservado_cer":
                col = "reservado_cer"
            sets.append(f"{col} = %s")
            vals.append(v)
        if not sets:
            continue
        vals.append(pid)
        sql = f"UPDATE producto SET {', '.join(sets)} WHERE id = %s"
        cur.execute(sql, vals)
        print(f"  OK id={pid} -> {cambios}")

    conn.commit()
    conn.close()
    print("\nCorrección completada.")

if __name__ == "__main__":
    fix_products()