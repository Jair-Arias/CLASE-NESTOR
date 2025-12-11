<?php
/**
 * Script de prueba para verificar conexión y estado de la BD
 * Ejecuta este archivo directamente en el navegador: http://localhost/GanaControl/test_conexion.php
 */

echo "<h1>🔍 Test de Conexión y Base de Datos</h1>";
echo "<hr>";

// Test 1: Conexión a la base de datos
echo "<h2>1. Probando conexión a BD...</h2>";
require_once "config/database.php";

try {
    $db = new Database();
    $conn = $db->conectar();
    echo "✅ <strong>Conexión exitosa a la base de datos</strong><br><br>";
} catch (Exception $e) {
    echo "❌ <strong>Error de conexión:</strong> " . $e->getMessage() . "<br><br>";
    die();
}

// Test 2: Verificar si la tabla existe
echo "<h2>2. Verificando tabla usuarios...</h2>";
try {
    $stmt = $conn->query("SHOW TABLES LIKE 'usuarios'");
    if ($stmt->rowCount() > 0) {
        echo "✅ <strong>Tabla 'usuarios' existe</strong><br><br>";
    } else {
        echo "❌ <strong>La tabla 'usuarios' NO existe. Ejecuta el SQL para crearla.</strong><br><br>";
        die();
    }
} catch (PDOException $e) {
    echo "❌ <strong>Error al verificar tabla:</strong> " . $e->getMessage() . "<br><br>";
    die();
}

// Test 3: Mostrar estructura de la tabla
echo "<h2>3. Estructura de la tabla usuarios:</h2>";
try {
    $stmt = $conn->query("DESCRIBE usuarios");
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td>" . $row['Field'] . "</td>";
        echo "<td>" . $row['Type'] . "</td>";
        echo "<td>" . $row['Null'] . "</td>";
        echo "<td>" . $row['Key'] . "</td>";
        echo "<td>" . ($row['Default'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table><br>";
} catch (PDOException $e) {
    echo "❌ <strong>Error:</strong> " . $e->getMessage() . "<br><br>";
}

// Test 4: Contar usuarios registrados
echo "<h2>4. Usuarios registrados en la BD:</h2>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as total FROM usuarios");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "📊 <strong>Total de usuarios:</strong> " . $row['total'] . "<br><br>";
} catch (PDOException $e) {
    echo "❌ <strong>Error:</strong> " . $e->getMessage() . "<br><br>";
}

// Test 5: Listar todos los usuarios (solo emails)
echo "<h2>5. Lista de emails registrados:</h2>";
try {
    $stmt = $conn->query("SELECT id, nombre, email, fecha_registro FROM usuarios ORDER BY id DESC");
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        echo "<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Fecha Registro</th></tr>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['nombre'] . "</td>";
            echo "<td>" . $row['email'] . "</td>";
            echo "<td>" . $row['fecha_registro'] . "</td>";
            echo "</tr>";
        }
        echo "</table><br>";
    } else {
        echo "ℹ️ <strong>No hay usuarios registrados aún.</strong><br><br>";
    }
} catch (PDOException $e) {
    echo "❌ <strong>Error:</strong> " . $e->getMessage() . "<br><br>";
}

// Test 6: Probar registro de usuario de prueba
echo "<h2>6. Probando registro de usuario:</h2>";
$email_prueba = "test_" . time() . "@test.com";
$nombre_prueba = "Usuario Prueba";
$password_prueba = password_hash("Test1234!", PASSWORD_DEFAULT);

try {
    // Verificar si el email existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email_prueba]);
    
    if ($stmt->rowCount() > 0) {
        echo "⚠️ <strong>El email ya existe (esto no debería pasar con un timestamp)</strong><br><br>";
    } else {
        // Intentar insertar
        $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, fecha_registro, activo) VALUES (?, ?, ?, NOW(), 1)");
        $resultado = $stmt->execute([$nombre_prueba, $email_prueba, $password_prueba]);
        
        if ($resultado) {
            echo "✅ <strong>Usuario de prueba creado exitosamente</strong><br>";
            echo "📧 Email: " . $email_prueba . "<br>";
            echo "🆔 ID: " . $conn->lastInsertId() . "<br><br>";
            
            // Limpiarlo inmediatamente
            $stmt = $conn->prepare("DELETE FROM usuarios WHERE email = ?");
            $stmt->execute([$email_prueba]);
            echo "🗑️ Usuario de prueba eliminado<br><br>";
        } else {
            echo "❌ <strong>Error al crear usuario de prueba</strong><br><br>";
        }
    }
} catch (PDOException $e) {
    echo "❌ <strong>Error en test de registro:</strong> " . $e->getMessage() . "<br><br>";
}

echo "<hr>";
echo "<h2>✅ Pruebas completadas</h2>";
echo "<p><a href='index.php'>Volver al login</a> | <a href='index.php?action=register'>Ir a registro</a></p>";
?>