# main.py
from ejercicios import (
    ejercicio_1_valor_absoluto,
    ejercicio_2_descuento_por_clave,
    ejercicio_3_promocion_supermercado,
    ejercicio_4_comision_vendedores,
    ejercicio_5_vectores_cuadrado,
    ejercicio_6_matriz_calificaciones,
)

def menu():
    while True:
        print("\n--- MENÚ PRINCIPAL ---")
        print("1) Valor absoluto")
        print("2) Descuento por clave")
        print("3) Promoción supermercado")
        print("4) Comisiones vendedores (100)")
        print("5) Vectores: elevar al cuadrado (500)")
        print("6) Matriz de calificaciones (50 alumnos)")
        print("0) Salir")
        opc = input("Elige una opción: ").strip()
        if opc == "1":
            ejercicio_1_valor_absoluto()
        elif opc == "2":
            ejercicio_2_descuento_por_clave()
        elif opc == "3":
            ejercicio_3_promocion_supermercado()
        elif opc == "4":
            ejercicio_4_comision_vendedores()
        elif opc == "5":
            ejercicio_5_vectores_cuadrado()
        elif opc == "6":
            ejercicio_6_matriz_calificaciones()
        elif opc == "0":
            print("Saliendo...")
            break
        else:
            print("Opción inválida. Intenta de nuevo.")

if __name__ == "__main__":
    menu()
