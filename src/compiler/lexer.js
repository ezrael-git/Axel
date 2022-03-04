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
    let it = "";
    let curPos = -1;
    for (let c of this.source) {
      curPos += 1;
      if (curPos > pos) {
        it += c;
        if (it.length == chars) {
          return it;
        }
      }
    }
  }

  back (pos, chars=1) {
    return this.source[pos - chars];
  }


  lex (source) {
    this.source = source;

    let lexed = [];
    let sc = this.scanner;
    let skipped = [];

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
        if (it.endsWith(TT_LPAREN)) {
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
      else if (it.endsWith(TT_FN) && !this.letters.includes(source[pos-2]) && this.peek(pos) == " ") {
        add("FUNCTION", TT_FN);
        let identifier = sc.getUntil(source,pos+1," ");
        add("IDENTIFIER", identifier.string);
        pos = identifier.curPos;
        let args = source.slice(pos,source.length).split(',');
        console.log("ARGS " + args)
        console.log(pos)
        console.log(source.length)
        add("LPAREN", TT_LPAREN);
        for (let arg of args.join(',').replaceAll(" ", "").split(',')) {
          add("IDENTIFIER", arg);
        }
        add("RPAREN", TT_RPAREN);
        console.log("COMB " + args.join(','));
        pos = sc.findString(source,args.join(',')).end;
      }
      else if (it.endsWith(TT_DEF) && !this.letters.includes(this.back(pos)) && this.peek(pos) == " ") {
        add("DEFINE", TT_DEF);
        let identifier = sc.getUntil(source,pos+1," ");
        add("IDENTIFIER", identifier.string);
        pos = identifier.curPos;
      }
      else if (it.endsWith(TT_IMM) && !this.letters.includes(this.back(pos)) && this.peek(pos) == " ") {
        add("IMMUTABLE", TT_DEF);
        let identifier = sc.getUntil(source,pos+1," ");
        add("IDENTIFIER", identifier.string);
        pos = identifier.curPos;
      }
      else {
        skipped.push({char:it});
      }


    }
    return {"lexed":lexed,"skipped":skipped}

  }
  
 
 
}



module.exports = Lexer;
