<?php
require_once ("./config/config.php");
require_once ("./util/Request.php");
require_once ("./util/utils.php");

$request = new Request();

// route the request to the proper controller
$controller_name = ucfirst($request->url_elements[1]) . 'Controller';
if (class_exists($controller_name)) {
  $controller = new $controller_name();
  $action_name = strtolower($request->verb) . 'Action';
  $result = $controller->$action_name($request);
}

// send the data to the proper output handler
$view_name = ucfirst($request->format) . 'View';
if (class_exists($view_name)) {
  $view = new $view_name();
  $view->render($result);
}

