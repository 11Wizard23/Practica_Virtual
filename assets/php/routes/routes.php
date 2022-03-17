<?php
require 'api/api.php';
$rutaArray = $_SERVER['REQUEST_URI'];
$rutaArray = explode('/' , $rutaArray);
$rutaArray = array_filter($rutaArray);  //Me interesa saber el numero 4
$method = $_SERVER['REQUEST_METHOD'];

//Se verifica que haya una ruta

if(!isset($rutaArray[4])){
  $json = array(
    'status' => 404,
    'ok' => false,
    'msg' => 'Not Found'
  );
  echo json_encode($json);
  return;
}

//Verificameos que metodo tiene la peticion y luego que ruta poara hacer correctamente
//  el direccionamiento a las funciones

if($method == 'GET'){
  //Obtener publicaciones
  $rutaArray[4] == 'publicaciones' ? $Api->getPublicaciones() : null;
  //Validar Token
  $rutaArray[4] == 'validtoken' ? $Api->validToken() : null;

}

else if($method == 'POST'){
  //Realizar una publicacion
  $rutaArray[4] == 'publicaciones' ? $Api->postPublicacion() : null;
  //Login Admin
  $rutaArray[4] == 'loginadmin' ? $Api->loginAdmin() : null;
  //Sing Up Admin
  $rutaArray[4] == 'singupadmin' ? $Api->singUpAdmin() : null;



  //Obtener una publicacion
  $rutaArray[4] == 'getpublicacion' ? $Api->getPublicacion() : null;


}

else if($method == 'PUT'){
  
}

else if($method == 'DELETE'){
  
}

