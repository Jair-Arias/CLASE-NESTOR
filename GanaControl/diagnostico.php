<?php
echo "<h1>🔍 Diagnóstico Completo</h1><hr>";

// 1. Test de conexión
require_once "config/database.php";
try {
    $db = new Database();
    $conn = $db->conectar();
    echo "✅ Conexión OK<br>";
} catch (Exception $e) {
    echo "❌ Error conexión: " . $e->getMessage();
    die();
}

// 2. Ver estructura REAL de la tabla
echo "<h2>📊 Estructura REAL de tabla 'usuarios':</h2>";
try {
    $stmt = $conn->query("DESCRIBE usuarios");
    echo "<table border='1' cellpadding='5'><tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td><strong>" . $row['Field'] . "</strong></td>";
        echo "<td>" . $row['Type'] . "</td>";
        echo "<td>" . $row['Null'] . "</td>";
        echo "<td>" . $row['Key'] . "</td>";
        echo "<td>" . ($row['Default'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}

// 3. Ver usuarios existentes
echo "<h2>👥 Usuarios en BD:</h2>";
try {
    $stmt = $conn->query("SELECT * FROM usuarios");
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' cellpadding='5'><tr>";
        $first = true;
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if ($first) {
                foreach (array_keys($row) as $key) {
                    echo "<th>" . $key . "</th>";
                }
                echo "</tr>";
                $first = false;
            }
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No hay usuarios<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}

// 4. Crear usuario de prueba SI no existe
echo "<h2>🧪 Creando usuario de prueba:</h2>";
$test_email = "test_" . time() . "@test.com";
$test_pass = "Test1234!";
$test_hash = password_hash($test_pass, PASSWORD_DEFAULT);

try {
    // Verificar si ya existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->execute([$test_email]);
    
    if ($check->rowCount() == 0) {
        // Intentar insertar sin columna 'activo'
        $sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute(['Test User', $test_email, $test_hash])) {
            echo "✅ Usuario creado: " . $test_email . "<br>";
            echo "🔑 Password: " . $test_pass . "<br>";
            echo "🆔 ID: " . $conn->lastInsertId() . "<br>";
            
            // Verificar que se puede leer
            $sql = "SELECT * FROM usuarios WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$test_email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<h3>📄 Datos leídos:</h3>";
            echo "<pre>";
            print_r($user);
            echo "</pre>";
            
            // Verificar contraseña
            if (password_verify($test_pass, $user['password'])) {
                echo "✅ Password verification OK<br>";
            } else {
                echo "❌ Password verification FAILED<br>";
            }
        } else {
            echo "❌ Error al crear usuario<br>";
        }
    } else {
        echo "ℹ️ Usuario ya existe<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// 5. Mostrar errores de PHP
echo "<h2>⚙️ Configuración PHP:</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Error Reporting: " . ini_get('error_reporting') . "<br>";
echo "Display Errors: " . ini_get('display_errors') . "<br>";

echo "<hr><h2>✅ Diagnóstico completo</h2>";
?>