<?php
class Database {
    private $host = "localhost";
    private $dbname = "ganacontrol";
    private $username = "root";
    private $password = "";

    public function conectar() {
        try {
            $conexion = new PDO(
                "mysql:host=$this->host;dbname=$this->dbname;charset=utf8",
                $this->username,
                $this->password
            );
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conexion;
        } catch (PDOException $e) {
            die("Error conexión: " . $e->getMessage());
        }
    }
}
?>


