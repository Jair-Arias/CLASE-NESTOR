<?php
require_once "models/Usuario.php";

class UsuarioController {

    /* -----------------------
       VISTA: LOGIN
    ----------------------- */
    public function login() {
        require "views/login.html";
    }

    /* -----------------------
       VISTA: REGISTRO
    ----------------------- */
    public function register() {
        require "views/register.html";
    }

    /* -----------------------
       PROCESAR LOGIN
    ----------------------- */
   public function autenticar() {
    // DEBUG: Mostrar lo que llega
    echo "<script>console.log('🔍 Autenticar llamado');</script>";
    
    // Verificar si es una prueba de debug
    if (isset($_GET['debug_login'])) {
        echo "<h2>🔍 DEBUG AUTENTICAR</h2>";
        echo "<pre>";
        echo "POST recibido:\n";
        print_r($_POST);
        echo "\nGET recibido:\n";
        print_r($_GET);
        echo "</pre>";
    }
    
    // Obtener datos de POST o GET
    $email = $_POST['email'] ?? $_GET['email'] ?? '';
    $password = $_POST['password'] ?? $_GET['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo "<script>
            alert('Por favor complete todos los campos');
            window.location = 'index.php?action=login&error=empty';
        </script>";
        return;
    }
    
    // Procesar login
    $usuario = (new Usuario())->login($email);
    
    if ($usuario && password_verify($password, $usuario['password'])) {
        session_start();
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];
        $_SESSION['usuario_email'] = $usuario['email'];
        $_SESSION['tiempo_inicio'] = time();
        
        // Redirigir al dashboard
        header("Location: index.php?action=dashboard");
        exit;
    } else {
        // Mostrar error específico
        if (!$usuario) {
            $error_msg = "Usuario no encontrado: $email";
        } else {
            $error_msg = "Contraseña incorrecta";
        }
        
        echo "<script>
            alert('Error: $error_msg');
            window.location = 'index.php?action=login&error=auth';
        </script>";
    }
}
    /* -----------------------
       PROCESAR REGISTRO
    ----------------------- */
    public function registrarUsuario() {

        if (!isset($_POST['nombre'], $_POST['email'], $_POST['password'], $_POST['password2'])) {
            echo "<script>alert('Complete todos los campos'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        $nombre = trim($_POST['nombre']);
        $email = trim($_POST['email']);
        $pass1 = trim($_POST['password']);
        $pass2 = trim($_POST['password2']);

        /* VALIDACIONES */
        if ($pass1 !== $pass2) {
            echo "<script>alert('Las contraseñas no coinciden'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        if (strlen($pass1) < 8) {
            echo "<script>alert('La contraseña debe tener al menos 8 caracteres'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        if (strlen($nombre) < 3) {
            echo "<script>alert('El nombre debe tener al menos 3 caracteres'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "<script>alert('Formato de email inválido'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        $model = new Usuario();

        // Evitar email duplicado
        if ($model->emailExiste($email)) {
            echo "<script>alert('Este email ya está registrado'); 
            window.location='index.php?action=register';</script>";
            exit;
        }

        // Hash seguro
        $passwordHash = password_hash($pass1, PASSWORD_DEFAULT);

        // Registrar
        $resultado = $model->registrar($nombre, $email, $passwordHash);

        if ($resultado) {
            echo "<script>
                alert('Registro exitoso. Ya puedes iniciar sesión');
                window.location='index.php?action=login';
            </script>";
            exit;
        } else {
            echo "<script>
                alert('Error al registrar. Intente de nuevo');
                window.location='index.php?action=register';
            </script>";
            exit;
        }
    }

    /* -----------------------
       DASHBOARD
    ----------------------- */
    public function dashboard() {
        session_start();

        if (!isset($_SESSION['usuario_id'])) {
            header("Location: index.php?action=login");
            exit;
        }

        // Expiración 30 minutos
        if (time() - $_SESSION['tiempo_inicio'] > 1800) {
            session_destroy();
            header("Location: index.php?action=login");
            exit;
        }

        $_SESSION['tiempo_inicio'] = time(); // renovar tiempo

        require "views/dashboard.html";
    }

    /* -----------------------
       LOGOUT
    ----------------------- */
    public function logout() {
        session_start();
        session_destroy();
        header("Location: index.php?action=login");
        exit;
    }
}
?>
