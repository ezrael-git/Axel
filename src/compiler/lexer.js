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

  get_src (from=0, to) {
    let h = this.source.trim().split('\n');
    return h[from:to];
  }

  isFuncRef (tks) {
    let flag = false;
    if (this.get_src(0,this.line).includes("fn " + tks[0])) {
      flag = true;
    }
    return flag;
  }

  isFuncCall (tks) {
  }

  isVarRef (tks) {
    let flag = false;
    if (this.get_src(0,this.line).includes("imm " + tks[0]) || this.get_src(0,this.line).includes("def " + tks[0])) {
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
      else if (digits.includes(tk[0]) && digits.includes(tk[tk.length - 1])) {
        add("integer",tk);
      }
      else if (declarating_keywords.includes(tk)) {
        add("declaration",tk);
      }
      else if (["+", "-", "/", "*"].includes(tk)) {
        add("operator",tk);
      }
      else if (this.isVarRef(tk) == true || this.isFuncRef(tk) == true) {
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

    let src = this.type_format(source.split(' '));

    this.lexed = src;
    this.source = source;
    this.line += 1;
    return this.lexed;

  }
  
 
 
}



module.exports = Lexer;
