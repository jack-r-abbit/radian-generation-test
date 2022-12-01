<?php
class BaseController {

  // Need to handle OPTION requests for when json is sent
  public function optionsAction($request) {
    return true;
  }

}

