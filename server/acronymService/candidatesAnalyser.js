'use strict'

class Abbreviation {
  constructor(long, short) {
    this.long = long;
    this.short = short;
  }
}

let candidatesAnalyser = {
  analyseCandidates: function(abrAndDefAllLcs) {
    let abbreviations = [];  

    abrAndDefAllLcs.forEach(data => {
      if (data.allLcs.length != 0) { 
        if (data.isInitializm) {
          data = analyseInitializm(data);
        }
        data = analyseRemoteness(data);
        console.log(data);
        let long = data.allLcs[0].buildLongForm(data.shortInitialForm, data.longInitialForm);
        abbreviations.push(new Abbreviation(long, data.shortInitialForm));
    }
    });
    console.log(abbreviations);
    return abbreviations;
  }
}

function analyseInitializm(initializm) {
  let maxNumberOfWords = getMaxNumberOfWords(initializm);
  initializm.allLcs = initializm.allLcs.filter( lcs => {
      return lcs.numberOfWords == maxNumberOfWords;
       
  })
  return initializm; 
}

function getMaxNumberOfWords(initializm) {
  let maxNumberOfWords = initializm.allLcs[0].numberOfWords;
  initializm.allLcs.forEach(lcs => {
    if(maxNumberOfWords < lcs.numberOfWords) {
      maxNumberOfWords = lcs.numberOfWords;    
    }
  });
  return maxNumberOfWords;
}

function analyseRemoteness(initializm) {
  let minRemote = getMinRemote(initializm);
  initializm.allLcs = initializm.allLcs.filter( lcs => {
    return lcs.remoteness == minRemote;
     
})
return initializm;      
}

function getMinRemote(initializm) {
    let minRemote = initializm.allLcs[0].remoteness;
    initializm.allLcs.forEach(lcs => {
      if(minRemote > lcs.remoteness) {
        minRemote = lcs.remoteness;    
      }
    });
    return minRemote;
}

module.exports = candidatesAnalyser;