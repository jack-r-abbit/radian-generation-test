<?php
class ProductsController extends BaseController {

  public function getAction($request) {
    $ids = (isset($request->url_elements[2]) && strlen($request->url_elements[2])) ? explode(',', $request->url_elements[2]) : [];
    $data = get_records($ids);
    return $data;
  }

  public function postAction($request) {
    $data = NULL;
    switch ($request->payload['action']) {
      case "add":
        $request->payload['products'] = isset($request->payload['products']) ? $request->payload['products'] : [];

        $records = [];
        foreach ($request->payload['products'] as $record) {
          $records[] = (array)$record;
        }
        $data = add_records($records);
      break;
      case "delete":
        $request->payload['ids'] = isset($request->payload['ids']) ? $request->payload['ids'] : [];

        $data = delete_records($request->payload['ids']);
      break;
      case "update":
        $request->payload['products'] = isset($request->payload['products']) ? $request->payload['products'] : [];

        $records = [];
        foreach ($request->payload['products'] as $record) {
          $records[] = (array)$record;
        }

        $data = update_records($records);
      break;
    }
    return $data;
  }
}

