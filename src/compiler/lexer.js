// lexer.py
const Scanner = require("./scanner.js");
let TT_LPAREN = "("
let TT_RPAREN = ")"
let TT_EQ = "="
let TT_COMPARE = "=="
let TT_COMPAREOPP = "!="
let TT_PLUS = "+"
let TT_MINUS = "-"
let TT_MULTIPLY = "*"
let TT_DIVIDE = "/"
let TT_DOT = "."
let TT_COMMA = ","

let TT_FN = "fn"
let TT_RETURN = "return"
let TT_DEF = "def"
let TT_IMM = "imm"
let TT_DO = "do"
let TT_END = "end"
let TT_PRINT = "print"
let TT_TRUE = "true"
let TT_FALSE = "false"
let TT_NIL = "nil"
let TT_IF = "if"
let TT_ELIF = "elif"
let TT_ELSE = "else"



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

  cleanWhitespace (str) {
    while (str.startsWith(" ")) {
      str = str.split('');
      str[0] = '';
      str = str.join('');
    }
    while (str.endsWith(" ")) {
      str = str.split('');
      str[str.length - 1] = '';
      str = str.join('');
    }
    return str;
  }

  process (stats) {
    /*
    Handy wrapper around Lexer.lex. Instead of passing one line at a time to the Lexer.lex method, this method allows you to pass multiple lines and then returns their tokens in an Object.
    Object format: { line : tokens }

    Returns:
      Object
    */
    let collection = [];
    for (let stat of stats) {
      this.line += 1;
      collection = collection.concat(this.lex(stat));
    }
    console.log("COL " + JSON.stringify(collection));
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
    let cleanWhitespace = this.cleanWhitespace;

    function add (type, starts, ends, tk) {
      lexed.push({type:type, starts:starts, ends:ends, tk:cleanWhitespace(tk), line:this.line});
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
      else if (it.endsWith(TT_EQ) && this.peek(pos) != "=" && this.back(pos) != "=" && this.back(pos) != "!") {
        add("EQUALITY", pos, pos, TT_EQ);
      }
      // comparison operator
      else if (it.endsWith(TT_COMPARE)) {
        add("COMPARE", pos-1, pos, TT_COMPARE);
      }
      else if (it.endsWith(TT_COMPAREOPP)) {
        add("COMPAREOPP", pos-1, pos, TT_COMPAREOPP);
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
      // do keyword
      else if (it.endsWith(TT_DO) && !this.letters.includes(source[pos-2]) && !this.letters.includes(this.peek(pos))) {
        add("DO", pos-1, pos, TT_DO);
      }
      // end keyword
      else if (it.endsWith(TT_END) && !this.letters.includes(source[pos-3]) && !this.letters.includes(this.peek(pos))) {
        add("END", pos-2, pos, TT_END);
      }
      // print keyword
      else if (it.endsWith(TT_PRINT) && !this.letters.includes(source[pos-5]) && !this.letters.includes(this.peek(pos))) {
        add("PRINT", pos-4, pos, TT_PRINT);
      }
      // true keyword
      else if (it.endsWith(TT_TRUE) && !this.letters.includes(source[pos-4]) && !this.letters.includes(this.peek(pos))) {
        add("TRUE", pos-3, pos, TT_TRUE);
      }
      // false keyword
      else if (it.endsWith(TT_FALSE) && !this.letters.includes(source[pos-5]) && !this.letters.includes(this.peek(pos))) {
        add("FALSE", pos-4, pos, TT_FALSE);
      }
      // nil keyword
      else if (it.endsWith(TT_TRUE) && !this.letters.includes(source[pos-3]) && !this.letters.includes(this.peek(pos))) {
        add("NIL", pos-2, pos, TT_NIL);
      }
      // if keyword
      else if (it.endsWith(TT_IF) && !this.letters.includes(source[pos-2]) && !this.letters.includes(this.peek(pos))) {
        add("IF", pos-1, pos, TT_IF);
      }
      // elif keyword
      else if (it.endsWith(TT_ELIF) && !this.letters.includes(source[pos-4]) && !this.letters.includes(this.peek(pos))) {
        add("ELIF", pos-2, pos, TT_ELIF);
      }
      // else keyword
      else if (it.endsWith(TT_ELSE) && !this.letters.includes(source[pos-4]) && !this.letters.includes(this.peek(pos))) {
        add("ELSE", pos-2, pos, TT_ELSE);
      }
      // return keyword
      else if (it.endsWith(TT_RETURN) && !this.letters.includes(source[pos-6]) && !this.letters.includes(this.peek(pos))) {
        add("RETURN", pos-5, pos, TT_RETURN);
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
    return lexed

  }
  
 
 
}



module.exports = Lexer;
