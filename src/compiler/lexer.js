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

    function _convert (check_for, convert_to) {
      parsed.forEach(function (piece) {
        if (check_for.includes(piece)) {
          let ind = parsed.indexOf(piece);
          let converted = new convert_to(piece);
          parsed[ind] = converted;
        };
      });
    }

    // now we can check for the parsed digits and convert them
    _convert( digits, Type.Digit );

    // let's do the same for all the strings
    _convert( ['"', "'"], Type.Text );
    
    // time to do the same to all the signs
    _convert( Type.Sign.signs, Type.Sign );

    return parsed;

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
