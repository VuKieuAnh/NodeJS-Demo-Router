var http = require('http');
var url = require('url');
let fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

let server = http.createServer(function (req, res) {
    //get url and parse
    var parseUrl = url.parse(req.url, true);
    //
    // //get the path
    var path = parseUrl.pathname;
    var trimPath = path.replace(/^\/+|\/+$/g, '');

    var method = req.method.toLowerCase();


    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function (end) {

        if(method=='get'){
            var chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
            chosenHandler(req, res);
        }
        else{
            console.log("method post");
            var decoder = new StringDecoder('utf-8');
            var buffer = '';
            req.on('data', function (data) {
                buffer += decoder.write(data);
            });
            req.on('end', function (end) {
                buffer += decoder.end();
                console.log("Co payloads "+buffer);
            });
            var chosenHandler = router.login;
            chosenHandler(req, res);
        }

    });
});


server.listen(3000, function () {
    console.log('server running at localhost:3000 ')
});

var handlers = {};
//sample handlers
handlers.loginform = function (rep, res) {
    fs.readFile('./view/login.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
};
// //not found sample
handlers.home = function (rep, res) {
    fs.readFile('./view/home.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
};

// //not found sample
handlers.notFound = function (rep, res) {
    fs.readFile('./view/notfound.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
};

handlers.login = function (req, res){
    //get url and parse
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function (end) {
        buffer += decoder.end();
        console.log("Co payloads "+buffer);
    });
    fs.readFile('./view/done.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}
//definer the request router
var router = {
    'home': handlers.home,
    'loginForm': handlers.loginform,
    'login':handlers.login
}


