<?php
require_once "config/database.php";

class Usuario {

    private $conexion;

    public function __construct() {
        $this->conexion = (new Database())->conectar();
    }

    /**
     * Registrar nuevo usuario
     * @param string $nombre Nombre completo
     * @param string $email Email del usuario
     * @param string $password Contraseña hasheada
     * @return bool True si se registró correctamente
     */
    public function registrar($nombre, $email, $password) {
        try {
            // Limpiar y sanitizar email
            $email = strtolower(trim($email));
            $nombre = trim($nombre);

            // Verificar si el email ya existe
            $sqlCheck = "SELECT id FROM usuarios WHERE email = ?";
            $stmtCheck = $this->conexion->prepare($sqlCheck);
            $stmtCheck->execute([$email]);
            
            if ($stmtCheck->rowCount() > 0) {
                error_log("Email ya registrado: " . $email);
                return false; // Email ya registrado
            }

            // Insertar nuevo usuario
            $sql = "INSERT INTO usuarios (nombre, email, password, fecha_registro, activo) VALUES (?, ?, ?, NOW(), 1)";
            $stmt = $this->conexion->prepare($sql);
            $resultado = $stmt->execute([$nombre, $email, $password]);
            
            if ($resultado) {
                error_log("Usuario registrado exitosamente: " . $email);
                return true;
            } else {
                error_log("Error al ejecutar INSERT para: " . $email);
                return false;
            }

        } catch (PDOException $e) {
            error_log("Error en registrar(): " . $e->getMessage());
            error_log("Código de error: " . $e->getCode());
            return false;
        }
    }

    /**
     * Login de usuario
     * @param string $email Email del usuario
     * @return array|false Datos del usuario o false si no existe
     */
    public function login($email) {
        try {
            // Limpiar email
            $email = strtolower(trim($email));

            $sql = "SELECT id, nombre, email, password, activo FROM usuarios WHERE email = ? LIMIT 1";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Verificar si está activo
                if ($usuario['activo'] == 1) {
                    return $usuario;
                }
            }
            
            return false;

        } catch (PDOException $e) {
            error_log("Error en login(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Actualizar último acceso del usuario
     * @param int $usuario_id ID del usuario
     * @return bool
     */
    public function actualizarUltimoAcceso($usuario_id) {
        try {
            $sql = "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?";
            $stmt = $this->conexion->prepare($sql);
            return $stmt->execute([$usuario_id]);
        } catch (PDOException $e) {
            error_log("Error en actualizarUltimoAcceso(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener usuario por ID
     * @param int $usuario_id ID del usuario
     * @return array|false Datos del usuario
     */
    public function obtenerPorId($usuario_id) {
        try {
            $sql = "SELECT id, nombre, email, fecha_registro, ultimo_acceso FROM usuarios WHERE id = ? LIMIT 1";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([$usuario_id]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            return false;

        } catch (PDOException $e) {
            error_log("Error en obtenerPorId(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Verificar si un email existe (para debugging)
     * @param string $email
     * @return bool
     */
    public function emailExiste($email) {
        try {
            $email = strtolower(trim($email));
            $sql = "SELECT id FROM usuarios WHERE email = ?";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([$email]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Error en emailExiste(): " . $e->getMessage());
            return false;
        }
    }
}
?>


