// parser.js

const Keyword = require("../data/keyword.js");
const Iden = require("../data/identifier.js");
const Type = require("../type/bundle.js");
const Exception = require("../exception/bundle.js");




module.exports = class Parser {
  constructor () {
    this.parsed = []; // parsed lines
    this.parsedLine = 0; // line being parsed
    this.cur = []; // current list of tokens to iterate through
    this.curPos = 0; // position of current token being analyzed
    
    this.variables = {"initialized": true}
    
  }

  // error handling
  raise (name, line, msg) {
    console.log(`main.py:${name} at ${line}:\n${msg}`);
    throw new Error ();
    
  }

  // emitting
  emit (s) {
    console.log(">>> " + s);
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

  
  
  parse (tks) { // general note: tks stands for tokens
    this.addLine(tks);
    this.ref(tks)
    let iden = this.next().name;
    console.log("IDEN " + iden);

    // as a general rule, all lines must begin with an Identifier token
    // so we can use that to help us parse

    if (iden == "log") {
      let exp_lparen = this.next();
      let exp_rparen = tks[-1];

      if (exp_lparen != "(") {
        this.raise("InvalidSyntax", this.parsedLine, "Expected {LPAREN} after {IDEN: log}, got " + exp_lparen + " instead")

      let expr = this.next();
      console.log(">>>" + expr.eval());
    }
  }



}

