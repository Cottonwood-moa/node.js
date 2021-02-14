const {odd ,even} = require('./var');
const indexCheck = require('./func');

function string (str){
    if (str.length %2){
        return odd;
    }
    return even;
}

console.log(indexCheck(3));
console.log(string('안녕하세요?'));

