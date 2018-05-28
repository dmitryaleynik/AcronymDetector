'use strict'

let lcsAnalyser = {
  analyzeLcs: function(abrAndDefAllLcs) {
    abrAndDefAllLcs.forEach(data => {
      
      console.log(data.allLcs.length);
     
      data.allLcs = applyMaxSizeRule(data.short, data.allLcs);
      console.log(data.allLcs.length);
      data.allLcs = applyTheFirstLetterRule(data.longContext, data.allLcs);

      


      console.log(data.allLcs.length);
     
      data.allLcs = applyDistanceBetweenNeighbourCharRule(data.longContext, data.allLcs);

      console.log(data.allLcs.length);
     
    //  data.allLcs = applyFirstTwoWordsRule(data.longContext, data.allLcs);
      console.log(data.allLcs);
      console.log(data.allLcs.length);
      console.log('\n');
    });
    console.log('end');
    return abrAndDefAllLcs;
  }
  
}


  function applyTheFirstLetterRule(longContext, allLcs) {

   allLcs = allLcs.filter(lcs => {

    let indexesOfCurrentLcs = lcs.indexOfChars;
    
    for (let i = 0; i < lcs.indexOfChars.length; i++) {
      if(!(isFirstLetter(longContext, lcs.indexOfChars[i])) && !hasNeighbourLetterAsFirst(longContext, indexesOfCurrentLcs, lcs.indexOfChars[i])) {
        return false; 
      }
    }
    return true
   });
   return allLcs;


   function isFirstLetter(longContext, index) {
    if(index == 0 || longContext[index - 1] == ' ') {
      return true;
    }
    return false; 
  }

  function hasNeighbourLetterAsFirst(longContext, indexesOfCurrentLcs, index) {
    while(index != 0 && longContext[index] != ' ') {
      index--;
      if (indexesOfCurrentLcs.indexOf(index) != -1) {
        return true;
      }
    }
    return false;
  }
  }
  

  function applyDistanceBetweenNeighbourCharRule(longContext, allLcs) {
   
    allLcs = allLcs.filter(lcs => {
         if(hasTwoWordsBetweenChar(lcs.indexOfChars, longContext)) {
          return false;
        }
        return true; 
    });
    return allLcs;

    function hasTwoWordsBetweenChar(indexesOfCurrentLcs, longContext) {
      for (let i = 0; i < indexesOfCurrentLcs.length - 1; i++) {
        let currentCharIndex = indexesOfCurrentLcs[i];
        let nextCharIndex = indexesOfCurrentLcs[i + 1];
        let numberOfSpaces = 0;
        do {
          currentCharIndex++;
          if( longContext[currentCharIndex] == ' ') {
            numberOfSpaces++;
          }
          if(numberOfSpaces == 3) {
            return true;
          }
        
        } while(nextCharIndex != currentCharIndex)
      }
      return false;
    }
  }

  function applyMaxSizeRule(short, allLcs) {
    allLcs = allLcs.filter(lcs => {
      if (short.length > lcs.indexOfChars.length) {
        return false;
      }
      return true;
    });
    return allLcs;
  }

  function applyFirstTwoWordsRule(longContext, allLcs) {
    allLcs = allLcs.filter(lcs => {
      if (!hasOccurenceInFirstTwoWords(longContext, lcs.indexOfChars)) {
        return false;
      }
      return true;
    });
    return allLcs;

    function hasOccurenceInFirstTwoWords(longContext, indexOfChars) {
      let numberOfSpaces = 0;
      let indexOfThirdWord = 0;
      while (indexOfThirdWord < longContext.length && numberOfSpaces != 3) {
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
  }

module.exports = lcsAnalyser;