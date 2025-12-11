// app.js - Sistema GanaControl - Validaciones Completas

// =======================
// FUNCIONES GENERALES
// =======================

// Función para redirigir
function goTo(page) {
    window.location.href = page;
}

// Función para mostrar errores
function mostrarError(campo, mensaje) {
    // Remover error anterior si existe
    const errorAnterior = campo.parentNode.querySelector('.error-mensaje');
    if (errorAnterior) {
        errorAnterior.remove();
    }
    
    // Remover clase de error del campo
    campo.classList.remove('border-red-500', 'border-red-600');
    campo.classList.add('border-white/30', 'border-gray-300');
    
    // Si hay mensaje de error, mostrarlo
    if (mensaje) {
        campo.classList.remove('border-white/30', 'border-gray-300');
        campo.classList.add('border-red-500', 'border-red-600');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-mensaje text-red-400 text-sm mt-1 ml-4';
        errorElement.textContent = mensaje;
        campo.parentNode.appendChild(errorElement);
    }
}

// Función para mostrar éxito
function mostrarExito(campo) {
    campo.classList.remove('border-red-500', 'border-red-600');
    campo.classList.add('border-green-500');
}

// =======================
// VALIDACIONES GENERALES
// =======================

// Validar nombre (solo letras, espacios y tildes, máximo 40 caracteres)
function validarNombre(nombre) {
    if (nombre.trim() === '') {
        return { valido: false, mensaje: 'El nombre es obligatorio' };
    }
    
    if (nombre.length > 40) {
        return { valido: false, mensaje: 'El nombre no puede tener más de 40 caracteres' };
    }
    
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!regex.test(nombre)) {
        return { valido: false, mensaje: 'Solo se permiten letras y tildes' };
    }
    
    return { valido: true, mensaje: '' };
}

// Validar email (formato válido con @ y .com)
function validarEmail(email) {
    if (email.trim() === '') {
        return { valido: false, mensaje: 'El correo electrónico es obligatorio' };
    }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return { valido: false, mensaje: 'Formato de correo inválido' };
    }
    
    if (!email.toLowerCase().endsWith('.com')) {
        return { valido: false, mensaje: 'El correo debe terminar en .com' };
    }
    
    return { valido: true, mensaje: '' };
}

// Validar contraseña (mínimo 8 caracteres, 8 letras y 4 números)
function validarContrasena(contrasena) {
    if (contrasena.trim() === '') {
        return { valido: false, mensaje: 'La contraseña es obligatoria' };
    }
    
    if (contrasena.length < 8) {
        return { valido: false, mensaje: 'Mínimo 8 caracteres' };
    }
    
    const letras = (contrasena.match(/[a-zA-Z]/g) || []).length;
    const numeros = (contrasena.match(/[0-9]/g) || []).length;
    
    if (letras < 8) {
        return { valido: false, mensaje: 'Debe tener al menos 8 letras' };
    }
    
    if (numeros < 4) {
        return { valido: false, mensaje: 'Debe tener al menos 4 números' };
    }
    
    return { valido: true, mensaje: '' };
}

// Validar confirmación de contraseña
function validarConfirmacionContrasena(contrasena, confirmacion) {
    if (confirmacion.trim() === '') {
        return { valido: false, mensaje: 'Confirma tu contraseña' };
    }
    
    if (contrasena !== confirmacion) {
        return { valido: false, mensaje: 'Las contraseñas no coinciden' };
    }
    
    return { valido: true, mensaje: '' };
}

// Validar campo obligatorio
function validarObligatorio(valor, campo) {
    if (valor.trim() === '') {
        return { valido: false, mensaje: `${campo} es obligatorio` };
    }
    return { valido: true, mensaje: '' };
}

// Validar número positivo
function validarNumeroPositivo(numero, campo) {
    if (numero === '' || isNaN(numero)) {
        return { valido: false, mensaje: `${campo} debe ser un número` };
    }
    
    if (parseFloat(numero) <= 0) {
        return { valido: false, mensaje: `${campo} debe ser mayor a 0` };
    }
    
    return { valido: true, mensaje: '' };
}

// Validar fechas (fecha inicio <= fecha fin)
function validarFechas(fechaInicio, fechaFin, campo) {
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        if (inicio > fin) {
            return { valido: false, mensaje: `${campo}: La fecha inicio no puede ser mayor a la fecha fin` };
        }
    }
    return { valido: true, mensaje: '' };
}

// Validar selección de opción
function validarSeleccion(valor, campo) {
    if (!valor || valor === '' || valor.includes('Seleccionar')) {
        return { valido: false, mensaje: `Debes seleccionar ${campo}` };
    }
    return { valido: true, mensaje: '' };
}

// =======================
// VALIDACIONES MÓDULO ALIMENTACIÓN
// =======================

function validarFormularioAlimentacion() {
    let formularioValido = true;
    
    // Validar tipo de alimento
    const nombreAlimento = document.querySelector('input[placeholder*="alimento"]');
    if (nombreAlimento) {
        const resultado = validarObligatorio(nombreAlimento.value, 'Nombre del alimento');
        if (!resultado.valido) {
            mostrarError(nombreAlimento, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(nombreAlimento);
        }
    }
    
    // Validar proveedor
    const proveedor = document.querySelector('input[placeholder*="Proveedor"]');
    if (proveedor) {
        const resultado = validarObligatorio(proveedor.value, 'Proveedor');
        if (!resultado.valido) {
            mostrarError(proveedor, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(proveedor);
        }
    }
    
    // Validar cantidad
    const cantidad = document.querySelector('input[type="number"]');
    if (cantidad) {
        const resultado = validarNumeroPositivo(cantidad.value, 'Cantidad');
        if (!resultado.valido) {
            mostrarError(cantidad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cantidad);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO INVENTARIO
// =======================

function validarFormularioInventario() {
    let formularioValido = true;
    
    // Validar código del producto
    const codigo = document.querySelector('input[placeholder*="Código"]');
    if (codigo) {
        const resultado = validarObligatorio(codigo.value, 'Código del producto');
        if (!resultado.valido) {
            mostrarError(codigo, resultado.mensaje);
            formularioValido = false;
        } else {
            // Validar formato de código (ej: G001)
            const regex = /^[A-Za-z]+\d+$/;
            if (!regex.test(codigo.value)) {
                mostrarError(codigo, 'Formato inválido. Use: LETRAS+NÚMEROS (ej: G001)');
                formularioValido = false;
            } else {
                mostrarExito(codigo);
            }
        }
    }
    
    // Validar categoría
    const categoria = document.querySelector('select');
    if (categoria) {
        const resultado = validarSeleccion(categoria.value, 'categoría');
        if (!resultado.valido) {
            mostrarError(categoria, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(categoria);
        }
    }
    
    // Validar nombre del producto
    const nombre = document.querySelector('input[placeholder*="Nombre del producto"]');
    if (nombre) {
        const resultado = validarObligatorio(nombre.value, 'Nombre del producto');
        if (!resultado.valido) {
            mostrarError(nombre, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(nombre);
        }
    }
    
    // Validar cantidad
    const cantidad = document.querySelector('input[type="number"]');
    if (cantidad) {
        const resultado = validarNumeroPositivo(cantidad.value, 'Cantidad');
        if (!resultado.valido) {
            mostrarError(cantidad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cantidad);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO PRODUCCIÓN
// =======================

function validarFormularioProduccion() {
    let formularioValido = true;
    
    // Validar fecha
    const fecha = document.querySelector('input[type="date"]');
    if (fecha) {
        const resultado = validarObligatorio(fecha.value, 'Fecha');
        if (!resultado.valido) {
            mostrarError(fecha, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(fecha);
        }
    }
    
    // Validar animal/lote
    const animal = document.querySelector('input[placeholder*="Animal"]');
    if (animal) {
        const resultado = validarObligatorio(animal.value, 'Animal/Lote');
        if (!resultado.valido) {
            mostrarError(animal, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(animal);
        }
    }
    
    // Validar tipo de producción
    const tipoProduccion = document.getElementById('tipoProduccion');
    if (tipoProduccion) {
        const resultado = validarSeleccion(tipoProduccion.value, 'tipo de producción');
        if (!resultado.valido) {
            mostrarError(tipoProduccion, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(tipoProduccion);
        }
    }
    
    // Validar cantidad
    const cantidad = document.querySelector('#campoCantidad input');
    if (cantidad && !cantidad.disabled) {
        const resultado = validarNumeroPositivo(cantidad.value, 'Cantidad');
        if (!resultado.valido) {
            mostrarError(cantidad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cantidad);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO REPRODUCCIÓN
// =======================

function validarFormularioReproduccion() {
    let formularioValido = true;
    
    // Validar animal
    const animal = document.querySelector('select');
    if (animal) {
        const resultado = validarSeleccion(animal.value, 'animal');
        if (!resultado.valido) {
            mostrarError(animal, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(animal);
        }
    }
    
    // Validar evento
    const evento = document.querySelectorAll('select')[1];
    if (evento) {
        const resultado = validarSeleccion(evento.value, 'evento');
        if (!resultado.valido) {
            mostrarError(evento, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(evento);
        }
    }
    
    // Validar fecha
    const fecha = document.querySelector('input[type="date"]');
    if (fecha) {
        const resultado = validarObligatorio(fecha.value, 'Fecha');
        if (!resultado.valido) {
            mostrarError(fecha, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(fecha);
        }
    }
    
    // Validar responsable
    const responsable = document.querySelector('input[placeholder*="Responsable"]');
    if (responsable) {
        const resultado = validarNombre(responsable.value);
        if (!resultado.valido) {
            mostrarError(responsable, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(responsable);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO VACUNACIONES
// =======================

function validarFormularioVacuna() {
    let formularioValido = true;
    
    // Validar nombre de vacuna
    const nombreVacuna = document.querySelector('input[placeholder*="Vacuna"]');
    if (nombreVacuna) {
        const resultado = validarObligatorio(nombreVacuna.value, 'Nombre de la vacuna');
        if (!resultado.valido) {
            mostrarError(nombreVacuna, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(nombreVacuna);
        }
    }
    
    // Validar enfermedad
    const enfermedad = document.querySelector('input[placeholder*="Enfermedad"]');
    if (enfermedad) {
        const resultado = validarObligatorio(enfermedad.value, 'Enfermedad');
        if (!resultado.valido) {
            mostrarError(enfermedad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(enfermedad);
        }
    }
    
    // Validar dosis
    const dosis = document.querySelector('input[placeholder*="Dosis"]');
    if (dosis) {
        const resultado = validarNumeroPositivo(dosis.value, 'Dosis');
        if (!resultado.valido) {
            mostrarError(dosis, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(dosis);
        }
    }
    
    return formularioValido;
}

function validarFormularioVacunacion() {
    let formularioValido = true;
    
    // Validar animal/lote
    const animal = document.querySelectorAll('select')[0];
    if (animal) {
        const resultado = validarSeleccion(animal.value, 'animal o lote');
        if (!resultado.valido) {
            mostrarError(animal, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(animal);
        }
    }
    
    // Validar vacuna
    const vacuna = document.querySelectorAll('select')[2];
    if (vacuna) {
        const resultado = validarSeleccion(vacuna.value, 'vacuna');
        if (!resultado.valido) {
            mostrarError(vacuna, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(vacuna);
        }
    }
    
    // Validar cantidad
    const cantidad = document.querySelector('input[placeholder*="Cantidad administrada"]');
    if (cantidad) {
        const resultado = validarNumeroPositivo(cantidad.value, 'Cantidad');
        if (!resultado.valido) {
            mostrarError(cantidad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cantidad);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO VENTAS
// =======================

function validarFormularioVentas() {
    let formularioValido = true;
    
    // Validar tipo de venta
    const tipoVenta = document.querySelector('select');
    if (tipoVenta) {
        const resultado = validarSeleccion(tipoVenta.value, 'tipo de venta');
        if (!resultado.valido) {
            mostrarError(tipoVenta, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(tipoVenta);
        }
    }
    
    // Validar producto/animal
    const producto = document.querySelectorAll('select')[1];
    if (producto) {
        const resultado = validarSeleccion(producto.value, 'producto o animal');
        if (!resultado.valido) {
            mostrarError(producto, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(producto);
        }
    }
    
    // Validar cantidad
    const cantidad = document.querySelector('input[type="number"]');
    if (cantidad) {
        const resultado = validarNumeroPositivo(cantidad.value, 'Cantidad');
        if (!resultado.valido) {
            mostrarError(cantidad, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cantidad);
        }
    }
    
    // Validar precio unitario
    const precio = document.querySelector('input[placeholder*="Precio unitario"]');
    if (precio) {
        const resultado = validarNumeroPositivo(precio.value, 'Precio unitario');
        if (!resultado.valido) {
            mostrarError(precio, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(precio);
        }
    }
    
    // Validar cliente
    const cliente = document.querySelector('input[placeholder*="cliente"]');
    if (cliente) {
        const resultado = validarObligatorio(cliente.value, 'Nombre del cliente');
        if (!resultado.valido) {
            mostrarError(cliente, resultado.mensaje);
            formularioValido = false;
        } else {
            mostrarExito(cliente);
        }
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO REGISTRO
// =======================

function validarFormularioRegistro() {
    const nombre = document.querySelector('input[type="text"]');
    const email = document.querySelector('input[type="email"]');
    const contrasena = document.querySelectorAll('input[type="password"]')[0];
    const confirmacion = document.querySelectorAll('input[type="password"]')[1];
    
    let formularioValido = true;
    
    // Validar nombre
    const resultadoNombre = validarNombre(nombre.value);
    if (!resultadoNombre.valido) {
        mostrarError(nombre, resultadoNombre.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(nombre);
    }
    
    // Validar email
    const resultadoEmail = validarEmail(email.value);
    if (!resultadoEmail.valido) {
        mostrarError(email, resultadoEmail.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(email);
    }
    
    // Validar contraseña
    const resultadoContrasena = validarContrasena(contrasena.value);
    if (!resultadoContrasena.valido) {
        mostrarError(contrasena, resultadoContrasena.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(contrasena);
    }
    
    // Validar confirmación de contraseña
    const resultadoConfirmacion = validarConfirmacionContrasena(contrasena.value, confirmacion.value);
    if (!resultadoConfirmacion.valido) {
        mostrarError(confirmacion, resultadoConfirmacion.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(confirmacion);
    }
    
    return formularioValido;
}

// =======================
// VALIDACIONES MÓDULO LOGIN
// =======================

function validarFormularioLogin() {
    const email = document.querySelector('input[type="email"]');
    const contrasena = document.querySelector('input[type="password"]');
    
    let formularioValido = true;
    
    // Validar email
    const resultadoEmail = validarEmail(email.value);
    if (!resultadoEmail.valido) {
        mostrarError(email, resultadoEmail.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(email);
    }
    
    // Validar contraseña (solo que no esté vacía)
    const resultadoContrasena = validarObligatorio(contrasena.value, 'Contraseña');
    if (!resultadoContrasena.valido) {
        mostrarError(contrasena, resultadoContrasena.mensaje);
        formularioValido = false;
    } else {
        mostrarExito(contrasena);
    }
    
    return formularioValido;
}

// =======================
// INICIALIZACIÓN DE EVENT LISTENERS
// =======================

document.addEventListener('DOMContentLoaded', function() {
    // =======================
    // INDEX (welcome.html)
    // =======================
    const startBtn = document.getElementById("btnStart");
    if (startBtn) {
        startBtn.addEventListener("click", () => goTo("entrada.html"));
    }

    // =======================
    // ENTRADA (entrada.html)
    // =======================
    const btnRegister = document.getElementById("btnRegister");
    const btnLogin = document.getElementById("btnLogin");

    if (btnRegister) {
        btnRegister.addEventListener("click", () => goTo("register.html"));
    }
    if (btnLogin) {
        btnLogin.addEventListener("click", () => goTo("login.html"));
    }

    // =======================
    // LOGIN (login.html)
    // =======================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validarFormularioLogin()) {
                alert("Inicio de sesión exitoso ✅");
                window.location.href = "dashboard.html";
            }
        });
        
        // Validación en tiempo real para login
        const email = document.querySelector('input[type="email"]');
        const contrasena = document.querySelector('input[type="password"]');
        
        if (email) {
            email.addEventListener('blur', function() {
                const resultado = validarEmail(this.value);
                mostrarError(this, resultado.mensaje);
            });
        }
        
        if (contrasena) {
            contrasena.addEventListener('blur', function() {
                const resultado = validarObligatorio(this.value, 'Contraseña');
                mostrarError(this, resultado.mensaje);
            });
        }
    }

    // =======================
    // REGISTER (register.html)
    // =======================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validarFormularioRegistro()) {
                alert("Cuenta creada con éxito 🎉");
                goTo("login.html");
            }
        });
        
        // Validación en tiempo real para registro
        const nombre = document.querySelector('input[type="text"]');
        const email = document.querySelector('input[type="email"]');
        const contrasena = document.querySelectorAll('input[type="password"]')[0];
        const confirmacion = document.querySelectorAll('input[type="password"]')[1];
        
        if (nombre) {
            nombre.addEventListener('blur', function() {
                const resultado = validarNombre(this.value);
                mostrarError(this, resultado.mensaje);
            });
            
            // Limitar caracteres en nombre
            nombre.addEventListener('input', function() {
                if (this.value.length > 40) {
                    this.value = this.value.substring(0, 40);
                }
            });
        }
        
        if (email) {
            email.addEventListener('blur', function() {
                const resultado = validarEmail(this.value);
                mostrarError(this, resultado.mensaje);
            });
        }
        
        if (contrasena) {
            contrasena.addEventListener('blur', function() {
                const resultado = validarContrasena(this.value);
                mostrarError(this, resultado.mensaje);
            });
        }
        
        if (confirmacion) {
            confirmacion.addEventListener('blur', function() {
                const resultado = validarConfirmacionContrasena(contrasena.value, this.value);
                mostrarError(this, resultado.mensaje);
            });
        }
    }

    // =======================
    // DASHBOARD (dashboard.html)
    // =======================
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    const abrirAyudaBtn = document.getElementById('abrirAyuda');
    const modalAyuda = document.getElementById('modalAyuda');
    const contenidoAyuda = document.getElementById('contenidoAyuda');

    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            userMenu.classList.toggle('hidden');
            const expanded = userMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            userMenuBtn.setAttribute('aria-expanded', !expanded);
        });

        window.addEventListener('click', (e) => {
            if (userMenu && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
                userMenu.classList.add('hidden');
                userMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (abrirAyudaBtn) {
        abrirAyudaBtn.addEventListener('click', () => {
            modalAyuda.classList.remove('hidden');
            modalAyuda.classList.add('flex');
            if (userMenu) userMenu.classList.add('hidden');
        });
    }

    // =======================
    // ALIMENTACIÓN (alimentacion.html)
    // =======================
    const formAlimentacion = document.querySelector('form');
    if (formAlimentacion && window.location.pathname.includes('alimentacion.html')) {
        formAlimentacion.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormularioAlimentacion()) {
                alert('Alimento registrado correctamente ✅');
                formAlimentacion.reset();
            }
        });
    }

    // =======================
    // INVENTARIO (inventario.html)
    // =======================
    const formInventario = document.querySelector('form');
    if (formInventario && window.location.pathname.includes('inventario.html')) {
        formInventario.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormularioInventario()) {
                alert('Ítem de inventario registrado correctamente ✅');
                formInventario.reset();
            }
        });
    }

    // =======================
    // PRODUCCIÓN (produccion.html)
    // =======================
    const formProduccion = document.getElementById('formProduccion');
    if (formProduccion) {
        formProduccion.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormularioProduccion()) {
                alert('Producción registrada correctamente ✅');
                formProduccion.reset();
            }
        });
    }

    // =======================
    // REPRODUCCIÓN (reproduccion.html)
    // =======================
    const formReproduccion = document.querySelector('form');
    if (formReproduccion && window.location.pathname.includes('reproduccion.html')) {
        formReproduccion.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormularioReproduccion()) {
                alert('Evento reproductivo registrado correctamente ✅');
                formReproduccion.reset();
            }
        });
    }

    // =======================
    // VACUNACIONES (vacunaciones.html)
    // =======================
    if (window.location.pathname.includes('vacunaciones.html')) {
        const forms = document.querySelectorAll('form');
        if (forms[0]) { // Formulario de vacuna
            forms[0].addEventListener('submit', (e) => {
                e.preventDefault();
                if (validarFormularioVacuna()) {
                    alert('Vacuna registrada correctamente ✅');
                    forms[0].reset();
                }
            });
        }
        if (forms[1]) { // Formulario de vacunación
            forms[1].addEventListener('submit', (e) => {
                e.preventDefault();
                if (validarFormularioVacunacion()) {
                    alert('Vacunación registrada correctamente ✅');
                    forms[1].reset();
                }
            });
        }
    }

    // =======================
    // VENTAS (ventas.html)
    // =======================
    const formVentas = document.querySelector('form');
    if (formVentas && window.location.pathname.includes('ventas.html')) {
        formVentas.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormularioVentas()) {
                alert('Venta registrada correctamente ✅');
                formVentas.reset();
            }
        });
        
        // Calcular total automáticamente
        const cantidad = document.querySelector('input[type="number"]');
        const precio = document.querySelector('input[placeholder*="Precio unitario"]');
        const total = document.querySelector('input[placeholder*="Total"]');
        
        if (cantidad && precio && total) {
            function calcularTotal() {
                const cant = parseFloat(cantidad.value) || 0;
                const prec = parseFloat(precio.value) || 0;
                total.value = (cant * prec).toFixed(2);
            }
            
            cantidad.addEventListener('input', calcularTotal);
            precio.addEventListener('input', calcularTotal);
        }
    }

    // =======================
    // FUNCIONES GLOBALES PARA MODALES
    // =======================
    window.abrirHistorial = function() {
        const modal = document.getElementById("modalHistorial");
        if (modal) {
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }
    };
    
    window.cerrarHistorial = function() {
        const modal = document.getElementById("modalHistorial");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    };
    
    window.cerrarAyuda = function() {
        if (modalAyuda) {
            modalAyuda.classList.add("hidden");
            modalAyuda.classList.remove("flex");
            if (contenidoAyuda) {
                contenidoAyuda.innerHTML = "<p>Selecciona un módulo para ver las instrucciones detalladas.</p>";
            }
        }
    };
    
    window.mostrarAyuda = function(modulo) {
        if (!contenidoAyuda) return;
        
        let html = "";
        switch(modulo) {
            case "vacunaciones":
                html = `<h3 class="font-bold text-lg text-green-700">Vacunaciones</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar nuevas vacunas con nombre, enfermedad, dosis, proveedor, fecha y lote.</li>
                          <li>Registrar vacunaciones por animal o lote con fecha, tipo de aplicación y observaciones.</li>
                          <li>Consultar historial de vacunaciones filtrando por animal, lote o vacuna.</li>
                        </ul>`;
                break;
            case "produccion":
                html = `<h3 class="font-bold text-lg text-green-700">Producción</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar producción de leche o carne por animal o lote.</li>
                          <li>Consultar historial filtrando por fecha, animal o cantidad.</li>
                        </ul>`;
                break;
            case "ventas":
                html = `<h3 class="font-bold text-lg text-green-700">Ventas</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar ventas con código, tipo, cantidad, valor y comprobantes.</li>
                          <li>Consultar historial con filtros por producto, animal, fecha y estado de pago.</li>
                        </ul>`;
                break;
            case "reproduccion":
                html = `<h3 class="font-bold text-lg text-green-700">Reproducción</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar eventos de reproducción por animal o lote.</li>
                          <li>Programar fechas de celo, inseminación y seguimiento de crías.</li>
                        </ul>`;
                break;
            case "alimentacion":
                html = `<h3 class="font-bold text-lg text-green-700">Alimentación</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar alimentación diaria por animal con tipo, cantidad y fecha.</li>
                          <li>Consultar historial y ajustar dietas según necesidades.</li>
                        </ul>`;
                break;
            case "inventario":
                html = `<h3 class="font-bold text-lg text-green-700">Inventario</h3>
                        <ul class="list-disc pl-6">
                          <li>Registrar productos con código, cantidad, proveedor y fecha de ingreso.</li>
                          <li>Consultar y actualizar inventario, registrar salidas de productos.</li>
                        </ul>`;
                break;
            case "otros":
                html = `<h3 class="font-bold text-lg text-green-700">Otros / Contactar</h3>
                        <p>Comunícate con soporte: <a href="mailto:soporte@ganacontrol.com" class="text-blue-600 underline">soporte@ganacontrol.com</a> o +57 301 7330341.</p>`;
                break;
            default:
                html = "<p>Selecciona un módulo para ver las instrucciones detalladas.</p>";
        }
        contenidoAyuda.innerHTML = html;
    };

    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('[id*="modal"]');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    });

    // =======================
    // BUSCADOR DASHBOARD
    // =======================
    const searchInput = document.getElementById('searchInput');
    const movimientosLista = document.getElementById('movimientosLista');
    if (searchInput && movimientosLista) {
        const items = movimientosLista.getElementsByTagName('li');
        searchInput.addEventListener('keyup', function() {
            let filtro = searchInput.value.toLowerCase();
            for (let i = 0; i < items.length; i++) {
                let texto = items[i].textContent.toLowerCase();
                items[i].style.display = texto.includes(filtro) ? "" : "none";
            }
        });
    }
});

// =======================
// FUNCIONES GLOBALES
// =======================

// Función para cambiar entre tipos de historial
window.cambiarHistorial = function() {
    const tipo = document.getElementById("tipoHistorial").value;
    const tablaAlimentos = document.getElementById("tablaAlimentos");
    const tablaAlimentaciones = document.getElementById("tablaAlimentaciones");
    const filtrosAlimentos = document.getElementById("filtrosAlimentos");
    const filtrosAlimentaciones = document.getElementById("filtrosAlimentaciones");
    
    if (tablaAlimentos) tablaAlimentos.classList.toggle("hidden", tipo !== "alimentos");
    if (tablaAlimentaciones) tablaAlimentaciones.classList.toggle("hidden", tipo !== "alimentaciones");
    if (filtrosAlimentos) filtrosAlimentos.classList.toggle("hidden", tipo !== "alimentos");
    if (filtrosAlimentaciones) filtrosAlimentaciones.classList.toggle("hidden", tipo !== "alimentaciones");
};

// Función para abrir historial de producción
window.abrirHistorialProduccion = function() {
    const modal = document.getElementById("modalHistorialProduccion");
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

// Función para cerrar historial de producción
window.cerrarHistorialProduccion = function() {
    const modal = document.getElementById("modalHistorialProduccion");
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

console.log('✅ GanaControl - Sistema de validaciones cargado correctamente');