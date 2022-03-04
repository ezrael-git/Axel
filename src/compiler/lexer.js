// lexer.py
const Scanner = require("./scanner.js");
let TT_LPAREN = "("
let TT_RPAREN = ")"
let TT_EQ = "="
let TT_PLUS = "+"
let TT_MINUS = "-"
let TT_MULTIPLY = "*"
let TT_DIVIDE = "/"

let TT_FN = "fn"
let TT_DEF = "def"
let TT_IMM = "imm"



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
    while (pos != source.length + 1) {
      pos += 1;
      let char = source[pos];
      it += char;

      // handle parentheses
      if (it.endsWith(TT_LPAREN) && sc.inQuotes(source,pos) == false || it.endsWith(TT_RPAREN) && sc.inQuotes(source,pos) == false) {
        if (tt.endsWith(TT_LPAREN)) {
          add("LPAREN", TT_LPAREN);
        } else {
          add("RPAREN", TT_RPAREN);
        }
      }
      // beginning of string
      else if (it.endsWith("'") && sc.inQuotes(source,pos) == true || it.endsWith('"') && sc.inQuotes(source,pos) == true) {
        // get the exact quote used
        changingString = it[it.length - 1]
        // get full string
        let fullString = sc.getUntil(source,pos,changingString);
        add("STRING", fullString.string);
        pos = fullString.curPos;
      }
      // addition operator
      else if (it.endsWith(TT_PLUS)) {
        add("PLUS", TT_PLUS);
      }
      else if (it.endsWith(TT_MINUS)) {
        add("MINUS", TT_MINUS);
      }
      else if (it.endsWith(TT_MULTIPLY)) {
        add("MULTIPLY", TT_MULTIPLY);
      }
      else if (it.endsWith(TT_DIVIDE)) {
        add("DIVIDE", TT_DIVIDE);
      }
      else if (it.endsWith(TT_EQ)) {
        add("EQUALITY", TT_EQ);
      }
      else if (it.endsWith(TT_FN) && this.back(pos) == " " && this.peek(pos) != " ") {
        add("FUNCTION", TT_FN);
        let identifier = sc.getUntil(source,pos+2," ");
        add("IDENTIFIER", identifier.string);
        pos = identifier.curPos;
        let args = source.replace(
      }
      

    }

  }
  
 
 
}



module.exports = Lexer;
