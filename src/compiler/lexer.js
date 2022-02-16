// lexer.py


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

  isFunctionCall (tks) {
    let flag = false;
    if (this.get_src(0,this.line).includes("fn " + tks[0])) {
      flag = true;
    }
    return flag;
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
    for (let tk of tks) {

      if (tk.startsWith("'") && tk.endsWith("'") || tk.startsWith('"') && tk.endsWith('"')) {
        typed.push(new String(tk));
      }
      else if (digits.includes(tk[0]) && digits.includes(tk[tk.length - 1])) {
        typed.push(new Integer(tk));
      }
      else if (keywords.includes(tk)) {
        typed.push(new Keyword(tk));
      }
      else if (operators.includes(tk)) {
        typed.push(new Operator(tk));
      }
      else {
        typed.push(new Identifier(tk));
      }

    }
  }


  lex (source) {

    let src = source.split(' ');

    this.lexed = src;
    this.source = source;
    this.line += 1;
    return this.lexed;

  }
  
 
 
}



module.exports = Lexer;
