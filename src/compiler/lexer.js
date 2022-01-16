// lexer.py
const Initializer = require("../data/initializer.js");
const Type = require("../type/bundle.js");

class Lexer {
  constructor (source) {
    this.source = source;
    this.parsed = undefined;

    this.curPos = -1;
   
  }

  lex () {
    let
    for (const ini in Initializer) {
      if (this.source.includes(ini)) {
        parsed.push(ini);
      }
    }
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
