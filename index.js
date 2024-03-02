var http = require('http');
var https = require ('https');
var url = require('url');
var config = require('./lib/config');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var _data = require('./lib/data');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

//Testing 
//@TODD delete this
_data.delete('test','newFile',function(err){
    console.log('this was the erro',err);
});

//instantiating HTTP Server 
var httpServer = http.createServer(function(req,res){
        unifiedServer(req,res);
    });



httpServer.listen(config.httpPort,function(){
    console.log("the server is running on port: "+config.httpPort+" in " +config.envName +"mode");
})


//instantiate the https server 
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort,function(){
    console.log("the server is running on port: "+config.httpsPort+" in " +config.envName +"mode");
})

//all the server logice for both the http and htptps server 
 var unifiedServer = function(req,res){
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    var queryStringObject = parsedUrl.query;
    var method = req.method.toLocaleLowerCase();

    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer +=decoder.end();

        //chose the handler this request should go. 

        var chooosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        //construct the data objec to send to handlers

        var data = {
            'trimmedPath':trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers':headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };
        // route the request to the handler specified in the router

        chooosenHandler(data,function(statusCode,payload){
            //use the status code called back by the handler or default to 200

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            //convert the paylaod to a string

            var paylaodString = JSON.stringify(payload);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(paylaodString);
            console.log('Returning this response: ',statusCode, paylaodString);
    
        });
    });
};

var router = {
    'ping' : handlers.ping,
    'users' : handlers.users
}