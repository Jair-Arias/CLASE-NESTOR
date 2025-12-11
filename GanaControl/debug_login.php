<?php
// Activar TODOS los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

echo "<h1>🐛 DEBUG COMPLETO LOGIN</h1>";
echo "<hr>";

// 1. Incluir archivos necesarios
echo "<h2>1. Incluyendo archivos...</h2>";
try {
    require_once "models/Usuario.php";
    echo "✅ models/Usuario.php incluido<br>";
} catch (Exception $e) {
    echo "❌ Error incluyendo models/Usuario.php: " . $e->getMessage() . "<br>";
}

// 2. Simular POST (para probar)
echo "<h2>2. Simulando datos de login...</h2>";
$_POST['email'] = 'test@test.com';
$_POST['password'] = 'Test1234!';
echo "Email: " . $_POST['email'] . "<br>";
echo "Password: " . $_POST['password'] . "<br>";

// 3. Instanciar y probar
echo "<h2>3. Probando modelo Usuario...</h2>";
try {
    $usuarioModel = new Usuario();
    echo "✅ Modelo Usuario instanciado<br>";
    
    $usuario = $usuarioModel->login($_POST['email']);
    echo "Resultado login():<br>";
    echo "<pre>";
    var_dump($usuario);
    echo "</pre>";
    
    if ($usuario) {
        echo "<h2>4. Verificando contraseña...</h2>";
        $verificacion = password_verify($_POST['password'], $usuario['password']);
        echo "password_verify resultado: ";
        var_dump($verificacion);
        
        if ($verificacion) {
            echo "<h2>5. Iniciando sesión...</h2>";
            session_start();
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nombre'] = $usuario['nombre'];
            $_SESSION['usuario_email'] = $usuario['email'];
            $_SESSION['tiempo_inicio'] = time();
            
            echo "✅ Sesión iniciada:<br>";
            echo "ID: " . $_SESSION['usuario_id'] . "<br>";
            echo "Nombre: " . $_SESSION['usuario_nombre'] . "<br>";
            echo "Email: " . $_SESSION['usuario_email'] . "<br>";
            
            echo "<h2>6. Redirigiendo...</h2>";
            echo "<script>
                setTimeout(function() {
                    window.location = 'index.php?action=dashboard';
                }, 3000);
            </script>";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    echo "Archivo: " . $e->getFile() . "<br>";
    echo "Línea: " . $e->getLine() . "<br>";
    echo "Trace:<br><pre>";
    print_r($e->getTrace());
    echo "</pre>";
}

// 4. Verificar sesión actual
echo "<h2>7. Estado actual de sesión:</h2>";
session_start();
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

echo "<hr><h2>✅ Debug completo</h2>";
?>