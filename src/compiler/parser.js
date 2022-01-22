// parser.js

const Keyword = require("../data/keyword.js");
const Iden = require("../data/identifier.js");
const Type = require("../type/bundle.js");
const Exception = require("../exception/bundle.js");




module.exports = class Parser {
  constructor () {
    this.parsed = []; // parsed lines (raw, they are not parsed. for clarity, think of these as processed lines)
    this.parsedLine = 0; // line being parsed
    this.cur = []; // current list of tokens to iterate through
    this.curPos = 0; // position of current token being analyzed
    
    this.vars = {"initialized": true}
    this.emitted = ""; // actual parsed lines
    
  }

  // error handling
  raise (name, line, msg) {
    console.log(`main.py:${name} at ${line}:\n${msg}`);
    throw new Error ();
    
  }

  // emitting
  emit (s) {
    this.emitted += s + "\n";
  }

  // iterating tools

  ref (n=undefined) { // refresh the cur and curPos
    this.cur = n;
    this.curPos = 0;
  }

  addLine (tks) {
    this.parsed += tks.join("");
    this.parsedLine += 1;
  }


  next () {
    let n = this.cur[this.curPos];
    this.curPos += 1;
    return n;
  }


  
  
  parse (tks, orig="") { // general note: tks stands for tokens
    this.addLine(tks);
    this.ref(tks)
    let iden = this.next();
    console.log("Received Tokens: " + tks);
    console.log("IDEN " + iden);


    // as a general rule, all lines must begin with an Identifier token
    // so we can use that to help us parse

    if (iden == "log") {
      let expr;
      if (this.cur.length == 2) {
        expr = this.next();
      } else {
        this.next();
        expr = this.next();
      }
      this.emit(`console.log(${expr})`);
    }
    else if (iden == "if") {
      let condition = this.next();
      this.emit(`if (${condition}) {`)
    }
    else if (iden == "end") {
      this.emit("}");
    }
    else if (iden == "def") {
      let name = this.next();
      let eq = this.next();
      let value = this.next();
      this.emit(`let ${name} = ${value}`);
    }
    else if (iden == "fn") {
      let name = this.next();
      let lparen = this.next();
      let it = "";
      let args = [];
      while (it != ")") {
        it = this.next();
        args.push(it);
      }
      let s = `function ${name} (`
      args.forEach(a => s += a + ",");
      s = s.split('').splice(-1, 1).join('');
      s += ") {"
      this.emit(s);
    }
    else {
      this.emit(orig);
    }
  }



}

