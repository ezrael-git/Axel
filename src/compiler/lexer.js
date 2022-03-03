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
    this.scanner = new Scanner()

   
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
    let sc = this.scanner;

    function add (type, tk) {
      lexed.push({type:type, pos:pos, tk:tk})
    }

    let it = "";
    let pos = -1;
    let inString = false;
    let changingString = "";
    for (let char of source) {
      it += char;
      pos += 1;

      if (it.endsWith(TT_LPAREN) && sc.inQuotes(source,pos) == false) {
        add("LPAREN", TT_LPAREN);
      }
      // beginning of string
      else if (it.endsWith("'") && sc.inQuotes(source,pos) == true || it.endsWith('"') && sc.inQuotes(source,pos) == true) {
        inString = true;
        changingString = it[it.length - 1]
      }

    }

  }
  
 
 
}



module.exports = Lexer;
