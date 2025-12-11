<?php
// Activar TODOS los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

echo "<style>
    body { font-family: Arial; margin: 20px; }
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style>";

echo "<h1>🔍 DEBUG PROFUNDO - GanaControl</h1>";
echo "<hr>";

// ============================================
// 1. VERIFICAR SESIÓN Y CONFIGURACIÓN
// ============================================
echo "<h2>1. Configuración PHP y Sesión</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Session Status: " . session_status() . " (2 = PHP_SESSION_ACTIVE)<br>";

// ============================================
// 2. SIMULAR DATOS DE LOGIN
// ============================================
echo "<h2>2. Simulando datos POST</h2>";
$_POST['action'] = 'autenticar';
$_POST['email'] = 'test@test.com';
$_POST['password'] = 'Test1234!';

echo "POST data:<br>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

// ============================================
// 3. VERIFICAR ARCHIVOS
// ============================================
echo "<h2>3. Verificando archivos incluidos</h2>";

$files = [
    'config/database.php',
    'models/Usuario.php',
    'controllers/UsuarioController.php'
];

foreach ($files as $file) {
    if (file_exists($file)) {
        echo "<span class='success'>✅ $file existe</span><br>";
        echo "Tamaño: " . filesize($file) . " bytes<br>";
    } else {
        echo "<span class='error'>❌ $file NO existe</span><br>";
    }
}

// ============================================
// 4. PROBAR CONEXIÓN DIRECTA
// ============================================
echo "<h2>4. Probando conexión directa a BD</h2>";
try {
    // Intenta conectar directamente
    $host = 'localhost';
    $dbname = 'ganacontrol';
    $username = 'root';
    $password = '';
    
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<span class='success'>✅ Conexión directa OK</span><br>";
    
    // Verificar usuarios
    $stmt = $conn->query("SELECT id, nombre, email, LEFT(password, 20) as pass_hash FROM usuarios");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Usuarios en BD: " . count($usuarios) . "<br>";
    echo "<pre>";
    print_r($usuarios);
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<span class='error'>❌ Error conexión directa: " . $e->getMessage() . "</span><br>";
}

// ============================================
// 5. PROBAR MODELO USUARIO DIRECTAMENTE
// ============================================
echo "<h2>5. Probando modelo Usuario directamente</h2>";
try {
    require_once "models/Usuario.php";
    $usuarioModel = new Usuario();
    echo "<span class='success'>✅ Modelo Usuario instanciado</span><br>";
    
    // Probar login
    $email = 'test@test.com';
    $usuario = $usuarioModel->login($email);
    
    if ($usuario) {
        echo "<span class='success'>✅ Usuario encontrado</span><br>";
        echo "<pre>";
        print_r($usuario);
        echo "</pre>";
        
        // Probar contraseña
        $password_correcta = 'Test1234!';
        $verificado = password_verify($password_correcta, $usuario['password']);
        
        if ($verificado) {
            echo "<span class='success'>✅ Contraseña correcta</span><br>";
        } else {
            echo "<span class='error'>❌ Contraseña INCORRECTA</span><br>";
            echo "Hash en BD: " . $usuario['password'] . "<br>";
            echo "Contraseña probada: " . $password_correcta . "<br>";
            
            // Generar hash correcto
            echo "<br><span class='info'>Generando hash para 'Test1234!':</span><br>";
            $hash_correcto = password_hash($password_correcta, PASSWORD_DEFAULT);
            echo "Hash correcto: " . $hash_correcto . "<br>";
        }
    } else {
        echo "<span class='error'>❌ Usuario NO encontrado: $email</span><br>";
    }
    
} catch (Exception $e) {
    echo "<span class='error'>❌ Error en modelo: " . $e->getMessage() . "</span><br>";
    echo "Trace:<br><pre>";
    print_r($e->getTrace());
    echo "</pre>";
}

// ============================================
// 6. PROBAR CONTROLADOR DIRECTAMENTE
// ============================================
echo "<h2>6. Probando controlador directamente</h2>";
try {
    require_once "controllers/UsuarioController.php";
    $controller = new UsuarioController();
    echo "<span class='success'>✅ Controlador instanciado</span><br>";
    
    // Llamar al método autenticar directamente
    echo "<br>Llamando a autenticar()...<br>";
    ob_start(); // Capturar salida
    $controller->autenticar();
    $output = ob_get_clean();
    
    if (!empty($output)) {
        echo "Salida del controlador:<br>";
        echo $output;
    } else {
        echo "<span class='info'>⚠️ El controlador no produjo salida (puede haber redirección)</span><br>";
    }
    
} catch (Exception $e) {
    echo "<span class='error'>❌ Error en controlador: " . $e->getMessage() . "</span><br>";
}

// ============================================
// 7. FORMULARIO DE PRUEBA
// ============================================
echo "<h2>7. Formulario de prueba interactivo</h2>";
echo '<form method="POST" action="debug_profundo.php">
    <h3>Probar login manualmente:</h3>
    <input type="hidden" name="debug" value="1">
    
    <label>Email:</label><br>
    <input type="email" name="email" value="test@test.com" style="width:300px;padding:5px;"><br><br>
    
    <label>Contraseña:</label><br>
    <input type="password" name="password" value="Test1234!" style="width:300px;padding:5px;"><br><br>
    
    <button type="submit" style="background:#4CAF50;color:white;padding:10px 20px;border:none;border-radius:5px;">
        Probar Login
    </button>
</form>';

// ============================================
// 8. PROCESAR SI HAY DATOS DE PRUEBA
// ============================================
if (isset($_POST['debug']) && $_POST['debug'] == '1') {
    echo "<h2>8. Resultado de prueba manual</h2>";
    
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    echo "Email: " . htmlspecialchars($email) . "<br>";
    echo "Contraseña: " . htmlspecialchars($password) . "<br><br>";
    
    try {
        require_once "models/Usuario.php";
        $usuarioModel = new Usuario();
        $usuario = $usuarioModel->login($email);
        
        if ($usuario) {
            echo "<span class='success'>✅ Usuario encontrado</span><br>";
            
            $verificado = password_verify($password, $usuario['password']);
            if ($verificado) {
                echo "<span class='success'>✅✅✅ LOGIN EXITOSO!</span><br><br>";
                
                // Simular inicio de sesión
                session_start();
                $_SESSION['debug_usuario_id'] = $usuario['id'];
                $_SESSION['debug_usuario_nombre'] = $usuario['nombre'];
                
                echo "Datos de sesión guardados:<br>";
                echo "ID: " . $_SESSION['debug_usuario_id'] . "<br>";
                echo "Nombre: " . $_SESSION['debug_usuario_nombre'] . "<br><br>";
                
                echo '<a href="index.php?action=dashboard" style="background:#2196F3;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                    Ir al Dashboard
                </a>';
                
            } else {
                echo "<span class='error'>❌ Contraseña incorrecta</span><br>";
                
                // Mostrar ayuda
                echo "<br><h3>Ayuda para solucionar:</h3>";
                echo "1. Ejecuta en phpMyAdmin:<br>";
                echo "<code>SELECT email, LEFT(password, 30) as hash FROM usuarios;</code><br><br>";
                
                echo "2. Actualiza contraseña:<br>";
                echo "<code>UPDATE usuarios SET password = '" . password_hash($password, PASSWORD_DEFAULT) . "' WHERE email = '$email';</code>";
            }
        } else {
            echo "<span class='error'>❌ Usuario no encontrado</span><br>";
        }
        
    } catch (Exception $e) {
        echo "<span class='error'>❌ Error: " . $e->getMessage() . "</span><br>";
    }
}

// ============================================
// 9. COMANDOS SQL PARA SOLUCIONAR
// ============================================
echo "<h2>9. Comandos SQL para solucionar problemas</h2>";
echo "<pre>";
echo "-- 1. Ver todos los usuarios y sus hashes:
SELECT id, nombre, email, LEFT(password, 30) as hash_inicio, 
       LENGTH(password) as longitud, activo 
FROM usuarios;

-- 2. Actualizar contraseña para test@test.com:
UPDATE usuarios 
SET password = '" . password_hash('Test1234!', PASSWORD_DEFAULT) . "'
WHERE email = 'test@test.com';

-- 3. Crear usuario nuevo seguro:
INSERT INTO usuarios (nombre, email, password, activo) 
VALUES ('Admin Test', 'admin@test.com', 
        '" . password_hash('Admin123!', PASSWORD_DEFAULT) . "', 1);

-- 4. Verificar estructura de tabla:
DESCRIBE usuarios;
";
echo "</pre>";

echo "<hr>";
echo "<h2 class='success'>✅ Debug completo ejecutado</h2>";
echo "<p><a href='index.php?action=login'>Volver al login normal</a></p>";
?>