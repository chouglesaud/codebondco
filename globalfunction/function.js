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

module.exports = {fileParser,dater}