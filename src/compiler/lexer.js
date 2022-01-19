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
    this.let_dig = letters.concat(digits);
    this.blocking = ["+", "-", " ", "(", ")", "/"];
    this.quotes = ['"', "'"];

    this.curPos = -1;
   
  }

  _rem (arr, item) {
    let n = [];
    arr.forEach(function (a) {
      if (a != item) {
        n.push(a);
      }
    });
    return n;
  };

  process_str (item, starting, blocking=this.blocking) {
    let saved = "";
    let save = false;
    item.split('').forEach(function (c) {
      if (starting.includes(c)) {
        save = true;
      }
      if (blocking.includes(c)) {
        return saved;
      }
      if (save == true) {
        saved += c;
      }
    });
    return saved;
  }

  process_arr (arr, starting, blocking=this.blocking) {
    let de = false;
    let rem = this._rem;
    arr.forEach(function (c) {
      if (starting.includes(c)) {
        de = true;
      }
      if (blocking.includes(c)) {
        return arr;
      }
      if (de == true) {
        arr = rem(arr, c);
      }
    });
    return saved;
  }

  lex () {

    let tokens = [];
    let src = this.source.split(' ');

    let digits = this.digits;

    src.forEach(function (piece) {

      // check for Text
      if (piece.startsWith('"') and piece.endsWith('"')) {
        tokens.push(Type.Text(piece));
      }

      // check for Digit
      else if (digits.includes(piece[0])) {
        tokens.push(Type.Digit(piece));
      }

      // check for List
      else if (piece.startsWith("[")) {
        tokens.push(Type.List(piece));
      }

      // check for Dict
      else if (piece.startsWith("{")) {
        tokens.push(Type.Dict(piece));
      }

      // check for Sign
      else if (Type.Sign.signs.includes(piece)) {
        tokens.push(Type.Sign(piece));
      }

      // check for Identifier
      else if (letters.includes(piece)) {
        tokens.push(Type.Identifier(piece));
      }

      // throw syntax error
      else {
        tokens.push(Error.IllegalCharacterError);
      }

    return tokens;




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
