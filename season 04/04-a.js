//node .\03-f.js create x.txt salamSALAMsalam
//node .\03-f.js append x.txt salamSALAMsalam
//node .\03-f.js delete x.txt
//node .\03-f.js delete myDirName
//node .\03-f.js copy x.txt y.txt  


const { create } = require('domain');
let fs = require('fs');
const { json } = require('stream/consumers');
let command = process.argv[2];
let name = process.argv[3];
let arg4 = process.argv[4];

function writeFileCallback(err) {
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('writeFile  successfull.');
    }
}

function appendFileCallback(err) {
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('append  successfull.');
    }
}

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

function copyFileCallback(err){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('copyFile successfill')
    }
}
function readFile(err){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('copyFile successfill')
    }
}


let messages ={
    copy: 'copyFile successfull',
    append: 'append  successfull.',
    create: 'writeFile  successfull.',
    readfile: 'readFile successfull',
}

function fsCallback(err){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log(messages[command])
    }
}

// switch(command){
//     case 'create':
//         fs.writeFile(name, arg4, writeFileCallback); 
//         break;
//     case 'append':
//         fs.appendFile(name, arg4, appendFileCallback); 
//         break;
//     case 'delete':
//         fs.unlink(name, unlinkCallback);
//         break;
//     case 'copy':
//         fs.copyFile(name, arg4, copyFileCallback); 
//         break;
//     default:
//         console.log('Command not found');
// }

let commands = {
    create: function(){
        fs.writeFile(name, arg4, fsCallback);
    },
    append: function(){
        fs.appendFile(name, arg4, fsCallback); 
    },
    delete: function(){
        fs.unlink(name, unlinkCallback);
    },
    copy: function(){
        fs.copyFile(name, arg4, fsCallback);
    },
    readfile: function(){
        fs.readFile(name , fsCallback)
    },
    createRecord: function(){
        let data ={
            name: process.argv[3],
            family: process.argv[4],
            email: process.argv[5],
        }
        fs.readfile('databese.json', 'utf8' ,function readcalback(err,filedata){
            if(err){
                console.log('ERR: ', err);
            }
            else{
                filedata = JSON.parse(filedata);
                filedata.record.push(data);
                filedata = JSON.stringify(filedata);
                fs.writeFile('databese.json' , filedata , fsCallback)
            }
        });

    },
    readrecord: function(){
        fs.readfile("databese.json", 'utf8' , function readcalback(err , filedata){
            if(err){
                console.log('ERR: ', err);
            }
            else{
                filedata = JSON.parse(filedata);
                console.log(filedata.record[process.argv[3]])
            } 
        })
    }
}

commands[command]();