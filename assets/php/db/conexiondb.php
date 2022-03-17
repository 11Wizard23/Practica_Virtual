<?php
class dataBase {
    public $user="root";
    public $pass="";
    public $server="localhost";
    public $db="prueba";
    public $con;

    function connect () {
            $this->con= new mysqli($this->server,$this->user,$this->pass,$this->db);
            if ($this->con->connect_errno) {
                die("Fallo".$this->con->connect_errno);
            }
            return $this->con;
    }
}

$DB = new dataBase();
$con = $DB->connect(); //Nos conectamos con la base de datos
//Esta abse de datos será usada por cualquier metodo que lo requiera

