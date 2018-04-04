'use strict'
var arr = [];

async function each (arr, fn) {
    for(const item of arr) {
        let data = await fn(item);

        arr.push(data);
    }

    return arr;
    
}

module.exports = each;