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



  function findLcsSizeTable(abr, def) {
    
    var sizeMatrix = []
    var notFirstOccurenceMatrix = [];
    for (let i = 0; i <= abr.length; i++) {
      sizeMatrix[i] = [];
    }

    for (let i = 0; i <= abr.length; i++) {
      notFirstOccurenceMatrix[i] = [];
    }

    for (let i = 0; i <= abr.length; i++) {
      for(let j = 0 ; j <= def.length; j++) {
        notFirstOccurenceMatrix[i][j] = 0;
      }
    }

    for (let i = 0; i <= abr.length; i++) {
      let occurenceOFCharachter = false;
      for (let j = 0; j <= def.length; j++) {


        if (i == 0 || j == 0) {
          sizeMatrix[i][j] = 0;
        }
         else {
          if (abr[i - 1] == def[j - 1]) {
            console.log(occurenceOFCharachter);
            if (occurenceOFCharachter) {
              notFirstOccurenceMatrix[i][j] = 1;
            }
            sizeMatrix[i][j] = 1 + sizeMatrix[i-1][j-1];
            occurenceOFCharachter = true;
          }
          else {
            sizeMatrix[i][j] = Math.max(sizeMatrix[i-1][j], sizeMatrix[i][j-1]);
          }
        }
      }
    }

    console.log(sizeMatrix);

    console.log('\n');
    console.log(notFirstOccurenceMatrix);
    console.log(notFirstOccurenceMatrix[2][5]);

    return {
      sizeMat: sizeMatrix,
      occurenceMat: notFirstOccurenceMatrix
    };
  }



  class Subsequence {

    constructor(sub, abrIndex, defIndex) {

      if(arguments.length == 2) {

        this.abrIndex = arguments[0];
        this.defIndex = arguments[1];
        this.chars = [];
        this.indexOfChars = [];

      } else {

        this.chars = sub.chars.slice();
        this.indexOfChars = sub.indexOfChars.slice();
        this.defIndex = sub.defIndex;
        this.abrIndex = sub.abrIndex;
      }
      
    }
  }



  function findLongestSubs(abr, def, sizeMatrix, notFirstOccurenceMatrix) {
   
    let stack = [];
    
    console.log(sizeMatrix);
    console.log(notFirstOccurenceMatrix);    

    let allLongestSubs = [];

    stack.push(new Subsequence(abr.length, def.length));

    do {
      currentSub =  stack.pop();
      let i = currentSub.abrIndex;
      let j = currentSub.defIndex;
      
      while (i != 0 && j != 0 ) {
      
        if (abr[i - 1] == def[j - 1]) {
          
          if(notFirstOccurenceMatrix[i][j] != 1) {
            
            currentSub.chars.unshift(def[j-1]);
            currentSub.indexOfChars.unshift(j); 
            i--;
            j--;
            
            continue;

          } else {


            let newSub = new Subsequence(currentSub);
            newSub.chars.unshift(def[j-1]);
            newSub.indexOfChars.unshift(j);
                          
            newSub.abrIndex = i - 1;
            newSub.defIndex = j - 1;
            
            stack.push(newSub);
          }
        } 

          if (sizeMatrix[i-1][j] > sizeMatrix[i][j-1]) {
            i--;  
          }
          else {
            j--;   
          }
        
      }
      allLongestSubs.push(currentSub);
     
    } while(stack.length != 0)

    

    allLongestSubs.forEach(data => {
      console.log(data);
    })


  }


     let sizeMatrixAndOccurenceMatrix = findLcsSizeTable('t rex', 'like others tyrannosaurus rex');
     var res =    findLongestSubs('trex', 'like others tyrannosaurus rex', sizeMatrixAndOccurenceMatrix.sizeMat, sizeMatrixAndOccurenceMatrix.occurenceMat);
     console.log(res);

    


    function hasOccurenceInFirstTwoWords(longContext, indexOfChars) {
      let numberOfSpaces = 0;
      let indexOfThirdWord = 0;
      while (numberOfSpaces != 3) {
       if (longContext[indexOfThirdWord] == ' ') {
         numberOfSpaces++;
       }
       indexOfThirdWord++;
      }
      if (indexOfChars[0] > indexOfThirdWord) {
        return false;
      } 
      return true;
    }
  

    //console.log(hasOccurenceInFirstTwoWords('Dima Dima lol pep', [20,20,20]));

    function getNumberOfWords(longContext, indexOfChars) {
      let numberOfWords = 1;
      for (let i = 0; i < indexOfChars[indexOfChars.length - 1]; i++) {
        if (longContext[i] == ' ') {
          numberOfWords++;
        }
      }
      return numberOfWords;
    }


    function setRemoteness(indexOfChars) {
      return indexOfChars.reduce((sum, currentIndex) => {
        return sum + currentIndex;
      },0);
    }









    function setNumberOfWords(longContext, indexOfChars) {
      let numberOfWords = 1;
      
      let indexInWord = indexOfChars[0];
      while (indexInWord < longContext.length && longContext[indexInWord] != ' ') {
        indexInWord++;
      }
      
      for (let i = 0; i < indexOfChars.length; i++) {
        if (indexInWord > indexOfChars[i]) {
          continue;
        } else {
          indexInWord = indexOfChars[i];
        } 
        while (indexInWord < longContext.length && longContext[indexInWord] != ' ') {
          indexInWord++;
        }
        numberOfWords++;
      }
      console.log(numberOfWords);
      this.numberOfWords = numberOfWords;
    }



    function isInitializm(short) {
      for(let i = 0; i < short.length; i++) {
        if (short.charCodeAt(i) < 65 || short.charCodeAt(i) > 90) {
          return false;
        }
      }
      return true;
    }

    
    console.log(isInitializm('DDd'));

    console.log('dsd   ds '.replace('   ', ''));


})();
