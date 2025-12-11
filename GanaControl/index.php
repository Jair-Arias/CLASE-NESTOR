<?php
// Iniciar sesión al principio
session_start();

// Obtener la acción
$action = $_GET['action'] ?? $_POST['action'] ?? 'login';

// Debug: mostrar qué acción se está procesando
if (isset($_GET['debug']) || isset($_POST['debug'])) {
    echo "<pre>";
    echo "Acción solicitada: $action\n";
    echo "Método: " . $_SERVER['REQUEST_METHOD'] . "\n";
    echo "GET: ";
    print_r($_GET);
    echo "POST: ";
    print_r($_POST);
    echo "</pre>";
}

// Incluir controlador
require_once "controllers/UsuarioController.php";

// Crear instancia del controlador
$controller = new UsuarioController();

// Ejecutar la acción correspondiente
if (method_exists($controller, $action)) {
    $controller->$action();
} else {
    // Si la acción no existe, ir al login
    $controller->login();
}
?>


