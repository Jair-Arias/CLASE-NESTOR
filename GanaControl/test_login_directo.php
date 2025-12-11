<?php
require_once "models/Usuario.php";

// Ahora con contraseña CORRECTA
$email = "test@test.com";
$password = "Test1234!"; // ← CONTRASEÑA CORRECTA

echo "<h1>🔐 Test Login CONTRASEÑA CORRECTA</h1>";

$usuarioModel = new Usuario();
$usuario = $usuarioModel->login($email);

if ($usuario) {
    echo "Usuario encontrado: " . $usuario['nombre'] . "<br>";
    
    $resultado = password_verify($password, $usuario['password']);
    echo "password_verify: " . ($resultado ? "✅ OK" : "❌ FALLO") . "<br>";
    
    if ($resultado) {
        session_start();
        $_SESSION['usuario_id'] = $usuario['id'];
        echo "✅ LOGIN EXITOSO - Redirigiendo...";
        echo "<script>setTimeout(function() { window.location='index.php?action=dashboard'; }, 2000);</script>";
    }
} else {
    echo "❌ Usuario no encontrado";
}
?>