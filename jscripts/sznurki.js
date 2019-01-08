var aplikacja = angular.module('ngApp', []); //rejestracja aplikacji

//aplikacja.config (function($routeProvider) {});

//aplikacja.run (function ($rootScope) {to na przykład inicjalizacja zmiennych});
var fd;

function setCookie (cname, cvalue) {
  var now = new Date();
  now.setTime(now.getTime() + (8*60*60*1000));//8 godzin
  document.cookie = cname + "=" + cvalue + "; expires=" + now.toUTCString();
}//function setCookie

function checkCookie (cname) {
  var cookies = decodeURIComponent(document.cookie).split(';');
  var cookie = "";
  var cvalue = "";
  for (var i = 0; i < cookies.length && cvalue == ""; i++) {
    cookie = cookies[i].replace(/^ +/g, '');
    if (cookie.indexOf(cname) == 0) {
      cvalue = cookie.substring(cname.length + 1, cookie.length);
    }//if
  }//while
  return cvalue;
}//function checkCookie

function removeCookie (cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}//function removeCookie



aplikacja.controller('ngCtrl', function($scope, $http, $timeout) {
  $scope.linkTable = [];
  $scope.sender    = "";
  $scope.response  = "";
  $scope.backup    = "";
  $scope.subject   = "";
  $scope.respIndex = 0;
  if ($scope.linkTable.length) {
    $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
    $scope.linka      = $scope.linkTable[$scope.respIndex].link;
  }
  else {
    $scope.respondent = "ADRES RESPONDENTA";
    $scope.linka      = "LINK DO BADANIA DLA REPONDENTA";
  }
  $scope.beginning  = "";
  $scope.ending     = "";
  $scope.certificate = "";
  $scope.dropbox    = "";
  $scope.linkoLimit = 1000;

  $http.get("./datafiles/sznurki_init_file.json")
       .then(function (response) {
               $scope.sender    = (response.data.hasOwnProperty("sender"))?    response.data.sender : "blabla";
               $scope.response  = (response.data.hasOwnProperty("response"))?  response.data.response : "";
               $scope.backup    = (response.data.hasOwnProperty("backup"))?    response.data.backup : "";
               $scope.subject   = (response.data.hasOwnProperty("subject"))?   response.data.subject : "";
               $scope.beginning = (response.data.hasOwnProperty("beginning"))? response.data.beginning.join(" ") : "";
               $scope.ending    = (response.data.hasOwnProperty("ending"))?    response.data.ending.join(" ") : "";
             },
             function (response) {
               $scope.sender    = "";
               $scope.response  = "";
               $scope.backup    = "";
               $scope.subject   = "";
               $scope.beginning = "";
               $scope.ending    = "";
               //$scope.ending+= response.statusText;
             });

  $scope.firstResp = function () {
    $scope.respIndex = 0;
    if ($scope.linkTable.length) {
      $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
      $scope.linka = $scope.linkTable[$scope.respIndex].link;
    }
  };

  $scope.prevResp = function () {
    if ($scope.respIndex) {
      $scope.respIndex--;
      $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
      $scope.linka = $scope.linkTable[$scope.respIndex].link;
    }
  };

  $scope.nextResp = function () {
    if ($scope.respIndex < $scope.linkTable.length - 1) {
      $scope.respIndex++;
      $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
      $scope.linka = $scope.linkTable[$scope.respIndex].link;
    }
  };

  $scope.lastResp = function () {
    if ($scope.respIndex < $scope.linkTable.length - 1) {
      $scope.respIndex = $scope.linkTable.length - 1;
      $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
      $scope.linka = $scope.linkTable[$scope.respIndex].link;
    }
  };

  $scope.makeLinkTable = function (text) {
    var startPos = 0,
        endPos   = 0,
        newrow;
    while ($scope.linkTable.length) {
      delete $scope.linkTable[$scope.linkTable.length - 1];
      $scope.linkTable.pop();
    }//while
    $scope.respIndex = 0;
    $scope.respondent = "";
    $scope.linka = "";
    //$scope.ending = "makeLinkTable.length=" + $scope.linkTable.length + "\n";
    while (startPos < text.length) {
      endPos = text.indexOf("\t", startPos);
      if (endPos != -1) {
        resp = text.substring(startPos, endPos);
        //$scope.ending += startPos + "," + endPos + "=>" + resp + "; ";
        startPos = endPos + 1;
        endPos = text.indexOf("\n", startPos);
        if (endPos == -1)
          endPos = text.length;
        link = text.substring(startPos, endPos);
        //$scope.ending += startPos + "," + endPos + "=>" + link + "\n";
        newrow = {resp: resp, link: link};
        $scope.linkTable.push(newrow);
        startPos = endPos + 1;
      }//if
      else
        startPos = text.length;
    }//while
    $scope.firstResp();
    //$scope.ending += "linkTable.length=" + $scope.linkTable.length + "\n";
  };

  $scope.readFileIntoLinkTable = function () {
    //$scope.ending = "readFile::";
    if (document.getElementById("link-file").files.length && window.File && window.FileReader && window.FileList && window.Blob) {
      document.body.style.cursor = "progress";
      var fileToUpload = document.getElementById("link-file").files[0];
      var fileReader = new FileReader();
      fileReader.onload = function(event) {
          $scope.makeLinkTable(event.target.result.replace(/ /g, "").replace(/\n+/g, "\n"));
        };
      fileReader.readAsText(fileToUpload);
      //a tu cichcem na serwer
        var formData = new FormData();
        formData.append('fileToUpload', fileToUpload);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./phpscripts/zaladujFormData.php", true);
        xhr.send(formData);
        //document.getElementById("link-file-info").innerHTML = xhr.responseText;
      //a to by angular się obudził
      $timeout(function() {
          $scope.firstResp();
          document.body.style.cursor = "auto";
        },
        100);
    }
  };
/*
  $scope.readFileIntoLinkTable = function () {
    //$scope.ending = "readFile::";
    if (document.getElementById("link-file").files.length && window.FormData) {
      document.body.style.cursor = "progress";
      var fileToUpload = document.getElementById("link-file").files[0];
      var formData = new FormData();
      var linkFileInfo = document.getElementById("link-file-info");
      formData.append('fileToUpload', fileToUpload);
      linkFileInfo.innerHTML = "<em>plik '" + fileToUpload.name + "'</em>";
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "./phpscripts/zaladuj.php", true);
      xhr.send(formData);
  //      $http.post("./phpscripts/zaladuj.php", formData)
  //           .then(function(response){linkFileInfo.innerHTML += "<em> - </em>";},
  //                 function(response){linkFileInfo.innerHTML += "<strong> ??? </strong>";});
      linkFileInfo.innerHTML += " <em>wczytywanie</em>";
      $timeout(function () {
                 $http.get("./uploads/" + fileToUpload.name)
                      .then(function (response) {//sukces
                              $scope.makeLinkTable(response.data.replace(/ /g, "").replace(/\n+/g, "\n"));
                              linkFileInfo.innerHTML = "<em>plik '" + fileToUpload.name + "' wczytany</em>";
                              document.body.style.cursor = "auto";
                              document.getElementById("link-file").value = "";
                              //document.uploader.reset();
                            },
                            function (response) {//bląd
                              linkFileInfo.innerHTML += "<strong>" + response.statusText + "</strong>";
                              document.body.style.cursor = "auto";
                            });
               },
               1000);
    }
  };

  $scope.readFileIntoLinkTable = function () {
    //$scope.ending = "readFile::";
    if (document.getElementById("link-file").files.length) {
      document.body.style.cursor = "progress";
      document.uploader.submit();
      linkFileName = document.getElementById("link-file").files[0].name;
      document.getElementById("link-file-info").innerHTML = "<em>wczytywanie</em>";
      $timeout(function () {
                 $http.get("./uploads/" + linkFileName)
                      .then(function (response) {//sukces
                              $scope.makeLinkTable(response.data.replace(/ /g, "").replace(/\n+/g, "\n"));
                              document.getElementById("link-file-info").innerHTML = "<em>wczytany</em>";
                              document.body.style.cursor = "auto";
                              document.uploader.reset();
                            },
                            function (response) {//bląd
                              document.getElementById("link-file-info").innerHTML = "<strong>" + response.statusText + "</strong>";
                              document.body.style.cursor = "auto";
                            });
               },
               1);
    }
  };
*/

  $scope.readDropboxIntoLinkTable = function () {
    //$scope.ending = "readDropbox\n";
    if (20 < $scope.dropbox.length) {
      $scope.dropbox = $scope.dropbox.replace(/ /g, "").replace(/\n+/g, "\n");
      $scope.makeLinkTable($scope.dropbox);
    }
  };//$scope.readDropboxIntoLinkTable = function

  $scope.showMail = function () {
    document.getElementById('cover-banner-sent').style.display = "none";
    document.getElementById('cover-banner-letter').style.display = "block";
    document.getElementById('cover-banner-letter').innerHTML = ($scope.beginning + "\n\n" +
                                                                "<a href=" + $scope.linka + ">" + $scope.linka + "</a>\n\n" +
                                                                $scope.ending).replace(/\n/g,"<br>");
    document.getElementById('cover-banner').style.display = "block";
  };//$scope.showMail = function ()

  $scope.sendMail = function (sender, response, backup, respondent, subject, message, certificate) {
    $http({
      method: "POST",
      url: "./phpscripts/wyslij_list.php",
      data: "sender="      + sender + "&" +
            "response="    + response + "&" +
            "backup="      + backup + "&" +
            "respondent="  + respondent + "&" +
            "subject="     + subject + "&" +
            "message="     + message.replace(/\n/g,"<br>") + "&" +
            "certificate=" + certificate,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
                document.getElementById('cover-banner-sent').innerHTML += response.data;//(response.data).replace(/\n/g,"<br>");
                if (response.data == "List wysłany") {
                  setCookie("certificate", $scope.certificate);
                }//if
                else {
                  removeCookie("certificate");
                  //$scope.certificate = "";
                }
              },
              function(response) {
                document.getElementById('cover-banner-sent').innerHTML += response.statusText;
              });
  };//$scope.sendMail = function

  $scope.sendCurrMail = function () {
//    document.getElementById('cover-banner-sent').innerHTML = "<strong>LISTA WYSYŁANYCH LISTÓW:</strong><br />";
    $scope.certificate = checkCookie("certificate");
    document.getElementById('cover-banner-sent').style.display = "none";
    document.getElementById('cover-banner-letter').style.display = "none";
    document.getElementById('cover-banner').style.display = "block";
    document.getElementById('certificate-box').style.display = "inline-block";
    document.getElementById('certificateCurr-button').style.display = "inline";
    document.getElementById('certificateAll-button').style.display = "none";
    if ($scope.certificate != "") {
      $scope.applyCertificateCurr();
    }//if
  };//$scope.sendCurrMail = function

  $scope.applyCertificateCurr = function () {
    document.getElementById('certificate-box').style.display = "none";
    document.getElementById('cover-banner-sent').style.display = "block";
    document.getElementById('cover-banner').style.cursor = "progress";
    document.getElementById('cover-banner-sent').innerHTML += "<br>" + ($scope.respIndex+1) + ". do: " + $scope.respondent + " &lt;" + $scope.linka + "&gt; :: ";
    $scope.sendMail($scope.sender, $scope.response, $scope.backup, $scope.respondent,
                    $scope.subject,
                    $scope.beginning + "\n\n" +
                      "<a href=" + $scope.linka + ">" + $scope.linka + "</a>\n\n" +
//                      $scope.linka + "\n\n" +
                      $scope.ending,
                    $scope.certificate);
    $timeout(function () {
               document.getElementById('cover-banner').style.cursor = "auto";
             },
             2000);
  };//$scope.applyCertificateCurr = function

  $scope.sendMailRecursive = function () {
    if ($scope.respIndex < $scope.linkTable.length) {
      $scope.respondent = $scope.linkTable[$scope.respIndex].resp;
      $scope.linka = $scope.linkTable[$scope.respIndex].link;
      document.getElementById('cover-banner-sent').innerHTML += "<br>" + ($scope.respIndex+1) + ". do: " + $scope.respondent + " &lt;" + $scope.linka + "&gt; :: ";
      $scope.sendMail($scope.sender, $scope.response, $scope.backup, $scope.respondent,
                      $scope.subject,
                      $scope.beginning + "\n\n" +
                          "<a href=" + $scope.linka + ">" + $scope.linka + "</a>\n\n" +
//                        $scope.linka + "\n\n" +
                        $scope.ending,
                      $scope.certificate);
      $scope.respIndex++;
      $timeout($scope.sendMailRecursive, 3000);
    }
    else {
      $scope.respIndex = $scope.linkTable.length - 1;
      document.getElementById('cover-banner').style.cursor = "auto";
    }
  };//$scope.sendMailRecursive = function

  $scope.sendAllMails = function () {
//    document.getElementById('cover-banner-sent').innerHTML = "<strong>LISTA WYSYŁANYCH LISTÓW:</strong><br />";
    $scope.certificate = checkCookie("certificate");
    document.getElementById('cover-banner-sent').style.display = "none";
    document.getElementById('cover-banner-letter').style.display = "none";
    document.getElementById('cover-banner').style.display = "block";
    document.getElementById('certificate-box').style.display = "inline-block";
    document.getElementById('certificateCurr-button').style.display = "none";
    document.getElementById('certificateAll-button').style.display = "inline";
    if ($scope.certificate != "") {
      $scope.applyCertificateAll();
    }//if
  };//$scope.sendAllMails function

  $scope.applyCertificateAll = function () {
    document.getElementById('certificate-box').style.display = "none";
    document.getElementById('cover-banner-sent').style.display = "block";
    document.getElementById('cover-banner').style.cursor = "progress";
    document.getElementById('cover-banner-sent').innerHTML += "<br /><br /><em>Wysyłka wszystkich linków</em>";
    $scope.firstResp();
    $scope.sendMailRecursive ();
  };//$scope.applyCertificateAll function
});
