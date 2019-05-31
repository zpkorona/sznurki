<?php
if (count($_FILES)) {
  $target_dir = "../upload/";

//  echo "_FILES:<br />";
//  print_r($_FILES);
//  echo "<br />-------------------------------<br />";
  $filesArray = $_FILES[array_keys($_FILES)[0]];
  echo "filesArray = _FILES[array_keys(_FILES)[0]]:<br />";
  print_r($filesArray);
  echo "<br />-------------------------------<br />";
  //filesNum = $_FILES
/*
filesArray:
Array ( [name] => Array ( [0] => mailmail.log
                          [1] => wyslij_list.php
                          [2] => zaladuj-1.php
                          [3] => zaladujFormArray.php )
        [type] => Array ( [0] => application/octet-stream
                          [1] => application/octet-stream
                          [2] => application/octet-stream
                          [3] => application/octet-stream )
        [tmp_name] => Array ( [0] => C:\xampp\tmp\php64D0.tmp
                              [1] => C:\xampp\tmp\php64D1.tmp
                              [2] => C:\xampp\tmp\php64D2.tmp
                              [3] => C:\xampp\tmp\php64D3.tmp ) [error] => Array ( [0] => 0 [1] => 0 [2] => 0 [3] => 0 ) [size] => Array ( [0] => 31134 [1] => 2688 [2] => 664 [3] => 3265 ) )
*/
  foreach ($filesArray['name'] as $fileIndex => $fileName) {
    $target_file = $target_dir . basename($fileName);
    echo "$fileName ===>>>$target_file <br />";
    if (file_exists($target_file)) {
      echo "Plik już istniał. <br />";
    }//if
    if (100000 < $filesArray['size'][$fileIndex]) {
      echo "Duży ten plik. <br />";
    }//if
    else {
      if (move_uploaded_file($filesArray['tmp_name'][$fileIndex], $target_file)) {
        echo "Plik ". basename($fileName). " został załadowany. <br />";
      }
      else {
        echo "Nie udało sie załadować pliku. <br />";
      }
    }//else
    echo "<br />-------------------------------<br />";
  }
}
else {
  echo "Brak plików do załadowania";
}
?>
