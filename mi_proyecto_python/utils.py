# utils.py
import math
import random

def leer_float(prompt, minimo=None, maximo=None):
    while True:
        try:
            x = float(input(prompt))
            if minimo is not None and x < minimo:
                print(f"Error: el valor debe ser >= {minimo}")
                continue
            if maximo is not None and x > maximo:
                print(f"Error: el valor debe ser <= {maximo}")
                continue
            return x
        except ValueError:
            print("Entrada inválida. Ingresa un número válido.")

def leer_int(prompt, minimo=None, maximo=None):
    while True:
        try:
            x = int(input(prompt))
            if minimo is not None and x < minimo:
                print(f"Error: el valor debe ser >= {minimo}")
                continue
            if maximo is not None and x > maximo:
                print(f"Error: el valor debe ser <= {maximo}")
                continue
            return x
        except ValueError:
            print("Entrada inválida. Ingresa un entero válido.")

def valor_absoluto(x):
    # Usamos la definición matemática y comprobación por sqrt(x^2)
    if x < 0:
        abs_val = -x
    else:
        abs_val = x
    # comprobación matemática alternativa
    check = math.sqrt(x * x)
    assert abs(abs_val - check) < 1e-9
    return abs_val

def aleatorio_0_99():
    return random.randint(0, 99)
