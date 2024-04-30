//node .\03-f.js create x.txt salamSALAMsalam
//node .\03-f.js append x.txt salamSALAMsalam
//node .\03-f.js delete x.txt
//node .\03-f.js delete myDirName
//node .\03-f.js copy x.txt y.txt

//node .\04-a.js read x.txt
//noed .\04-a.js createRecord nasser torabzade nasser@x.com
//node .\04-a.js readRecord 2

//noed .\05-a.js readRecord 102
//noed .\05-a.js deleteRecord 102

//node .06-a.js redisCreate nasser testVal
//node .06-a.js redisCreate testVal
//node .06-b.js redisDelete testVal



let fs = require('fs');
let command = process.argv[2];
let name = process.argv[3];
let arg4 = process.argv[4];

function unlinkCallback(err) {
    if(err){
        if(err.code === 'EPERM'){
            fs.rmdir(name, rmdirCallback); 
        }
        else{
            console.log('ERR: ', err)
        }
    }
    else{
        console.log("unlink  successfull.")
    }
}

function rmdirCallback(err){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('rmdir successfull')
    }
}

function fsCallback(err){
    let messages ={
        copy: 'copyFile successfull',
        append: 'append successfull.',
        create: 'writeFile successfull.',
        read:  'readFile successfull.',
        createRecord:  'createRecord done successfully.',
    };
             
    if(err){
        console.log('ERR: ', err);
    }
    else{            
        console.log(messages[command]);
    }
}

function readFileCallback(err, data){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log(messages[command]);
        console.log('Data: ', data)
    }
}

function createRecordController(requestParams, response){

    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else {
            fileData = JSON.parse(fileData);

            requestParams.id = 100 + fileData.records.length;
            fileData.records.push(requestParams);


            fileData = JSON.stringify(fileData);
            fs.writeFile('database.json', fileData, function(err){
                if(err){
                    console.log('ERR: ', err);
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('ERR: ' + err);
                    response.end();
                }
                else{            
                    console.log('createRecord success');
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('createRecord success');
                    response.end();
                }
            });
        }
    });
}

function readRecordController(requestParams, response){      
    function getArrayIndex(array, id){
        for(let i=0; i<array.length; i++){
            if(array[i].id == id ){
                return i;
            }
        }
    }
    
    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else { 
            fileData = JSON.parse(fileData);

            if(fileData.records[getArrayIndex(fileData.records, requestParams.name)] === undefined){
                console.log("Record not found.");

                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write("Record not found.");
                response.end();
            }
            else{
                console.log('record: ', fileData.records[getArrayIndex(fileData.records, requestParams.name)]);   

                let data = JSON.stringify(fileData.records[getArrayIndex(fileData.records, requestParams.name)]);
                
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write('record: ' + data);
                response.end();
            }                             
        }
    });
}

function deleteRecordController(request, response){
    function getArrayIndex(array, id){
        for(let i=0; i<array.length; i++){
            if(array[i].id == id ){
                return i;
            }
        }
    }

    let name = request.url.split('/')[2];
    
    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else { 
            let name = request.url.split('/')[2];
    
            fileData = JSON.parse(fileData);
            // let deleteIndex = getArrayIndex(fileData.records, name);
            // fileData.records.splice(deleteIndex, 1);     

            let index = getArrayIndex(fileData.records, name);
            console.log('getArrayIndex', index)
            if(index){
                let x = fileData.records.splice(getArrayIndex(fileData.records, name), 1); 
                console.log('deleted items', x);
            }
            console.log('fileData.records.splice', fileData.records);

            
            fileData = JSON.stringify(fileData);
            fs.writeFile('database.json', fileData, function(error){
                if(error){
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('error: ' + error);
                    response.end();
                }
                else{
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('delete record Successfull');
                    response.end();
                }
            });
        }
    });
}

async function redisCreateController(){
    const client = await redis.createClient({
        url: 'redis://127.0.0.1:6379'
    })
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

    try{
        await client.set(name, arg4);
        console.log('redisCreate successful');
    }
    catch(err){
        console.log('redis Create error: ', err);
    }

    await client.disconnect();
}

function redisDeleteController(){

}

function send(response, text){
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(text);
    response.end();
}

let commands = { 
    create: function(){
        fs.writeFile(name, arg4, fsCallback);
    },
    append: function(){
        fs.appendFile(name, arg4, fsCallback); 
    },
    delete: function(request, response){
        let name = request.url.split('/')[2];
        fs.unlink(name, function(error){
            if(error){
                if(error.code === 'EPERM'){
                    fs.rmdir(name, function(error){
                        if(error){
                            console.log('ERR: ', error);
                            send(response, error);
                        }
                        else{
                            let message = 'delete successfull'
                            console.log(message);
                            send(response, message);
                        }
                    }); 
                }
                else{
                    console.log('ERR: ', error);
                    send(response, error);
                }
            }
            else{
                let message = 'delete successfull'
                console.log(message);
                send(response, message);
            }
        });
    },
    copy: function(){
        fs.copyFile(name, arg4, fsCallback);
    },
    read: function(request, response){
        let name = request.url.split('/')[2];
        fs.readFile(name, {encoding: 'utf8'}, function(err, fileData){
            if(err){

            }
            else{
                send(response, fileData);
            }
        });
    },

    createRecord: createRecordController,
    readRecord: readRecordController,
    deleteRecord: deleteRecordController,

    redisCreate: redisCreateController,
    redisDelete: redisDeleteController
}   

function requestHandler(request, response){

    console.log('request.method', request.method);
    console.log('request.url', request.url);

    command = request.url.split('/')[1];
    name = request.url.split('/')[2];
    arg4 = request.url.split('/')[3];

    let requestParams = {
        command:command,
        name:name,
        arg4:arg4
    }
    
    try {
        commands[command](request, response);
    }
    catch(e){

    }
}

let http = require('http');
let port = 80;
let server = http.createServer(requestHandler);
server.listen(port);
console.log("Server is running on port:" + port)