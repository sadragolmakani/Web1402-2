let fs = require('fs');
let data = process.argv[3];



function x(err) {
    if (err){
        if(err.code === 'EPERM'){
            fs.rmdircallback(process.argv[2] , x)
        }
        else{
            console.log('ER: ', err);
        }
    }
    else{
        console.log("File DELETE.")
    }
}
function y(err) {
    if (err) {
        console.log('ERR: ' , err)
    }
    else {
        console.log('rmdir successfill')
    }
}

fs.unlinkcallback(process.argv[2] , x)