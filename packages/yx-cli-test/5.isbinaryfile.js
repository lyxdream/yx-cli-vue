const path = require('path');
const { isBinaryFileSync } = require('isbinaryfile');
let logo = path.join(__dirname,'template/assets/2.png');
let isBinary = isBinaryFileSync(logo);
console.log(isBinary);
let main = path.join(__dirname,'template/main.js');
isBinary = isBinaryFileSync(main);
console.log(isBinary);


// true
// false