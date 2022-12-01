<?php
spl_autoload_register('apiAutoload');

/* Get record(s) and return as array */
function get_records($ids) {
  list($headers, $data, $index) = get_all_records();

  $records = [];
  foreach ($data["data"] as $record) {
    if (!count($ids) || in_array($record['id'], $ids)) {
      $records[] = $record;
    }
  }
  $data["data"] = $records;
  return $data;
}

/* Add record(s) and return all as array */
function add_records($records) {
  list($headers, $data, $index) = get_all_records();

  if (count($records)) {
    $new_records = [];
    foreach ($records as $i => $record) {
      $record["id"] = strval(++$index["index"]);
      $new_records[$record["tempid"]] = $record;
      unset($record["tempid"]);
      unset($record["isNew"]);
      $records[$i] = $record;
    }

    $data["data"] = array_merge($data["data"], $records);
    append_all_records($headers["headers"], $records);
    $data["data"] = $new_records;
  }

  return $data;
}

/* Update record(s) and return all as array */
function update_records($records) {
  list($headers, $data, $index) = get_all_records();

  if (count($records)) {
    $new_records = [];
    foreach ($records as $record) {
      $new_records[$record['id']] = $record;
    }

    function alter(&$item1, $key, $new_records) {
      if (array_key_exists($item1["id"], $new_records)) {
        $item1 = array_merge($item1, $new_records[$item1["id"]]);
      }
    }

    array_walk($data["data"], 'alter', $new_records);
    $data = put_all_records($headers["headers"], $data);
    $data["data"] = $records;
  }
  return $data;
}

/* Delete record(s) */
function delete_records($ids) {
  list($headers, $data, $index) = get_all_records();

  if (!count($ids)) {
    return false;
  }

  $records = [];
  $deleted = [];
  foreach ($data["data"] as $record) {
    if (in_array($record['id'], $ids)) {
      $deleted[] = $record;
    }
    else {
      $records[] = $record;
    }
  }
  put_all_records($headers["headers"], array(
    "data" => $records
  ));
  $data["data"] = $records;

  return $data;
}

/*****************************************
 *           Util Functions               *
 *****************************************/

/* Read the CSV file and return as array */
function get_all_records() {
  $index = 0;

  $rows = array_map('str_getcsv', file(DATA_SOURCE));
  $headers = array_shift($rows);
  $headers_flipped = array_flip($headers);

  $data = array();
  foreach ($rows as $row) {
    $data[] = array_combine($headers, $row);
    $index = max($index, $row[$headers_flipped["id"]]);
  }

  return array(
    compact('headers') ,
    compact('data') ,
    compact('index')
  );
}

/* Write the CSV file and return as array */
function put_all_records($headers, $data) {
  $records = $data["data"];

  $fp = fopen(DATA_SOURCE, 'w');
  fputcsv_custom($fp, (object)$headers);
  foreach ($records as $row) {
    // Use the headers array to make sure every row has all keys so the csv stays aligned
    $row = array_merge(array_fill_keys($headers, null) , $row);
    fputcsv_custom($fp, $row);
  }
  fclose($fp);

  return $data;
}

/* Write the CSV file and return as array */
function append_all_records($headers, $records) {
  $fp = fopen(DATA_SOURCE, 'a');
  foreach ($records as $row) {
    // Use the headers array to make sure every row has all keys so the csv stays aligned
    $row = array_merge(array_fill_keys($headers, null) , $row);
    fputcsv_custom($fp, $row);
  }
  fclose($fp);

  return $records;
}

/* Custom fputcsv that forces enclosure for all fields */
function fputcsv_custom($handle, $fields, $delimiter = ",", $enclosure = '"', $escape_char = "\\") {
  fwrite($handle, implode($delimiter, fputcsv_fmt($fields, $enclosure, $escape_char)) . "\n");
}
function fputcsv_fmt($fields, $enclosure = '"', $escape_char = "\\") {
  $field_arr = [];
  foreach ($fields as $index => $field) {
    $field_arr[$index] = $enclosure . str_replace($enclosure, $escape_char . $enclosure, $field) . $enclosure;
  }
  return $field_arr;
}

/* Automatically load controllers, views and models if they exist */
function apiAutoload($classname) {
  if (preg_match('/[a-zA-Z]+Controller$/', $classname)) {
    include APP_ROOT . '/controllers/' . $classname . '.php';
    return true;
  }
  elseif (preg_match('/[a-zA-Z]+View$/', $classname)) {
    include APP_ROOT . '/views/' . $classname . '.php';
    return true;
  }
  elseif (preg_match('/[a-zA-Z]+Model$/', $classname)) {
    include APP_ROOT . '/models/' . $classname . '.php';
    return true;
  }
}

