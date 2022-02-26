// parser.js





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

  generate_ast (tks) {
    let program = {}
  }


  
  
  parse (tks, orig="") {
    this.addLine(orig);
    this.ref(tks)
    let stat = this.next().value;
    stat = this.cleanse_whitespace(stat);

    if (stat == "def") {
      let fmtd = orig.replace("def", "let");
      this.emit(`${fmtd}`);
    }
    else if (stat == "imm") {
      let fmtd = orig.replace("imm", "const");
      this.emit(`${fmtd}`);
    }
    else if (stat == "log") {
      this.emit(`console.log(${orig.replace("log ", "")})`)
    }
    else if (stat == "fn") {
      let nameRaw = orig.replace("fn ", "");
      let name = "";
      for (let char of nameRaw) {
        if (char == " " || char == "(") {
          break
        }
        name += char;
      }

      let args = orig.replace("fn " + name, "").replaceAll("(", "").replaceAll(")", "");
      // Check for type annotations and if there are, remove them
      let it = ""
      for (let char of args) {
        it += char
        if (it.endsWith("->")) {
          break
        }
      }
      args = it.replace("->", "")
      if (args.length < 1) {
        args = " ";
      }
      this.emit(`function ${name} (${args}) {`)
    }
    else if (stat == "end") {
      this.emit("}");
    }
    else if (stat == "class") {
      this.emit(`class ${orig.replace("class ", "")} {`);
    }
    else if (stat == "meth") {
      let name = this.next().value;
      if (name == "initialize") {
        name = "constructor";
        orig = orig.replace("initialize", "constructor");
      }
      let args = orig.replace("meth " + name, "").replace("(", "").replace(")", "");
      this.emit(`${name} (${args}) {`);
    }
    else if (stat == "if") {
      let condition = orig.replace("if ", "");
      this.emit(`if (${condition}) {`)
    }
    else if (stat == "elif") {
      let condition = orig.replace("elif ", "");
      this.emit(`else if (${condition}) {`)
    }
    else if (stat == "else") {
      this.emit(`else`)
    }
    else {
      this.emit(orig);
    }

    


  }



}

