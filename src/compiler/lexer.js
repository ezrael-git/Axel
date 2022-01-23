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
      str = str.replaceAll(t, tempChar+t+tempChar);
    });

    let result = str.split(tempChar);
    return result;
  }

  // processing

  type_format (splt) {
    let tokens = [];
    for (let piece of splt) {
      if (piece[0] == undefined) {
        continue
      }

      // check for Text
      if (piece.startsWith('"') && piece.endsWith('"') || piece.startsWith("'") && piece.endsWith("'")) {
        tokens.push(new Type.Text(piece));
      }

      // check for Digit
      else if (this.digits.includes(piece[0])) {
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
      else if (this.letters.includes(piece[0].toUpperCase())) {
        tokens.push(new Type.Identifier(piece));
      }

      // check for parentheses
      else if (["(", ")"].includes(piece)) {
        tokens.push(piece);
      }


      else {
        // assume is string lmao
        console.log("ok so uhhh we don't know how to handle this one " + piece);
        tokens.push(new Type.Text(piece));
      }





    }; // for loop's brace
    return tokens;
  }

  remove_emp (lis) {
    let n = [];
    lis.forEach(function (e) {
      if (e != " " && e != "" && e.length > 0 && e[0] != undefined) {
        n.push(e.replaceAll(" ", ""));
      }
    });
    return n;
  }

  remove (lis, item) {
    let n = [];
    lis.forEach(function (e) {
      if (e != item) {
        n.push(e);
      }
    });
    return n;
  }


  // lexing

  lex () {

    let tokens = [];

    let spltrs = [" ", ",", "[", "]", "(", ")", "log", "fn", "def", "imm", "if", "ef", "es"].concat(Iden);
    let src = this._split(this.source, spltrs);
    src = this.remove_emp(src);
    src = this.remove(this.remove(src, "("), ")");


    this.lexed = src;
    return this.lexed;


    


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
