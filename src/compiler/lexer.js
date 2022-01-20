// lexer.py
const Iden = require("../data/identifier.js");
const Type = require("../type/bundle.js");
const Error = require("../exception/bundle.js");


class Lexer {
  constructor (source) {
    this.source = source;
    this.lexed = source;
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    this.digits = "0123456789".split('');
    this.let_dig = this.letters.concat(this.digits);
    this.blocking = ["+", "-", " ", "(", ")", "/"];
    this.quotes = ['"', "'"];

    this.curPos = -1;
   
  }

  // type manipulation

  _rem (arr, item) {
    let n = [];
    arr.forEach(function (a) {
      if (a != item) {
        n.push(a);
      }
    });
    return n;
  };

  _split (str, tokens) {
    let tempChar = "@@@@@#$_&"; // We can use the first token as a temporary join character
    tokens.forEach(function (t) {
      str = str.replaceAll(t, t+tempChar);
    });

    let result = str.split(tempChar);
    console.log("_split(): " + result);
    return result;
  }

  // processing


  // lexing

  lex () {

    let tokens = [];

    let spltrs = [" ", ",", "[", "]", "(", ")", "log"].concat(Iden);
    let src = this._split(this.source, spltrs);

    let letters = this.letters;
    let digits = this.digits;

    // type checking
    src.forEach(function (piece) {

      // check for Text
      if (piece.startsWith('"') && piece.endsWith('"')) {
        tokens.push(new Type.Text(piece));
      }

      // check for Digit
      else if (digits.includes(piece[0])) {
        tokens.push(new Type.Digit(piece));
      }

      // check for List
      else if (piece.startsWith("[")) {
        tokens.push(new Type.List(piece));
      }

      // check for Dict
      else if (piece.startsWith("{")) {
        tokens.push(new Type.Dict(piece));
      }

      // check for Sign
      else if (Type.Sign.signs.includes(piece)) {
        tokens.push(new Type.Sign(piece));
      }

      // check for Identifier
      else if (letters.includes(piece)) {
        tokens.push(new Type.Identifier(piece));
      }

      // check for parentheses
      else if (Type.Paren.bundle.includes(piece)) {
        if (piece == "(") {
          tokens.push(Type.Paren.left);
        } else if (piece == ")") {
          tokens.push(Type.Paren.right);
        }
      }

      // throw syntax error
      else {
        // tokens.push(Error.IllegalCharacterError);
        console.log("Illegal Character: " + piece);
        return
      }

    this.lexed = tokens;
    return this.lexed;




    });


    


  }
  
  next () {
    this.curPos += 1;
    return this.lexed.split('')[this.curPos];
  }
  
  prev () {
    this.curPos -= 1;
    return this.lexed.split('')[this.curPos];
  }
 
 
}



module.exports = Lexer;
