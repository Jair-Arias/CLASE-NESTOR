# ejercicios.py
import csv
import math
import random
from utils import leer_float, leer_int, aleatorio_0_99

# helper local 
def _mi_abs(x):
    return x if x >= 0 else -x


# 1) Valor absoluto 
def ejercicio_1_valor_absoluto():
    print("--- Ejercicio 1: Valor absoluto ---")
    x = leer_float("Ingrese un número real: ")

    # método A: condicional
    abs_a = -x if x < 0 else x

    # método B: definición matemática sqrt(x^2)
    abs_b = math.sqrt(x * x)

    # método C: x^2 / sqrt(x^2) (cuidando x == 0)
    abs_c = 0.0 if x == 0 else (x * x) / abs_b

    print(f"Valor ingresado: {x}")
    print(f"Condicional : {abs_a}")
    print(f"sqrt(x^2)   : {abs_b}")
    print(f"x^2/sqrt(x^2): {abs_c}")

    # verificación 
    diff1 = abs_a - abs_b
    diff2 = abs_b - abs_c
    ok = (_mi_abs(diff1) < 1e-9) and (_mi_abs(diff2) < 1e-9)
    print("Consistencia:", "OK" if ok else "ERROR")

    signo = "positivo" if x > 0 else ("cero" if x == 0 else "negativo")
    print(f"El número es {signo}. Distancia al 0: {abs_a}\n")


# 2) Descuento por clave (01 -> 10%, 02 -> 20%)
def ejercicio_2_descuento_por_clave():
    print("--- Ejercicio 2: Descuento por clave ---")
    nombre = input("Nombre del artículo: ").strip()
    clave = input("Clave (01 o 02): ").strip()
    precio = leer_float("Precio original: ", minimo=0.0)

    clave_norm = clave.lstrip("0") or "0"
    if clave_norm == "1":
        tasa = 0.10
    elif clave_norm == "2":
        tasa = 0.20
    else:
        tasa = 0.0
        print("Clave inválida: no se aplica descuento (se esperaba 01 o 02).")

    descuento = precio * tasa
    final = precio - descuento

    print("\n--- Resultado ---")
    print(f"Artículo: {nombre}")
    print(f"Precio original: ${precio:.2f}")
    print(f"Descuento: ${descuento:.2f} ({tasa*100:.0f}%)")
    print(f"Precio final: ${final:.2f}\n")


# 3) Promoción supermercado (numero aleatorio define 15% o 20%)
def ejercicio_3_promocion_supermercado():
    print("--- Ejercicio 3: Promoción supermercado ---")
    total = leer_float("Total de la compra: $", minimo=0.0)
    numero = aleatorio_0_99()
    tasa = 0.15 if numero < 74 else 0.20
    descuento = total * tasa
    final = total - descuento

    print(f"Número aleatorio: {numero}")
    print(f"Descuento aplicado: {tasa*100:.0f}% -> ${descuento:.2f}")
    print(f"Total a pagar: ${final:.2f}\n")


# 4) Comisiones para 100 vendedores (modo manual o aleatorio)
def ejercicio_4_comision_vendedores():
    print("--- Ejercicio 4: Comisiones (100 vendedores) ---")
    n = 100
    modo = input("Ingreso Manual (m) o Aleatorio (r)? (m/r): ").strip().lower()
    ventas = []

    if modo == 'r':
        for _ in range(n):
            r = random.random()
            if r < 0.60:
                v = random.uniform(0, 2_000_000)
            elif r < 0.85:
                v = random.uniform(2_000_000, 6_000_000)
            else:
                v = random.uniform(6_000_000, 9_999_999)
            ventas.append(round(v, 2))
        print("Ventas generadas (aleatorio).")
    else:
        print(f"Ingrese las ventas ({n} valores):")
        for i in range(1, n + 1):
            v = leer_float(f"Vendedor {i} - ventas: $", minimo=0.0, maximo=10_000_000.0)
            ventas.append(round(v, 2))

    comisiones = []
    for idx, v in enumerate(ventas, start=1):
        if 1_000_000 <= v < 3_000_000:
            tasa = 0.03
        elif 3_000_000 <= v < 5_000_000:
            tasa = 0.04
        elif 5_000_000 <= v < 7_000_000:
            tasa = 0.05
        elif 7_000_000 <= v < 10_000_000:
            tasa = 0.06
        else:
            tasa = 0.0
        com = round(v * tasa, 2)
        comisiones.append((idx, v, tasa, com))

    total_ventas = sum(ventas)
    total_comis = sum(c for (_, _, _, c) in comisiones)
    print("\n--- Resumen ---")
    print(f"Total ventas: ${total_ventas:,.2f}")
    print(f"Total comisiones: ${total_comis:,.2f}")

    top5 = sorted(comisiones, key=lambda x: x[1], reverse=True)[:5]
    print("\nTop 5 vendedores por venta:")
    for i, venta, tasa, com in top5:
        print(f"{i:03d}: ${venta:,.2f} | Tasa {tasa*100:.1f}% | Comisión ${com:,.2f}")

    if modo == 'm':
        ver = input("\n¿Mostrar listado completo de comisiones? (s/n): ").strip().lower()
        if ver == 's':
            for i, venta, tasa, com in comisiones:
                print(f"{i:03d}: Venta=${venta:,.2f} | Tasa={tasa*100:.1f}% | Comisión=${com:,.2f}")

    if input("\n¿Exportar comisiones a CSV? (s/n): ").strip().lower() == 's':
        nombre = input("Nombre archivo (ej: comisiones.csv): ").strip() or "comisiones.csv"
        with open(nombre, mode='w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(["Vendedor", "Venta", "Tasa", "Comision"])
            for i, venta, tasa, com in comisiones:
                w.writerow([i, f"{venta:.2f}", f"{tasa:.2f}", f"{com:.2f}"])
        print(f"Exportado: {nombre}")
    print()


# 5) Vectores de 500 elementos -> elevar al cuadrado (modo m/r)
def ejercicio_5_vectores_cuadrado():
    print("--- Ejercicio 5: Vectores (500) al cuadrado ---")
    n = 500
    modo = input("Manual (m) o Aleatorio (r)? (m/r): ").strip().lower()
    original = []

    if modo == 'r':
        original = [random.uniform(-100, 100) for _ in range(n)]
        print("Vector aleatorio generado.")
    else:
        print(f"Ingrese {n} números:")
        for i in range(n):
            original.append(leer_float(f"Elemento {i+1}: "))

    resultado = [x * x for x in original]

    print("\nPrimeros 10 (orig -> al cuadrado):")
    for i in range(10):
        print(f"{original[i]:.6f} -> {resultado[i]:.6f}")

    media = sum(original) / n
    var = sum((x - media) ** 2 for x in original) / n
    print(f"\nMedia original: {media:.6f} | Desv. estándar: {math.sqrt(var):.6f}")

    if input("\n¿Exportar vectores a CSV? (s/n): ").strip().lower() == 's':
        nombre = input("Nombre archivo (ej: vectores.csv): ").strip() or "vectores.csv"
        with open(nombre, mode='w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(["Original", "AlCuadrado"])
            for a, b in zip(original, resultado):
                w.writerow([f"{a:.6f}", f"{b:.6f}"])
        print(f"Exportado: {nombre}")
    print()


# 6) Matriz de calificaciones (50) - contadores: aprobados, recuperación, perdieron, máximos
def ejercicio_6_matriz_calificaciones():
    print("--- Ejercicio 6: Calificaciones (50 alumnos) ---")
    n = 50
    modo = input("Manual (m) o Aleatorio (r)? (m/r): ").strip().lower()
    alumnos = []

    if modo == 'r':
        for i in range(n):
            codigo = 1000 + i
            n1 = round(random.uniform(1.0, 5.0), 2)
            n2 = round(random.uniform(1.0, 5.0), 2)
            n3 = round(random.uniform(1.0, 5.0), 2)
            alumnos.append((codigo, n1, n2, n3))
        print("Alumnos generados (aleatorio).")
    else:
        for i in range(n):
            codigo = input(f"Código alumno {i+1}: ").strip()
            n1 = leer_float(" Calificación 1 (1.0-5.0): ", minimo=1.0, maximo=5.0)
            n2 = leer_float(" Calificación 2 (1.0-5.0): ", minimo=1.0, maximo=5.0)
            n3 = leer_float(" Calificación 3 (1.0-5.0): ", minimo=1.0, maximo=5.0)
            alumnos.append((codigo, n1, n2, n3))

    aprobados = recuperacion = maximos = perdieron = 0
    lista_max = []
    lista_perd = []
    detalles = []

    for codigo, a, b, c in alumnos:
        final = round((a + b + c) / 3.0, 2)
        detalles.append((codigo, a, b, c, final))
        if final >= 3.0:
            aprobados += 1
        elif 2.0 <= final <= 2.9:
            recuperacion += 1
        else:  # final < 2.0
            perdieron += 1
            lista_perd.append((codigo, final))
        if final == 5.0:
            maximos += 1
            lista_max.append(codigo)

    print("\n--- Resultados ---")
    print(f"Total alumnos: {n}")
    print(f"Aprobados (3.0-5.0): {aprobados} ({aprobados/n*100:.2f}%)")
    print(f"Recuperación (2.0-2.9): {recuperacion} ({recuperacion/n*100:.2f}%)")
    print(f"Perdieron (<2.0): {perdieron} ({perdieron/n*100:.2f}%)")
    print(f"Con 5.0 exacto: {maximos}")
    if maximos:
        print("Códigos con 5.0:", ", ".join(map(str, lista_max)))
    if perdieron:
        print("\nLista de perdieron (código - final):")
        for cod, fin in lista_perd:
            print(f"{cod} - {fin:.2f}")

    if input("\n¿Exportar calificaciones a CSV? (s/n): ").strip().lower() == 's':
        nombre = input("Nombre archivo (ej: calificaciones.csv): ").strip() or "calificaciones.csv"
        with open(nombre, mode='w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(["Codigo", "Nota1", "Nota2", "Nota3", "Final"])
            for row in detalles:
                w.writerow([row[0], f"{row[1]:.2f}", f"{row[2]:.2f}", f"{row[3]:.2f}", f"{row[4]:.2f}"])
        print(f"Exportado: {nombre}")
    print()
