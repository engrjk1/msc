var http = require('http')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req,res){
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
            'queryString' : queryStringObject,
            'method' : method,
            'headers':headers,
            'payload' : buffer
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

    });

server.listen(3000,function(){
    console.log("the server is running on port 3000");
})

var handlers = {}
handlers.sample = function(data,callback){
    //callback a http status code, and a payload object
    callback(406,{'name' : 'sample handler'});
};

handlers.notFound = function(data,callback){
    callback(404);
};
var router = {
    'sample' : handlers.sample
}
