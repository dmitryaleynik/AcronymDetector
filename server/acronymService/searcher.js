const REGEXES = require('./regexes');
function Searcher(rawText) {
  this.text = rawText;

  this.search = function () {

    var abbreviationsContext = [];
    var promises = [];

    REGEXES.forEach(function(regular, index, arr) {
      promises.push(new Promise ((resolve, reject) => {
        resolve(rawText.match(regular))
      }));
      console.log('after' + index);
    })
    Promise.all(promises).then(results => {
      console.log('done');
      console.log(results);
    })
  }
}
module.exports = Searcher;