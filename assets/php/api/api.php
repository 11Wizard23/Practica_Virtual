<?php
require 'db/conexiondb.php';
require './php-jwt-main/src/JWK.php';
require './php-jwt-main/src/JWT.php';

use Firebase\JWT\JWT;

class Api
{

  public $con;
  public $key = 'VirtualLlantasPrueba';


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

  public function getPublicacion()
  {
    $token = !isset($_SERVER['HTTP_X_TOKEN_LLANTAS']) ? '' : $_SERVER['HTTP_X_TOKEN_LLANTAS'];
    $id = !isset($_POST['id']) ? '' : $_POST['id'];
    try {
      $newDecoded = JWT::decode($token, $this->key, array('HS256'));
      if ($id != '') {
        $query = "SELECT * FROM publicaciones WHERE id = '$id'ORDER BY fecha desc";
        $result = mysqli_query($this->con, $query);

        $json = array();
        $row = mysqli_fetch_array($result);
        $json[] = array(
          'id' => $row['id'],
          'titulo' => $row['titulo'],
          'email' => $row['email'],
          'img' => $row['img'],
          'contenido' => $row['contenido'],
          'fecha' => $row['fecha']

        );

        $jsonResponse = array(
          'status' => 200,
          'ok' => true,
          'auth' => true,

          'publicacion' => $json[0]
        );
        echo json_encode($jsonResponse);
      } else {
        $jsonResponse = array(
          'status' => 500,
          'ok' => false,
          'auth' => true,

          'msg' => 'No data'
        );
        echo json_encode($jsonResponse);
      }
    } catch (Exception $e) {
      $jsonResponse = array(
        'ok' => true,
        'auth' => false,
        'msg' => 'UnAutorized'
      );
      echo json_encode($jsonResponse);
    }
  }

  public function postPublicacion()
  { //Publicar 
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

  public function loginAdmin()
  { //Ingresar administrador
    $email = !isset($_POST['email']) ? '' : $_POST['email'];
    $password = !isset($_POST['password']) ? '' : $_POST['password'];
    $time = time();

    if ($email !=  '' && $password != '') {
      $query = "SELECT * from admins where email = '$email'";
      $result = mysqli_query($this->con, $query);

      if (mysqli_num_rows($result) == 0) {
        $jsonResponse = array(
          'ok' => true,
          'auth' => false,
          'msg' => 'Bad credentials'
        );
        echo json_encode($jsonResponse);  //El correo no existe
        return;
      } else {
        $MyResult = mysqli_fetch_array($result);
        if (password_verify($password, $MyResult['password'])) { //Verificamos la contraseña
          $token = array(
            'iat' => $time, // Tiempo que inició el token
            'exp' => $time + (60 * 60), // Tiempo que expirará el token (+1 hora)
            'data' => [ // información del usuario
              'nombre' => $MyResult['nombre'],
              'email' => $email
            ]
          );
          $jwt = JWT::encode($token, $this->key);
          $jsonResponse = array(
            'ok' => true,
            'auth' => true,
            'token' => $jwt
          );
          echo json_encode($jsonResponse);
        } else {
          $jsonResponse = array(
            'ok' => true,
            'auth' => false,
            'msg' => 'Bad credentials'
          );
          echo json_encode($jsonResponse);  //Contraseña incorrecta
          return;
        }
      }
    }
  }

  public function singUpAdmin()
  { //Registrar administrador
    $nombre = !isset($_POST['nombre']) ? '' : $_POST['nombre'];
    $email = !isset($_POST['email']) ? '' : $_POST['email'];
    $password = !isset($_POST['password']) ? '' : $_POST['password'];
    $criptedPassword = password_hash($password, PASSWORD_DEFAULT, ['cost' => 15]);
    $time = time();

    $consulta = "INSERT into admins (nombre , email , password) 
            values ('$nombre','$email','$criptedPassword')";
    try {
      mysqli_query($this->con, $consulta);
      $token = array(
        'iat' => $time, // Tiempo que inició el token
        'exp' => $time + (60 * 60), // Tiempo que expirará el token (+1 hora)
        'data' => [ // información del usuario
          'nombre' => $nombre,
          'email' => $email
        ]
      );
      $jwt = JWT::encode($token, $this->key);
      $jsonResponse = array(
        'ok' => true,
        'auth' => true,
        'token' => $jwt
      );
      echo json_encode($jsonResponse);
    } catch (Exception $e) {
      $jsonResponse = array(
        'ok' => true,
        'auth' => false,
        'msg' => 'Correo ya registrado'
      );
      echo json_encode($jsonResponse);
    }
  }

  public function validToken()
  { //Validar token
    $token = !isset($_SERVER['HTTP_X_TOKEN_LLANTAS']) ? '' : $_SERVER['HTTP_X_TOKEN_LLANTAS'];
    try {
      $newDecoded = JWT::decode($token, $this->key, array('HS256'));
      $jsonResponse = array(
        'ok' => true,
        'auth' => true,
        'nombre' => $newDecoded->data->nombre,
        'email' => $newDecoded->data->email
      );
      echo json_encode($jsonResponse);
    } catch (Exception $e) {
      $jsonResponse = array(
        'ok' => true,
        'auth' => false,
        'msg' => $e->getMessage()
      );
      echo json_encode($jsonResponse);
    }
  }
}

$Api = new Api();
$Api->con = $con;
