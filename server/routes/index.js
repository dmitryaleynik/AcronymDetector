var express = require('express');
var fs = require('fs');

var app = express();
var router = express.Router();

router.get('/', function (req, res) {
  fs.readFile('../public/index.html', function (err, data) {
      if (err) {
          console.log(err);
          res.writeHead(404, {'Content-Type': 'text/html'});
      } else {
        res.writeHead(200, {'Content-Type': 'text/html' });
        res.write(data.toString());
      }
      res.end();
  })
})
module.exports = router;