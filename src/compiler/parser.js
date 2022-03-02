// parser.js
// generate AST

const Node = require("./nodes.js");
const Scanner = require("./scanner.js");




module.exports = class Parser {
  constructor () {
    this.parsed = []; // parsed lines (raw, they are not parsed. for clarity, think of these as processed lines)
    // also they contain no whitespaces
    this.parsedLine = 0; // line being parsed
    this.cur = []; // current list of tokens to iterate through
    this.curPos = 0; // position of current token being analyzed
    
    this.vars = {"initialized": true}
    this.emitted = ""; // actual parsed lines
    this.scanner = new Scanner();
    
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

  gatherBlocks (stats) {
    let main = [];
    let block_references = [];
    let line_number = 0;
    let elem_number = -1;
    for (let stat of stats) {
      line_number += 1;
      elem_number += 1;
      if (this.scanner.includes(stat, "{")) {
        block_references.push(line_number);
        continue;
      }
      if (this.scanner.namespace(stats, line_number) == "main") {
        main.push({line_number : stat});
      }
    }

    // now that we have a basic estimate of how the main program looks like, we can add further detail to our data
    addAfterLine (number, item) {
      main.splice(number - 1, 0, item);
    }

    let reference_number = 0;
    for (let reference of block_references) {
      reference_number += 1;
      let block_code = this.scanner.scan_block(stats, reference);
      for (let line of block_code) {
        let block_line_number = this.scanner.find(line, {block_start:reference});
        let to_push = {block_line_number : line}
        addAfterLine(block_line_number, to_push);
      }
    }
  }


  gateway (code) {
    let ast = [];
    let line = 0;
    let pos = -1;
    for (let line in code) {
      line += 1;
      pos += 1;

      
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
      /*
      else if () {
      }
      */
    }

    return node;
  }



}

