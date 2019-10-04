const fs = require("fs")

function fileParser(file){                                       
    let Read       = fs.readFileSync(file)  // reads the json file
    let parsedFile = JSON.parse(Read)       //  parse json file
    return parsedFile                                         
}

function dater(){
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let date  = new Date;
    return `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
 }

 let error404 = {
    name      : 404,
    firstnum  : 4,
    secondnum : 0,
    thirdnum  : 4,
    firstword : "webpage",
    secondword: "not",
    thirdword : "found"
}

let error500 = {
    name      : 500,
    firstnum  : 5,
    secondnum : 0,
    thirdnum  : 0,
    firstword : "internal",
    secondword: "server",
    thirdword : "error"
}
let error400 = {
    name      : 400,
    firstnum  : 4,
    secondnum : 0,
    thirdnum  : 0,
    firstword : "bad",
    secondword: "request",
    thirdword : "error"
}

module.exports = {fileParser,dater,error500,error404,error400}