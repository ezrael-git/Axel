// parser.js
// generate AST

const Node = require("./node.js");




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

  // emitting and formatting
  emit (s) {
    this.emitted += s + "\n";
  }


  removeStrAt (st, pos, new_char) {
    st = st.split('')
    st[pos] = new_char
    st = st.join('')
    return st;
  }

  cleanse_whitespace (stat) {
    while (stat.startsWith(" ")) {
      stat = this.removeStrAt(stat,0,"");
    }
    return stat;
  }

  refresh () {
    /*
    Return the parser to its natural, default state.
    */
    this.parsed = [];
    this.parsedLine = 0;
    this.cur = [];
    this.curPos = 0;
    this.vars = {"initialized":true};
    this.emitted = "";
    return true;
  }


  // iterating tools


  ref (n=undefined) { // refresh the cur and curPos
    this.cur = n;
    this.curPos = 0;
  }

  addLine (line) {
    this.parsed.push(line);
    this.parsedLine += 1;
  }


  next () {
    let n = this.cur[this.curPos];
    this.curPos += 1;
    return n;
  }



  gateway (code) {
    let ast = [];
    for (let line in code) {
      let tokens = code[line];
      let result = this.parse(tokens,line);
      ast.push(result);
    }
    return ast;
  }
  
  
  parse (tks, orig="") {
    this.addLine(orig);
    this.ref(tks)
    let node = [];

    while (true) {
      let token = this.cleanse_whitespace(this.next())
      let tv = token.value;
      if (this.curPos - 1 == this.cur.length) {
        break;
      }

      if (tv.startsWith("'") && tv.endsWith("'") || tv.startsWith('"') && tv.endsWith('"')) {
        node.push(new Node.StringNode(tv, token.line));
      }
      else if () {
      }
    }

    return node;
  }



}

