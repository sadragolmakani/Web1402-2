let http = require('http');
let port = 80;


let server = http.createServer(function(request, response){

    console.log('request.method', request.method);
    console.log('request.url', request.url);

    console.log('request recieved');

    response.writeHead(200, { 'Content-Type': 'text/plain' });

    response.write("this is a test!");

    response.end();

});


server.listen(port);
console.log("Server is running on port:" + port)
