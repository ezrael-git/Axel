// lexer.py
const Initializer = require("../data/initializer.js");
const Type = require("../type/bundle.js");

class Lexer {
  constructor (source) {
    this.source = source;
    this.parsed = source;

    this.curPos = -1;
   
  }

  lex () {
    let parsed = this.parsed;
    let source = this.source;

    // split initializers
    for (const ini in Initializer) {
      parsed = parsed.split(ini);
    }

    // check for numbers, and then split them
    let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0");

    parsed.forEach(function (piece) {

      digits.forEach(function (digit) {
        parsed = piece.split(digit);
      });

    });

    // now we can check for the parsed digits and convert them
    parsed.forEach(function (piece) {
      if (digits.includes(piece)) {
        let ind = parsed.indexOf(piece);
        let converted = new Type.Digit(piece);
        parsed[ind] = converted;
      };
    });

    // let's do the same for all the strings
    

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
