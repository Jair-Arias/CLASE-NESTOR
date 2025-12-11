/**
 * GanaControl - Sistema de Gestión Ganadera
 * Archivo JavaScript Principal
 * @author Tu Nombre
 * @version 1.0
 */

// ===============================================
// CONFIGURACIÓN GLOBAL
// ===============================================

const CONFIG = {
    API_URL: 'controllers/AuthController.php',
    TIMEOUT_ALERTA: 5000,
    DEBUG_MODE: false
};

// ===============================================
// UTILIDADES Y HELPERS
// ===============================================

/**
 * Logger para debugging
 */
const logger = {
    log: (message, data = null) => {
        if (CONFIG.DEBUG_MODE) {
            console.log(`[GanaControl] ${message}`, data || '');
        }
    },
    error: (message, error = null) => {
        console.error(`[GanaControl ERROR] ${message}`, error || '');
    },
    info: (message) => {
        console.info(`[GanaControl INFO] ${message}`);
    }
};

/**
 * Validar email
 * @param {string} email Email a validar
 * @returns {boolean}
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

/**
 * Validar contraseña con requisitos de seguridad
 * @param {string} password Contraseña a validar
 * @returns {object} Objeto con validación y errores
 */
function validarPassword(password) {
    const errores = [];
    
    if (password.length < 8) {
        errores.push("Mínimo 8 caracteres");
    }
    
    if (!/[A-Z]/.test(password)) {
        errores.push("Una letra mayúscula");
    }
    
    if (!/[a-z]/.test(password)) {
        errores.push("Una letra minúscula");
    }
    
    if (!/[0-9]/.test(password)) {
        errores.push("Un número");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?\/\\|`~]/.test(password)) {
        errores.push("Un carácter especial (!@#$%...)");
    }
    
    return {
        valida: errores.length === 0,
        errores: errores,
        fuerza: calcularFuerzaPassword(password)
    };
}

/**
 * Calcular fuerza de la contraseña
 * @param {string} password Contraseña
 * @returns {string} 'debil', 'media', 'fuerte'
 */
function calcularFuerzaPassword(password) {
    let fuerza = 0;
    
    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?\/\\|`~]/.test(password)) fuerza++;
    
    if (fuerza <= 2) return 'debil';
    if (fuerza <= 4) return 'media';
    return 'fuerte';
}

/**
 * Mostrar mensaje de error
 * @param {string} mensaje Mensaje a mostrar
 */
function mostrarError(mensaje) {
    // Eliminar alertas previas
    const alertaPrev = document.querySelector('.alerta-error');
    if (alertaPrev) alertaPrev.remove();

    const alerta = document.createElement('div');
    alerta.className = 'alerta-error fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-md';
    alerta.innerHTML = `
        <div class="flex items-start gap-3">
            <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
                <p class="font-semibold">Error</p>
                <p class="text-sm">${mensaje}</p>
            </div>
            <button onclick="this.closest('.alerta-error').remove()" class="text-white hover:text-gray-200 flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta.parentElement) {
            alerta.classList.add('animate-fade-out');
            setTimeout(() => alerta.remove(), 300);
        }
    }, CONFIG.TIMEOUT_ALERTA);

    logger.error(mensaje);
}

/**
 * Mostrar mensaje de éxito
 * @param {string} mensaje Mensaje a mostrar
 */
function mostrarExito(mensaje) {
    const alertaPrev = document.querySelector('.alerta-exito');
    if (alertaPrev) alertaPrev.remove();

    const alerta = document.createElement('div');
    alerta.className = 'alerta-exito fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-md';
    alerta.innerHTML = `
        <div class="flex items-start gap-3">
            <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
                <p class="font-semibold">Éxito</p>
                <p class="text-sm">${mensaje}</p>
            </div>
        </div>
    `;
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta.parentElement) {
            alerta.classList.add('animate-fade-out');
            setTimeout(() => alerta.remove(), 300);
        }
    }, 3000);

    logger.info(mensaje);
}

/**
 * Mostrar mensaje de advertencia
 * @param {string} mensaje Mensaje a mostrar
 */
function mostrarAdvertencia(mensaje) {
    const alertaPrev = document.querySelector('.alerta-advertencia');
    if (alertaPrev) alertaPrev.remove();

    const alerta = document.createElement('div');
    alerta.className = 'alerta-advertencia fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-md';
    alerta.innerHTML = `
        <div class="flex items-start gap-3">
            <svg class="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div class="flex-1">
                <p class="font-semibold">Advertencia</p>
                <p class="text-sm">${mensaje}</p>
            </div>
            <button onclick="this.closest('.alerta-advertencia').remove()" class="text-white hover:text-gray-200 flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta.parentElement) {
            alerta.remove();
        }
    }, 4000);
}

/**
 * Mostrar indicador de carga en botón
 * @param {HTMLElement} boton Botón a deshabilitar
 */
function mostrarCargando(boton) {
    if (!boton) return;
    
    boton.disabled = true;
    boton.dataset.textoOriginal = boton.innerHTML;
    boton.innerHTML = `
        <div class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Procesando...</span>
        </div>
    `;
}

/**
 * Ocultar indicador de carga
 * @param {HTMLElement} boton Botón a habilitar
 */
function ocultarCargando(boton) {
    if (!boton) return;
    
    boton.disabled = false;
    if (boton.dataset.textoOriginal) {
        boton.innerHTML = boton.dataset.textoOriginal;
    } else {
        boton.textContent = 'Enviar';
    }
}

// ===============================================
// FORMULARIO DE REGISTRO
// ===============================================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    logger.info('Formulario de registro detectado');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const botonSubmit = registerForm.querySelector('button[type="submit"]');
        const nombre = document.querySelector('.register-nombre').value.trim();
        const email = document.querySelector('.register-email').value.trim();
        const password = document.querySelector('.register-password').value;
        const confirmacion = document.querySelector('.register-confirmacion').value;

        // Validaciones frontend
        if (!nombre || !email || !password || !confirmacion) {
            mostrarError('Todos los campos son obligatorios');
            return;
        }

        if (nombre.length < 3) {
            mostrarError('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (nombre.length > 100) {
            mostrarError('El nombre no puede exceder 100 caracteres');
            return;
        }

        if (!validarEmail(email)) {
            mostrarError('Por favor ingresa un email válido');
            return;
        }

        if (password !== confirmacion) {
            mostrarError('Las contraseñas no coinciden');
            return;
        }

        const validacionPass = validarPassword(password);
        if (!validacionPass.valida) {
            mostrarError('La contraseña debe contener: ' + validacionPass.errores.join(', '));
            return;
        }

        // Enviar al backend
        try {
            mostrarCargando(botonSubmit);
            logger.log('Enviando registro...', { email });

            const response = await fetch(`${CONFIG.API_URL}?action=registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    password: password,
                    confirmacion: confirmacion
                })
            });

            const data = await response.json();
            logger.log('Respuesta del servidor:', data);

            if (data.success) {
                mostrarExito(data.message || 'Usuario registrado exitosamente');
                
                // Limpiar formulario
                registerForm.reset();
                
                // Redirigir a login después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                mostrarError(data.message || 'Error al registrar usuario');
            }

        } catch (error) {
            logger.error('Error en registro:', error);
            mostrarError('Error de conexión con el servidor. Por favor intenta nuevamente.');
        } finally {
            ocultarCargando(botonSubmit);
        }
    });

    // Validación en tiempo real de contraseña
    const passwordInput = document.querySelector('.register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const validacion = validarPassword(e.target.value);
            
            // Eliminar indicador previo
            let indicador = passwordInput.nextElementSibling;
            if (indicador && indicador.classList.contains('password-strength')) {
                indicador.remove();
            }

            if (e.target.value.length > 0) {
                indicador = document.createElement('div');
                indicador.className = 'password-strength text-xs mt-2 px-2 transition-all';
                
                if (validacion.valida) {
                    const colorFuerza = {
                        'debil': 'text-red-400',
                        'media': 'text-yellow-400',
                        'fuerte': 'text-green-400'
                    };
                    indicador.className += ' ' + colorFuerza[validacion.fuerza];
                    indicador.textContent = `✓ Contraseña ${validacion.fuerza}`;
                } else {
                    indicador.className += ' text-yellow-300';
                    indicador.textContent = 'Falta: ' + validacion.errores.join(', ');
                }
                
                passwordInput.parentElement.insertBefore(indicador, passwordInput.nextSibling);
            }
        });
    }

    // Validación de confirmación de contraseña en tiempo real
    const confirmacionInput = document.querySelector('.register-confirmacion');
    if (confirmacionInput && passwordInput) {
        confirmacionInput.addEventListener('input', (e) => {
            let indicador = confirmacionInput.nextElementSibling;
            if (indicador && indicador.classList.contains('password-match')) {
                indicador.remove();
            }

            if (e.target.value.length > 0) {
                indicador = document.createElement('div');
                indicador.className = 'password-match text-xs mt-2 px-2';
                
                if (e.target.value === passwordInput.value) {
                    indicador.className += ' text-green-400';
                    indicador.textContent = '✓ Las contraseñas coinciden';
                } else {
                    indicador.className += ' text-red-400';
                    indicador.textContent = '✗ Las contraseñas no coinciden';
                }
                
                confirmacionInput.parentElement.insertBefore(indicador, confirmacionInput.nextSibling);
            }
        });
    }
}

// ===============================================
// FORMULARIO DE LOGIN
// ===============================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    logger.info('Formulario de login detectado');

    // Verificar parámetros URL (mensajes de error/timeout)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'timeout') {
        mostrarAdvertencia('Tu sesión ha expirado por inactividad. Por favor inicia sesión nuevamente.');
    } else if (urlParams.get('error') === 'no_session') {
        mostrarAdvertencia('Debes iniciar sesión para acceder al sistema.');
    } else if (urlParams.get('error') === 'security') {
        mostrarError('Sesión cerrada por razones de seguridad. Por favor inicia sesión nuevamente.');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const botonSubmit = loginForm.querySelector('button[type="submit"]');
        const email = document.querySelector('.login-email').value.trim();
        const password = document.querySelector('.login-password').value;

        // Validaciones frontend
        if (!email || !password) {
            mostrarError('Email y contraseña son obligatorios');
            return;
        }

        if (!validarEmail(email)) {
            mostrarError('Por favor ingresa un email válido');
            return;
        }

        if (password.length < 6) {
            mostrarError('La contraseña es demasiado corta');
            return;
        }

        // Enviar al backend
        try {
            mostrarCargando(botonSubmit);
            logger.log('Enviando login...', { email });

            const response = await fetch(`${CONFIG.API_URL}?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            logger.log('Respuesta del servidor:', data);

            if (data.success) {
                mostrarExito(data.message || `¡Bienvenido/a ${data.usuario.nombre}!`);
                
                // Limpiar formulario
                loginForm.reset();
                
                // Redirigir a dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                mostrarError(data.message || 'Credenciales incorrectas');
                
                // Si está bloqueado, mostrar mensaje adicional
                if (data.bloqueado) {
                    setTimeout(() => {
                        mostrarAdvertencia('Por seguridad, intenta recuperar tu contraseña o espera el tiempo indicado.');
                    }, 2000);
                }
            }

        } catch (error) {
            logger.error('Error en login:', error);
            mostrarError('Error de conexión con el servidor. Por favor intenta nuevamente.');
        } finally {
            ocultarCargando(botonSubmit);
        }
    });
}

// ===============================================
// DASHBOARD - VERIFICACIÓN DE SESIÓN
// ===============================================

if (window.location.pathname.includes('dashboard.html')) {
    logger.info('Dashboard detectado - Verificando sesión...');
    
    // Verificar sesión al cargar
    verificarSesion();
    
    // Verificar sesión cada 5 minutos
    setInterval(verificarSesion, 300000);
    
    // Cargar información del usuario
    cargarInformacionUsuario();
}

/**
 * Verificar si hay sesión activa
 */
async function verificarSesion() {
    try {
        const response = await fetch(`${CONFIG.API_URL}?action=verificar_sesion`);
        const data = await response.json();
        
        logger.log('Verificación de sesión:', data);
        
        if (!data.sesion_activa) {
            logger.info('No hay sesión activa - Redirigiendo a login');
            window.location.href = 'login.html?error=no_session';
        } else {
            logger.info('Sesión activa verificada');
            // Actualizar UI con datos del usuario si es necesario
            if (data.usuario) {
                actualizarUIUsuario(data.usuario);
            }
        }
    } catch (error) {
        logger.error('Error al verificar sesión:', error);
    }
}

/**
 * Cargar información del usuario actual
 */
async function cargarInformacionUsuario() {
    try {
        const response = await fetch(`${CONFIG.API_URL}?action=obtener_usuario`);
        const data = await response.json();
        
        if (data.success && data.usuario) {
            actualizarUIUsuario(data.usuario);
        }
    } catch (error) {
        logger.error('Error al cargar información del usuario:', error);
    }
}

/**
 * Actualizar UI con información del usuario
 * @param {object} usuario Datos del usuario
 */
function actualizarUIUsuario(usuario) {
    // Actualizar nombre en el menú
    const menuLinks = document.querySelectorAll('#userMenu a');
    if (menuLinks.length > 0 && usuario.nombre) {
        // El primer enlace después del título es el nombre del usuario
        menuLinks.forEach((link, index) => {
            if (link.textContent.trim() === 'Nombre Usuario') {
                link.textContent = usuario.nombre;
                link.title = usuario.email;
            }
        });
    }
    
    logger.log('UI actualizada con usuario:', usuario);
}

// ===============================================
// MENÚ DE USUARIO (DASHBOARD)
// ===============================================

const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');

if (userMenuBtn && userMenu) {
    logger.info('Menú de usuario detectado');

    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
        const expanded = userMenuBtn.getAttribute('aria-expanded') === 'true';
        userMenuBtn.setAttribute('aria-expanded', !expanded);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
            userMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Agregar opción de cerrar sesión al menú si no existe
    if (!document.querySelector('#logoutOption')) {
        const hr = document.createElement('hr');
        const logoutOption = document.createElement('a');
        logoutOption.id = 'logoutOption';
        logoutOption.href = '#';
        logoutOption.className = 'block px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold';
        logoutOption.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Cerrar Sesión</span>
            </div>
        `;
        logoutOption.addEventListener('click', async (e) => {
            e.preventDefault();
            await cerrarSesion();
        });
        
        userMenu.appendChild(hr);
        userMenu.appendChild(logoutOption);
    }
}

// ===============================================
// FUNCIÓN CERRAR SESIÓN
// ===============================================

/**
 * Cerrar sesión del usuario
 */
async function cerrarSesion() {
    try {
        logger.info('Cerrando sesión...');
        
        const response = await fetch(`${CONFIG.API_URL}?action=logout`, {
            method: 'POST'
        });
        
        const data = await response.json();
        logger.log('Respuesta logout:', data);
        
        if (data.success) {
            mostrarExito('Sesión cerrada exitosamente');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            throw new Error('Error al cerrar sesión');
        }
    } catch (error) {
        logger.error('Error al cerrar sesión:', error);
        // Redirigir de todas formas
        window.location.href = 'login.html';
    }
}

// ===============================================
// BUSCADOR DE MOVIMIENTOS (DASHBOARD)
// ===============================================

const searchInput = document.getElementById('searchInput');
const movimientosLista = document.getElementById('movimientosLista');

if (searchInput && movimientosLista) {
    logger.info('Buscador de movimientos detectado');

    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        const items = movimientosLista.querySelectorAll('li');
        let encontrados = 0;
        
        items.forEach(item => {
            const texto = item.textContent.toLowerCase();
            if (texto.includes(termino) || termino === '') {
                item.style.display = '';
                item.classList.add('animate-fade-in');
                encontrados++;
            } else {
                item.style.display = 'none';
            }
        });

        // Mostrar mensaje si no hay resultados
        let noResultados = document.getElementById('no-resultados');
        if (encontrados === 0 && termino !== '') {
            if (!noResultados) {
                noResultados = document.createElement('li');
                noResultados.id = 'no-resultados';
                noResultados.className = 'text-gray-500 italic text-center py-4';
                noResultados.textContent = 'No se encontraron movimientos';
                movimientosLista.appendChild(noResultados);
            }
        } else if (noResultados) {
            noResultados.remove();
        }
    });

    // Placeholder dinámico
    const placeholders = [
        'Buscar vacunaciones...',
        'Buscar ventas...',
        'Buscar producción...',
        'Buscar movimientos...'
    ];
    let placeholderIndex = 0;

    setInterval(() => {
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        searchInput.placeholder = placeholders[placeholderIndex];
    }, 3000);
}

// ===============================================
// MODAL DE AYUDA (DASHBOARD)
// ===============================================

const abrirAyuda = document.getElementById('abrirAyuda');
const modalAyuda = document.getElementById('modalAyuda');

if (abrirAyuda && modalAyuda) {
    logger.info('Sistema de ayuda detectado');

    abrirAyuda.addEventListener('click', (e) => {
        e.preventDefault();
        modalAyuda.classList.remove('hidden');
        modalAyuda.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });
}

/**
 * Cerrar modal de ayuda
 */
function cerrarAyuda() {
    const modalAyuda = document.getElementById('modalAyuda');
    if (modalAyuda) {
        modalAyuda.classList.add('hidden');
        modalAyuda.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

/**
 * Mostrar contenido de ayuda según módulo
 * @param {string} modulo Módulo seleccionado
 */
function mostrarAyuda(modulo) {
    const contenidoAyuda = document.getElementById('contenidoAyuda');
    
    const ayudas = {
        vacunaciones: `
            <h3 class="font-bold text-lg mb-3 text-green-700">📊 Módulo de Vacunaciones</h3>
            <div class="space-y-2">
                <p><strong>Registrar vacunación:</strong> Haz clic en el botón "Nueva Vacunación" e ingresa los datos del animal y la vacuna aplicada.</p>
                <p><strong>Calendario:</strong> Programa vacunaciones futuras y recibe recordatorios.</p>
                <p><strong>Historial:</strong> Consulta el registro completo de vacunaciones por animal.</p>
                <p><strong>Reportes:</strong> Genera reportes de vacunación para auditorías.</p>
            </div>
        `,
        produccion: `
            <h3 class="font-bold text-lg mb-3 text-green-700">🥛 Módulo de Producción</h3>
            <div class="space-y-2">
                <p><strong>Registro diario:</strong> Ingresa la producción de leche de cada vaca.</p>
                <p><strong>Análisis:</strong> Visualiza gráficos de producción por período.</p>
                <p><strong>Comparativas:</strong> Compara producción entre animales.</p>
                <p><strong>Proyecciones:</strong> Calcula proyecciones de producción mensual.</p>
            </div>
        `,
        ventas: `
            <h3 class="font-bold text-lg mb-3 text-green-700">💰 Módulo de Ventas</h3>
            <div class="space-y-2">
                <p><strong>Registrar venta:</strong> Ingresa los detalles de cada venta realizada.</p>
                <p><strong>Clientes:</strong> Gestiona tu cartera de clientes.</p>
                <p><strong>Facturación:</strong> Genera facturas automáticas.</p>
                <p><strong>Estadísticas:</strong> Visualiza ingresos por período.</p>
            </div>
        `,
        reproduccion: `
            <h3 class="font-bold text-lg mb-3 text-green-700">🐄 Módulo de Reproducción</h3>
            <div class="space-y-2">
                <p><strong>Ciclos reproductivos:</strong> Registra celos, montas y gestaciones.</p>
                <p><strong>Calendario de partos:</strong> Programa y rastrea fechas de parto.</p>
                <p><strong>Inseminación:</strong> Gestiona inseminaciones artificiales.</p>
                <p><strong>Genealogía:</strong> Mantén el registro genealógico del ganado.</p>
            </div>
        `,
        alimentacion: `
            <h3 class="font-bold text-lg mb-3 text-green-700">🌾 Módulo de Alimentación</h3>
            <div class="space-y-2">
                <p><strong>Planes nutricionales:</strong> Crea planes de alimentación personalizados.</p>
                <p><strong>Consumo:</strong> Registra el consumo de alimentos por animal o lote.</p>
                <p><strong>Inventario:</strong> Controla el stock de alimentos y concentrados.</p>
                <p><strong>Costos:</strong> Calcula costos de alimentación por animal.</p>
            </div>
        `,
        inventario: `
            <h3 class="font-bold text-lg mb-3 text-green-700">📦 Módulo de Inventario</h3>
            <div class="space-y-2">
                <p><strong>Stock actual:</strong> Visualiza el inventario de insumos en tiempo real.</p>
                <p><strong>Alertas:</strong> Recibe notificaciones de stock bajo.</p>
                <p><strong>Movimientos:</strong> Registra entradas y salidas de insumos.</p>
                <p><strong>Proveedores:</strong> Gestiona la información de tus proveedores.</p>
            </div>
        `,
        otros: `
            <h3 class="font-bold text-lg mb-3 text-green-700">📞 Contacto y Soporte</h3>
            <div class="space-y-3">
                <p><strong>¿Necesitas ayuda?</strong> Nuestro equipo está disponible para asistirte.</p>
                <div class="bg-green-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> soporte@ganacontrol.com</p>
                    <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                    <p><strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                </div>
                <p class="text-sm italic">También puedes enviarnos tus sugerencias para mejorar el sistema.</p>
            </div>
        `}
    };