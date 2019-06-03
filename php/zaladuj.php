<?php
$target_dir = "../uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
echo "<br />$target_file <br />";

if (file_exists($target_file)) {
  echo "Plik już istniał. <br />";
}

if (100000 < $_FILES["fileToUpload"]["size"]) {
  echo "Zbyt duży ten plik. <br />";
}
else {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    echo "Plik ". basename( $_FILES["fileToUpload"]["name"]). " został załadowany. <br />";
  } else {
    echo "Nie udało sie załadowac pliku. <br />";
  }
}
?>
