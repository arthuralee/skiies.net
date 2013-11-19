var express = require('express');
var app = express();

var redirectWWW = function(req, res, next) {
  if (req.headers.host == "www.skiies.net") {
    res.writeHead(301, {"Location": "http://skiies.net"});
    res.end();
  } else {
    next();
  }
}

app.configure(function() {
  app.use(express.bodyParser());
  //app.use(redirectWWW);
  app.use(express.staticCache());
  app.use(express.compress());
  app.use(express.static(__dirname + '/static', {maxAge: 86400000}));
  app.use(app.router);
});

// 404 - serve index file
app.get("/*", function(req, res) {
  res.sendfile(__dirname + "/static/index.html");
});

app.listen(8000);
