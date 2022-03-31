const Scanner = require("./scanner.js");
const fs = require("fs");

module.exports = class Preprocessor {
  constructor (stdblib=true) {
    this.variables = [];
    this.imports = [];
    this.scanner = new Scanner();
    this.stdblib = stdblib;
  }

  removeAllAfter (line,symbol) {
    let it = "";
    for (let char of line) {
      it += char;
      if (it.endsWith(symbol)) {
        // because we don't want to return the string with the symbol included
        let new_it = it.split('');
        new_it = new_it.slice(0,it.length - symbol.length).join('');
        return new_it;
      }
    }
    return it;
  }


  removeComments (stats) {
    let fmtd = [];
    for (let stat of stats) {
      let push = this.removeAllAfter(stat,"--");
      if (push.length > 1) {
        fmtd.push(push);
      }
    }
    return fmtd;
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

  formatEnd (stats) {
    let fmtd = [];
    for (let stat of stats) {
      let a = stat.replaceAll("end", "end\n");
      for (let b of a.split('\n')) {
        fmtd.push(b);
      }
    }
    return fmtd;
  }

  formatDo (stats) {
    let fmtd = [];
    for (let stat of stats) {
      let a = stat.replaceAll("elif", "end elif").replaceAll("else", "end else");
      fmtd.push(a);
    }
    return fmtd;
  }

  formatEmpty (stats) {
    let fmtd = [];
    for (let s of stats) {
      if (s.length != 0) {
        fmtd.push(s);
      }
    }
    return fmtd;
  }



  process (code) {
    /*
    Interface
    */
    code = this.removeComments(code)
    console.log("part " + code);
    code = this.formatDo(code);
    code = this.formatEnd(code);
    code = this.formatEmpty(code);
    console.log(code);
    return code;
  }
}
