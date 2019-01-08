<?php
$target_dir = "../uploads/";

print_r($_FILES);
echo "<br />-------------------------------<br />";

foreach ($_FILES as $fileToUpload => $fileArray) {
  print_r($fileArray);
  echo "<br />";
  $target_file = $target_dir . basename($_FILES[$fileToUpload]['name']);
  $uploadOk = 1;
  $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
  echo "<br />$target_file <br />";

  if (file_exists($target_file)) {
    echo "Plik już istniał. <br />";
  }//if
  if (100000 < $_FILES[$fileToUpload]['size']) {
    echo "Zbyt duży ten plik. <br />";
  }//if
  else {
    if (move_uploaded_file($_FILES[$fileToUpload]['tmp_name'], $target_file)) {
      echo "Plik ". basename( $_FILES[$fileToUpload]['name']). " został załadowany. <br />";
    }
    else {
      echo "Nie udało sie załadowac pliku. <br />";
    }
  }//else
  echo "<br />-------------------------------<br />";
}
?>
