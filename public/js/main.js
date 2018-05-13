(function (){

  var textarea = document.getElementsByTagName('textarea')[0];

  var okButton = document.getElementsByClassName('okBut')[0];
  okButton.onclick = function () {
  var rawText = textarea.value.trim();

    if (rawText) {
      var xhttp = new XMLHttpRequest();
      xhttp.open('POST', 'http://localhost:8081/', true);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({text:rawText }));
      xhttp.onload = function (res) {
        if (this.status == 200) {
          alert('well done');        
        } else {
          alert('error')
        }
    }
    } else {
        alert('type something');
    }
    }

  var clearButton = document.getElementsByClassName('clearBut')[0];
  clearButton.onclick = function () {
   textarea.value = ''; 
  }

  let regular = /(\s*\w+\d*\w*\s*){2} an acronym for [^!^?^\.]+/g;
  let str = 'BSu is an acronym for for Belarussian State UNiversity is the biggest university in Belarus.';
  alert(str.match(regular));

  

})();
