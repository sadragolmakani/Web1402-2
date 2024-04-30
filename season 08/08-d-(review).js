let http = require('http');
let port = 80;
let server = http.createServer(requestHandler);
server.listen(port);
console.log("Server is running on port:" + port);

let httpControllers = require('./httpControllers');
let commandlineControllers = require('./commandlineControllers');
        
function requestHandler(request, response){
    console.log('request:', request.url);
    command = request.url.split('/')[1];

    // if(command === 'page1'){
    //     response.writeHead(200, { 'Content-Type': 'text/plain'});
    //     response.write('this is page1');
    //     response.end();
    // }
    // if(command === 'page2'){
    //     httpControllers.text(request, response);
    // }
    // if(command === 'page3'){
    //     httpControllers.textFile(request, response);
    // }
    // if(command === 'create'){ 
    //     httpControllers.createFile(request, response);
    // }


    let commands = {
        'favicon.ico':function(){

        },
        page1: function(){
            response.writeHead(200, { 'Content-Type': 'text/plain'});
            response.write('this is page1');
            response.end();
        },
        page2: function(){
            httpControllers.text(request, response);
        },
        page3: function(){
            httpControllers.textFile(request, response);
        },
        create: function(){
            httpControllers.createFile(request, response);
        },
        copy: function(){
            httpControllers.copyFile(request, response);
        }
    }

    commands[command]();
}

if(process.argv[2]){
    let command = process.argv[2];

    let commands = {
        page1: function(){
            commandlineControllers.text();
        },
        create: function(){
            let name = process.argv[3];
            let body = process.argv[4];
            commandlineControllers.create(name, body);
        }
    }

    commands[command]();
}