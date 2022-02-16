// lexer.py
let declarating_keywords = ["imm", "def", "fn"]

class Token {
  constructor (type, value, position) {
    this.type = type;
    this.value = value;
    this.position = position;
    if (!["string", "integer", "identifier", "declaration", "operator"].includes(type)) {
      throw new Error("Wrong type: " + type);
    }
  }
}


class Lexer {
  constructor () {
    this.source = undefined;
    this.lexed = undefined;
    this.line = 0;
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    this.digits = "0123456789"

   
  }

  get_src (fro=0, to) {
    let h = this.source.trim().split('\n');
    return h.splice(fro,to);
  }

  isFuncRef (name) {
    let flag = false;
    if (this.get_src(0,this.line).includes("fn " + name)) {
      flag = true;
    }
    return flag;
  }

  isFuncCall (call) {
    if (this.isFuncRef(call.replace("call:", "")) == false) {
      return false;
    }
    else if (call.includes("call")) {
      return false;
    }
    return true;
  }

  isVarRef (name) {
    let flag = false;
    if (this.get_src(0,this.line).includes("imm " + name) || this.get_src(0,this.line).includes("def " + name)) {
      flag = true;
    }
    return flag;
  }


  type_format (tks) {
    let typed = [];
    let tk_pos = -1;

    function add(type,value) {
      typed.push(new Token(type,value,tk_pos));
    }

    for (let tk of tks) {
      tk_pos += 1

      if (tk.startsWith("'") && tk.endsWith("'") || tk.startsWith('"') && tk.endsWith('"')) {
        add("string",tk);
      }
      else if (this.digits.includes(tk[0]) && this.digits.includes(tk[tk.length - 1])) {
        add("integer",tk);
      }
      else if (declarating_keywords.includes(tk)) {
        add("declaration",tk);
      }
      else if (["+", "-", "/", "*", "="].includes(tk)) {
        add("operator",tk);
      }
      else if (this.isVarRef(tk) == true || this.isFuncRef(tk) == true) {
        add("identifier",tk);
      }
      else if (typed[tk_pos-1].type == "declaration") {
        add("identifier",tk);
      }
      else if (this.isFuncCall(tk) == true) {
        add("call",tk);
      }
      else {
        throw new Error("Unknown token: " + tk);
      }

    }
  }


  lex (source) {
    this.source = source;

    let src = this.type_format(source.split(' '));

    this.lexed = src;
    this.line += 1;
    return this.lexed;

  }
  
 
 
}



module.exports = Lexer;
