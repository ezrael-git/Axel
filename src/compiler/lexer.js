// lexer.py
const keywords = require("./keyword.js");
const arguments = require("./argument.js");



class Lexer {
  constructor (source) {
    this.source = source;
    this.chars = [].concat(keywords,arguments);
    this.parsed = this.source.split(' ');

    this.curPos = -1;
   
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