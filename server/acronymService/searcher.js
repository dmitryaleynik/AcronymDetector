'use strict'
const REGEXES = require('./regexes');
let lcsAnalyser = require('./lcsAnalyser');
let candidatesAnalyser = require('./candidatesAnalyser');


class AbreviationAndDefCandidate {
  constructor(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex) {
    this.textFragment = textFragment;
    this.shortStartIndex = shortStartIndex;
    this.shortEndIndex = shortEndIndex;
    this.longStartIndex = longStartIndex;
    this.longEndIndex = longEndIndex;
    this.short = this.textFragment.substring(this.shortStartIndex, this.shortEndIndex);
    this.longContext = this.textFragment.substring(this.longStartIndex, this.longEndIndex)
    this.isInitializm;
    this.shortInitialForm;
    this.longInitialForm;
  }

  normalize() {
    this.shortInitialForm = this.short;
    this.longInitialForm = this.longContext;
    this.toLowCase();
    this.replaceSpecialChar();
  }

  toLowCase() {
    this.short = this.short.toLowerCase();
    this.longContext = this.longContext.toLowerCase();
  }

  replaceSpecialChar() {
   this.short = this.short.replace(/[\-\'\.]/g,"");
   this.longContext = this.longContext.replace(/[\-\'\.]/g," ");
  }


  setTypeOFShort() {
    this.isInitializm = this.getIsInitializm();
  }

  getIsInitializm() {
    for(let i = 0; i < this.short.length; i++) {
      if (this.short.charCodeAt(i) < 65 || this.short.charCodeAt(i) > 90) {
        return false;
      }
    }
    return true;
  }
}



function Searcher(rawText) {
  var text = rawText;
  this.search = function () {
    var promises = [];

    REGEXES.forEach(function(data, index, arr) {
      promises.push(new Promise ((resolve, reject) => {
        resolve({
          textFragmentsWithAbrevAndDef: rawText.match(data.regex),
          splitter: data.splitter
        })
      }));
     
    })

    Promise.all(promises)
    .then(results => {
      return highlight(results);
    })
    .then(highlighted => {
      return normalize(highlighted);
    }) 
    .then(abrAndDefContext => {
      return findAllLcsOfAbrAndDef(abrAndDefContext);
    })
    .then(abrAndDefAllLcs => {
      return lcsAnalyser.analyzeLcs(abrAndDefAllLcs);
    })
    .then(candidates => {
      return candidatesAnalyser.analyseCandidates(candidates);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

   function highlight (abbreviationsContexts) {
    var abrAndDefCandidatesWithContext = [];

    if (abbreviationsContexts.length == 0 ) {
      return;
    }
    abbreviationsContexts.forEach( data => {
      if(data.textFragmentsWithAbrevAndDef != null) {
        if (data.splitter != '(s)' && data.splitter != '(l)') {
          var splitter = data.splitter;
          
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {

            var indexOfSplitter = textFragment.indexOf(splitter);
            var shortStartIndex = 0;
            var shortEndIndex = indexOfSplitter - 1;  
            var longStartIndex = indexOfSplitter + splitter.length + 1;
            var longEndIndex = textFragment.length;
            abrAndDefCandidatesWithContext.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
        });
        } else if (data.splitter == '(s)') {
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {
            var indexOfOpenBracket = textFragment.indexOf('(');
            var indexOfCloseBracket = textFragment.indexOf(')');
            var shortStartIndex = indexOfOpenBracket + 1;
            var shortEndIndex = indexOfCloseBracket;
            var longStartIndex = 0;
            var longEndIndex = indexOfOpenBracket - 1;
            abrAndDefCandidatesWithContext.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
          }); 

        }  else if (data.splitter == '(l)') {
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {
            var indexOfOpenBracket = textFragment.indexOf('(');
            var indexOfCloseBracket = textFragment.indexOf(')');
            console.log(indexOfOpenBracket);
            console.log(indexOfCloseBracket);
            var shortStartIndex = 0;
            var shortEndIndex = indexOfOpenBracket - 1;
            var longStartIndex = indexOfOpenBracket + 1;
            var longEndIndex = indexOfCloseBracket - 1;
            abrAndDefCandidatesWithContext.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
          });
        }  
      }
    });
    return abrAndDefCandidatesWithContext;
  }


  function normalize(abrAndDefCandidatesWithContext) {

    var abrAndDefCandidates = [];
    
    abrAndDefCandidatesWithContext.forEach( data => {
      data.setTypeOFShort();
      data.normalize();
      abrAndDefCandidates.push({
        short: data.short,
        longContext: data.longContext,
        isInitializm: data.isInitializm,
        shortInitialForm: data.shortInitialForm ,
        longInitialForm: data.longInitialForm
      });
    });
    console.log(abrAndDefCandidates);
    
    return abrAndDefCandidates;

  }


  function findAllLcsOfAbrAndDef(abrAndDefCandidates) {

    let abrAndDefAllLcs = [];

    abrAndDefCandidates.forEach(data => {{

      let sizeMatrixAndOccurenceMatrix = findLcsSizeTable(data.short, data.longContext);
      let allLcs = findLongestSubs(data.short, data.longContext, sizeMatrixAndOccurenceMatrix.sizeMat, sizeMatrixAndOccurenceMatrix.occurenceMat);
      
      abrAndDefAllLcs.push({
        short: data.short,
        longContext: data.longContext, 
        allLcs: allLcs,
        isInitializm: data.isInitializm,
        shortInitialForm: data.shortInitialForm,
        longInitialForm: data.longInitialForm
      });

    }})
    return abrAndDefAllLcs;
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
        this.numberOfWords;
        this.remoteness;
        this.isInitializm;

      } else {

        this.chars = sub.chars.slice();
        this.indexOfChars = sub.indexOfChars.slice();
        this.defIndex = sub.defIndex;
        this.abrIndex = sub.abrIndex;
        this.numberOfWords;
        this.remoteness;
      }
    }

    setStatistic(longContext, short) {
      let lastCharIndex = this.indexOfChars[this.indexOfChars.length - 1];
      this.setRemoteness();
      this.setNumberOfWords(longContext, this.indexOfChars);
    }
   
    setNumberOfWords(longContext, indexOfChars) {
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
      this.numberOfWords = numberOfWords;
    }

    setRemoteness() {
      this.remoteness = this.indexOfChars.reduce( (sum, currentIndex) => {
        return sum + currentIndex;
      },0);
    }

    buildLongForm(short, longContext) {
      console.log('!!!');
      let lastIndex = this.indexOfChars[this.indexOfChars.length - 1];
      let long = longContext.substring(this.indexOfChars[0], lastIndex);
      console.log(long);
      let i = lastIndex;
      while(longContext.length > i && longContext[i] != ' ') {
        long += longContext[i];
        i++;
      }
      console.log(long);
      return long;
    }
  }



  function findLongestSubs(abr, def, sizeMatrix, notFirstOccurenceMatrix) {
    let stack = [];
    
    let allLongestSubs = [];

    stack.push(new Subsequence(abr.length, def.length));

    do {
      let currentSub =  stack.pop();
      let i = currentSub.abrIndex;
      let j = currentSub.defIndex;
      
      while (i != 0 && j != 0 ) {
      
        if (abr[i - 1] == def[j - 1]) {
          
          if(notFirstOccurenceMatrix[i][j] != 1) {
            
            currentSub.chars.unshift(def[j-1]);
            currentSub.indexOfChars.unshift(j-1); 
            i--;
            j--;
            continue;

          } else {

            let newSub = new Subsequence(currentSub);
            newSub.chars.unshift(def[j-1]);
            newSub.indexOfChars.unshift(j-1);
                          
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
      currentSub.setStatistic(def, abr);
      allLongestSubs.push(currentSub);
     
    } while(stack.length != 0)

    return allLongestSubs;
  } 

}
module.exports = Searcher;