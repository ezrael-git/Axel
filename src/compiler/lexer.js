// lexer.py
const Scanner = require("./scanner.js");
let TT_LPAREN = "("
let TT_RPAREN = ")"
let TT_EQ = "="
let TT_PLUS = "+"
let TT_MINUS = "-"
let TT_MULTIPLY = "*"
let TT_DIVIDE = "/"
let TT_DOT = "."
let TT_COMMA = ","

let TT_FN = "fn"
let TT_DEF = "def"
let TT_IMM = "imm"
let TT_END = "end"
let TT_PRINT = "print"



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
    this.digits = "0123456789".split('');
    this.scanner = new Scanner()

   
  }

  peek (pos, chars=1) {
    /*
    Get the next x characters in a line, x being the chars variable.

    Returns:
      String
    */
    return this.source.slice(pos+1,pos+chars+1)
  }

  back (pos, chars=1) {
    /*
    Get the previous x characters in a line, x being the chars variable.

    Returns:
      String
    */
    return this.source[pos - chars];
  }

  process (stats) {
    /*
    Handy wrapper around Lexer.lex. Instead of passing one line at a time to the Lexer.lex method, this method allows you to pass multiple lines and then returns their tokens in an Object.
    Object format: { line : tokens }

    Returns:
      Object
    */
    let collection = {};
    let line = 0;
    for (let stat of stats) {
      line += 1;
      collection[line] = this.lex(stat).lexed;
    }
    return collection;
  }


  lex (source) {
    /*
    Lexes a line of code, returning the tokens and skipped characters in an Object.
    
    Returns:
      Object
    */
    this.source = source;

    let lexed = [];
    let sc = this.scanner;
    let skipped = [];

    function add (type, starts, ends, tk) {
      lexed.push({type:type, starts:starts, ends:ends, tk:tk.replaceAll(" ", "")});
    }

    function lastToken () {
      return lexed[lexed.length - 1]
    }

    function wait(ms, cb=false) {
      var waitDateOne = new Date();
      while ((new Date()) - waitDateOne <= ms) {
        //Nothing
      }
      if (cb) {
        eval(cb);
      }
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
        let changingString = it[it.length - 1]
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
      // dot operator
      else if (it.endsWith(TT_DOT)) {
        add("DOT", pos, pos, TT_DOT);
      }
      // comma operator
      else if (it.endsWith(TT_COMMA)) {
        add("COMMA", pos, pos, TT_COMMA);
      }
      // integers
      else if (this.digits.includes(it[it.length - 1])) {
        // get full integer
        let full_integer = sc.getIntegers(source,pos);
        add("INTEGER", pos, full_integer.end, full_integer.integers);
        pos = full_integer.end;
      }
      // fn keyword
      else if (it.endsWith(TT_FN) && !this.letters.includes(source[pos-2]) && this.peek(pos) == " ") {
        add("FUNCTION", pos-1, pos, TT_FN);
      }
      // def keyword
      else if (it.endsWith(TT_DEF) && !this.letters.includes(source[pos-3]) && this.peek(pos) == " ") {
        add("DEFINE", pos-2, pos, TT_DEF);
      }
      // imm keyword
      else if (it.endsWith(TT_IMM) && !this.letters.includes(source[pos-3]) && this.peek(pos) == " ") {
        add("IMMUTABLE", pos-2, pos, TT_DEF);
      }
      // end keyword
      else if (it.endsWith(TT_END) && !this.letters.includes(source[pos-3]) && !this.letters.includes(this.peek(pos))) {
        add("END", pos-2, pos, TT_END);
      }
      // print keyword
      else if (it.endsWith(TT_PRINT) && !this.letters.includes(source[pos-3]) && !this.letters.includes(this.peek(pos))) {
        add("PRINT", pos-4, pos, TT_PRINT);
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
        if (sc.inArgList(source,pos).flag == true) {
          let inArg = sc.inArgList(source,pos);
          let args = source.slice(inArg.starting + 1,inArg.ending).replaceAll(" ","").split(',');
          for (let arg of args) {
            let argDetails = sc.findString(source,arg);
            add("IDENTIFIER", argDetails.start, argDetails.end, arg);
          }
          pos = inArg.ending - 1;
        }
        else if (this.letters.includes(char) && !this.letters.includes(this.peek(pos))) {
          let full_word = sc.getLettersReverse(source,pos);
          add("IDENTIFIER", full_word.start, full_word.end, full_word.letters);
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
