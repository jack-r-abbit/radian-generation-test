<?php
class JsonView extends BaseView {
  public function render($content) {
    parent::render($content);
    header('Content-Type: application/json; charset=utf8');
    echo json_encode($content);
    return true;
  }
}

