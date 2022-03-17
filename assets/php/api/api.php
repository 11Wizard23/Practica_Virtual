<?php
require 'db/conexiondb.php';

class Api
{

  public $con;

  public function getPublicaciones()
  { // Obtener las publicaciones que estan en la base de datos
    $query = "SELECT * FROM publicaciones ORDER BY fecha desc";
    $result = mysqli_query($this->con, $query);

    $json = array();
    while ($row = mysqli_fetch_array($result)) {
      $json[] = array(
        'id' => $row['id'],
        'titulo' => $row['titulo'],
        'email' => $row['email'],
        'img' => $row['img'],
        'contenido' => $row['contenido'],
        'fecha' => $row['fecha']

      );
    }
    $jsonResponse = array(
      'status' => 200,
      'ok' => true,
      'publicaciones' => $json
    );
    echo json_encode($jsonResponse);
  }

  public function postPublicacion()
  {
    $titulo = !isset($_POST['titulo']) ? '' : $_POST['titulo'];
    $email = !isset($_POST['email']) ? '' : $_POST['email'];
    $img = !isset($_FILES['img']) ? '' : $_FILES['img']; //File type
    $contenido = !isset($_POST['contenido']) ? '' : $_POST['contenido'];

    if ($img != '') {
      $imgName = $_FILES['img']['name'];
      $imgSave = $_FILES['img']['tmp_name'];
      $hora  = date('H.i.s', time());
      $url =  $imgName . date("y.m.d.") . $hora . ".jpg";


      if (move_uploaded_file($imgSave, '../img/' . $url)) {
        $img = $url;
      } else {
        $jsonResponse = array(
          'status' => 500,
          'ok' => false,
          'msg' => 'Internal Error'
        );
        echo json_encode($jsonResponse);
        return;
      }
    }


    $query = "INSERT INTO publicaciones (titulo , email, img , contenido ) values ('$titulo' , '$email' , '$img' , '$contenido')";
    $result = mysqli_query($this->con, $query);
    if (!$result) {
      $jsonResponse = array(
        'status' => 500,
        'ok' => false,
        'msg' => mysqli_error($this->con)
      );
      echo json_encode($jsonResponse);
      return;
    }

    $jsonResponse = array(
      'status' => 200,
      'ok' => true,
      'titulo' => $img
    );
    echo json_encode($jsonResponse);
  }
}

$Api = new Api();
$Api->con = $con;
