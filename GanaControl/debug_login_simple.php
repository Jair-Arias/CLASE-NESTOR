<?php
// NO REDIRECCIONES - solo debug
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

echo "<h1>🐛 DEBUG LOGIN SIMPLE</h1>";
echo "<a href='index.php'>← Volver</a><hr>";

// Mostrar TODO lo que llega
echo "<h2>1. Datos recibidos:</h2>";
echo "<h3>GET:</h3>";
echo "<pre>";
print_r($_GET);
echo "</pre>";

echo "<h3>POST:</h3>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

echo "<h3>SESSION:</h3>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

// Si hay datos de login, procesarlos
if (isset($_POST['email']) && isset($_POST['password'])) {
    echo "<h2>2. Procesando login...</h2>";
    
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    echo "Email: $email<br>";
    echo "Password: $password<br><br>";
    
    // Incluir y probar
    require_once "models/Usuario.php";
    
    try {
        $usuarioModel = new Usuario();
        $usuario = $usuarioModel->login($email);
        
        if ($usuario) {
            echo "<h3>✅ Usuario encontrado en BD:</h3>";
            echo "<pre>";
            print_r($usuario);
            echo "</pre>";
            
            // Verificar contraseña
            $verificado = password_verify($password, $usuario['password']);
            echo "<h3>Verificación de contraseña: " . ($verificado ? "✅ OK" : "❌ FALLO") . "</h3>";
            
            if ($verificado) {
                echo "<h3 style='color:green;'>🎉 LOGIN EXITOSO!</h3>";
                
                // Guardar en sesión
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nombre'] = $usuario['nombre'];
                $_SESSION['usuario_email'] = $usuario['email'];
                
                echo "<p>Sesión iniciada para: " . $usuario['nombre'] . "</p>";
                echo "<p><a href='index.php?action=dashboard'>Ir al Dashboard</a></p>";
            } else {
                echo "<h3 style='color:red;'>❌ Contraseña incorrecta</h3>";
                echo "Hash en BD: " . $usuario['password'] . "<br>";
                echo "¿Estás seguro que la contraseña es 'Test1234!' ?<br>";
            }
        } else {
            echo "<h3 style='color:red;'>❌ Usuario no encontrado en BD</h3>";
            echo "Email buscado: $email<br>";
            
            // Mostrar usuarios existentes
            require_once "config/database.php";
            $db = new Database();
            $conn = $db->conectar();
            $stmt = $conn->query("SELECT email FROM usuarios");
            echo "Usuarios en BD: ";
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo $row['email'] . ", ";
            }
        }
        
    } catch (Exception $e) {
        echo "<h3 style='color:red;'>❌ Error: " . $e->getMessage() . "</h3>";
        echo "Archivo: " . $e->getFile() . "<br>";
        echo "Línea: " . $e->getLine() . "<br>";
    }
}

// Formulario de prueba
echo "<hr><h2>3. Formulario de prueba:</h2>";
?>
<form method="POST" action="debug_login_simple.php">
    <input type="hidden" name="action" value="autenticar">
    
    <label>Email:</label><br>
    <input type="email" name="email" value="test@test.com" style="width:300px;padding:5px;margin:5px 0;"><br>
    
    <label>Contraseña:</label><br>
    <input type="password" name="password" value="Test1234!" style="width:300px;padding:5px;margin:5px 0;"><br><br>
    
    <button type="submit" style="background:#4CAF50;color:white;padding:10px 20px;border:none;border-radius:5px;">
        Probar Login
    </button>
</form>

<?php
echo "<hr><h2>4. Comandos SQL para verificar:</h2>";
echo "<pre>";
echo "-- Verificar usuario test@test.com:
SELECT * FROM usuarios WHERE email = 'test@test.com';

-- Verificar contraseña:
SELECT email, 
       password,
       password = '\$2y\$10\$1GfUu/hzsWSGLRcF2KkwsuCyW.bXyEnMRcWORkN6OcZLlwMZqjkca' as hash_correcto
FROM usuarios 
WHERE email = 'test@test.com';
";
echo "</pre>";
?>