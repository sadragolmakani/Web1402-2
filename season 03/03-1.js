let fs = require('fs');
let data = process.argv[3];



function x(err) {
    if (err) throw err;
    console.log('The file has been saved!');
    }

    fs.writeFile(process.argv[2] + ".txt", data , x)