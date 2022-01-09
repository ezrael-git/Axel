// lexer.py
const keywords = require("./keyword.js");



class Lexer {
  constructor (source) {
    this.source = source;
    this.keywords = keywords;
    this.parsed = source.split(' ');
    this.curPos = 0;
   
  }
  
  nextToken () {
    this.curPos += 1;
    return this.parsed[this.curPos];
  }
  
  backToken () {
    this.curPos -= 1;
    return this.parsed[this.curPos];
  }
 
 
}



module.exports = Lexer;
