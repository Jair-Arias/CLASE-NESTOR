<?php
echo "<h1>Test Formulario</h1>";

// Probar con datos directos
$_POST['action'] = 'autenticar';
$_POST['email'] = 'test@test.com';
$_POST['password'] = 'Test1234!';

echo "<h3>Datos enviados:</h3>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

// Incluir y ejecutar controlador
require_once "controllers/UsuarioController.php";
$controller = new UsuarioController();
$controller->autenticar();
?>