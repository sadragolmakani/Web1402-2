console.log("inputs",process.argv);

let inputs = [];

function x  (val , index){
    if (index>1){
        inputs[index-2] = val;
    }
}
process.argv.forEach(x);
console.log("inputs",inputs);
