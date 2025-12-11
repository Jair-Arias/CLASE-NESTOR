-- ===============================================
-- GANACONTROL - BASE DE DATOS
-- Sistema de Gestión Ganadera
-- ===============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ganacontrol 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ganacontrol;

-- ===============================================
-- TABLA: usuarios
-- ===============================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL DEFAULT NULL,
    
    -- Índices para optimizar búsquedas
    INDEX idx_email (email),
    INDEX idx_activo (activo),
    INDEX idx_bloqueado (bloqueado_hasta)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLA: sesiones (opcional - para gestión avanzada)
-- ===============================================

CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_activa (activa)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLA: logs_actividad (para auditoría)
-- ===============================================

CREATE TABLE IF NOT EXISTS logs_actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha),
    INDEX idx_accion (accion)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLA: intentos_login (para seguridad)
-- ===============================================

CREATE TABLE IF NOT EXISTS intentos_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    exitoso BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_ip (ip_address),
    INDEX idx_fecha (fecha)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- DATOS DE PRUEBA (opcional - solo desarrollo)
-- ===============================================

-- Usuario de prueba (contraseña: Test123!)
-- INSERT INTO usuarios (nombre, email, password, activo) VALUES 
-- ('Usuario Prueba', 'prueba@ganacontrol.com', '$argon2id$v=19$m=65536,t=4,p=3$example_salt$example_hash', TRUE);

-- ===============================================
-- VISTAS ÚTILES
-- ===============================================

-- Vista de usuarios activos
CREATE OR REPLACE VIEW v_usuarios_activos AS
SELECT 
    id,
    nombre,
    email,
    fecha_registro,
    ultimo_acceso,
    CASE 
        WHEN ultimo_acceso IS NULL THEN 'Nunca'
        WHEN ultimo_acceso > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'Hoy'
        WHEN ultimo_acceso > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'Esta semana'
        WHEN ultimo_acceso > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'Este mes'
        ELSE 'Hace más de un mes'
    END as ultima_actividad
FROM usuarios
WHERE activo = TRUE;

-- Vista de intentos de login recientes
CREATE OR REPLACE VIEW v_intentos_login_recientes AS
SELECT 
    email,
    ip_address,
    exitoso,
    fecha,
    CASE 
        WHEN exitoso = TRUE THEN 'Exitoso'
        ELSE 'Fallido'
    END as resultado
FROM intentos_login
WHERE fecha > DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY fecha DESC;

-- ===============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ===============================================

-- Procedimiento para limpiar sesiones antiguas
DELIMITER $$

CREATE PROCEDURE limpiar_sesiones_antiguas()
BEGIN
    DELETE FROM sesiones 
    WHERE activa = FALSE 
    OR fecha_actividad < DATE_SUB(NOW(), INTERVAL 7 DAY);
END$$

DELIMITER ;

-- Procedimiento para limpiar logs antiguos
DELIMITER $$

CREATE PROCEDURE limpiar_logs_antiguos()
BEGIN
    DELETE FROM logs_actividad 
    WHERE fecha < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    DELETE FROM intentos_login 
    WHERE fecha < DATE_SUB(NOW(), INTERVAL 30 DAY);
END$$

DELIMITER ;

-- ===============================================
-- EVENTOS PROGRAMADOS (requiere event_scheduler=ON)
-- ===============================================

-- Evento para limpiar automáticamente sesiones antiguas
CREATE EVENT IF NOT EXISTS evento_limpiar_sesiones
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL limpiar_sesiones_antiguas();

-- Evento para limpiar automáticamente logs antiguos
CREATE EVENT IF NOT EXISTS evento_limpiar_logs
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
    CALL limpiar_logs_antiguos();

-- ===============================================
-- TRIGGERS
-- ===============================================

-- Trigger para registrar intentos de login
DELIMITER $$

CREATE TRIGGER after_usuario_login
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.ultimo_acceso != OLD.ultimo_acceso OR NEW.ultimo_acceso IS NOT NULL THEN
        INSERT INTO logs_actividad (usuario_id, accion, descripcion)
        VALUES (NEW.id, 'LOGIN', CONCAT('Inicio de sesión exitoso'));
    END IF;
END$$

DELIMITER ;

-- ===============================================
-- PERMISOS Y SEGURIDAD
-- ===============================================

-- Crear usuario de aplicación (opcional - producción)
-- CREATE USER 'ganacontrol_app'@'localhost' IDENTIFIED BY 'tu_password_seguro_aqui';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ganacontrol.* TO 'ganacontrol_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ===============================================
-- VERIFICACIÓN DE INSTALACIÓN
-- ===============================================

-- Mostrar todas las tablas creadas
SHOW TABLES;

-- Verificar estructura de tabla usuarios
DESCRIBE usuarios;

-- Contar usuarios registrados
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Verificar que event_scheduler esté activo
SHOW VARIABLES LIKE 'event_scheduler';

-- ===============================================
-- FIN DEL SCRIPT
-- ===============================================

SELECT 'Base de datos GanaControl instalada correctamente' as mensaje;