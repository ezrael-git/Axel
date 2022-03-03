// lexer.py
const Scanner = require("./scanner.js");
let TT_LPAREN = "("
let TT_RPAREN = ")"
let TT_FN = "fn"
let TT_DEF = "def"
let TT_IMM = "imm"
let TT_EQ = "="
let TT_PLUS = "+"
let TT_MINUS = "-"
let TT_MULTIPLY = "*"
let TT_DIVIDE = "/"



class Lexer {
  constructor () {
    this.source = "";
    this.lexed = undefined;
    this.line = 0;
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    this.digits = "0123456789"

   
  }

  peek (pos, chars=1) {
    return this.source.slice(pos, chars);
  }

  back (pos, chars=1) {
    return this.source[pos - chars];
  }


  lex (source) {
    this.source = source;

    let lexed = [];

    function add (type, tk) {
      lexed.push({type:type, pos:pos, tk:tk})
    }

    let it = "";
    let pos = -1;
    for (let char of source) {
      it += char;
      pos += 1;

      if (it.endsWith(TT_LPAREN)) {
        add("LPAREN", TT_LPAREN);
      }
      else if (it.endsWith()) {
      }

    }

  }
  
 
 
}



module.exports = Lexer;
