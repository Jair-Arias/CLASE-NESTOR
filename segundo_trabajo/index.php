<?php
class Deuda {
    protected $monto;
    protected $tasa;
    protected $plazo;

    public function __construct($monto, $tasa, $plazo) {
        $this->monto = $monto;
        $this->tasa = $tasa;
        $this->plazo = $plazo;
    }

    public function calcularCuota() {
        $i = ($this->tasa / 100) / 12;
        if ($i == 0) return $this->monto / $this->plazo;
        return $this->monto * ($i / (1 - pow(1 + $i, -$this->plazo)));
    }
}

class DeudaAmortizable extends Deuda {
    public function generarTabla() {
        $tabla = [];
        $saldo = $this->monto;
        $i = ($this->tasa / 100) / 12;
        $cuota = $this->calcularCuota();

        for ($mes = 1; $mes <= $this->plazo; $mes++) {
            $interes = $saldo * $i;
            $capital = $cuota - $interes;
            $saldo -= $capital;
            if ($saldo < 0) $saldo = 0;
            $tabla[] = [
                'mes' => $mes,
                'cuota' => $cuota,
                'interes' => $interes,
                'amortizacion' => $capital,
                'saldo' => $saldo
            ];
        }
        return $tabla;
    }
}

$resultado = null;
$cuotaMensual = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $monto = floatval($_POST['monto']);
    $tasa = floatval($_POST['tasa']);
    $plazo = intval($_POST['plazo']);
    $decimales = intval($_POST['decimales']);

    $deuda = new DeudaAmortizable($monto, $tasa, $plazo);
    $resultado = $deuda->generarTabla();
    $cuotaMensual = $deuda->calcularCuota();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Simulador de Tabla de Amortización</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: #ffffff;
        color: #000000;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    h1 {
        text-align: center;
        font-size: 26px;
        margin-top: 40px;
        margin-bottom: 30px;
        font-weight: bold;
    }

    form {
        width: 50%;
        margin: 0 auto;
        text-align: left;
        background: #ffffff;
    }

    label {
        font-weight: bold;
        display: block;
        margin-top: 15px;
        margin-bottom: 5px;
    }

    input, select {
        width: 100%;
        padding: 8px;
        border: 1px solid #c7c7c7;
        border-radius: 3px;
        background-color: #fdfdfd;
    }

    .botones {
        text-align: center;
        margin-top: 25px;
        margin-bottom: 20px;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        margin: 0 8px;
    }

    button:hover {
        background-color: #0056b3;
    }

    table {
        width: 80%;
        margin: 40px auto;
        border-collapse: collapse;
        font-size: 15px;
    }

    th, td {
        border: 1px solid #d3d3d3;
        padding: 10px;
        text-align: center;
    }

    th {
        background-color: #343a40;
        color: white;
    }

    tr:nth-child(even) {
        background-color: #f7f7f7;
    }

    .resultado {
        text-align: center;
        font-size: 16px;
        margin-bottom: 40px;
    }

    footer {
        background-color: #f5f5f5;
        color: #333;
        text-align: center;
        padding: 15px;
        font-size: 15px;
        border-top: 1px solid #ddd;
        letter-spacing: 0.5px;
        margin-top: auto;
    }

    footer span {
        font-weight: bold;
    }
</style>

<script>
function validarFormulario() {
    let monto = document.getElementById('monto').value;
    let tasa = document.getElementById('tasa').value;
    let plazo = document.getElementById('plazo').value;

    if (monto <= 0 || tasa < 0 || plazo <= 0) {
        alert("Por favor ingrese valores válidos.");
        return false;
    }
    return true;
}

function limpiarCampos() {
    document.getElementById('monto').value = '';
    document.getElementById('tasa').value = '';
    document.getElementById('plazo').value = '';
    document.getElementById('decimales').value = '2';

    // eliminar tabla y resultados si existen
    let tabla = document.getElementById('tablaResultados');
    let cuota = document.getElementById('cuotaMensual');
    if (tabla) tabla.remove();
    if (cuota) cuota.remove();
}
</script>
</head>
<body>

<h1>Simulador de Tabla de Amortización</h1>

<form method="POST" onsubmit="return validarFormulario();">
    <label for="monto">Monto de la Deuda:</label>
    <input type="number" id="monto" name="monto" step="any" required>

    <label for="tasa">Tasa de Interés (% anual):</label>
    <input type="number" id="tasa" name="tasa" step="any" required>

    <label for="plazo">Plazo (meses):</label>
    <input type="number" id="plazo" name="plazo" required>

    <label for="decimales">Decimales:</label>
    <select id="decimales" name="decimales">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option>
    </select>

    <div class="botones">
        <button type="submit">Calcular</button>
        <button type="button" onclick="limpiarCampos()">Limpiar</button>
    </div>
</form>

<?php if ($resultado): ?>
    <div id="cuotaMensual" class="resultado">
        <p><strong>Cuota mensual:</strong> <?= number_format($cuotaMensual, $decimales, '.', ',') ?></p>
    </div>

    <table id="tablaResultados">
        <tr>
            <th>Mes</th>
            <th>Cuota</th>
            <th>Interés</th>
            <th>Amortización</th>
            <th>Saldo</th>
        </tr>
        <?php foreach ($resultado as $fila): ?>
        <tr>
            <td><?= $fila['mes'] ?></td>
            <td><?= number_format($fila['cuota'], $decimales, '.', ',') ?></td>
            <td><?= number_format($fila['interes'], $decimales, '.', ',') ?></td>
            <td><?= number_format($fila['amortizacion'], $decimales, '.', ',') ?></td>
            <td><?= number_format($fila['saldo'], $decimales, '.', ',') ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
<?php endif; ?>

<footer>
    Desarrollado por <span>Jair Arias</span> © <?= date('Y') ?>
</footer>

</body>
</html>





