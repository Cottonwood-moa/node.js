const {odd, even} = require('./var');

function checkOddOREven(num){
    if (num%2){
        return odd;
    }
    return even;
}

module.exports = checkOddOREven;
