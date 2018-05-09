const REGEXES = require('./regexes');
function Searcher(rawText) {
  this.text = rawText;

  this.search = function () {

    var abbreviationsContext = [];
    var promises = [];

    REGEXES.forEach(function(data, index, arr) {
      promises.push(new Promise ((resolve, reject) => {
        resolve(rawText.match(data.regex))
      }));
      console.log('after' + data.splitter);
    })
    Promise.all(promises).then(results => {
      console.log('done');
      console.log(results);
    })
  }
}
module.exports = Searcher;