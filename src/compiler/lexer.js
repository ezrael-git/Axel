// lexer.py
const Iden = require("../data/identifier.js");
const Type = require("../type/bundle.js");


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

    let letters = this.letters;
    let digits = this.digits;
    let both = this.let_dig;
    let process = this.process;
    let src = this.source.split('');
    let proarr = this.process_arr;
    let blocking = this.blocking;
    let quotes = this.quotes;

    while true {

        src.forEach(function (char) {

          if (letters.includes(char)) {

            let id = process(source, char);
            tokens.push(new Type.Identifier(id));
            src = proarr(src, char);
            break;

          }
          else if (digits.includes(char)) {
            let id = process(source, char);
            tokens.push(new Type.Digit(id));
            src = proarr(src, char);
            break;
          }
          else if (Type.Sign.signs().includes(char)) {
            let id = process(source, char);
            tokens.push(new Type.Sign(id));
            src = proarr(src, char);
            break;
          }
          else if (quotes.includes(char)) {
            // ong string found 
            let id = process(source, char, quotes);
            tokens.push(new Type.Identifier(id));
            src = proarr(src, char, quotes);
            break;
          }



    }

      




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
