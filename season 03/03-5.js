let data = process.argv[2];

switch (data) {
    case 1:
        function x(err) {
            if (err) throw err;
            console.log('The file has been saved!');
            }
        
            fs.writeFile(process.argv[2] + ".txt", data , x)
        break;
    case 2:
        function x(err) {
            if (err) throw err;
            console.log('The file has been saved!');
            }
    
            fs.appendFile(process.argv[2] + ".txt", data , x)
    case 3:
        function x(err) {
            if (err) throw err;
            console.log('The file has been saved!');
            }
        
            fs.unlink(process.argv[2] + ".txt", data , x)
    case 4:
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
    default:
        break;
}