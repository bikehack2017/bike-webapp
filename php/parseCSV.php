<?php

$path = $_REQUEST["path"];


//echo $path;
//echo "\n";

$rides = [];

$files = scandir($path);
$files = array_diff($files, array('.', '..'));

foreach ($files as $fileName) {

  $fileNameFull = $path . $fileName;
  $fileOpen = fopen($fileNameFull,"r");

  $i = 0;
  $ride = [];
  while (($line = fgetcsv($fileOpen)) !== FALSE) {
    if ($i == 0) { //this is the name
      $ride["name"] = $line[0];
      $ride["time"] = [];
      $ride["speed"] = [];
      $ride["elevation"] = [];
      $ride["distance"] = [];
    }
    else if ($i > 1) {
      array_push($ride["time"], $line[0]);
      array_push($ride["speed"], $line[1]);
      array_push($ride["elevation"], $line[2]);
      array_push($ride["distance"], $line[3]);
    }

    $i = $i + 1;

    //print_r($line);

  }
  array_push($rides, $ride);

  fclose($fileOpen);

}

$rides = json_encode($rides);
echo $rides;





?>
