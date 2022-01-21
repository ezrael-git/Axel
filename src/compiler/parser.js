// parser.js

const keywords = require("../data/keyword.js");
const arguments = require("../data/argument.js");
const initializers = require("../data/initializer.js");




module.exports = class Parser {
  constructor () {
    this.parsed = []; // parsed lines
    this.parsedLine = 0; // line being parsed
    this.cur = []; // current list of tokens to iterate through
    this.curPos = 0; // position of current token being analyzed
    
    this.variables = {"initialized": true}
    
  }

  // error handling
  raise (e) {
    console.log(`main.py:{e.name} at {e.line}:\n{e.message}`);
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
    let next = this.next;
    let iden = next();
    let raise = this.raise;
    let emit = this.emit;

    // as a general rule, all lines must begin with an Identifier token
    // so we can use that to help us parse

    if (iden == "log") {
      let exp_lparen = next();
      let exp_rparen = tks[-1];
      if (exp_lparen != Paren.Left) {
        raise(new Exception.SyntaxError("Expected LPAREN after IDEN log", this.parsedLine))
      } else if (exp_rparen != Paren.Right) {
        raise(new Exception.SyntaxError("Expected Paren.Right after IDEN log EXPR", this.parsedLine))
      }
      let expr = next();
      console.log(">>>" + expr.eval());
    }



}

