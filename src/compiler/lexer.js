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
    this.lowercase = [];
    for (let lett of this.letters) {
      this.lowercase.push(lett.toLowerCase());
    }
    this.letters = this.letters.concat(this.lowercase)
    this.digits = "0123456789"
    this.scanner = new Scanner()

   
  }

  peek (pos, chars=1) {
    return this.source.slice(pos+1,pos+chars+1)
  }

  back (pos, chars=1) {
    return this.source[pos - chars];
  }


  lex (source) {
    this.source = source;

    let lexed = [];
    let sc = this.scanner;
    let skipped = [];

    function add (type, starts, ends, tk) {
      lexed.push({type:type, starts:starts, ends:ends, tk:tk.replaceAll(" ", "")})
    }

    function lastToken () {
      return lexed[lexed.length - 1]
    }

    let it = "";
    let pos = -1;
    while (pos != source.length + 1) {
      pos += 1;
      let char = source[pos];
      it += char;


      // handle...
      // parentheses
      if (it.endsWith(TT_LPAREN) && sc.inQuotes(source,pos) == false || it.endsWith(TT_RPAREN) && sc.inQuotes(source,pos) == false) {
        if (it.endsWith(TT_LPAREN)) {
          add("LPAREN", pos, pos, TT_LPAREN);
        } else {
          add("RPAREN", pos, pos, TT_RPAREN);
        }
      }
      // beginning of string
      else if (it.endsWith("'") && sc.inQuotes(source,pos) == true || it.endsWith('"') && sc.inQuotes(source,pos) == true) {
        // get the exact quote used
        changingString = it[it.length - 1]
        // get full string
        let fullString = sc.getUntil(source,pos,changingString);
        add("STRING", pos, fullString.curPos, fullString.string);
        pos = fullString.curPos;
      }
      // addition operator
      else if (it.endsWith(TT_PLUS)) {
        add("PLUS", pos, pos, TT_PLUS);
      }
      // subtraction operator
      else if (it.endsWith(TT_MINUS)) {
        add("MINUS", pos, pos, TT_MINUS);
      }
      // multiplication operator
      else if (it.endsWith(TT_MULTIPLY)) {
        add("MULTIPLY", pos, pos, TT_MULTIPLY);
      }
      // division operator
      else if (it.endsWith(TT_DIVIDE)) {
        add("DIVIDE", pos, pos, TT_DIVIDE);
      }
      // equality / assignment operator
      else if (it.endsWith(TT_EQ)) {
        add("EQUALITY", pos, pos, TT_EQ);
      }
      // fn keyword
      else if (it.endsWith(TT_FN) && !this.letters.includes(source[pos-2]) && this.peek(pos) == " ") {
        add("FUNCTION", pos-1, pos, TT_FN);
      }
      // def keyword
      else if (it.endsWith(TT_DEF) && !this.letters.includes(this.back(pos)) && this.peek(pos) == " ") {
        add("DEFINE", pos-2, pos, TT_DEF);
      }
      // imm keyword
      else if (it.endsWith(TT_IMM) && !this.letters.includes(this.back(pos)) && this.peek(pos) == " ") {
        add("IMMUTABLE", pos-2, pos, TT_DEF);
      }
      else {
        // identifiers
        if (lastToken() != undefined) {
          if (lastToken().type == "FUNCTION" || lastToken().type == "DEFINE" || lastToken().type == "IMMUTABLE") {
            let identifier = sc.getUntil(source,pos," ")
            add("IDENTIFIER", pos, identifier.curPos, identifier.string);
            pos = identifier.curPos;
            continue;
          }
        }
        console.log(sc.inArgList(source,pos));
        console.log(pos);
        if (sc.inArgList(source,pos).flag == true) {
          let inArg = sc.inArgList(source,pos);
          let args = source.slice(inArg.starting + 1,inArg.ending).replaceAll(" ","").split(',');
          for (let arg of args) {
            let argDetails = sc.findString(source,arg);
            add("IDENTIFIER", argDetails.start, argDetails.end, arg);
          }
          pos = inArg.ending - 1;
        }
        // skip
        else {
          skipped.push({it:char});
        }
      }


    }
    return {"lexed":lexed,"skipped":skipped}

  }
  
 
 
}



module.exports = Lexer;
