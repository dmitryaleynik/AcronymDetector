const REGEXES = require('./regexes');
function Searcher(rawText) {
  console.log('in Searcher constractor' + rawText);

  this.text = rawText;

  this.search = function () {
    console.log(REGEXES);
    
  }
}
module.exports = Searcher;