'use strict'


class AbreviationAndDefCandidate {
  constructor(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex) {
    this.textFragment = textFragment;
    this.shortStartIndex = shortStartIndex;
    this.shortEndIndex = shortEndIndex;
    this.longStartIndex = longStartIndex;
    this.longEndIndex = longEndIndex;
  }
}
const REGEXES = require('./regexes');
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
      return detect();
    }) 
    .catch(error => {
      console.log(error.message);
    })
  }

   function highlight (abbreviationsContexts) {
    var abrAndDefCandidates = [];
    if (abbreviationsContexts.length == 0 ) {
      console.log('in return');
      return;
    }
    abbreviationsContexts.forEach( data => {
      if(data.textFragmentsWithAbrevAndDef != null) {
        if (data.splitter != '(s)' && data.splitter != ('l')) {
          var splitter = data.splitter;
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {

            var indexOfSplitter = textFragment.indexOf(splitter);
            var shortStartIndex = 0;
            var shortEndIndex = indexOfSplitter - 2;  
            var longStartIndex = indexOfSplitter + splitter.length + 1;
            var longEndIndex = textFragment.length - 1;
            abrAndDefCandidates.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
        });
        } else if (data.splitter == '(s)') {
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {
            var indexOfOpenBracket = textFragment.indexOf('(');
            var indexOfCloseBracket = textFragment.indexOf(')');
            var shortStartIndex = indexOfOpenBracket + 1;
            var shortEndIndex = indexOfCloseBracket - 1;
            var longStartIndex = 0;
            var longEndIndex = indexOfOpenBracket - 2;
            abrAndDefCandidates.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
          }); 

        } else if (data.splitter == '(l)') {
          data.textFragmentsWithAbrevAndDef.forEach( textFragment => {
            var indexOfOpenBracket = textFragment.indexOf('(');
            var indexOfCloseBracket = textFragment.indexOf(')');
            var shortStartIndex = textFragment.search(/\w+\d*\w* \(/);
            var shortEndIndex = indexOfOpenBracket - 2;
            var longStartIndex = indexOfOpenBracket + 1;
            var longEndIndex = indexOfCloseBracket - 1;
            abrAndDefCandidates.push(new AbreviationAndDefCandidate(textFragment, shortStartIndex, shortEndIndex, longStartIndex, longEndIndex));
          });
        }
      }
    });
    console.log(abrAndDefCandidates);
  }

  function detect () {
    console.log('in detect');
  }




 
}
module.exports = Searcher;