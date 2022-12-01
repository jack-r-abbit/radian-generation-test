<?php
class Request {
  public $url_elements;
  public $verb;
  public $parameters;
  public $payload;
  public $content_type;

  public function __construct() {
    $this->verb = $_SERVER['REQUEST_METHOD'];
    $this->url_elements = explode('/', $_SERVER['PATH_INFO']);
    $this->parseIncomingParams();

    // initialise json as default format
    $this->format = 'json';
    if (isset($this->parameters['format'])) {
      $this->format = $this->parameters['format'];
    }
    return true;
  }

  public function parseIncomingParams() {
    $parameters = array();
    $payload = array();

    // pull the GET vars
    if (isset($_SERVER['QUERY_STRING'])) {
      parse_str($_SERVER['QUERY_STRING'], $parameters);
    }

    // parse the PUT/POST body payload
    $body = file_get_contents("php://input");
    $content_type = false;
    if (isset($_SERVER['CONTENT_TYPE'])) {
      $content_type = $_SERVER['CONTENT_TYPE'];
    }

    switch ($content_type) {
      case "application/json":
      case "application/json; charset=utf8":
        $body_params = json_decode($body);
        if ($body_params) {
          foreach ($body_params as $param_name => $param_value) {
            $payload[$param_name] = $param_value;
          }
        }
        $this->format = "json";
      break;
      case "application/x-www-form-urlencoded":
        parse_str($body, $postvars);
        foreach ($postvars as $field => $value) {
          $payload[$field] = $value;

        }
        $this->format = "html";
      break;
      default:
        // we could parse other supported formats here
        
      break;
    }
    $this->parameters = $parameters;
    $this->payload = $payload;
    $this->content_type = $content_type;
  }
}

