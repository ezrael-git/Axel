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

  input_all (src, name, value) {
    
  }


  // iterating tools

  ref (n=undefined) { // refresh the cur and curPos
    this.cur = n;
    this.curPos = 0;
  }

  addLine (line) {
    this.parsed += line
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
    
    if (stat == "def") {
      this.emit(`${orig.replace("def", "let")}`);
    }
    else if (stat == "imm") {
      this.emit(`${orig.replace("imm", "const")}`);
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
      if (args.length < 1) {
        args = " ";
      }
      this.emit(`function ${name} (${args}) {`)
    }
    else if (stat == "end") {
      this.emit("}");
    }
    else {
      this.emit(orig);
    }

    


  }



}

