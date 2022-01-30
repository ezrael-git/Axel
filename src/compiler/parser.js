// parser.js

const Keyword = require("../data/keyword.js");
const Iden = require("../data/identifier.js");
const Type = require("../type/bundle.js");
const Exception = require("../exception/bundle.js");




module.exports = class Parser {
  constructor () {
    this.parsed = []; // parsed lines (raw, they are not parsed. for clarity, think of these as processed lines)
    // also they contain no whitespaces
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

  literal_replace (a) {
    let rep = {
      "@": "this."
    }
    for (let k in rep) {
      let v = rep[k];
      let starting = false;
      for (let char of a) {
        if (["'", '"'].includes(char) && starting == false) {
          starting = true;
        }
        else if (["'", '"'].includes(char) && starting == true) {
          starting = false;
        }
        else if (char == k && starting == false) {
          a = a.split("");
          a[a.indexOf(char)] = v;
          a = a.join("");
        }
      }
    }
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
      let expr = orig.replace("log ", "");
      this.emit(`console.log(${expr})`);
    }
    else if (iden == "if") {
      let condition = orig.replace("if ", "");
      this.emit(`if (${condition}) {`)
    }
    else if (iden == "ef") {
      let condition = orig.replace("ef ", "");
      this.emit(`else if (${condition}) {`)
    }
    else if (iden == "es") {
      this.emit(`else {`)
    }
    else if (iden == "end") {
      this.emit("}");
    }
    else if (iden == "def") {
      let name = this.next();
      let eq = this.next();
      let value = orig.replace("def ", "").replace(name, "").replace(eq, "");
      this.emit(`let ${name} = ${value}`);
    }
    else if (iden == "fn") {
      let name = this.next();
      let it = "";
      let args = [];
      if (orig.includes("(")) {
        let arglist = orig.replaceAll("(", "").replaceAll(")", "").replace("fn ", "").replace(name, "").split(",");
        this.emit(`function ${name} (${arglist.join(",").replaceAll(" ", "")}) {`);
      } else if (orig.split(" ").length > 2) {
        let arglist = orig.replace("fn " + name, "").replaceAll(" ", "").split(",");
        this.emit(`function ${name} (${arglist}) {`);
      }
      else {
        this.emit(`function ${name} () {`);
      }
    }
    else if (iden == "imm") {
      let name = this.next();
      let eq = this.next();
      let value = this.next();
      this.emit(`const ${name} = ${value}`);
    }
    else if (this.cur.length > 1) {
      let funcNameRaw = iden.replaceAll("(", "").replaceAll(")", "");
      let isFunc = false;
      for (let line of this.parsed.split("\n")) {
        if (line.includes("fn" + funcNameRaw)) {
          isFunc = true;
        }
      }
      if (isFunc != true) {
        this.emit(orig);
        console.log("funcTry failed, type: " + typeof funcTry);
        return 0;
      }
      // ong, function call found
      let saved = "";
      for (let c of orig.split('')) {
        if (c == " " || c == "(") {
          break;
        }
        saved += c;
      }
      let funcName = saved;
      let funcArgs = orig.replaceAll(funcName + "(", "").replaceAll(funcName + " ", "").replaceAll(")", "").replaceAll(" ", "").split(",");
      console.log("FNFA " + funcName + " " + funcArgs);
      this.emit(`${funcName}(${funcArgs})`)
    }
    else {
      let processed = this.literal_replace(orig);
      this.emit(processed);
    }
  }



}

